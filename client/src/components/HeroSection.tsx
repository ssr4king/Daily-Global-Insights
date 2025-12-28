import { Article } from "@shared/schema";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection({ article }: { article: Article }) {
  if (!article) return null;

  return (
    <section className="relative w-full h-[60vh] min-h-[500px] overflow-hidden rounded-3xl group perspective-1000 mx-auto max-w-[1400px]">
      {/* Background Image with Parallax-like effect */}
      <div className="absolute inset-0">
        <img 
          src={article.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80"} // Generic news background
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end p-8 md:p-16 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wide shadow-[0_0_20px_rgba(56,189,248,0.5)]">
              Featured Story
            </span>
            <span className="text-white/80 text-sm font-medium backdrop-blur-md px-3 py-1 rounded-full bg-white/5 border border-white/10">
              {article.source || "Nexus News"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight text-white drop-shadow-2xl">
            {article.title}
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            {article.description}
          </p>

          <div className="pt-4">
            <a 
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-3 px-8 py-4 rounded-xl
                bg-white text-background font-bold text-lg
                hover:bg-primary hover:text-white
                transition-all duration-300 transform hover:translate-x-2 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]
              "
            >
              Read Full Article
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
