import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type NewsListResponse } from "@shared/routes";
import { Category } from "@shared/schema";
import { getApiUrl } from "@/config";

// GET /api/news
export function useNews(category?: Category) {
  return useQuery({
    queryKey: [api.news.list.path, category],
    queryFn: async () => {
      // Build query string manually since we're using fetch directly
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      params.append("country", "in"); // Default country per requirements

      const url = `${getApiUrl(api.news.list.path)}?${params.toString()}`;
      const res = await fetch(url);
      
      if (!res.ok) throw new Error("Failed to fetch news");
      return api.news.list.responses[200].parse(await res.json());
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

// POST /api/news/sync - For manual refresh/initial load
export function useSyncNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.news.sync.path, {
        method: api.news.sync.method,
      });
      if (!res.ok) throw new Error("Failed to sync news");
      return api.news.sync.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.news.list.path] });
    },
  });
}
