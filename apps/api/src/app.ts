import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

type AssetBinding = {
  fetch: (request: Request | string, init?: RequestInit) => Promise<Response>
}

export type Env = {
  Bindings: {
    // Add your bindings here, e.g.:
    // DB: D1Database
    // KV: KVNamespace
    ASSETS?: AssetBinding
  }
}

const app = new Hono<Env>()

app.use('*', logger())
app.use('*', cors())

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: Date.now() })
})

app.notFound((c) => {
  if (c.req.path.startsWith('/api/')) {
    return c.json({ message: 'Not Found' }, 404)
  }

  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw)
  }

  return c.text('Frontend assets are not available.', 404)
})

export default app
