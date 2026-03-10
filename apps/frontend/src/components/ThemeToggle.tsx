import { Moon, Sun, SunMoon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getTranslations } from '@/i18n'

type ThemeMode = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'bkio-theme'

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ?
    'dark' :
    'light'
}

const themeOrder: ThemeMode[] = ['dark', 'light', 'system']

export function ThemeToggle({ locale }: { locale: 'en' | 'zh' }) {
  const t = getTranslations(locale)
  const [theme, setThemeState] = useState<ThemeMode>('system')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'system')
      setThemeState(saved)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      const resolvedTheme = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme
      document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
    }

    applyTheme()
    localStorage.setItem(STORAGE_KEY, theme)
    media.addEventListener('change', applyTheme)
    return () => media.removeEventListener('change', applyTheme)
  }, [theme])

  const nextTheme = useMemo(() => {
    const index = themeOrder.indexOf(theme)
    return themeOrder[(index + 1) % themeOrder.length]
  }, [theme])

  const currentLabel = t.theme[theme]
  const nextLabel = t.theme[nextTheme]

  const setTheme = useCallback(() => {
    setThemeState((current) => {
      const index = themeOrder.indexOf(current)
      return themeOrder[(index + 1) % themeOrder.length]
    })
  }, [])

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : SunMoon

  return (
    <button
      type="button"
      onClick={setTheme}
      className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg outline-none transition-colors hover:bg-muted hover:text-foreground"
      aria-label={`${currentLabel} theme. Click to switch to ${nextLabel}.`}
      title={`${currentLabel} -> ${nextLabel}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
