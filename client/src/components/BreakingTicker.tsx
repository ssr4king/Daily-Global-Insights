import { motion } from "framer-motion";
import { Article } from "@shared/schema";
import { Zap } from "lucide-react";

interface BreakingTickerProps {
  news: Article[];
}

export function BreakingTicker({ news }: BreakingTickerProps) {
  if (!news.length) return null;

  // Duplicate news for seamless loop
  const tickerContent = [...news, ...news, ...news];

  return (
    <div className="bg-primary/10 border-b border-primary/20 backdrop-blur-sm overflow-hidden py-2 sticky top-0 z-40">
      <div className="flex items-center relative">
        <div className="absolute left-0 z-10 bg-gradient-to-r from-background to-transparent w-20 h-full" />
        <div className="absolute left-4 z-20 flex items-center gap-2 bg-background/80 backdrop-blur rounded px-2 py-0.5 border border-primary/20">
          <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Breaking</span>
        </div>
        
        <motion.div 
          className="flex whitespace-nowrap gap-12 pl-32"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 40 
          }}
        >
          {tickerContent.map((item, i) => (
            <div key={`${item.id}-${i}`} className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              <span className="font-medium">{item.title}</span>
            </div>
          ))}
        </motion.div>
        
        <div className="absolute right-0 z-10 bg-gradient-to-l from-background to-transparent w-20 h-full" />
      </div>
    </div>
  );
}
