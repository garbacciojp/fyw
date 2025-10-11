/**
 * AppShell Component
 * Main container for the widget
 * 
 * Single Responsibility: Provide main layout structure
 * Props: 5 (under the 7-prop limit - includes debug panel support)
 * 
 * RESPONSIVE BEHAVIOR:
 * Mobile (<768px): Vertical layout with image preview window on top
 * Desktop (≥768px): Horizontal two-column layout (image left, content right)
 */

import type { ReactNode } from 'react';
import { cn } from '@/core';
import { DEFAULT_IMAGE } from '@/config/images.config';

interface AppShellProps {
  children: ReactNode;
  showVideo?: boolean;
  imageSrc?: string;
  debugPanel?: ReactNode;
  className?: string;
}

/**
 * Main application shell component
 * Provides the two-column layout (video + content)
 */
export const AppShell: React.FC<AppShellProps> = ({
  children,
  showVideo = true,
  imageSrc = DEFAULT_IMAGE,
  debugPanel,
  className,
}) => {
  return (
    <div
      className={cn(
        'fyw-widget',
        'fyw-fixed fyw-top-0 fyw-left-0 fyw-right-0 fyw-bottom-0 fyw-z-[999999]',
        'fyw-overflow-hidden fyw-bg-fyw-black',
        className
      )}
      style={{ maxHeight: '100vh', height: '100vh' }}
    >
      {/* 
        RESPONSIVE LAYOUT:
        Mobile: Single scrollable column with image at top
        Desktop: Two-column layout (image left, content right)
      */}
      <div className="fyw-flex fyw-h-full fyw-w-full fyw-overflow-hidden">
        {/* 
          IMAGE SECTION - Desktop only (fixed position)
          Hidden on mobile - image appears inside scrollable content instead
        */}
        {showVideo && (
          <div className="fyw-hidden md:fyw-block md:fyw-w-1/2 fyw-h-full fyw-relative fyw-bg-gray-800">
            <img 
              src={imageSrc}
              alt="Custom jewellery product showcase"
              className="fyw-w-full fyw-h-full fyw-object-cover"
              style={{ objectPosition: 'center 75%' }}
              onLoad={() => console.log('✅ Image loaded successfully')}
              onError={(e) => {
                console.error('❌ Image failed to load');
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.style.background = 'linear-gradient(135deg, #8B4513 0%, #654321 100%)';
              }}
            />
            
            {/* PRYA Branding Overlay - Desktop only */}
            <div className="fyw-absolute fyw-bottom-6 fyw-left-1/2 fyw-transform fyw--translate-x-1/2">
              <h2 className="fyw-text-white fyw-font-sans fyw-text-xl fyw-font-medium fyw-tracking-wide fyw-drop-shadow-lg">
                PRYA
              </h2>
            </div>
            
            {/* Debug Panel Overlay - Desktop only */}
            {debugPanel}
          </div>
        )}

        {/* 
          CONTENT SECTION:
          Mobile: Full width, full height
          Desktop: 50% width on right side, full height
        */}
        <div
          className={cn(
            'fyw-w-full fyw-h-full fyw-bg-fyw-black fyw-text-fyw-white',
            // Desktop: if showing video, take only 1/2 width
            showVideo && 'md:fyw-w-1/2'
          )}
        >
          {/* Actual content - child components */}
          {children}
        </div>
      </div>
    </div>
  );
};


