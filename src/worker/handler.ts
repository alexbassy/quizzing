import { Router } from 'worktop'
import type { Context } from 'worktop'
import * as CORS from 'worktop/cors'
import { start } from 'worktop/cfw'
import * as utils from 'worktop/utils'
import { reply } from 'worktop/response'
import { createApi } from 'unsplash-js'
import { type Photos } from 'unsplash-js/dist/methods/search/types/response'
import { ITinyApiResponse, IUnsplashSearchResult } from './types'

interface Bindings extends Context {
  bindings: {
    UNSPLASH_ACCESS_KEY: string
    TINIFY_API_KEY: string
    OPENAI_API_KEY: string
  }
}

// Initialize
const API = new Router<Bindings>()

API.prepare = CORS.preflight({
  origin: /quizzing\.ninja|quizzing\.pages\.dev|localhost:3000/,
  headers: ['Cache-Control', 'Content-Type', 'X-Count'],
  methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
})

API.add('GET', '/backgrounds/search', async (req, context) => {
  const query = context.url.searchParams.get('query')
  if (!query) {
    return reply(421, { message: 'Query required' })
  }
  const unsplashApi = createApi({
    accessKey: context.bindings.UNSPLASH_ACCESS_KEY,
  })
  const results = await unsplashApi.search.getPhotos({
    query,
    orientation: 'landscape',
    perPage: 20,
  })

  const slimResults: IUnsplashSearchResult[] = (results.response as Photos).results.map((item) => {
    return {
      id: item.id,
      blurHash: item.blur_hash,
      color: item.color,
      description: item.alt_description,
      urls: item.urls,
      credit: {
        name: item.user.name,
        url: item.links.html,
      },
    }
  })

  return reply(200, slimResults)
})

API.add('POST', '/compress', async (req, context) => {
  const body = await utils.body<ArrayBuffer>(req)
  if (!body) {
    return reply(421, { message: 'No body' })
  }

  const authHeader = { Authorization: `Basic ${btoa(`api:${context.bindings.TINIFY_API_KEY}`)}` }

  const tinifyResponse = await fetch('https://api.tinify.com/shrink', {
    method: 'POST',
    headers: authHeader,
    body: body,
  })

  const data = await tinifyResponse.json<ITinyApiResponse>()

  const convertedFile = await fetch(data.output.url, {
    method: 'POST',
    headers: { ...authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ convert: { type: '*/*' } }),
  })

  const fileBlob = await convertedFile.blob()

  const form = new FormData()
  form.append('file', fileBlob)
  form.append('ratio', data.output.ratio.toString())

  return new Response(form, {
    status: 200,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
})

API.add('POST', '/generate-question', async (req, context) => {
  interface ChatGPTResponse {
    choices: {
      text: string
    }[]
  }

  const prompt = await utils.body<string>(req)

  if (!prompt) {
    return reply(421, { message: 'No prompt' })
  }

  // Check if prompt is simple human language and not code
  if (!/[^\W-]/g.test(prompt)) {
    return reply(421, { message: 'Prompt should contain simple human language' })
  }

  async function requestChatGPT(topic: string): Promise<string> {
    const url = 'https://api.openai.com/v1/completions'
    const apiKey = context.bindings.OPENAI_API_KEY
    const model = 'text-davinci-003'
    const maxTokens = 300

    const systemPrompt = `You are a making a quiz with your group of intelligent, fun loving friends. 8/10 difficulty. Questions and options should be fun and not overly complex. The quiz is multiple choice with four options. Only one correct answer and the other three options are incorrect. Vary the format and style of the questions to be interesting. Give a brief explanation or context for the correct answer in no more than 30 words. Provide the questions and the correct answer in minified JSON format (not pretty printed) as if it will be parsed directly. The only output should be the JSON.
      The schema should be (TypeScript) \`{ title: string; options: string[]; correctAnswer: { index: number; explanation: string } }[]\` 
      Start with three random questions. Topic: ${topic}`

    const body = JSON.stringify({
      prompt: systemPrompt,
      max_tokens: maxTokens,
      model: model,
    })

    const response = await fetch(url, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ChatGPT response: ${response.statusText}`)
    }

    const json = await response.json<ChatGPTResponse>()
    const completions = json.choices[0].text

    console.log(json)

    return completions
  }

  try {
    const res = await requestChatGPT(prompt)
    return reply(200, res)
  } catch (e) {
    console.log(e)
    return reply(500, {
      message: 'Questions could not be generated. The prompt might have broken the terms of use.',
    })
  }
})

// Attach "fetch" event handler
// ~> use `Cache` for request-matching, when permitted
// ~> store Response in `Cache`, when permitted
export default start(API.run)
