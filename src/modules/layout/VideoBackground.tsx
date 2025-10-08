/**
 * VideoBackground Component
 * Background video player
 * 
 * Single Responsibility: Render background video
 * Props: 2 (under the 7-prop limit)
 */

import { cn } from '@/core';

interface VideoBackgroundProps {
  videoUrl?: string;
  className?: string;
}

/**
 * Background video component
 */
export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoUrl = 'https://cdn.shopify.com/videos/c/o/v/fb8ce557f69346be9792e02ccb0df7a4.mp4',
  className,
}) => {
  return (
    <div className={cn('fyw-w-full fyw-h-full fyw-relative fyw-overflow-hidden', className)}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fyw-w-full fyw-h-full fyw-object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};


