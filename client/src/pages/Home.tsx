import { useNews, useSyncNews } from "@/hooks/use-news";
import { NewsCard } from "@/components/NewsCard";
import { HeroSection } from "@/components/HeroSection";
import { BreakingTicker } from "@/components/BreakingTicker";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Category } from "@shared/schema";

interface HomeProps {
  category?: Category;
}

export default function Home({ category }: HomeProps) {
  const { data: news, isLoading, error } = useNews(category);
  const syncMutation = useSyncNews();

  // Initial sync if database is empty or stale
  useEffect(() => {
    // Optionally trigger a sync on mount if needed, or rely on cache
    // For this demo, we assume data exists or user hits refresh
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-destructive">
        Error loading news. Please try again later.
      </div>
    );
  }

  // Filter out articles without images for the hero section to look good
  const heroArticle = news?.find(a => a.imageUrl && a.title.length > 30);
  const remainingNews = news?.filter(a => a.id !== heroArticle?.id) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white">
      {/* Ticker for all pages */}
      <BreakingTicker news={news || []} />
      
      <Navbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {isLoading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse">Fetching global updates...</p>
          </div>
        ) : (
          <>
            {/* Hero Section - Only show on main page or if category has a hero-worthy item */}
            {heroArticle && (
              <HeroSection article={heroArticle} />
            )}

            {/* Controls / Section Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-display font-bold flex items-center gap-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  {category ? category.charAt(0).toUpperCase() + category.slice(1) : "Latest Stories"}
                </span>
                <div className="h-px w-20 bg-gradient-to-r from-primary/50 to-transparent ml-4" />
              </h2>

              <button 
                onClick={() => syncMutation.mutate()}
                disabled={syncMutation.isPending}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  bg-white/5 hover:bg-white/10 border border-white/10
                  transition-all duration-200 hover:text-primary disabled:opacity-50
                "
              >
                <RefreshCw className={`w-4 h-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                {syncMutation.isPending ? 'Updating...' : 'Refresh Feed'}
              </button>
            </div>

            {/* News Grid */}
            {remainingNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {remainingNews.map((article, index) => (
                  <NewsCard key={article.id} article={article} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-xl text-muted-foreground">No news found for this category.</p>
                <button 
                  onClick={() => syncMutation.mutate()} 
                  className="mt-4 text-primary hover:underline"
                >
                  Try refreshing data
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
