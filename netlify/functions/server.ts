import serverless from "serverless-http";
import express from "express";

// Simple in-memory storage implementation (no path aliases)
interface Article {
  id: number;
  title: string;
  description?: string;
  content?: string;
  url: string;
  imageUrl?: string;
  source?: string;
  category?: string;
  publishedAt?: string;
}

class MemStorage {
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

const storage = new MemStorage();

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req: any, _res: any, buf: Buffer) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// News API configuration
const NEWS_API_KEY = "pub_b26b609a9da14b5b8c295911e0b7cdad";
const BASE_URL = "https://newsdata.io/api/1/news";

// Categories enum
const categories = [
  "general",
  "sports",
  "health",
  "technology",
  "business",
  "entertainment",
  "science"
] as const;

// Register routes directly
function registerRoutes() {
  // News list endpoint
  app.get("/api/news", async (req, res) => {
    try {
      const { category, country } = req.query;
      const cacheKey = `${country || 'in'}-${category || 'all'}`;
      
      // Try cache first
      const cached = await storage.getCachedNews(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      // Fetch from API
      const params = new URLSearchParams({
        apikey: NEWS_API_KEY,
        country: (country as string) || 'in',
        language: 'en',
      });

      if (category && category !== 'general' && categories.includes(category as any)) {
        params.append('category', category as string);
      }

      const response = await fetch(`${BASE_URL}?${params.toString()}`);
      
      if (!response.ok) {
        const text = await response.text();
        console.error("NewsAPI Error:", text);
        return res.status(500).json({ message: "Failed to fetch news" });
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        console.error("NewsAPI Error:", data);
        return res.status(500).json({ message: data.message || "Upstream API error" });
      }

      // Map to schema
      const articles = (data.results || []).map((item: any, index: number) => ({
        id: index,
        title: item.title,
        description: item.description || item.content?.slice(0, 200) || "",
        content: item.content || "",
        url: item.link,
        imageUrl: item.image_url,
        source: item.source_id,
        category: category || 'general',
        publishedAt: item.pubDate,
      }));

      // Cache result
      await storage.cacheNews(articles, cacheKey);

      res.json(articles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim().length === 0) {
        return res.json([]);
      }

      const searchQuery = q.trim();
      console.log(`[Search] Query: "${searchQuery}"`);
      const cacheKey = `search-${searchQuery}`;
      
      // Try cache first
      const cached = await storage.getCachedNews(cacheKey);
      if (cached) {
        console.log(`[Search] Returning cached results for: "${searchQuery}"`);
        return res.json(cached);
      }

      // Fetch from API with search query
      const params = new URLSearchParams({
        apikey: NEWS_API_KEY,
        q: searchQuery,
        language: 'en',
      });

      const url = `${BASE_URL}?${params.toString()}`;
      console.log(`[Search] Fetching from: ${url.split('apikey=')[0]}apikey=***`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const text = await response.text();
        console.error("NewsAPI Search Error:", response.status, text);
        return res.status(500).json({ message: "Failed to search news" });
      }

      const data = await response.json();
      console.log(`[Search] API Response status: ${data.status}, Results count: ${data.results?.length || 0}`);
      
      if (data.status === 'error') {
        console.error("NewsAPI Search Error:", data.message);
        return res.status(500).json({ message: data.message || "Upstream API error" });
      }

      // Map to schema
      const articles = (data.results || []).map((item: any, index: number) => ({
        id: index,
        title: item.title,
        description: item.description || item.content?.slice(0, 200) || "",
        content: item.content || "",
        url: item.link,
        imageUrl: item.image_url,
        source: item.source_id,
        category: 'search',
        publishedAt: item.pubDate,
      }));

      console.log(`[Search] Returning ${articles.length} results for: "${searchQuery}"`);

      // Cache result
      await storage.cacheNews(articles, cacheKey);

      res.json(articles);
    } catch (err) {
      console.error("[Search] Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

// Initialize routes
let appHandler: ReturnType<typeof serverless> | null = null;

async function initializeApp() {
  registerRoutes();
  return serverless(app);
}

// Lazy initialization
async function getHandler() {
  if (!appHandler) {
    appHandler = await initializeApp();
  }
  return appHandler;
}

export const handler = async (event: any, context: any) => {
  const serverlessHandler = await getHandler();
  return serverlessHandler(event, context);
};
