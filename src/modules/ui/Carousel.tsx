/**
 * Carousel Component
 * Swipeable horizontal carousel with peek preview
 * 
 * Single Responsibility: Render swipeable carousel
 * Props: 4 (under the 7-prop limit)
 */

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/core';

interface CarouselProps {
  children: ReactNode[];
  className?: string;
  cardClassName?: string;
  showGradient?: boolean;
}

/**
 * Swipeable carousel component with preview peek
 */
export const Carousel: React.FC<CarouselProps> = ({
  children,
  className,
  cardClassName,
  showGradient = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalCards = children.length;

  // Handle mouse/touch start
  const handleStart = (clientX: number) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(clientX);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  // Handle mouse/touch move
  const handleMove = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    const walk = (startX - clientX) * 0.5; // Further reduced sensitivity
    containerRef.current.scrollLeft = scrollLeft + walk;
  };

  // Handle mouse/touch end
  const handleEnd = () => {
    if (!containerRef.current || !isDragging) return;
    setIsDragging(false);

    // Snap to nearest card
    const container = containerRef.current;
    const cardWidth = container.offsetWidth * 0.92; // 92% width per card
    const newIndex = Math.round(container.scrollLeft / cardWidth);
    setCurrentIndex(Math.min(Math.max(0, newIndex), totalCards - 1));

    // Smooth scroll to snapped position
    container.scrollTo({
      left: newIndex * cardWidth,
      behavior: 'smooth',
    });
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.pageX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.pageX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Scroll event to update current index
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = container.offsetWidth * 0.92;
      const newIndex = Math.round(container.scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn('fyw-relative fyw-w-full', className)}>
      {/* Carousel container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          'fyw-flex fyw-gap-3 fyw-overflow-x-auto fyw-overflow-y-hidden',
          'fyw-snap-x fyw-snap-mandatory',
          'fyw-scrollbar-hide', // Hide scrollbar
          isDragging ? 'fyw-cursor-grabbing' : 'fyw-cursor-grab',
          'fyw-select-none' // Prevent text selection while dragging
        )}
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={cn(
              'fyw-flex-shrink-0',
              'fyw-w-[92%] md:fyw-w-[85%]', // Card takes 92% width on mobile, 85% on desktop
              'fyw-snap-start',
              cardClassName
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Right gradient fade effect */}
      {showGradient && (
        <div
          className="fyw-absolute fyw-top-0 fyw-right-0 fyw-bottom-0 fyw-w-24 fyw-pointer-events-none"
          style={{
            background: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
          }}
        />
      )}

      {/* Pagination dots */}
      <div className="fyw-flex fyw-justify-center fyw-gap-2 fyw-mt-6">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              if (containerRef.current) {
                const cardWidth = containerRef.current.offsetWidth * 0.92;
                containerRef.current.scrollTo({
                  left: index * cardWidth,
                  behavior: 'smooth',
                });
              }
            }}
            className={cn(
              'fyw-w-2 fyw-h-2 fyw-rounded-full fyw-transition-all fyw-duration-200',
              currentIndex === index
                ? 'fyw-bg-fyw-white fyw-w-6'
                : 'fyw-bg-fyw-gray-600 hover:fyw-bg-fyw-gray-400'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .fyw-scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

