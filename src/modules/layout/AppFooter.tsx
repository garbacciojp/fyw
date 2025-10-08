/**
 * AppFooter Component
 * Sticky footer area for navigation buttons
 * 
 * Single Responsibility: Render sticky footer area
 * Props: 2 (under the 7-prop limit)
 */

import type { ReactNode } from 'react';
import { cn } from '@/core';

interface AppFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Sticky footer component (always visible)
 */
export const AppFooter: React.FC<AppFooterProps> = ({ children, className }) => {
  return (
    <footer
      className={cn(
        'fyw-flex-shrink-0',
        'fyw-sticky fyw-bottom-0',
        'fyw-px-6 md:fyw-px-12',
        'fyw-py-4 md:fyw-py-5',
        'fyw-border-t fyw-border-fyw-gray-800',
        'fyw-bg-fyw-black',
        'fyw-backdrop-blur-sm',
        className
      )}
    >
      {children}
    </footer>
  );
};


