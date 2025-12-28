import { Link, useLocation } from "wouter";
import { categories } from "@shared/schema";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  // Helper to extract category from path
  const currentCategory = location === "/" ? "all" : location.split("/")[1] || "all";

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
          <div className="hidden md:block">
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
