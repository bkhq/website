import type { Locale } from '@/i18n'

export const DEFAULT_LOCALE: Locale = 'en'

export const RESERVED_ROOT_SEGMENTS = new Set([
  'api',
  'zh',
  'sys',
  'tags',
  'category',
  'link',
  'template',
])

function normalizePath(path: string): string {
  if (!path || path === '/') return '/'

  const normalized = `/${path}`.replace(/\/+/g, '/')
  if (normalized.length > 1 && normalized.endsWith('/')) {
    return normalized.slice(0, -1)
  }

  return normalized
}

export function localizePath(locale: Locale, path: string): string {
  const normalized = normalizePath(path)
  if (locale === DEFAULT_LOCALE) return normalized
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`
}

export function parseLocalizedPath(pathname: string): {
  locale: Locale
  path: string
  hadLocalePrefix: boolean
} {
  const normalized = normalizePath(pathname)
  const segments = normalized.split('/').filter(Boolean)
  const first = segments[0]

  if (first === 'en' || first === 'zh') {
    const rest = segments.slice(1)
    return {
      locale: first,
      path: rest.length > 0 ? `/${rest.join('/')}` : '/',
      hadLocalePrefix: true,
    }
  }

  return {
    locale: DEFAULT_LOCALE,
    path: normalized,
    hadLocalePrefix: false,
  }
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'zh' : 'en'
}

export function switchLocalePath(pathname: string, locale: Locale): string {
  const parsed = parseLocalizedPath(pathname)
  return localizePath(locale, parsed.path)
}

export function isReservedRootSlug(slug: string): boolean {
  return RESERVED_ROOT_SEGMENTS.has(slug) || slug.includes('.')
}
