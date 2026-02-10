export function Footer() {
  return (
    <footer className="border-t border-border py-6 mt-auto bg-secondary/30">
      <div className="container mx-auto px-4 text-center text-sm text-foreground/60">
        <p>© {new Date().getFullYear()} Escolhe Pra Mim. Desenvolvido por <a href="https://github.com/rennancos" target="_blank" className="text-primary hover:underline">@rennancos</a>.</p>
      </div>
    </footer>
  );
}
