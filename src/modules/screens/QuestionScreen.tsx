/**
 * QuestionScreen Component
 * Main question display screen
 * 
 * Single Responsibility: Render question with header/footer
 * Props: 5 (under the 7-prop limit) - grouped related props into objects
 */

import { QuestionRouter } from '@/modules/questions';
import { QuestionHeader, QuestionFooter } from '@/modules/layout';
import type { QuestionConfig, FlowType } from '@/types';

/**
 * Grouped props for navigation actions
 */
interface NavigationActions {
  onBack?: () => void;
  onContinue: () => void;
  onReset: () => void;
  onSwitchFlow: () => void;
  canContinue: boolean;
}

/**
 * Grouped props for progress info
 */
interface ProgressInfo {
  progress: number;
  questionNumber: number;
  totalQuestions: number;
}

interface QuestionScreenProps {
  config: QuestionConfig;
  flowType: FlowType;
  value: unknown;
  onChange: (value: unknown) => void;
  progressInfo: ProgressInfo;
  navigation: NavigationActions;
}

/**
 * Question screen with header, content, and footer
 * Composed using layout components
 */
export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  config,
  flowType,
  value,
  onChange,
  progressInfo,
  navigation,
}) => {
  const { progress, questionNumber, totalQuestions } = progressInfo;
  const { onBack, onContinue, onReset, onSwitchFlow, canContinue } = navigation;
  
  return (
    <>
      {/* Header - using reusable component */}
      <QuestionHeader
        flowType={flowType}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        progress={progress}
        onSwitchFlow={onSwitchFlow}
      />

      {/* Content section - constrained height, prevent scroll anchoring */}
      <div className="fyw-px-6 md:fyw-px-8 fyw-pt-6 md:fyw-pt-8 fyw-pb-2 fyw-flex-shrink-0" style={{ overflowAnchor: 'none' }}>
        <div className="fyw-w-full fyw-max-w-md fyw-mx-auto fyw-text-center">
          {/* Question title */}
          <div className="fyw-mb-6">
            <h2 className="fyw-font-heading fyw-text-6xl md:fyw-text-7xl fyw-font-normal fyw-uppercase fyw-text-fyw-white fyw-mb-4 fyw-leading-none">
              {config.getTitle(flowType)}
            </h2>
            {config.getSubtitle && (
              <p className="fyw-text-base fyw-text-fyw-white fyw-leading-relaxed">
                {config.getSubtitle(flowType)}
              </p>
            )}
          </div>

          {/* Question component */}
          <QuestionRouter config={config} value={value} onChange={onChange} />
        </div>
      </div>

      {/* Footer - using reusable component */}
      <QuestionFooter
        onContinue={onContinue}
        onBack={onBack}
        onReset={onReset}
        canContinue={canContinue}
      />
    </>
  );
};

