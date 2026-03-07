import { Github } from 'lucide-react'

export function GithubPrButton({ locale }: { locale: 'en' | 'zh' }) {
  return (
    <a
      href="https://github.com/bkhq/website/compare"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background shadow-md transition-opacity hover:opacity-90"
    >
      <Github className="h-4 w-4" />
      {locale === 'zh' ? '发起 Pull Request' : 'Open a Pull Request'}
    </a>
  )
}
