/**
 * Question Router
 * Routes to appropriate question component based on type
 * 
 * Single Responsibility: Route to correct question component
 * Props: 5 (under the 7-prop limit)
 */

import type { QuestionConfig, FlowType } from '@/types';
import { getQuestionComponent } from './QuestionRegistry';

interface QuestionRouterProps {
  config: QuestionConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  onComplete?: () => void;
  error?: string;
  flowType?: FlowType;
}

/**
 * Routes to the appropriate question component based on config
 */
export const QuestionRouter: React.FC<QuestionRouterProps> = ({
  config,
  value,
  onChange,
  onComplete,
  error,
  flowType,
}) => {
  // Get the component for this question type
  const QuestionComponent = getQuestionComponent(config.type);

  // Render the component with config-specific props
  return (
    <QuestionComponent
      value={value}
      onChange={onChange}
      onComplete={onComplete}
      error={error}
      flowType={flowType}
      {...config} // Pass all config as props
    />
  );
};


