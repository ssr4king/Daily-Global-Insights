import { type Article, type InsertArticle } from "@shared/schema";

export interface IStorage {
  // In-memory caching for news
  getCachedNews(category?: string): Promise<Article[] | undefined>;
  cacheNews(articles: Article[]): Promise<void>;
}

export class MemStorage implements IStorage {
  private cache: Map<string, { data: Article[], timestamp: number }>;
  private CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  constructor() {
    this.cache = new Map();
  }

  async getCachedNews(category: string = 'all'): Promise<Article[] | undefined> {
    const cached = this.cache.get(category);
    if (!cached) return undefined;

    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(category);
      return undefined;
    }

    return cached.data;
  }

  async cacheNews(articles: Article[], category: string = 'all'): Promise<void> {
    this.cache.set(category, {
      data: articles,
      timestamp: Date.now()
    });
  }
}

export const storage = new MemStorage();
