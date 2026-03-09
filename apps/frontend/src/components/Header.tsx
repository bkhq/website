import { Github } from 'lucide-react'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { localizePath } from '@/lib/routes'

const translations = {
  en: { submit: 'Submit' },
  zh: { submit: '投稿' },
} as const

export function Header({ locale }: { locale: 'en' | 'zh' }) {
  const t = translations[locale]

  return (
    <header className="relative z-10">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <a href={localizePath(locale, '/')}>
          <img src="/logo.svg" alt="BK" className="h-10 w-10 rounded-lg" />
        </a>

        <div className="flex items-center gap-2 text-sm">
          <a
            href="https://github.com/bkhq/website"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
          <LocaleSwitcher locale={locale} />
          <ThemeToggle locale={locale} />
          <a
            href={localizePath(locale, '/sys/submit')}
            className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-input bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {t.submit}
          </a>
        </div>
      </div>
    </header>
  )
}
