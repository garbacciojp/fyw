/**
 * ResultsScreen Component
 * Display word suggestions
 * 
 * Single Responsibility: Render results
 * Props: 5 (under the 7-prop limit)
 */

import { Button } from '@/modules/ui';
import type { WordSuggestion } from '@/types';
import { cn } from '@/core';

interface ResultsScreenProps {
  words: WordSuggestion[];
  userName?: string;
  onClose: () => void;
  onStartOver: () => void;
  className?: string;
}

/**
 * Results screen component
 */
export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  words,
  userName = 'you',
  onClose,
  onStartOver,
  className,
}) => {
  return (
    <div className={cn('fyw-flex fyw-flex-col fyw-h-full', className)}>
      {/* Header */}
      <div className="fyw-flex-shrink-0 fyw-px-6 md:fyw-px-12 fyw-py-6 fyw-border-b fyw-border-fyw-gray-800">
        <h2 className="fyw-font-heading fyw-text-3xl fyw-font-normal fyw-text-fyw-white">
          Your Perfect Words, {userName}
        </h2>
        <p className="fyw-text-fyw-gray-400 fyw-mt-2">
          Based on your preferences, here are {words.length} meaningful words curated just for you.
        </p>
      </div>

      {/* Content (scrollable) */}
      <div className="fyw-flex-1 fyw-overflow-y-auto fyw-px-6 md:fyw-px-12 fyw-py-6">
        <div className="fyw-space-y-6">
          {words.map((word, index) => (
            <div
              key={index}
              className={cn(
                'fyw-p-6 fyw-rounded-lg',
                'fyw-bg-fyw-gray-900 fyw-border fyw-border-fyw-gray-800',
                'hover:fyw-border-fyw-gray-700 fyw-transition',
                'fyw-animate-fadeIn'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Word name */}
              <h3 className="fyw-font-heading fyw-text-2xl fyw-font-normal fyw-text-fyw-white fyw-mb-2">
                {word.word}
              </h3>

              {/* Pronunciation, origin, type, and category */}
              <div className="fyw-flex fyw-items-center fyw-gap-3 fyw-text-sm fyw-text-fyw-gray-400 fyw-mb-4">
                <span className="fyw-italic">{word.pronunciation}</span>
                <span>•</span>
                <span>
                  {word.origin} • {word.type}
                </span>
                {word.category && (
                  <>
                    <span>•</span>
                    <span className="fyw-px-2 fyw-py-1 fyw-rounded fyw-bg-fyw-gray-800 fyw-text-fyw-white fyw-text-xs fyw-uppercase fyw-tracking-wider">
                      {word.category}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="fyw-text-fyw-gray-300 fyw-leading-relaxed">{word.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="fyw-flex-shrink-0 fyw-px-6 md:fyw-px-12 fyw-py-4 fyw-border-t fyw-border-fyw-gray-800 fyw-bg-fyw-black">
        <div className="fyw-flex fyw-flex-col fyw-gap-3">
          <Button onClick={onClose} size="lg" fullWidth>
            Close
          </Button>
          <Button onClick={onStartOver} variant="secondary" fullWidth>
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
};


