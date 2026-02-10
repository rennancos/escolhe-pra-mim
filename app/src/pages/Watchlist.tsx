import { useNavigate } from 'react-router-dom';
import type { Content } from '@/types';
import { ContentCard, EmptyState } from '@/components/custom';
import { useUserLists } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bookmark, 
  ArrowLeft, 
  Trash2,
  Film,
  Tv
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

export function Watchlist() {
  const navigate = useNavigate();
  const { 
    lists, 
    removeFromWatchlist, 
    markAsWatched
  } = useUserLists();

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
  };

  const handleClearAll = () => {
    lists.watchlist.forEach(item => removeFromWatchlist(item.content.id));
    toast.success('Lista limpa', {
      description: 'Todos os títulos foram removidos da sua lista.',
    });
  };

  const watchlistCount = lists.watchlist.length;
  const movieCount = lists.watchlist.filter(item => item.content.type === 'movie').length;
  const seriesCount = lists.watchlist.filter(item => item.content.type === 'series').length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
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

        {watchlistCount > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar Lista
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
        )}
      </div>

      {/* Stats */}
      {watchlistCount > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          <Badge variant="secondary" className="px-3 py-1">
            <Film className="mr-1 h-3 w-3" />
            {movieCount} Filme{movieCount !== 1 ? 's' : ''}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <Tv className="mr-1 h-3 w-3" />
            {seriesCount} Série{seriesCount !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}

      {/* Content */}
      {watchlistCount === 0 ? (
        <EmptyState
          variant="empty-watchlist"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {lists.watchlist.map(({ content }) => (
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
      )}
    </div>
  );
}

export default Watchlist;
