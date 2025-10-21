/**
 * ResultsScreen Component
 * Display word suggestions
 * 
 * Single Responsibility: Render results
 * Props: 5 (under the 7-prop limit)
 */

import { useState } from 'react';
import { Button, Carousel } from '@/modules/ui';
import type { WordSuggestion, FlowType } from '@/types';
import { cn } from '@/core';

interface ResultsScreenProps {
  words: WordSuggestion[];
  userName?: string;
  flowType?: FlowType;
  className?: string;
}

/**
 * Results screen component
 */
export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  words,
  userName = 'you',
  flowType = 'mine',
  className,
}) => {
  const isMineFlow = flowType === 'mine';
  const [copied, setCopied] = useState(false);
  const [copiedWordIndex, setCopiedWordIndex] = useState<number | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  // Copy current word to clipboard (only the word, nothing else)
  const handleCopyWords = async () => {
    // Only copy the word text from the current carousel position
    const currentWord = words[currentCarouselIndex];
    if (!currentWord) return;
    
    try {
      await navigator.clipboard.writeText(currentWord.word);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy word:', err);
    }
  };

  // Copy single word to clipboard (ONLY the word, nothing else)
  const handleCopySingleWord = async (word: WordSuggestion, index: number) => {
    try {
      // Only copy the word itself from word.word field
      await navigator.clipboard.writeText(word.word);
      setCopiedWordIndex(index);
      setTimeout(() => setCopiedWordIndex(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy word:', err);
    }
  };

  // Handle view jewellery button
  const handleViewJewellery = () => {
    window.open('https://prya.co.uk/collections/name-jewellery', '_blank');
  };

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
            {isMineFlow ? 'YOUR WORD' : 'THEIR WORD'}
          </h1>
          <h2 className="fyw-font-heading fyw-text-6xl md:fyw-text-7xl fyw-font-normal fyw-uppercase fyw-text-fyw-white fyw-leading-[0.8] fyw-break-words fyw-max-w-full fyw-px-4">
            PERFECT FOR {userName.toUpperCase()}
          </h2>
        </div>

        {/* Description */}
        <p className="fyw-text-base fyw-text-fyw-white fyw-leading-relaxed fyw-text-center fyw-max-w-md fyw-mx-auto">
          {isMineFlow 
            ? 'Meaningful words, carefully selected for you, ready to be transformed into jewellery that tells your story.'
            : 'Meaningful words, carefully selected for them, ready to be transformed into jewellery that tells their story.'}
        </p>
      </header>

      {/* Content (carousel) */}
      <div className="fyw-flex-1 fyw-flex fyw-items-center fyw-py-8 md:fyw-py-12">
        <Carousel 
          className="fyw-w-full fyw-px-6 md:fyw-px-8"
          onSlideChange={setCurrentCarouselIndex}
        >
          {words.map((word, index) => (
            <div
              key={index}
              className={cn(
                // Card styling - no borders, fixed height
                'fyw-p-6 md:fyw-p-8',
                'fyw-bg-[#1a1a1a]',
                'fyw-transition-all fyw-duration-200',
                'fyw-h-[380px] md:fyw-h-[400px]', // Fixed height for all cards
                'fyw-flex fyw-flex-col'
              )}
            >
              {/* Word name - fixed position with top spacing, clickable */}
              <div className="fyw-flex-shrink-0 fyw-mt-12 fyw-mb-3">
                <h3 
                  onClick={() => handleCopySingleWord(word, index)}
                  className={cn(
                    "fyw-text-3xl md:fyw-text-4xl fyw-font-normal fyw-uppercase fyw-text-fyw-white fyw-text-center fyw-tracking-wider",
                    "fyw-cursor-pointer fyw-transition-all fyw-duration-200",
                    "hover:fyw-text-fyw-gray-300",
                    copiedWordIndex === index && "fyw-text-green-500"
                  )}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  title="Click to copy this word"
                >
                  {copiedWordIndex === index ? '✓ COPIED' : word.word}
                </h3>
              </div>

              {/* Pronunciation, origin, type - stacked on mobile, inline on desktop */}
              <div className="fyw-flex-shrink-0 fyw-flex fyw-flex-col md:fyw-flex-row fyw-items-center fyw-justify-center fyw-gap-1 md:fyw-gap-3 fyw-text-sm fyw-text-fyw-gray-400 fyw-mb-6">
                <span className="fyw-italic">{word.pronunciation}</span>
                <span className="fyw-hidden md:fyw-inline">•</span>
                <span>
                  {word.origin} • {word.type}
                </span>
              </div>

              {/* Description - top aligned, takes remaining space */}
              <div className="fyw-flex-1 fyw-overflow-hidden">
                <p className="fyw-text-fyw-white fyw-leading-relaxed fyw-text-center fyw-text-base md:fyw-text-lg">
                  {word.description}
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Footer */}
      <div className="fyw-flex-shrink-0 fyw-px-6 md:fyw-px-8 fyw-py-6 md:fyw-py-8 fyw-bg-fyw-black">
        <div className="fyw-w-full fyw-max-w-md fyw-mx-auto fyw-flex fyw-flex-col fyw-gap-4">
          <Button onClick={handleViewJewellery} size="lg" fullWidth>
            VIEW JEWELLERY
          </Button>
          <Button onClick={handleCopyWords} variant="secondary" size="lg" fullWidth>
            {copied ? 'COPIED!' : 'COPY WORD'}
          </Button>
        </div>
      </div>
    </div>
  );
};


