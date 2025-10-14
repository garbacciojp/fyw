/**
 * Carousel Component
 * Simple swipeable/draggable carousel - full width cards
 * 
 * Single Responsibility: Render swipeable carousel with touch and mouse support
 * Props: 3 (under the 7-prop limit)
 * 
 * Features:
 * - Touch swipe (mobile)
 * - Mouse drag (desktop)
 * - Keyboard navigation (arrow keys)
 * - Click-to-navigate dots
 */

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/core';

interface CarouselProps {
  children: ReactNode[];
  className?: string;
  cardClassName?: string;
}

/**
 * Simple swipeable carousel component
 */
export const Carousel: React.FC<CarouselProps> = ({
  children,
  className,
  cardClassName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragEnd, setDragEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const totalCards = children.length;
  const minSwipeDistance = 50; // Minimum swipe/drag distance to trigger

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

  // Touch handlers (Mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // Reset
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Mouse handlers (Desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragEnd(0); // Reset
    setDragStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (!dragStart || !dragEnd) return;
    
    const distance = dragStart - dragEnd;
    const isLeftDrag = distance > minSwipeDistance;
    const isRightDrag = distance < -minSwipeDistance;

    if (isLeftDrag) {
      goToNext();
    } else if (isRightDrag) {
      goToPrevious();
    }
    
    // Reset
    setDragStart(0);
    setDragEnd(0);
  };

  const onMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(0);
      setDragEnd(0);
    }
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
      {/* Cards container - full width with touch and mouse support */}
      <div 
        ref={containerRef}
        className="fyw-relative fyw-w-full fyw-overflow-hidden fyw-touch-pan-y"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {/* Card display with slide animation */}
        <div 
          className="fyw-flex fyw-transition-transform fyw-duration-300 fyw-ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className={cn(
                'fyw-w-full fyw-flex-shrink-0',
                'fyw-flex fyw-justify-center', // Center content
                cardClassName
              )}
            >
              <div className="fyw-w-full md:fyw-max-w-[85%]">
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots - Perfect circles with robust inline styles */}
      <div 
        className="fyw-flex fyw-justify-center fyw-items-center fyw-mt-8"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '32px',
        }}
      >
        {children.map((_, index) => {
          const isActive = currentIndex === index;
          return (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className="fyw-carousel-dot"
              style={{
                // Force exact dimensions with inline styles (override any site CSS)
                width: isActive ? '12px' : '8px',
                height: isActive ? '12px' : '8px',
                minWidth: isActive ? '12px' : '8px',
                minHeight: isActive ? '12px' : '8px',
                maxWidth: isActive ? '12px' : '8px',
                maxHeight: isActive ? '12px' : '8px',
                
                // Force perfect circle
                borderRadius: '50%',
                aspectRatio: '1 / 1',
                
                // Colors and appearance
                backgroundColor: isActive ? '#ffffff' : '#4b5563',
                border: 'none',
                outline: 'none',
                padding: '0',
                margin: '0',
                
                // Remove any button defaults
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                
                // Interaction
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                
                // Shadow for active
                boxShadow: isActive ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
                
                // Prevent any flexbox stretching
                flexShrink: 0,
                flexGrow: 0,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#9ca3af';
                  (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#4b5563';
                  (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                }
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};

