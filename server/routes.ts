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

  return httpServer;
}
