import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import matter from 'gray-matter'
import { Marked } from 'marked'
import { createHighlighter } from 'shiki'
import type { Locale } from '@/i18n'
import { localizePath } from '@/lib/routes'

interface I18nText { en: string, zh: string }

export interface ToolLink {
  label: I18nText
  url: string
}

export interface ToolMeta {
  title: I18nText
  description: I18nText
  version?: string
  website?: string
  github?: string
  addedAt?: string
  addedBy?: { name: string, url?: string }
  links?: ToolLink[]
  link?: string[]
}

export interface ToolListItem {
  slug: string
  path?: string
  logo?: string
  order?: number
  tags?: string[]
}

export interface TagItem {
  key: string
  en: string
  zh: string
}

interface ToolListJson {
  featured: string[]
  list: ToolListItem[]
}

export interface ToolsJson {
  tags: TagItem[]
  featured: string[]
  list: ToolListItem[]
}

export interface DocFrontmatter {
  title?: I18nText
  order?: number
}

export interface ToolDoc {
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
  const dangerousTags = /<\s*(?:\/\s*)?(script|iframe|object|embed|applet|form|input|textarea|button|select|meta|link)\b[^>]*>/gi
  let cleaned = html.replace(dangerousTags, '')
  cleaned = cleaned.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  cleaned = cleaned.replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"')
  cleaned = cleaned.replace(/href\s*=\s*'javascript:[^']*'/gi, 'href=\'#\'')
  cleaned = cleaned.replace(/src\s*=\s*"javascript:[^"]*"/gi, '')
  cleaned = cleaned.replace(/src\s*=\s*'javascript:[^']*'/gi, '')
  return cleaned
}

function sanitizeSvg(svg: string): string {
  const dangerousTags = /<\s*(?:\/\s*)?(script|foreignObject|iframe|object|embed|applet|form|input|textarea|button|select|meta|link|style)\b[^>]*>/gi
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

function isSafeContentPath(path: string): boolean {
  if (!path || path.includes('\0'))
    return false

  const normalized = path.replace(/\\/g, '/')
  if (normalized.startsWith('/') || normalized.includes('..'))
    return false

  const segments = normalized.split('/')
  return segments.every(segment => segment.length > 0 && segment !== '.')
}

function getToolContentPath(slug: string, toolsData: ToolsJson = getToolsJson()): string {
  const item = toolsData.list.find(entry => entry.slug === slug)
  const contentPath = item?.path ?? slug
  return isSafeContentPath(contentPath) ? contentPath : slug
}

function replaceLinkPlaceholders(content: string): string {
  const segments = content.split(/(```[\s\S]*?```)/g)
  return segments
    .map((segment) => {
      if (segment.startsWith('```'))
        return segment
      return segment.replace(PLACEHOLDER_LINK_RE, (_match, rawTarget: string, rawLabel?: string) => {
        const target = rawTarget.trim().replace(/^\/+/, '')
        if (!target)
          return rawLabel?.trim() || ''
        const label = (rawLabel ?? rawTarget).trim()
        return `[${label}](/${target})`
      })
    })
    .join('')
}

function localizeInternalHref(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//'))
    return href
  if (href.startsWith('/api/') || href.startsWith('/assets/') || href.startsWith('/_'))
    return href

  const suffixIndex = href.search(/[?#]/)
  const path = suffixIndex === -1 ? href : href.slice(0, suffixIndex)
  const suffix = suffixIndex === -1 ? '' : href.slice(suffixIndex)
  const segments = path.split('/').filter(Boolean)
  const lastSegment = segments.at(-1) ?? ''

  if (lastSegment.includes('.'))
    return href

  if (segments[0] === 'en' || segments[0] === 'zh') {
    const rest = segments.slice(1)
    const localized = localizePath(locale, rest.length > 0 ? `/${rest.join('/')}` : '/')
    return `${localized}${suffix}`
  }

  return `${localizePath(locale, path)}${suffix}`
}

function rewriteInternalLinks(html: string, locale: Locale): string {
  return html.replace(/href=(['"])([^'"]+)\1/g, (match, quote: string, href: string) => {
    const localized = localizeInternalHref(href, locale)
    if (localized === href)
      return match
    return `href=${quote}${escapeAttribute(localized)}${quote}`
  })
}

export function resolveToolLogo(slug: string, logo?: string, toolsData?: ToolsJson): { type: 'icon', name: string } | { type: 'svg', content: string } | { type: 'none' } {
  if (!logo)
    return { type: 'none' }
  const contentPath = getToolContentPath(slug, toolsData)
  if (!isSafeContentPath(contentPath) || (logo.includes('.') && !isValidSlug(logo.replace('.svg', '')))) {
    return { type: 'none' }
  }

  if (logo.includes('.')) {
    try {
      const logoPath = resolve(CONTENT_ROOT, contentPath, logo)
      if (!logoPath.startsWith(resolve(CONTENT_ROOT)))
        return { type: 'none' }
      const content = readFileSync(logoPath, 'utf-8')
      return { type: 'svg', content: sanitizeSvg(content) }
    } catch {
      return { type: 'icon', name: 'image' }
    }
  }

  return { type: 'icon', name: logo }
}

export function getToolTags(toolsData: ToolsJson, tagKeys: string[], locale: Locale): { key: string, label: string }[] {
  return tagKeys.map((key) => {
    const tag = toolsData.tags.find(item => item.key === key)
    return { key, label: tag ? txt(tag, locale) : key }
  })
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
  const listJson = JSON.parse(readFileSync(join(CONTENT_ROOT, 'list.json'), 'utf-8')) as ToolListJson
  const tagsJson = JSON.parse(readFileSync(join(CONTENT_ROOT, 'tags.json'), 'utf-8')) as TagItem[]

  return {
    tags: tagsJson,
    featured: listJson.featured,
    list: listJson.list,
  }
}

export function getToolMeta(slug: string, toolsData?: ToolsJson): ToolMeta {
  try {
    const metaPath = join(CONTENT_ROOT, getToolContentPath(slug, toolsData), 'meta.json')
    return JSON.parse(readFileSync(metaPath, 'utf-8'))
  } catch {
    return {
      title: { en: slug, zh: slug },
      description: { en: '', zh: '' },
      link: [],
    }
  }
}

function parseDocFilename(filename: string): { locale: string | null, docSlug: string } {
  const name = filename.replace('.md', '')
  const match = name.match(/^(en|zh)\.(.+)$/)
  if (match)
    return { locale: match[1], docSlug: match[2] }
  return { locale: null, docSlug: name }
}

export function getToolDocSlugs(slug: string, toolsData?: ToolsJson): string[] {
  try {
    const toolDir = join(CONTENT_ROOT, getToolContentPath(slug, toolsData))
    const files = readdirSync(toolDir).filter(filename => filename.endsWith('.md'))
    const slugs = new Set<string>()
    for (const filename of files) {
      slugs.add(parseDocFilename(filename).docSlug)
    }
    return [...slugs]
  } catch {
    return []
  }
}

export async function getToolDocs(slug: string, locale?: Locale, toolsData?: ToolsJson): Promise<ToolDoc[]> {
  let files: string[]
  const toolDir = join(CONTENT_ROOT, getToolContentPath(slug, toolsData))

  try {
    files = readdirSync(toolDir).filter(filename => filename.endsWith('.md'))
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
    Array.from(docMap.entries(), async ([docSlug, filename]) => {
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

export async function getToolDoc(toolSlug: string, docSlug: string, locale?: Locale, toolsData?: ToolsJson) {
  const candidates = locale ? [`${locale}.${docSlug}.md`, `${docSlug}.md`] : [`${docSlug}.md`]
  const contentPath = getToolContentPath(toolSlug, toolsData)

  for (const filename of candidates) {
    try {
      const docPath = join(CONTENT_ROOT, contentPath, filename)
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
