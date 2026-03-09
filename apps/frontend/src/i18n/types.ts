export type Locale = 'en' | 'zh'

export interface Translations {
  nav: {
    home: string
    collections: string
    submit: string
  }
  locale: {
    en: string
    zh: string
  }
  hero: {
    title: string
    subtitle: string
    searchPlaceholder: string
  }
  filters: {
    all: string
  }
  card: {
    view: string
    noResults: string
    tags: string
  }
  pagination: {
    prev: string
    next: string
    page: string
    of: string
  }
  footer: {
    privacy: string
    terms: string
    submit: string
    copyright: string
  }
  theme: {
    light: string
    dark: string
  }
  toolDetail: {
    configuration: string
    usage: string
    troubleshooting: string
    introduction: string
    link: string
  }
  submit: {
    title: string
    description: string
  }
}
