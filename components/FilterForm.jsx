"use client";
import { useState, useEffect } from "react";
import { STREAMING_SERVICES, tmdb } from "@/services/tmdb";
import { DiceFive, Check, CircleNotch, FilmSlate, Television } from "phosphor-react";
import clsx from "clsx";

export function FilterForm({ onSearch, isLoading }) {
  const [type, setType] = useState("movie");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]); // IDs
  const [selectedStreaming, setSelectedStreaming] = useState([]);
  const [error, setError] = useState("");
  const [loadingGenres, setLoadingGenres] = useState(false);

  useEffect(() => {
    async function fetchGenres() {
      setLoadingGenres(true);
      const data = await tmdb.getGenres(type);
      setGenres(data);
      setSelectedGenres([]); // Reset selection on type change
      setLoadingGenres(false);
    }
    fetchGenres();
  }, [type]);

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const toggleStreaming = (service) => {
    setSelectedStreaming((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSearch = () => {
    if (selectedGenres.length === 0) {
      setError("Selecione pelo menos um gênero.");
      return;
    }
    if (selectedStreaming.length === 0) {
      setError("Selecione pelo menos um serviço de streaming.");
      return;
    }
    setError("");
    onSearch({ type, genres: selectedGenres, streaming: selectedStreaming });
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 w-full max-w-3xl mx-auto space-y-10 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Type Selection */}
      <div className="space-y-4 relative">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">O que vamos ver hoje?</h3>
        <div className="grid grid-cols-2 gap-4">
          {["movie", "series"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={clsx(
                "relative overflow-hidden py-4 px-6 rounded-2xl transition-all duration-300 font-bold text-lg group",
                type === t
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t === "movie" ? <FilmSlate size={20} weight="duotone" /> : <Television size={20} weight="duotone" />}
                {t === "movie" ? "Filme" : "Série"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div className="space-y-4 relative">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
          Gêneros
          {loadingGenres && <CircleNotch size={14} className="animate-spin" />}
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {loadingGenres ? (
             // Skeleton loader
             Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-9 w-24 bg-secondary/50 rounded-full animate-pulse" />
             ))
          ) : (
            genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => toggleGenre(genre.id)}
                className={clsx(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                  selectedGenres.includes(genre.id)
                    ? "bg-primary/10 border-primary text-primary shadow-sm"
                    : "bg-background/50 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                {genre.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Streaming */}
      <div className="space-y-4 relative">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">Onde assistir?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STREAMING_SERVICES.map((service) => (
            <button
              key={service}
              onClick={() => toggleStreaming(service)}
              className={clsx(
                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                selectedStreaming.includes(service)
                  ? "bg-background border-primary shadow-sm ring-1 ring-primary/20"
                  : "bg-background/30 border-transparent hover:bg-background/50 hover:border-border/80 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={clsx(
                "w-5 h-5 rounded-md flex items-center justify-center transition-colors shadow-sm",
                selectedStreaming.includes(service) 
                  ? "bg-gradient-to-br from-primary to-purple-600 text-white" 
                  : "bg-secondary text-transparent group-hover:bg-secondary/80"
              )}>
                <Check size={12} weight="bold" />
              </div>
              {service}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium animate-pulse flex items-center gap-2">
           ⚠️ {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSearch}
        disabled={isLoading || loadingGenres}
        className={clsx(
            "w-full py-5 text-white font-bold text-lg rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] relative overflow-hidden group",
            (isLoading || loadingGenres) 
              ? "bg-muted text-muted-foreground cursor-not-allowed" 
              : "bg-gradient-to-r from-primary via-indigo-500 to-purple-600 hover:shadow-primary/30 hover:shadow-2xl"
        )}
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        
        {isLoading ? (
            <CircleNotch size={24} className="animate-spin relative z-10" />
        ) : (
            <DiceFive size={24} className="relative z-10 group-hover:rotate-180 transition-transform duration-500" />
        )}
        <span className="relative z-10">{isLoading ? "Sorteando..." : "Sortear Título"}</span>
      </button>
    </div>
  );
}
