import { useNavigate } from 'react-router-dom';
import type { Content } from '@/types';
import { ContentCard, EmptyState } from '@/components/custom';
import { useUserLists } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
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

export function Watched() {
  const navigate = useNavigate();
  const { 
    lists, 
    removeFromWatched,
    addToWatchlist,
    isInWatchlist
  } = useUserLists();

  const handleRemove = (contentId: number, title: string) => {
    removeFromWatched(contentId);
    toast.success('Removido do histórico', {
      description: `"${title}" foi removido da sua lista de assistidos.`,
    });
  };

  const handleWatchAgain = (content: Content) => {
    addToWatchlist(content);
    toast.success('Adicionado à lista!', {
      description: `"${content.title}" foi salvo para assistir novamente.`,
    });
  };

  const handleClearAll = () => {
    lists.watched.forEach(item => removeFromWatched(item.content.id));
    toast.success('Histórico limpo', {
      description: 'Todos os títulos foram removidos do seu histórico.',
    });
  };

  const watchedCount = lists.watched.length;
  const movieCount = lists.watched.filter(item => item.content.type === 'movie').length;
  const seriesCount = lists.watched.filter(item => item.content.type === 'series').length;

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
            <CheckCircle className="h-7 w-7 text-green-600" />
            Já Assistidos
          </h1>
          <p className="text-muted-foreground mt-1">
            {watchedCount === 0 
              ? 'Seu histórico está vazio'
              : `Você assistiu ${watchedCount} título${watchedCount !== 1 ? 's' : ''}`
            }
          </p>
        </div>

        {watchedCount > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar Histórico
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Limpar histórico?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja remover todos os {watchedCount} títulos do seu histórico?
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
      {watchedCount > 0 && (
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
      {watchedCount === 0 ? (
        <EmptyState
          variant="empty-watched"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {lists.watched.map(({ content }) => (
            <ContentCard
              key={content.id}
              content={content}
              isInWatchlist={isInWatchlist(content.id)}
              isWatched={true}
              onAddToWatchlist={handleWatchAgain}
              onMarkAsWatched={() => {}}
              onRemoveFromWatchlist={() => {}}
              onRemoveFromWatched={(id) => handleRemove(id, content.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Watched;
