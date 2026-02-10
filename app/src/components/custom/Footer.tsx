import { Film, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        {/* Logo e Copyright */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <Film className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Escolhe Pra Mim</span>
            <span className="text-xs text-muted-foreground">
              © {currentYear} - Todos os direitos reservados
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            Feito com <Heart className="h-3 w-3 fill-red-500 text-red-500" /> para indecisos
          </span>
        </div>

        {/* API Credit */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Dados fornecidos por</span>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
          >
            TMDB
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
