import { FilmSlate } from "phosphor-react";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 glass">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <FilmSlate size={20} weight="duotone" className="text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:to-primary transition-all">
            Escolhe Pra Mim
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/rennancos"
            target="_blank"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            by @rennancos
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
