/**
 * ProgressBar Component
 * Visual progress indicator
 * 
 * Single Responsibility: Render progress bar
 * Props: 3 (under the 7-prop limit)
 */

import { cn } from '@/core';

interface ProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  className?: string;
}

/**
 * Progress bar component
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = true,
  className,
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('fyw-w-full', className)}>
      {/* Label */}
      {showLabel && (
        <div className="fyw-flex fyw-justify-between fyw-mb-2 fyw-text-sm fyw-text-fyw-gray-400">
          <span>Progress</span>
          <span>{clampedProgress}%</span>
        </div>
      )}

      {/* Progress bar track */}
      <div className="fyw-w-full fyw-h-1 fyw-bg-fyw-gray-800 fyw-rounded-full fyw-overflow-hidden">
        {/* Progress bar fill */}
        <div
          className="fyw-h-full fyw-bg-fyw-white fyw-transition-all fyw-duration-300 fyw-ease-out"
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};


