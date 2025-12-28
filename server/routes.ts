import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

const NEWS_API_KEY = "pub_b26b609a9da14b5b8c295911e0b7cdad";
const BASE_URL = "https://newsdata.io/api/1/news";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.news.list.path, async (req, res) => {
    try {
      const { category, country } = api.news.list.input.optional().parse(req.query) || { country: 'in' };
      const cacheKey = `${country}-${category || 'all'}`;
      
      // Try cache first
      const cached = await storage.getCachedNews(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      // Fetch from API
      const params = new URLSearchParams({
        apikey: NEWS_API_KEY,
        country: country || 'in',
        language: 'en',
      });

      if (category && category !== 'general') {
        params.append('category', category);
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
        id: index, // Temporary ID since we aren't saving to DB persistent
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

  return httpServer;
}
