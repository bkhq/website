import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import matter from 'gray-matter'
import { Marked } from 'marked'
import { createHighlighter } from 'shiki'
import type { Locale } from '@/i18n'

type I18nText = { en: string; zh: string }

export type ToolLink = {
  label: I18nText
  url: string
}

export type ToolMeta = {
  title: I18nText
  description: I18nText
  version?: string
  website?: string
  github?: string
  addedAt?: string
  addedBy?: { name: string; url?: string }
  links?: ToolLink[]
  relatedTools?: string[]
}

export type ToolListItem = {
  slug: string
  category: string
  logo?: string
  order?: number
  tags?: string[]
}

export type TagItem = {
  key: string
  en: string
  zh: string
}

export type CategoryItem = {
  key: string
  en: string
  zh: string
  badge: { en: string; zh: string }
}

export type ToolsJson = {
  categories: CategoryItem[]
  tags: TagItem[]
  featured: string[]
  list: ToolListItem[]
}

export type DocFrontmatter = {
  title?: I18nText
  order?: number
}

export type ToolDoc = {
  slug: string
  frontmatter: DocFrontmatter
  content: string
  html: string
}

const CONTENT_ROOT = join(process.cwd(), '../../content')
const PLACEHOLDER_LINK_RE = /\[\[([^|\]\n]+)(?:\|([^\]\n]+))?\]\]/g

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['bash', 'typescript', 'javascript', 'json', 'yaml', 'html', 'css', 'markdown', 'shell', 'text'],
    })
  }
  return highlighterPromise
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function escapeAttribute(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sanitizeHtml(html: string): string {
  const dangerousTags = /<\s*\/?\s*(script|iframe|object|embed|applet|form|input|textarea|button|select|meta|link)\b[^>]*>/gi
  let cleaned = html.replace(dangerousTags, '')
  cleaned = cleaned.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  cleaned = cleaned.replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"')
  cleaned = cleaned.replace(/href\s*=\s*'javascript:[^']*'/gi, "href='#'")
  cleaned = cleaned.replace(/src\s*=\s*"javascript:[^"]*"/gi, '')
  cleaned = cleaned.replace(/src\s*=\s*'javascript:[^']*'/gi, '')
  return cleaned
}

function sanitizeSvg(svg: string): string {
  const dangerousTags = /<\s*\/?\s*(script|foreignObject|iframe|object|embed|applet|form|input|textarea|button|select|meta|link|style)\b[^>]*>/gi
  let cleaned = svg.replace(dangerousTags, '')
  cleaned = cleaned.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  cleaned = cleaned.replace(/href\s*=\s*"javascript:[^"]*"/gi, '')
  cleaned = cleaned.replace(/href\s*=\s*'javascript:[^']*'/gi, '')
  cleaned = cleaned.replace(/xlink:href\s*=\s*"javascript:[^"]*"/gi, '')
  cleaned = cleaned.replace(/xlink:href\s*=\s*'javascript:[^']*'/gi, '')
  return cleaned
}

function isValidSlug(slug: string): boolean {
  return !slug.includes('..') && !slug.includes('\0') && !/[/\\]/.test(slug)
}

function replaceLinkPlaceholders(content: string): string {
  const segments = content.split(/(```[\s\S]*?```)/g)
  return segments
    .map((segment) => {
      if (segment.startsWith('```')) return segment
      return segment.replace(PLACEHOLDER_LINK_RE, (_match, rawTarget: string, rawLabel?: string) => {
        const target = rawTarget.trim().replace(/^\/+/, '')
        if (!target) return rawLabel?.trim() || ''
        const label = (rawLabel ?? rawTarget).trim()
        return `[${label}](/${target})`
      })
    })
    .join('')
}

function buildLocalizedPath(path: string, locale: Locale): string {
  if (!path || path === '/') return `/${locale}`
  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`
}

function localizeInternalHref(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  if (href.startsWith('/api/') || href.startsWith('/assets/') || href.startsWith('/_')) return href

  const suffixIndex = href.search(/[?#]/)
  const path = suffixIndex === -1 ? href : href.slice(0, suffixIndex)
  const suffix = suffixIndex === -1 ? '' : href.slice(suffixIndex)
  const segments = path.split('/').filter(Boolean)
  const lastSegment = segments.at(-1) ?? ''

  if (lastSegment.includes('.')) return href

  if (segments[0] === 'en' || segments[0] === 'zh') {
    const rest = segments.slice(1)
    const localized = buildLocalizedPath(rest.length > 0 ? `/${rest.join('/')}` : '/', locale)
    return `${localized}${suffix}`
  }

  return `${buildLocalizedPath(path, locale)}${suffix}`
}

function rewriteInternalLinks(html: string, locale: Locale): string {
  return html.replace(/href=(['"])([^'"]+)\1/g, (match, quote: string, href: string) => {
    const localized = localizeInternalHref(href, locale)
    if (localized === href) return match
    return `href=${quote}${escapeAttribute(localized)}${quote}`
  })
}

export function resolveToolLogo(slug: string, logo?: string): { type: 'icon'; name: string } | { type: 'svg'; content: string } | { type: 'none' } {
  if (!logo) return { type: 'none' }
  if (!isValidSlug(slug) || (logo.includes('.') && !isValidSlug(logo.replace('.svg', '')))) {
    return { type: 'none' }
  }

  if (logo.includes('.')) {
    try {
      const logoPath = resolve(CONTENT_ROOT, slug, logo)
      if (!logoPath.startsWith(resolve(CONTENT_ROOT))) return { type: 'none' }
      const content = readFileSync(logoPath, 'utf-8')
      return { type: 'svg', content: sanitizeSvg(content) }
    } catch {
      return { type: 'icon', name: 'image' }
    }
  }

  return { type: 'icon', name: logo }
}

export function getToolTags(toolsData: ToolsJson, tagKeys: string[], locale: Locale): { key: string; label: string }[] {
  return tagKeys.map((key) => {
    const tag = toolsData.tags.find((item) => item.key === key)
    return { key, label: tag ? txt(tag, locale) : key }
  })
}

export function getToolBadge(toolsData: ToolsJson, category: string, locale: Locale): string {
  const categoryItem = toolsData.categories.find((item) => item.key === category)
  if (!categoryItem) return category
  return txt(categoryItem.badge, locale)
}

export async function renderMarkdown(content: string, locale?: Locale): Promise<string> {
  const highlighter = await getHighlighter()
  const prepared = replaceLinkPlaceholders(content)

  const marked = new Marked({
    renderer: {
      code({ text, lang }) {
        const language = lang || 'text'
        const resolvedLang = highlighter.getLoadedLanguages().includes(language) ? language : 'text'
        try {
          const html = highlighter.codeToHtml(text, {
            lang: resolvedLang,
            themes: { light: 'github-light', dark: 'github-dark' },
            defaultColor: false,
            transformers: [
              {
                line(node, line) {
                  node.properties['data-line'] = line
                },
              },
            ],
          })
          const langLabel = lang || ''
          return `<div class="code-block" data-lang="${escapeHtml(langLabel)}" data-code="${escapeHtml(text)}">${html}</div>`
        } catch {
          return `<pre><code>${escapeHtml(text)}</code></pre>`
        }
      },
    },
  })

  const raw = await (marked.parse(prepared) as Promise<string> | string)
  const sanitized = sanitizeHtml(raw as string)
  return locale ? rewriteInternalLinks(sanitized, locale) : sanitized
}

export function getToolsJson(): ToolsJson {
  return JSON.parse(readFileSync(join(CONTENT_ROOT, 'list.json'), 'utf-8'))
}

export function getToolMeta(slug: string): ToolMeta {
  try {
    const metaPath = join(CONTENT_ROOT, slug, 'meta.json')
    return JSON.parse(readFileSync(metaPath, 'utf-8'))
  } catch {
    return {
      title: { en: slug, zh: slug },
      description: { en: '', zh: '' },
      relatedTools: [],
    }
  }
}

function parseDocFilename(filename: string): { locale: string | null; docSlug: string } {
  const name = filename.replace('.md', '')
  const match = name.match(/^(en|zh)\.(.+)$/)
  if (match) return { locale: match[1], docSlug: match[2] }
  return { locale: null, docSlug: name }
}

export function getToolDocSlugs(slug: string): string[] {
  try {
    const toolDir = join(CONTENT_ROOT, slug)
    const files = readdirSync(toolDir).filter((filename) => filename.endsWith('.md'))
    const slugs = new Set<string>()
    for (const filename of files) {
      slugs.add(parseDocFilename(filename).docSlug)
    }
    return [...slugs]
  } catch {
    return []
  }
}

export async function getToolDocs(slug: string, locale?: Locale): Promise<ToolDoc[]> {
  let files: string[]
  const toolDir = join(CONTENT_ROOT, slug)

  try {
    files = readdirSync(toolDir).filter((filename) => filename.endsWith('.md'))
  } catch {
    return []
  }

  const docMap = new Map<string, string>()
  for (const filename of files) {
    const { locale: fileLocale, docSlug } = parseDocFilename(filename)
    if (fileLocale === null && !docMap.has(docSlug)) {
      docMap.set(docSlug, filename)
    } else if (locale && fileLocale === locale) {
      docMap.set(docSlug, filename)
    }
  }

  return Promise.all(
    [...docMap.entries()].map(async ([docSlug, filename]) => {
      const raw = readFileSync(join(toolDir, filename), 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug: docSlug,
        frontmatter: data as DocFrontmatter,
        content,
        html: await renderMarkdown(content, locale ?? 'en'),
      }
    }),
  )
}

export async function getToolDoc(toolSlug: string, docSlug: string, locale?: Locale) {
  const candidates = locale ? [`${locale}.${docSlug}.md`, `${docSlug}.md`] : [`${docSlug}.md`]

  for (const filename of candidates) {
    try {
      const docPath = join(CONTENT_ROOT, toolSlug, filename)
      const raw = readFileSync(docPath, 'utf-8')
      const { data, content } = matter(raw)
      return {
        data: data as DocFrontmatter,
        content,
        html: await renderMarkdown(content, locale ?? 'en'),
      }
    } catch {
      continue
    }
  }

  return {
    data: {} as DocFrontmatter,
    content: '',
    html: '',
  }
}

export function txt(i18n: I18nText, locale: Locale): string {
  return i18n[locale] || i18n.en || ''
}
