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

function buildRedirectPath(pathname: string): string | null {
  const locale = pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en'
  let path = pathname

  if (path === '/en' || path.startsWith('/en/')) {
    path = path.slice(3) || '/'
  } else if (path === '/zh' || path.startsWith('/zh/')) {
    path = path.slice(3) || '/'
  }

  const prefix = locale === 'zh' ? '/zh' : ''

  if (path === '/privacy') return `${prefix}/sys/privacy`
  if (path === '/terms') return `${prefix}/sys/terms`
  if (path === '/submit') return `${prefix}/sys/submit`
  if (path === '/tag') return `${prefix}/tags`
  if (path.startsWith('/tag/')) return `${prefix}/tags/${path.slice('/tag/'.length)}`

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return path
  }

  return null
}

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: Date.now() })
})

app.notFound((c) => {
  if (c.req.path.startsWith('/api/')) {
    return c.json({ message: 'Not Found' }, 404)
  }

  const redirectPath = buildRedirectPath(c.req.path)
  if (redirectPath) {
    const url = new URL(c.req.url)
    url.pathname = redirectPath
    return c.redirect(url.toString(), 308)
  }

  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw)
  }

  return c.text('Frontend assets are not available.', 404)
})

export default app
