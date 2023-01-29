import { Router } from 'worktop'
import * as CORS from 'worktop/cors'
import { listen } from 'worktop/cache'
import { createApi } from 'unsplash-js'
import { type Photos } from 'unsplash-js/dist/methods/search/types/response'
import { IUnsplashSearchResult } from './types'

declare let UNSPLASH_ACCESS_KEY: string

const unsplashApi = createApi({
  accessKey: UNSPLASH_ACCESS_KEY,
})

// Initialize
const API = new Router()

API.prepare = CORS.preflight({
  origin: /quizzing\.ninja|localhost:3000/,
  headers: ['Cache-Control', 'Content-Type', 'X-Count'],
  methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
})

API.add('GET', '/backgrounds/search', async (req, res) => {
  const query = req.query.get('query')
  if (!query) {
    return res.send(421, { message: 'Query required' })
  }
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

  return res.send(200, slimResults)
})

// Attach "fetch" event handler
// ~> use `Cache` for request-matching, when permitted
// ~> store Response in `Cache`, when permitted
listen(API.run)
