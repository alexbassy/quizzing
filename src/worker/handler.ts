import { Router } from 'worktop'
import { uid as toUID } from 'worktop/utils'
import { listen } from 'worktop/cache'

// Initialize
const API = new Router()

API.add('GET', '/alive', (req, res) => {
  res.end('OK') // Node.js-like `res.end`
})

// Attach "fetch" event handler
// ~> use `Cache` for request-matching, when permitted
// ~> store Response in `Cache`, when permitted
listen(API.run)
