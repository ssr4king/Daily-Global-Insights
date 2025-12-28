import { Article } from "@shared/schema";
import { motion } from "framer-motion";
import { ExternalLink, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface NewsCardProps {
  article: Article;
  index: number;
}

export function NewsCard({ article, index }: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative perspective-1000 h-full"
    >
      <div className="
        h-full flex flex-col
        glass-panel rounded-2xl overflow-hidden
        transition-all duration-500 ease-out
        transform hover:-translate-y-2 hover:rotate-x-2 hover:shadow-[0_20px_40px_-15px_rgba(56,189,248,0.3)]
      ">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          {article.imageUrl ? (
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <span className="text-slate-600 text-4xl font-display font-bold">NEWS</span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="
              px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
              bg-primary/90 text-primary-foreground backdrop-blur-sm
              shadow-lg shadow-primary/25
            ">
              {article.category || "General"}
            </span>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-60" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow relative z-10">
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            {article.source && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {article.source}
              </span>
            )}
            {article.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(article.publishedAt), 'MMM d, yyyy')}
              </span>
            )}
          </div>

          <h3 className="text-xl font-display font-bold leading-tight mb-3 text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
            {article.description || article.content?.substring(0, 150) + "..."}
          </p>

          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="
              mt-auto inline-flex items-center justify-center gap-2
              w-full py-3 rounded-xl font-semibold text-sm
              bg-white/5 hover:bg-white/10 border border-white/10
              text-foreground hover:text-primary
              transition-all duration-300
              group-hover:shadow-lg group-hover:border-primary/30
            "
          >
            Read Full Story
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      {/* Floating Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10 rounded-2xl" />
    </motion.div>
  );
}
