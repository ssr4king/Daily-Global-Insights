import { Globe, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/20 backdrop-blur-lg mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              <span className="text-xl font-display font-bold text-foreground">NEXUS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Daily news curated for the modern world.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <SocialLink icon={<Twitter className="w-5 h-5" />} href="#" />
            <SocialLink icon={<Github className="w-5 h-5" />} href="#" />
            <SocialLink icon={<Linkedin className="w-5 h-5" />} href="#" />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Nexus News. Powered by NewsAPI.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a 
      href={href}
      className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-primary transition-colors hover:scale-110 transform duration-200"
    >
      {icon}
    </a>
  );
}
