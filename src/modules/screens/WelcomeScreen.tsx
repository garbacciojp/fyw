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
import { DEFAULT_IMAGE, UI_CONFIG } from '@/config';

interface WelcomeScreenProps {
  onSelectFlow: (flow: FlowType) => void;
  className?: string;
}

/**
 * Welcome screen with split-screen design (desktop) and mobile image preview
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectFlow, className }) => {
  return (
    <div className="fyw-w-full fyw-h-full fyw-overflow-y-auto fyw-overflow-x-hidden">
      {/* Mobile Image Preview - Scrollable at top (hidden on desktop) */}
      <div 
        className="md:fyw-hidden fyw-w-full fyw-relative fyw-bg-gray-800 fyw-flex-shrink-0"
        style={{
          height: UI_CONFIG.MOBILE_IMAGE_PREVIEW_HEIGHT
        }}
      >
        <img 
          src={DEFAULT_IMAGE}
          alt="Custom jewellery product showcase"
          className="fyw-w-full fyw-h-full fyw-object-cover"
          style={{ objectPosition: 'center 75%' }}
        />
      </div>

      {/* Content Container */}
      <div
        className={cn(
          'fyw-w-full fyw-px-8 fyw-py-12',
          'fyw-flex fyw-flex-col fyw-justify-center fyw-items-center',
          'fyw-text-white',
          'fyw-min-h-[calc(100vh-360px)] md:fyw-min-h-screen',
          className
        )}
      >
        <div className="fyw-max-w-sm fyw-mx-auto fyw-text-center fyw-space-y-6">
        {/* Small Heading */}
        <p className="fyw-text-lg fyw-uppercase fyw-tracking-wide fyw-text-white fyw-font-medium">
          FIND YOUR WORD
        </p>

        {/* Main Heading */}
        <h1 className="fyw-font-heading fyw-text-6xl md:fyw-text-7xl fyw-font-normal fyw-uppercase fyw-text-white fyw-leading-[0.8] fyw-space-y-1">
          <div>YOUR STORY.</div>
          <div>YOUR MEANING.</div>
          <div>YOUR WORD.</div>
        </h1>

        {/* Description */}
        <p className="fyw-text-base fyw-text-white fyw-leading-relaxed fyw-text-center fyw-px-1 md:fyw-px-0">
          Everyone's story is one of a kind, and your word should be too. Uncover the word that feels just right for you or someone special.
        </p>

        {/* Action Buttons */}
        <div className="fyw-flex fyw-flex-col fyw-gap-4 fyw-pt-4 fyw-px-8 md:fyw-px-4">
          <Button onClick={() => onSelectFlow('mine')} size="lg" fullWidth>
            MY WORD
          </Button>

          <Button onClick={() => onSelectFlow('theirs')} variant="secondary" size="lg" fullWidth>
            THEIR WORD
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
};


