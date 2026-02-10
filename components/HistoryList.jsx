"use client";
import Image from "next/image";
import { Trash, CheckCircle, Circle, Clock } from "phosphor-react";
import clsx from "clsx";

export function HistoryList({ history, onToggleWatched, onRemove }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border">
        <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />
        <p>Seu histórico está vazio.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div
          key={item.historyId}
          className="group flex items-center justify-between p-3 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4 overflow-hidden">
            {/* Poster Thumbnail */}
            <div className="w-10 h-14 bg-secondary rounded-md overflow-hidden flex-shrink-0 border border-border/50">
              {item.poster_path ? (
                <Image
                  src={item.poster_path}
                  alt={item.title}
                  width={40}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  ?
                </div>
              )}
            </div>

            <button
              onClick={() => onToggleWatched(item.historyId)}
              className={clsx(
                "flex-shrink-0 transition-colors",
                item.watched ? "text-green-500" : "text-muted-foreground hover:text-primary"
              )}
              title={item.watched ? "Marcar como não assistido" : "Marcar como assistido"}
            >
              {item.watched ? <CheckCircle size={24} weight="bold" className="bg-white dark:bg-black rounded-full" /> : <Circle size={24} />}
            </button>
            
            <div className={clsx("min-w-0 flex-grow", item.watched && "opacity-50")}>
              <h4 className={clsx("font-medium truncate text-sm md:text-base", item.watched && "line-through decoration-border")}>
                {item.title}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {item.type === "movie" ? "Filme" : "Série"} • {new Date(item.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => onRemove(item.historyId)}
            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Remover do histórico"
          >
            <Trash size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
