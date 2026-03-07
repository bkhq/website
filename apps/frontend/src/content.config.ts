import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const i18nText = z.object({ en: z.string(), zh: z.string() })

const toolMeta = defineCollection({
  loader: glob({ pattern: '**/meta.json', base: '../../content' }),
  schema: z.object({
    title: i18nText,
    description: i18nText,
    version: z.string().optional(),
    website: z.string().url().optional(),
    github: z.string().url().optional(),
    issueTracker: z.string().url().optional(),
    downloads: z
      .array(
        z.object({
          name: z.string(),
          icon: z.string(),
          file: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
  }),
})

const toolDocs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../../content' }),
  schema: z.object({
    title: i18nText,
    order: z.number().default(99),
  }),
})

export const collections = { toolMeta, toolDocs }
