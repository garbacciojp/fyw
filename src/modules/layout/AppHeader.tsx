/**
 * AppHeader Component
 * Header section with close button
 * 
 * Single Responsibility: Render header area
 * Props: 3 (under the 7-prop limit)
 */

import type { ReactNode } from 'react';
import { cn } from '@/core';

interface AppHeaderProps {
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
}

/**
 * Header component with close button
 */
export const AppHeader: React.FC<AppHeaderProps> = ({ onClose, children, className }) => {
  return (
    <header
      className={cn(
        'fyw-flex fyw-justify-end fyw-items-start',
        'fyw-flex-shrink-0',
        'fyw-px-6 fyw-pt-6 md:fyw-px-8 md:fyw-pt-8',
        className
      )}
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            'fyw-w-10 fyw-h-10',
            'fyw-bg-transparent fyw-text-fyw-white',
            'hover:fyw-text-fyw-gray-400',
            'fyw-border-none fyw-text-3xl fyw-font-light fyw-leading-none',
            'fyw-cursor-pointer fyw-transition-colors fyw-duration-200',
            'fyw-flex fyw-items-center fyw-justify-center',
            'fyw-p-0 fyw-m-0'
          )}
          aria-label="Close widget"
        >
          ×
        </button>
      )}

      {/* Header content */}
      {children}
    </header>
  );
};


