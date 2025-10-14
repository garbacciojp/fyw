/**
 * Carousel Component
 * Simple carousel with arrow navigation
 * 
 * Single Responsibility: Render navigable carousel
 * Props: 3 (under the 7-prop limit)
 */

import { useState, useEffect, type ReactNode } from 'react';
import { cn } from '@/core';

interface CarouselProps {
  children: ReactNode[];
  className?: string;
  cardClassName?: string;
}

/**
 * Simple carousel with arrow navigation
 */
export const Carousel: React.FC<CarouselProps> = ({
  children,
  className,
  cardClassName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCards = children.length;

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalCards - 1));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalCards]);

  return (
    <div className={cn('fyw-relative fyw-w-full', className)}>
      {/* Cards container */}
      <div className="fyw-relative fyw-w-full fyw-overflow-hidden">
        {/* Card display */}
        <div className="fyw-w-full">
          {children.map((child, index) => (
            <div
              key={index}
              className={cn(
                'fyw-w-full fyw-transition-opacity fyw-duration-300',
                index === currentIndex ? 'fyw-block' : 'fyw-hidden',
                cardClassName
              )}
            >
              {child}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {/* Left Arrow */}
        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className={cn(
              'fyw-absolute fyw-left-4 fyw-top-1/2 fyw--translate-y-1/2',
              'fyw-w-12 fyw-h-12 fyw-rounded-full',
              'fyw-bg-fyw-white fyw-shadow-lg',
              'fyw-flex fyw-items-center fyw-justify-center',
              'fyw-transition-all fyw-duration-200',
              'hover:fyw-scale-110 hover:fyw-shadow-xl',
              'active:fyw-scale-95',
              'fyw-z-10'
            )}
            aria-label="Previous word"
          >
            <svg
              className="fyw-w-6 fyw-h-6 fyw-text-fyw-black"
              fill="none"
              strokeWidth="2.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {currentIndex < totalCards - 1 && (
          <button
            onClick={goToNext}
            className={cn(
              'fyw-absolute fyw-right-4 fyw-top-1/2 fyw--translate-y-1/2',
              'fyw-w-12 fyw-h-12 fyw-rounded-full',
              'fyw-bg-fyw-white fyw-shadow-lg',
              'fyw-flex fyw-items-center fyw-justify-center',
              'fyw-transition-all fyw-duration-200',
              'hover:fyw-scale-110 hover:fyw-shadow-xl',
              'active:fyw-scale-95',
              'fyw-z-10'
            )}
            aria-label="Next word"
          >
            <svg
              className="fyw-w-6 fyw-h-6 fyw-text-fyw-black"
              fill="none"
              strokeWidth="2.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
      </div>

      {/* Pagination dots - Perfect circles with proper sizing */}
      <div className="fyw-flex fyw-justify-center fyw-items-center fyw-gap-3 fyw-mt-8">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={cn(
              // Base styles - enforce perfect circle
              'fyw-rounded-full fyw-transition-all fyw-duration-300 fyw-flex-shrink-0',
              'fyw-border-0 fyw-p-0 fyw-cursor-pointer',
              // Active state: larger white circle with subtle shadow
              currentIndex === index
                ? 'fyw-w-3 fyw-h-3 fyw-min-w-[12px] fyw-min-h-[12px] fyw-bg-fyw-white fyw-shadow-sm'
                : 'fyw-w-2 fyw-h-2 fyw-min-w-[8px] fyw-min-h-[8px] fyw-bg-fyw-gray-600 hover:fyw-bg-fyw-gray-400 hover:fyw-scale-110'
            )}
            style={{
              aspectRatio: '1 / 1', // Force perfect circle
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

