/**
 * WelcomeScreen Component
 * Mobile-first split-screen homepage design
 * 
 * Single Responsibility: Render welcome screen with product showcase
 * Props: 2 (under the 7-prop limit)
 */

import { Button } from '@/modules/ui';
import type { FlowType } from '@/types';
import { cn } from '@/core';

interface WelcomeScreenProps {
  onSelectFlow: (flow: FlowType) => void;
  className?: string;
}

/**
 * Welcome screen with split-screen design (45% image, 55% text)
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectFlow, className }) => {
  return (
    <div
      className={cn(
        'fyw-w-full fyw-px-6',
        'fyw-text-white',
        className
      )}
    >
      {/* Content Container */}
      <div className="fyw-max-w-sm fyw-mx-auto fyw-text-center fyw-space-y-6">
        {/* Small Heading */}
        <p className="fyw-text-sm fyw-uppercase fyw-tracking-wide fyw-text-white fyw-font-medium">
          FIND YOUR WORD
        </p>

        {/* Main Heading */}
        <h1 className="fyw-font-heading fyw-text-6xl md:fyw-text-7xl fyw-font-normal fyw-uppercase fyw-text-white fyw-leading-none fyw-space-y-1">
          <div>THE PERFECT</div>
          <div>WORD FOR YOUR</div>
          <div>CUSTOM JEWELLERY</div>
        </h1>

        {/* Description */}
        <p className="fyw-text-base fyw-text-white fyw-leading-relaxed fyw-text-left md:fyw-text-center">
          Everyone's story is unique, just like every word we suggest. Take our personalised quiz
          to discover meaningful words that resonate with your style, heritage, and emotions.
        </p>

        {/* Action Buttons */}
        <div className="fyw-flex fyw-flex-col fyw-gap-3 fyw-pt-4">
          <Button onClick={() => onSelectFlow('mine')} size="lg" fullWidth>
            MY WORD
          </Button>

          <Button onClick={() => onSelectFlow('theirs')} variant="secondary" size="lg" fullWidth>
            THEIR WORD
          </Button>
        </div>
      </div>
    </div>
  );
};


