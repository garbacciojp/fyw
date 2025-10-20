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

  // Resolve options: use getOptions if available, otherwise use static options
  const resolvedOptions = config.getOptions && flowType 
    ? config.getOptions(flowType)
    : config.options;

  // Prepare props with resolved options
  const componentProps = {
    value,
    onChange,
    onComplete,
    error,
    ...config, // Pass all config as props
    options: resolvedOptions, // Override with resolved options
    flowType, // Override config.flowType with actual flow
  };

  // Render the component with config-specific props
  // Type assertion needed because different question types have different props
  return <QuestionComponent {...(componentProps as any)} />;
};


