import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Content, ContentType } from '@/types';
import { ContentCard, EmptyState } from '@/components/custom';
import { useUserLists } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Bookmark, 
  ArrowLeft, 
  Trash2,
  Film,
  Tv,
  Shuffle,
  SortAsc,
  Filter,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type SortOption = 'date_desc' | 'date_asc' | 'title_asc' | 'rating_desc';

export function Watchlist() {
  const navigate = useNavigate();
  const { 
    lists, 
    removeFromWatchlist, 
    markAsWatched
  } = useUserLists();

  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date_desc');
  const [pickedContent, setPickedContent] = useState<Content | null>(null);
  const [isPickDialogOpen, setIsPickDialogOpen] = useState(false);

  const handleRemove = (contentId: number, title: string) => {
    removeFromWatchlist(contentId);
    toast.success('Removido da lista', {
      description: `"${title}" foi removido da sua lista.`,
    });
  };

  const handleMarkAsWatched = (content: Content) => {
    markAsWatched(content);
    toast.success('Marcado como assistido!', {
      description: `"${content.title}" foi movido para seu histórico.`,
    });
    if (pickedContent?.id === content.id) {
      setIsPickDialogOpen(false);
    }
  };

  const handleClearAll = () => {
    lists.watchlist.forEach(item => removeFromWatchlist(item.content.id));
    toast.success('Lista limpa', {
      description: 'Todos os títulos foram removidos da sua lista.',
    });
  };

  const handlePickRandom = () => {
    if (lists.watchlist.length === 0) return;
    const randomIndex = Math.floor(Math.random() * lists.watchlist.length);
    setPickedContent(lists.watchlist[randomIndex].content);
    setIsPickDialogOpen(true);
  };

  const filteredAndSortedList = useMemo(() => {
    let result = [...lists.watchlist];

    // Filter
    if (filterType !== 'all') {
      result = result.filter(item => item.content.type === filterType);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'date_asc':
          return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
        case 'title_asc':
          return a.content.title.localeCompare(b.content.title);
        case 'rating_desc':
          return (b.content.rating || 0) - (a.content.rating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [lists.watchlist, filterType, sortBy]);

  const watchlistCount = lists.watchlist.length;
  const movieCount = lists.watchlist.filter(item => item.content.type === 'movie').length;
  const seriesCount = lists.watchlist.filter(item => item.content.type === 'series').length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              className="mb-2 -ml-4"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Bookmark className="h-7 w-7 text-violet-600" />
              Para Assistir Depois
            </h1>
            <p className="text-muted-foreground mt-1">
              {watchlistCount === 0 
                ? 'Sua lista está vazia'
                : `Você tem ${watchlistCount} título${watchlistCount !== 1 ? 's' : ''} salvo${watchlistCount !== 1 ? 's' : ''}`
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {watchlistCount > 0 && (
              <>
                <Button 
                  onClick={handlePickRandom}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                >
                  <Shuffle className="mr-2 h-4 w-4" />
                  Escolher pra mim
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Limpar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Limpar lista?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover todos os {watchlistCount} títulos da sua lista?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAll} className="bg-red-600 hover:bg-red-700">
                        Sim, limpar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        {/* Filters & Stats Bar */}
        {watchlistCount > 0 && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="px-3 py-1 bg-white dark:bg-slate-800 border">
                <Film className="mr-1 h-3 w-3 text-violet-500" />
                {movieCount} Filmes
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 bg-white dark:bg-slate-800 border">
                <Tv className="mr-1 h-3 w-3 text-indigo-500" />
                {seriesCount} Séries
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterType} onValueChange={(v) => setFilterType(v as ContentType | 'all')}>
                  <SelectTrigger className="w-[130px] h-9 bg-background">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="movie">Filmes</SelectItem>
                    <SelectItem value="series">Séries</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[160px] h-9 bg-background">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Adicionado (Recente)</SelectItem>
                    <SelectItem value="date_asc">Adicionado (Antigo)</SelectItem>
                    <SelectItem value="rating_desc">Melhor Avaliados</SelectItem>
                    <SelectItem value="title_asc">Título (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {watchlistCount === 0 ? (
        <EmptyState
          variant="empty-watchlist"
          onAction={() => navigate('/')}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredAndSortedList.map(({ content }) => (
              <ContentCard
                key={content.id}
                content={content}
                isInWatchlist={true}
                isWatched={false}
                onAddToWatchlist={() => {}}
                onMarkAsWatched={handleMarkAsWatched}
                onRemoveFromWatchlist={(id) => handleRemove(id, content.title)}
                onRemoveFromWatched={() => {}}
              />
            ))}
          </div>

          {filteredAndSortedList.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhum item encontrado com os filtros selecionados.</p>
              <Button 
                variant="link" 
                onClick={() => setFilterType('all')}
                className="mt-2"
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </>
      )}

      {/* Random Pick Dialog */}
      <Dialog open={isPickDialogOpen} onOpenChange={setIsPickDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-600" />
              Sugestão para você
            </DialogTitle>
            <DialogDescription>
              Que tal assistir a este título agora?
            </DialogDescription>
          </DialogHeader>
          
          {pickedContent && (
            <div className="py-4">
              <ContentCard
                content={pickedContent}
                isInWatchlist={true}
                isWatched={false}
                onAddToWatchlist={() => {}}
                onMarkAsWatched={handleMarkAsWatched}
                onRemoveFromWatchlist={(id) => {
                  handleRemove(id, pickedContent.title);
                  setIsPickDialogOpen(false);
                }}
                onRemoveFromWatched={() => {}}
                variant="compact"
              />
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => handlePickRandom()}>
              <Shuffle className="mr-2 h-4 w-4" />
              Sugerir outro
            </Button>
            <Button onClick={() => setIsPickDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Watchlist;

