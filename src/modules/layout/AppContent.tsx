/**
 * AppContent Component
 * Scrollable content area
 * 
 * Single Responsibility: Render scrollable content area
 * Props: 2 (under the 7-prop limit)
 */

import type { ReactNode } from 'react';
import { cn } from '@/core';

interface AppContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * Scrollable content area component
 */
export const AppContent: React.FC<AppContentProps> = ({ children, className }) => {
  return (
    <main
      className={cn(
        'fyw-flex-1',
        'fyw-overflow-y-auto',
        'fyw-px-6 md:fyw-px-12',
        'fyw-py-6 md:fyw-py-8',
        'fyw-webkit-overflow-scrolling-touch',
        className
      )}
    >
      {children}
    </main>
  );
};


