import { Check, Globe } from 'lucide-react'
import { useCallback, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { switchLocalePath } from '@/lib/routes'

type Locale = 'en' | 'zh'

const STORAGE_KEY = 'bkio-locale'

const localeOptions: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
]

export function LocaleSwitcher({ locale: initial }: { locale: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initial)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
    const newPath = switchLocalePath(window.location.pathname, next)
    window.location.href = newPath
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg outline-none hover:bg-muted hover:text-foreground size-7"
        aria-label="Switch language"
      >
        <Globe className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {localeOptions.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => setLocale(opt.value)}
          >
            {opt.label}
            {locale === opt.value && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
