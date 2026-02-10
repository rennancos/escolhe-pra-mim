import { useState } from 'react';
import type { Content } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Bookmark,
  Check,
  Star,
  Calendar,
  Film,
  Tv,
  BookmarkCheck,
  RotateCcw,
} from 'lucide-react';

interface ContentCardProps {
  content: Content;
  isInWatchlist: boolean;
  isWatched: boolean;
  onAddToWatchlist: (content: Content) => void;
  onMarkAsWatched: (content: Content) => void;
  onRemoveFromWatchlist?: (contentId: number) => void;
  onRemoveFromWatched?: (contentId: number) => void;
  variant?: 'default' | 'compact';
}

export function ContentCard({
  content,
  isInWatchlist,
  isWatched,
  onAddToWatchlist,
  onMarkAsWatched,
  onRemoveFromWatchlist,
  onRemoveFromWatched,
  variant = 'default',
}: ContentCardProps) {
  const [imageError, setImageError] = useState(false);

  const typeLabel = content.type === 'movie' ? 'Filme' : 'Série';
  const TypeIcon = content.type === 'movie' ? Film : Tv;

  // Cores para os serviços de streaming
  const streamingColors: Record<string, string> = {
    'Netflix': 'bg-red-600 text-white',
    'Globoplay': 'bg-red-500 text-white',
    'HBO Max': 'bg-purple-600 text-white',
    'Disney+': 'bg-blue-600 text-white',
    'Prime Video': 'bg-sky-500 text-white',
    'Apple TV+': 'bg-slate-800 text-white',
    'Mercado Play': 'bg-yellow-500 text-black',
  };

  if (variant === 'compact') {
    return (
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Poster */}
            <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded-md bg-muted">
              {!imageError && content.posterPath ? (
                <img
                  src={content.posterPath}
                  alt={content.title}
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30">
                  <TypeIcon className="h-6 w-6 text-violet-400" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm line-clamp-1">{content.title}</h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <TypeIcon className="h-3 w-3" />
                  {typeLabel}
                </span>
                {content.year && (
                  <span className="flex items-center gap-0.5">
                    <Calendar className="h-3 w-3" />
                    {content.year}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {content.streaming.slice(0, 2).map((service) => (
                  <Badge
                    key={service}
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 ${streamingColors[service] || ''}`}
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1">
              {isWatched ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-500"
                        onClick={() => onRemoveFromWatched?.(content.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remover de assistidos</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onMarkAsWatched(content)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Marcar como assistido</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {isInWatchlist ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-violet-500"
                        onClick={() => onRemoveFromWatchlist?.(content.id)}
                      >
                        <BookmarkCheck className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remover da lista</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onAddToWatchlist(content)}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Salvar para assistir</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {!imageError && content.posterPath ? (
          <img
            src={content.posterPath}
            alt={content.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-100 via-indigo-100 to-purple-100 dark:from-violet-900/40 dark:via-indigo-900/40 dark:to-purple-900/40">
            <div className="text-center">
              <TypeIcon className="mx-auto h-16 w-16 text-violet-400/60" />
              <p className="mt-2 text-sm text-violet-400/80">Sem imagem</p>
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Type badge */}
        <Badge
          variant="secondary"
          className="absolute left-2 top-2 bg-black/60 text-white backdrop-blur-sm"
        >
          <TypeIcon className="mr-1 h-3 w-3" />
          {typeLabel}
        </Badge>

        {/* Rating */}
        {content.rating && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 bg-yellow-500/90 text-white"
          >
            <Star className="mr-1 h-3 w-3 fill-current" />
            {content.rating.toFixed(1)}
          </Badge>
        )}

        {/* Quick actions on hover */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-3 opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
          {!isWatched && (
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onMarkAsWatched(content)}
            >
              <Check className="mr-1 h-4 w-4" />
              Assistido
            </Button>
          )}
          {!isInWatchlist && !isWatched && (
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => onAddToWatchlist(content)}
            >
              <Bookmark className="mr-1 h-4 w-4" />
              Salvar
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-bold text-lg line-clamp-1 mb-1">{content.title}</h3>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          {content.year && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {content.year}
            </span>
          )}
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {content.genres.slice(0, 3).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>

        {/* Streaming services */}
        <div className="flex flex-wrap gap-1">
          {content.streaming.map((service) => (
            <Badge
              key={service}
              className={`text-xs ${streamingColors[service] || 'bg-slate-500'}`}
            >
              {service}
            </Badge>
          ))}
        </div>
      </CardContent>

      {/* Footer actions */}
      <CardFooter className="flex gap-2 p-4 pt-0">
        {isWatched ? (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
            onClick={() => onRemoveFromWatched?.(content.id)}
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            Assistir de novo
          </Button>
        ) : isInWatchlist ? (
          <>
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onMarkAsWatched(content)}
            >
              <Check className="mr-1 h-4 w-4" />
              Marcar assistido
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemoveFromWatchlist?.(content.id)}
            >
              <BookmarkCheck className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onAddToWatchlist(content)}
            >
              <Bookmark className="mr-1 h-4 w-4" />
              Ver depois
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onMarkAsWatched(content)}
            >
              <Check className="mr-1 h-4 w-4" />
              Já assisti
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default ContentCard;
