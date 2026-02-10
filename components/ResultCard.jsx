"use client";
import Image from "next/image";
import { BookmarkSimple, ArrowsClockwise, Television, FilmSlate, Check, Star } from "phosphor-react";
import clsx from "clsx";
import { useState } from "react";

export function ResultCard({ result, onReset, onSave, isSaved }) {
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = () => {
    onSave(result);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  if (!result) return null;

  return (
    <div className="glass-card rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl mx-auto animate-fade-in flex flex-col md:flex-row relative group hover:shadow-primary/10 transition-shadow duration-500">
      
      {/* Background Blur Effect */}
      {result.poster_path && (
        <div 
          className="absolute inset-0 opacity-10 blur-3xl scale-150 z-0 pointer-events-none"
          style={{ backgroundImage: `url(${result.poster_path})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}

      {/* Poster Image */}
      <div className="md:w-2/5 relative min-h-[400px] md:min-h-[500px] overflow-hidden z-10">
        {result.poster_path ? (
          <>
            <Image
              src={result.poster_path}
              alt={result.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground/50">
            {result.type === "movie" ? <FilmSlate size={64} weight="duotone" /> : <Television size={64} weight="duotone" />}
          </div>
        )}
        
        {result.vote_average && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 text-sm border border-white/10 shadow-lg">
            <Star size={14} weight="fill" className="text-yellow-400" />
            {result.vote_average.toFixed(1)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="md:w-3/5 p-6 md:p-10 flex flex-col relative z-10 bg-background/40 backdrop-blur-sm md:bg-transparent">
        <div className="flex-grow space-y-6">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
            <span className="px-2 py-1 rounded bg-secondary/80 border border-secondary-foreground/5">
              {result.type === "movie" ? "Filme" : "Série"}
            </span>
            {result.release_date && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span>{new Date(result.release_date).getFullYear()}</span>
              </>
            )}
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
            {result.title}
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {result.genres.map((genre) => (
              <span key={genre} className="px-3 py-1 bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-full text-xs font-medium backdrop-blur-md">
                {genre}
              </span>
            ))}
          </div>
          
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-light">
            {result.overview || "Sem sinopse disponível."}
          </p>

          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Disponível em</h4>
            {result.streaming && result.streaming.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {result.streaming.map((service) => (
                  <span key={service} className="px-4 py-2 bg-primary/5 text-primary rounded-xl text-sm font-semibold border border-primary/10 flex items-center gap-2">
                    <Check size={14} weight="bold" />
                    {service}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground italic">
                Nenhuma informação de streaming disponível.
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-4 border-t border-border/50">
          {onReset && (
            <button
              onClick={onReset}
              className="flex-1 py-3.5 px-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ArrowsClockwise size={20} />
              Sortear outro
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={clsx(
              "flex-1 py-3.5 px-6 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95",
              isSaved
                ? "bg-green-500/10 text-green-600 border border-green-500/20"
                : "bg-foreground text-background hover:bg-foreground/90"
            )}
          >
            {isSaved ? (
              <>
                <Check size={20} weight="bold" />
                Salvo!
              </>
            ) : (
              <>
                <BookmarkSimple size={20} weight="regular" />
                Salvar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
