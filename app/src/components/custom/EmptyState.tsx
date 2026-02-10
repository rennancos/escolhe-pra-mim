import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Film, SearchX, ListX, BookmarkX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  variant?: 'no-results' | 'empty-list' | 'empty-watchlist' | 'empty-watched';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  variant = 'no-results',
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  const variants = {
    'no-results': {
      icon: <SearchX className="h-16 w-16 text-violet-400" />,
      title: 'Nenhum resultado encontrado',
      description: 'Tente ajustar seus filtros para encontrar mais opções.',
      actionLabel: 'Limpar filtros',
    },
    'empty-list': {
      icon: <ListX className="h-16 w-16 text-violet-400" />,
      title: 'Lista vazia',
      description: 'Nada por aqui ainda.',
      actionLabel: 'Voltar ao início',
    },
    'empty-watchlist': {
      icon: <BookmarkX className="h-16 w-16 text-violet-400" />,
      title: 'Nenhum título salvo',
      description: 'Você ainda não salvou nenhum título para assistir depois.',
      actionLabel: 'Descobrir títulos',
    },
    'empty-watched': {
      icon: <Film className="h-16 w-16 text-violet-400" />,
      title: 'Nenhum título assistido',
      description: 'Você ainda não marcou nenhum título como assistido.',
      actionLabel: 'Descobrir títulos',
    },
  };

  const currentVariant = variants[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30">
        {icon || currentVariant.icon}
      </div>

      {/* Text */}
      <h3 className="text-xl font-bold text-foreground mb-2">
        {title || currentVariant.title}
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {description || currentVariant.description}
      </p>

      {/* Action */}
      {onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {actionLabel || currentVariant.actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
