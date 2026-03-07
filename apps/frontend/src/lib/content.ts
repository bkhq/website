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

/** Sanitize SVG content by stripping dangerous elements and attributes */
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

/** Validate that a slug does not contain path traversal sequences */
function isValidSlug(slug: string): boolean {
  return !slug.includes('..') && !slug.includes('\0') && !/[/\\]/.test(slug)
}

/** Resolve logo: if file exists in content/{slug}/, return its content; otherwise treat as lucide icon name; undefined = no logo */
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

/** Get localized tag labels for a tool */
export function getToolTags(toolsData: ToolsJson, tagKeys: string[], locale: Locale): { key: string; label: string }[] {
  return tagKeys.map((key) => {
    const tag = toolsData.tags.find((t) => t.key === key)
    return { key, label: tag ? txt(tag, locale) : key }
  })
}

/** Get badge for a tool by looking up its category */
export function getToolBadge(toolsData: ToolsJson, category: string, locale: Locale): string {
  const cat = toolsData.categories.find((c) => c.key === category)
  if (!cat) return category
  return txt(cat.badge, locale)
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

// Shiki highlighter singleton
let highlighterPromise: ReturnType<typeof createHighlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['bash', 'typescript', 'javascript', 'json', 'yaml', 'html', 'css', 'markdown', 'shell'],
    })
  }
  return highlighterPromise
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Strip dangerous HTML tags from rendered markdown output */
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

export async function renderMarkdown(content: string): Promise<string> {
  const highlighter = await getHighlighter()

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

  const raw = await marked.parse(content) as string
  return sanitizeHtml(raw)
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
    }
  }
}

/** Sync: list doc slugs only (for getStaticPaths) */
export function getToolDocSlugs(slug: string): string[] {
  try {
    const toolDir = join(CONTENT_ROOT, slug)
    return readdirSync(toolDir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.replace('.md', ''))
  } catch {
    return []
  }
}

export async function getToolDocs(slug: string): Promise<ToolDoc[]> {
  let files: string[]
  const toolDir = join(CONTENT_ROOT, slug)
  try {
    files = readdirSync(toolDir).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }

  return Promise.all(
    files.map(async (f) => {
      const raw = readFileSync(join(toolDir, f), 'utf-8')
      const { data, content } = matter(raw)
      const docSlug = f.replace('.md', '')
      return {
        slug: docSlug,
        frontmatter: data as DocFrontmatter,
        content,
        html: await renderMarkdown(content),
      }
    }),
  )
}

export async function getToolDoc(toolSlug: string, docSlug: string) {
  try {
    const docPath = join(CONTENT_ROOT, toolSlug, `${docSlug}.md`)
    const raw = readFileSync(docPath, 'utf-8')
    const { data, content } = matter(raw)
    return {
      data: data as DocFrontmatter,
      content,
      html: await renderMarkdown(content),
    }
  } catch {
    return {
      data: {} as DocFrontmatter,
      content: '',
      html: '',
    }
  }
}

export function txt(i18n: I18nText, locale: Locale): string {
  return i18n[locale] || i18n.en || ''
}
