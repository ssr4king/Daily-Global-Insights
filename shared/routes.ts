import { z } from 'zod';
import { insertArticleSchema, articles, categories } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  news: {
    list: {
      method: 'GET' as const,
      path: '/api/news',
      input: z.object({
        category: z.enum(categories).optional(),
        country: z.string().optional().default('in'),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof articles.$inferSelect>()),
        500: errorSchemas.internal,
      },
    },
    sync: {
      method: 'POST' as const,
      path: '/api/news/sync',
      responses: {
        200: z.object({ message: z.string(), count: z.number() }),
        500: errorSchemas.internal,
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type NewsListResponse = z.infer<typeof api.news.list.responses[200]>;
