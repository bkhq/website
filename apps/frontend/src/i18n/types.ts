export type Locale = 'en' | 'zh'

export type Translations = {
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
  categories: {
    all: string
    images: string
    textCode: string
    colors: string
    converters: string
    devTools: string
    containers: string
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
    relatedTools: string
  }
  submit: {
    title: string
    description: string
  }
}
