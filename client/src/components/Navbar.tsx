import { Link, useLocation } from "wouter";
import { categories } from "@shared/schema";
import { motion } from "framer-motion";
import { Globe, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { getApiUrl } from "@/config";

export function Navbar() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Helper to extract category from path
  const currentCategory = location === "/" ? "all" : location.split("/")[1] || "all";

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search API query
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      try {
        const response = await fetch(`${getApiUrl('/api/search')}?q=${encodeURIComponent(debouncedQuery)}`);
        if (!response.ok) {
          console.error("Search API error:", response.status);
          return [];
        }
        const data = await response.json();
        console.log("Search results:", data);
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.error("Search error:", err);
        return [];
      }
    },
    enabled: debouncedQuery.length > 0,
    retry: 1,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  return (
    <nav className="sticky top-[41px] z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <Globe className="w-8 h-8 text-primary relative z-10 transform group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-display font-bold tracking-tighter bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                NEXUS
              </span>
              <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] leading-none">
                Daily News
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
            <div className="flex items-center gap-1">
              <NavLink 
                href="/" 
                active={currentCategory === "all"}
              >
                Latest
              </NavLink>
              
              {categories.slice(0, 5).map((cat) => (
                <NavLink 
                  key={cat} 
                  href={`/${cat}`} 
                  active={currentCategory === cat}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 relative">
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className="w-full pl-10 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-primary text-sm"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
              
              {/* Search Results Dropdown */}
              {showResults && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background/98 border border-white/10 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto backdrop-blur-sm">
                  {isLoading ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      <span className="inline-block animate-pulse">Searching for "{searchQuery}"...</span>
                    </div>
                  ) : error ? (
                    <div className="p-4 text-center text-red-500 text-sm">
                      Error loading results. Please try again.
                    </div>
                  ) : searchResults && searchResults.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {searchResults.slice(0, 8).map((article: any, idx: number) => (
                        <a
                          key={idx}
                          href={article.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 hover:bg-white/10 transition-colors duration-150"
                        >
                          <p className="text-sm font-medium text-white truncate">
                            {article.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {article.source || "Unknown"}
                          </p>
                        </a>
                      ))}
                    </div>
                  ) : debouncedQuery ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No articles found for "{debouncedQuery}"
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      Type to search
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button - simple version for this demo */}
          <div className="md:hidden">
            <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center">
              <div className="w-4 h-0.5 bg-white mb-1"></div>
              <div className="w-4 h-0.5 bg-white mb-1"></div>
              <div className="w-4 h-0.5 bg-white"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Categories Scroll (visible only on mobile) */}
      <div className="md:hidden overflow-x-auto scrollbar-hide border-t border-white/5 py-3 px-4 flex gap-4">
         <Link href="/" className={`text-sm whitespace-nowrap ${currentCategory === 'all' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>Latest</Link>
         {categories.map(cat => (
           <Link key={cat} href={`/${cat}`} className={`text-sm whitespace-nowrap capitalize ${currentCategory === cat ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
             {cat}
           </Link>
         ))}
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <div className={`
        relative px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
        ${active ? 'text-white' : 'text-muted-foreground hover:text-white'}
      `}>
        {children}
        {active && (
          <motion.div
            layoutId="navbar-indicator"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        {/* Hover background */}
        <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 hover:opacity-100 transition-opacity -z-10" />
      </div>
    </Link>
  );
}
