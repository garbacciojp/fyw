/**
 * QuestionHeader Component
 * Header section for question screens with progress tracking
 * 
 * Single Responsibility: Render question header with progress
 * Props: 5 (under the 7-prop limit)
 */

import type { FlowType } from '@/types';
import { cn } from '@/core';

interface QuestionHeaderProps {
  flowType: FlowType;
  questionNumber: number;
  totalQuestions: number;
  progress: number;
  onSwitchFlow: () => void;
  className?: string;
}

/**
 * Question header with flow switcher and progress
 */
export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  flowType,
  questionNumber,
  totalQuestions,
  progress,
  onSwitchFlow,
  className,
}) => {
  return (
    <header
      className={cn(
        'fyw-flex-shrink-0',
        'fyw-w-full',
        'fyw-px-6 md:fyw-px-8',
        'fyw-pt-8 md:fyw-pt-12',
        'fyw-pb-10', // ~1cm gap below header (40px)
        className
      )}
    >
      {/* Main heading - centered */}
      <div className="fyw-mb-6 fyw-text-center">
        <h1 className="fyw-text-xl fyw-uppercase fyw-tracking-wider fyw-text-fyw-white fyw-font-normal fyw-mb-2">
          FIND YOUR WORD
        </h1>
        <div className="fyw-text-sm fyw-text-fyw-gray-400">
          (for{' '}
          <button
            onClick={onSwitchFlow}
            className="fyw-text-green-500 fyw-underline hover:fyw-text-green-400 fyw-transition-colors fyw-duration-200"
          >
            {flowType === 'mine' ? 'someone else' : 'myself'}
          </button>
          )
        </div>
      </div>

      {/* Progress info - full width with left/right alignment */}
      <div className="fyw-flex fyw-items-center fyw-justify-between fyw-text-sm">
        {/* Left side: question number and progress */}
        <div className="fyw-flex fyw-items-center fyw-gap-3 fyw-text-fyw-white">
          <span>{questionNumber}/{totalQuestions}</span>
          <span className="fyw-text-fyw-gray-600">•</span>
          <span>Progress: {progress}%</span>
        </div>
        
        {/* Right side: choices saved */}
        <div className="fyw-text-green-500">
          Choices Saved
        </div>
      </div>
    </header>
  );
};

