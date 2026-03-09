import { Check, Moon, Sun } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'bkio-theme'

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ?
    'dark' :
    'light'
}

const themeOptions: {
  value: Theme
  icon: typeof Sun
  en: string
  zh: string
}[] = [
  { value: 'light', icon: Sun, en: 'Light', zh: '浅色' },
  { value: 'dark', icon: Moon, en: 'Dark', zh: '深色' },
]

export function ThemeToggle({ locale }: { locale: 'en' | 'zh' }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined')
      return 'light'
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark')
      return saved
    return getSystemTheme()
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = useCallback((mode: Theme) => {
    setThemeState(mode)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg outline-none hover:bg-muted hover:text-foreground size-7"
        aria-label="Toggle color theme"
      >
        {theme === 'dark' ?
            (
              <Moon className="h-4 w-4" />
            ) :
            (
              <Sun className="h-4 w-4" />
            )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themeOptions.map((opt) => {
          const Icon = opt.icon
          return (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => setTheme(opt.value)}
            >
              <Icon className="h-4 w-4" />
              {opt[locale]}
              {theme === opt.value && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
