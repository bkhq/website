const translations = {
  en: {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    submit: 'Submit',
    copyright: '\u00a9 2026 BK.io',
  },
  zh: {
    privacy: '隐私政策',
    terms: '服务条款',
    submit: '投稿',
    copyright: '\u00a9 2026 BK.io',
  },
} as const

export function Footer({ locale }: { locale: 'en' | 'zh' }) {
  const t = translations[locale]

  return (
    <footer className="relative z-10 mt-4 pb-6 text-sm text-muted-foreground/70">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-start">
            <a href={`/${locale}/privacy`} className="transition-colors hover:text-foreground">{t.privacy}</a>
            <a href={`/${locale}/terms`} className="transition-colors hover:text-foreground">{t.terms}</a>
            <a href={`/${locale}/submit`} className="transition-colors hover:text-foreground">{t.submit}</a>
          </div>
          <p className="whitespace-nowrap">{t.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
