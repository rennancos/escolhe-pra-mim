"use client";
import Image from "next/image";
import { Trash, BookmarkSimple, FilmSlate, Television } from "phosphor-react";

export function SavedList({ saved, onRemove }) {
  if (!saved || saved.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border">
        <BookmarkSimple className="w-10 h-10 mx-auto mb-3 opacity-20" />
        <p>Você ainda não salvou nenhum título.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {saved.map((item) => (
        <div
          key={item.id}
          className="relative flex gap-3 p-3 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all group"
        >
          {/* Poster Thumbnail */}
          <div className="w-16 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0 border border-border/50">
            {item.poster_path ? (
              <Image
                src={item.poster_path}
                alt={item.title}
                width={64}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                {item.type === "movie" ? <FilmSlate size={20} /> : <Television size={20} />}
              </div>
            )}
          </div>

          <div className="flex-grow min-w-0 pr-6 py-1">
            <h4 className="font-medium truncate text-foreground leading-tight mb-1" title={item.title}>
              {item.title}
            </h4>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {item.genres.slice(0, 2).map((g) => (
                <span key={g} className="text-[10px] px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded border border-border">
                  {g}
                </span>
              ))}
              {item.genres.length > 2 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded border border-border">
                  +{item.genres.length - 2}
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground truncate">
              {item.streaming.length > 0 ? item.streaming.join(", ") : "Nenhum streaming"}
            </p>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Remover dos salvos"
          >
            <Trash size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
