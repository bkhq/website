import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Binary,
  Braces,
  ChevronLeft,
  ChevronRight,
  FileCode2,
  ImageIcon,
  Palette,
  ScanSearch,
  Search,
  Tag,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Locale } from '@/i18n'
import { localizePath } from '@/lib/routes'
import { cn } from '@/lib/utils'

interface ToolTag {
  key: string
  label: string
}

interface ToolItem {
  slug: string
  logo: string
  logoSvg?: string
  order: number
  title: string
  description: string
  tags?: ToolTag[]
}

const iconMap: Record<string, LucideIcon> = {
  'image': ImageIcon,
  'braces': Braces,
  'palette': Palette,
  'binary': Binary,
  'scan-search': ScanSearch,
  'file-code-2': FileCode2,
}

const PAGE_SIZE = 12

interface Props {
  locale: Locale
  tools: ToolItem[]
  allTags: ToolTag[]
  initialTag?: string
  translations: {
    searchPlaceholder: string
    all: string
    view: string
    noResults: string
    tags: string
    pagination: {
      prev: string
      next: string
      page: string
      of: string
    }
  }
}

export function ToolSearch({ locale, tools, allTags, initialTag, translations }: Props) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [activeTag, setActiveTag] = useState(initialTag ?? '')

  const normalizedQuery = query.trim().toLowerCase()

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const tag of allTags) {
      counts.set(tag.key, tools.filter(t => t.tags?.some(tt => tt.key === tag.key)).length)
    }
    return counts
  }, [tools, allTags])

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesTag =
        activeTag === '' || tool.tags?.some(t => t.key === activeTag)
      const searchText =
        `${tool.title} ${tool.description} ${(tool.tags ?? []).map(t => t.label).join(' ')}`.toLowerCase()
      const matchesQuery =
        normalizedQuery.length === 0 || searchText.includes(normalizedQuery)
      return matchesTag && matchesQuery
    })
  }, [tools, activeTag, normalizedQuery])

  const totalPages = Math.max(1, Math.ceil(filteredTools.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedTools = filteredTools.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  // Reset page when search query changes
  useEffect(() => {
    setPage(1)
  }, [normalizedQuery])

  function handleTagChange(key: string) {
    const newTag = activeTag === key ? '' : key
    setActiveTag(newTag)
    setPage(1)
    if (newTag) {
      window.history.replaceState(null, '', localizePath(locale, `/tags/${newTag}`))
    } else {
      window.history.replaceState(null, '', localizePath(locale, '/'))
    }
  }

  return (
    <>
      <div className="relative mt-6 w-full max-w-[38rem] text-left">
        <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="tool-search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={translations.searchPlaceholder}
          className="h-11 rounded-lg bg-background/90 pl-10 pr-4 text-[15px] shadow-sm md:text-[15px]"
        />
      </div>

      {allTags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5 text-sm">
          <Button
            size="default"
            variant={activeTag === '' ? 'default' : 'outline'}
            className="rounded-full px-3"
            onClick={() => handleTagChange('')}
          >
            <span className="text-[13px]">{translations.all}</span>
            <Badge
              variant={activeTag === '' ? 'secondary' : 'outline'}
              className={cn(
                'min-w-5 justify-center px-1.5 py-0 text-[10px]',
                activeTag === '' &&
                'border-transparent bg-white/15 text-white dark:bg-white/10',
              )}
            >
              {tools.length}
            </Badge>
          </Button>
          <Tag className="h-3.5 w-3.5 text-muted-foreground/50" />
          {allTags.map((tag) => {
            const count = tagCounts.get(tag.key) ?? 0
            if (count === 0)
              return null
            return (
              <button
                key={tag.key}
                type="button"
                onClick={() => handleTagChange(tag.key)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition-colors',
                  activeTag === tag.key ?
                    'border-foreground/20 bg-foreground/10 text-foreground' :
                    'border-border/40 text-muted-foreground hover:border-border hover:text-foreground',
                )}
              >
                {tag.label}
                <span className="text-[10px] opacity-60">{count}</span>
              </button>
            )
          })}
        </div>
      )}

      {filteredTools.length === 0 ?
          (
            <div className="mt-12 flex flex-col items-center gap-2 text-muted-foreground">
              <Search className="h-8 w-8 opacity-30" />
              <p className="text-sm">{translations.noResults}</p>
            </div>
          ) :
          (
            <>
              <div className="mx-auto mt-8 grid w-full gap-4 md:grid-cols-2 xl:grid-cols-3">
                {pagedTools.map((tool, index) => {
                  const Icon = (tool.logo && iconMap[tool.logo]) ? iconMap[tool.logo] : null
                  return (
                    <a
                      key={tool.slug}
                      href={localizePath(locale, `/${tool.slug}`)}
                      className="group/link"
                    >
                      <div
                        className="card-fade flex h-[180px] flex-col gap-3 rounded-xl border border-border/40 bg-[var(--surface-strong)] px-4 pt-4 pb-3.5 text-sm text-card-foreground transition-all duration-200 group-hover/link:border-border/60 group-hover/link:bg-[var(--surface)] group-hover/link:shadow-md"
                        style={{ animationDelay: `${index * 70}ms` }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 flex-none items-center justify-center text-foreground">
                            {tool.logoSvg ?
                                (
                                  <span className="h-5 w-5" dangerouslySetInnerHTML={{ __html: tool.logoSvg }} />
                                ) :
                              Icon ?
                                  (
                                    <Icon className="h-5 w-5" />
                                  ) :
                                  (
                                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground/8 text-xs font-semibold text-foreground/70">
                                      {tool.title.charAt(0).toUpperCase()}
                                    </span>
                                  )}
                          </div>
                          <div className="text-base font-medium leading-none">
                            {tool.title}
                          </div>
                        </div>
                        <div className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
                          {tool.description}
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-2">
                          <div className="flex min-w-0 flex-wrap items-center gap-1">
                            {tool.tags?.slice(0, 4).map(tag => (
                              <span
                                key={tag.key}
                                className="rounded-full bg-foreground/5 px-1.5 py-px text-[10px] text-muted-foreground/60"
                              >
                                {tag.label}
                              </span>
                            ))}
                          </div>
                          <span className="inline-flex flex-none items-center gap-1 text-[13px] text-muted-foreground transition-colors group-hover/link:text-foreground">
                            {translations.view}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={currentPage <= 1}
                    onClick={() => setPage(currentPage - 1)}
                    aria-label={translations.pagination.prev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Button
                      key={p}
                      variant={p === currentPage ? 'default' : 'outline'}
                      size="sm"
                      className="min-w-8"
                      onClick={() => setPage(p)}
                      aria-label={`${translations.pagination.page} ${p}`}
                      aria-current={p === currentPage ? 'page' : undefined}
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage(currentPage + 1)}
                    aria-label={translations.pagination.next}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
    </>
  )
}
