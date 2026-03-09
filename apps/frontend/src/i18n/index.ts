import { en } from './en'
import type { Locale, Translations } from './types'
import { zh } from './zh'

export type { Locale, Translations }

const translationMap: Record<Locale, Translations> = { en, zh }

export function getTranslations(locale: Locale): Translations {
  return translationMap[locale]
}

export function detectLocale(): Locale {
  if (typeof document !== 'undefined') {
    const saved = localStorage.getItem('bkio-locale')
    if (saved === 'en' || saved === 'zh')
      return saved
    return navigator.language.startsWith('zh') ? 'zh' : 'en'
  }
  return 'en'
}
