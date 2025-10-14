/**
 * LoadingScreen Component
 * Loading state with animation
 * 
 * Single Responsibility: Render loading state
 * Props: 2 (under the 7-prop limit)
 */

import { cn } from '@/core';
import type { FlowType } from '@/types';

interface LoadingScreenProps {
  flowType?: FlowType;
  className?: string;
}

/**
 * Loading screen component
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  flowType = 'mine',
  className,
}) => {
  const isMineFlow = flowType === 'mine';
  const title = isMineFlow ? 'Finding Your Word' : 'Finding Their Word';
  const message = isMineFlow 
    ? 'Curating words that speak to your story'
    : 'Curating words that speak to their story';
  return (
    <div
      className={cn(
        'fyw-flex fyw-flex-col fyw-items-center fyw-justify-center',
        'fyw-h-full fyw-text-center fyw-px-6',
        className
      )}
    >
      {/* Animated loader - Simple bouncing dots */}
      <div className="fyw-mb-12">
        <div className="fyw-flex fyw-items-center fyw-justify-center fyw-gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="fyw-w-3 fyw-h-3 fyw-bg-fyw-white fyw-rounded-full"
              style={{
                animation: `fyw-bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Text */}
      <h2 className="fyw-font-heading fyw-text-4xl fyw-font-normal fyw-text-fyw-white fyw-mb-4">
        {title}
      </h2>
      <p className="fyw-text-fyw-gray-400 fyw-max-w-md">{message}</p>

      {/* Loading animation styles */}
      <style>{`
        @keyframes fyw-bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          40% {
            transform: translateY(-12px);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};


