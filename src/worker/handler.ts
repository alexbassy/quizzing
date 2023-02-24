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
  }
}

// Initialize
const API = new Router<Bindings>()

API.prepare = CORS.preflight({
  origin: /quizzing\.ninja|localhost:3000/,
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

// Attach "fetch" event handler
// ~> use `Cache` for request-matching, when permitted
// ~> store Response in `Cache`, when permitted
export default start(API.run)
