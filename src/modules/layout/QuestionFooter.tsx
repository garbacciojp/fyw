/**
 * QuestionFooter Component
 * Footer section for question screens with navigation
 * 
 * Single Responsibility: Render question footer with navigation buttons
 * Props: 6 (under the 7-prop limit)
 */

import { Button } from '@/modules/ui';
import { cn } from '@/core';

interface QuestionFooterProps {
  onContinue: () => void;
  onBack?: () => void;
  onReset: () => void;
  canContinue: boolean;
  continueLabel?: string;
  className?: string;
}

/**
 * Question footer with navigation buttons
 */
export const QuestionFooter: React.FC<QuestionFooterProps> = ({
  onContinue,
  onBack,
  onReset,
  canContinue,
  continueLabel = 'Continue →',
  className,
}) => {
  return (
    <footer
      className={cn(
        'fyw-flex-shrink-0',
        'fyw-px-6 md:fyw-px-8',
        'fyw-pt-8',
        // Generous bottom padding for all mobile browsers
        'fyw-pb-8 sm:fyw-pb-6',
        'fyw-bg-fyw-black',
        className
      )}
      style={{ 
        // Add extra bottom padding for iOS safe area + general mobile browser UI
        // This works on all devices - iOS uses safe area, others get min 2rem
        paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom) + 1rem))' 
      }}
    >
      <div className="fyw-w-full fyw-max-w-md fyw-mx-auto fyw-flex fyw-flex-col fyw-gap-3">
        {/* Continue button */}
        <Button onClick={onContinue} disabled={!canContinue} size="lg" fullWidth>
          {continueLabel}
        </Button>

        {/* Back button */}
        {onBack && (
          <Button onClick={onBack} variant="secondary" fullWidth>
            ← Back
          </Button>
        )}

        {/* Reset button */}
        <button
          onClick={onReset}
          className={cn(
            'fyw-text-sm fyw-text-red-500',
            'hover:fyw-text-red-400 fyw-transition-colors fyw-duration-200',
            'fyw-py-2'
          )}
        >
          RESET ALL
        </button>
      </div>
    </footer>
  );
};

