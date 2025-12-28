import { Globe, Twitter, Github, Linkedin, Instagram } from "lucide-react";

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
            <SocialLink icon={<Instagram className="w-5 h-5" />} href="https://www.instagram.com/singhshubham0001/?igsh=bXR4eWdkdDYwc243#" title="Instagram" />
            <SocialLink icon={<Twitter className="w-5 h-5" />} href="https://x.com/Shubhams_Stwt?t=k7YrLLNZysYZ5oYlLeNGEQ&s=09" title="Twitter" />
            <SocialLink icon={<Github className="w-5 h-5" />} href="https://github.com/ssr4king" title="GitHub" />
            <SocialLink icon={<Linkedin className="w-5 h-5" />} href="https://www.linkedin.com/in/shubham-dev-ies/" title="LinkedIn" />
          </div>

          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Nexus News. Powered by NewsAPI.</p>
            <p className="text-xs mt-2">Made by <span className="text-primary font-semibold">Shubham Singh Rajput</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, href, title }: { icon: React.ReactNode; href: string; title: string }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-primary transition-colors hover:scale-110 transform duration-200"
    >
      {icon}
    </a>
  );
}
