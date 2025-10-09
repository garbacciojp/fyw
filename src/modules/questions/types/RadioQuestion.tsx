/**
 * RadioQuestion Component
 * Single-choice radio button group
 * 
 * Single Responsibility: Render radio button options
 * Props: 5 (under the 7-prop limit)
 */

import { RadioButton } from '@/modules/ui';
import type { QuestionOption } from '@/types';
import type { QuestionComponentProps } from '../QuestionRegistry';

interface RadioQuestionProps extends QuestionComponentProps {
  options?: QuestionOption[];
}

/**
 * Radio button question component
 */
export const RadioQuestion: React.FC<RadioQuestionProps> = ({
  value,
  onChange,
  onComplete,
  options = [],
  error,
}) => {
  const selectedValue = value as string;

  const handleChange = (newValue: string) => {
    onChange(newValue);
    // Auto-advance after selection (with small delay for visual feedback)
    if (onComplete) {
      setTimeout(onComplete, 300);
    }
  };

  return (
    <div className="fyw-space-y-3">
      {/* Radio buttons in a neat grid layout */}
      <div className="fyw-grid fyw-grid-cols-1 md:fyw-grid-cols-2 fyw-gap-4">
        {options.map((option) => (
          <RadioButton
            key={option.value}
            value={option.value}
            label={option.label}
            checked={selectedValue === option.value}
            onChange={handleChange}
          />
        ))}
      </div>
      
      {error && <p className="fyw-text-sm fyw-text-red-500 fyw-mt-2">{error}</p>}
    </div>
  );
};


