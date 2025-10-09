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
      {/* Header - similar to question screens but without progress bar */}
      <header
        className={cn(
          'fyw-flex-shrink-0',
          'fyw-w-full',
          'fyw-px-6 md:fyw-px-8',
          'fyw-pt-8 md:fyw-pt-12',
          'fyw-pb-10'
        )}
      >
        {/* Main heading - centered */}
        <div className="fyw-mb-6 fyw-text-center">
          <h1 className="fyw-text-xl fyw-uppercase fyw-tracking-wider fyw-text-fyw-white fyw-font-normal fyw-mb-2">
            YOUR WORDS
          </h1>
          <h2 className="fyw-font-heading fyw-text-6xl md:fyw-text-7xl fyw-font-normal fyw-uppercase fyw-text-fyw-white fyw-leading-none">
            PERFECT FOR {userName.toUpperCase()}
          </h2>
        </div>

        {/* Description */}
        <p className="fyw-text-base fyw-text-fyw-white fyw-leading-relaxed fyw-text-center fyw-max-w-md fyw-mx-auto">
          Here are meaningful words that resonate with your story, carefully selected to create beautiful, personalised jewellery.
        </p>
      </header>

      {/* Content (scrollable) */}
      <div className="fyw-flex-1 fyw-overflow-y-auto fyw-px-6 md:fyw-px-8 fyw-py-8 md:fyw-py-12">
        <div className="fyw-w-full fyw-max-w-md fyw-mx-auto fyw-space-y-8">
          {words.map((word, index) => (
            <div
              key={index}
              className={cn(
                // Card styling - no borders
                'fyw-p-6',
                'fyw-bg-[#1a1a1a]',
                'fyw-transition-all fyw-duration-200',
                'hover:fyw-bg-[#1f1f1f]',
                'fyw-animate-fadeIn'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Word name */}
              <h3 className="fyw-text-xl fyw-font-normal fyw-uppercase fyw-text-fyw-white fyw-mb-3 fyw-text-center fyw-tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {word.word}
              </h3>

              {/* Pronunciation, origin, type, and category */}
              <div className="fyw-flex fyw-items-center fyw-justify-center fyw-gap-3 fyw-text-sm fyw-text-fyw-gray-400 fyw-mb-4">
                <span className="fyw-italic">{word.pronunciation}</span>
                <span>•</span>
                <span>
                  {word.origin} • {word.type}
                </span>
                {/* Category tag - temporarily hidden but data still available from API */}
                {/* {word.category && (
                  <>
                    <span>•</span>
                    <span className="fyw-px-2 fyw-py-1 fyw-rounded fyw-bg-fyw-gray-800 fyw-text-fyw-white fyw-text-xs fyw-uppercase fyw-tracking-wider">
                      {word.category}
                    </span>
                  </>
                )} */}
              </div>

              {/* Description */}
              <p className="fyw-text-fyw-white fyw-leading-relaxed fyw-text-center">{word.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="fyw-flex-shrink-0 fyw-px-6 md:fyw-px-8 fyw-py-6 md:fyw-py-8 fyw-bg-fyw-black">
        <div className="fyw-w-full fyw-max-w-md fyw-mx-auto fyw-flex fyw-flex-col fyw-gap-4">
          <Button onClick={onStartOver} size="lg" fullWidth>
            TRY AGAIN
          </Button>
          <Button onClick={onClose} variant="secondary" size="lg" fullWidth>
            COPY WORDS
          </Button>
        </div>
      </div>
    </div>
  );
};


