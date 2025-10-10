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
      {/* Animated loader */}
      <div className="fyw-mb-12">
        <div className="fyw-relative fyw-w-20 fyw-h-20 fyw-mx-auto">
          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="fyw-absolute fyw-w-2 fyw-h-2 fyw-bg-fyw-white fyw-rounded-full"
              style={{
                animation: `fyw-orbit 2s linear infinite ${i * 0.2}s`,
                top: '50%',
                left: '50%',
                transformOrigin: '0 40px',
              }}
            />
          ))}

          {/* Center pulse */}
          <div
            className="fyw-absolute fyw-w-1 fyw-h-1 fyw-bg-fyw-gray-400 fyw-rounded-full fyw-top-1/2 fyw-left-1/2"
            style={{
              transform: 'translate(-50%, -50%)',
              animation: 'fyw-centerPulse 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* Text */}
      <h2 className="fyw-font-heading fyw-text-4xl fyw-font-normal fyw-text-fyw-white fyw-mb-4">
        {title}
      </h2>
      <p className="fyw-text-fyw-gray-400 fyw-max-w-md">{message}</p>

      {/* Additional loading animation */}
      <style>{`
        @keyframes fyw-centerPulse {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }
      `}</style>
    </div>
  );
};


