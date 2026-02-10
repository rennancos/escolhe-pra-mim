import { Film, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

export function LoadingSpinner({
  message = 'Sorteando...',
  subMessage = 'Preparando as melhores opções para você',
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className="h-24 w-24 rounded-full border-4 border-violet-200 dark:border-violet-900/50" />
        
        {/* Spinning gradient ring */}
        <div className="absolute inset-0 h-24 w-24 animate-spin rounded-full border-4 border-transparent border-t-violet-600 border-r-indigo-600" 
          style={{ animationDuration: '1s' }}
        />
        
        {/* Inner content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 animate-pulse">
            <Film className="h-7 w-7 text-white" />
          </div>
        </div>

        {/* Floating sparkles */}
        <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-yellow-500 animate-bounce" 
          style={{ animationDelay: '0.2s' }}
        />
        <Sparkles className="absolute -bottom-1 -left-3 h-4 w-4 text-violet-500 animate-bounce" 
          style={{ animationDelay: '0.4s' }}
        />
      </div>

      {/* Text */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          {message}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {subMessage}
        </p>
      </div>

      {/* Loading dots */}
      <div className="mt-4 flex gap-1">
        <div className="h-2 w-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="h-2 w-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="h-2 w-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}

export default LoadingSpinner;
