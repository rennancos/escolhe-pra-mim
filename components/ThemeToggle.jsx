"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "phosphor-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-secondary transition-colors text-foreground"
      aria-label="Alternar tema"
    >
      {theme === "dark" ? <Sun size={20} weight="regular" /> : <Moon size={20} weight="regular" />}
    </button>
  );
}
