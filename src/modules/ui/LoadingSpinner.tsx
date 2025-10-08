/**
 * LoadingSpinner Component
 * Animated loading indicator
 * 
 * Single Responsibility: Render loading spinner
 * Props: 2 (under the 7-prop limit)
 */

import { cn } from '@/core';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Loading spinner component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'fyw-w-4 fyw-h-4 fyw-border-2',
    md: 'fyw-w-8 fyw-h-8 fyw-border-2',
    lg: 'fyw-w-12 fyw-h-12 fyw-border-3',
  };

  return (
    <div
      className={cn(
        'fyw-rounded-full',
        'fyw-border-fyw-gray-700 fyw-border-t-fyw-white',
        'fyw-animate-spin',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="fyw-sr-only">Loading...</span>
    </div>
  );
};


