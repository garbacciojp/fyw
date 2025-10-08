/**
 * TextInputQuestion Component
 * Simple text input question type
 * 
 * Single Responsibility: Render a basic text input field
 * Props: 4 (under the 7-prop limit)
 */

import { Input } from '@/modules/ui';
import type { QuestionComponentProps } from '../QuestionRegistry';

/**
 * Text input question component
 */
export const TextInputQuestion: React.FC<QuestionComponentProps> = ({
  value,
  onChange,
  onComplete,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="fyw-w-full fyw-max-w-md fyw-mx-auto">
      <Input
        type="text"
        value={(value as string) || ''}
        onChange={handleChange}
        label=""
        placeholder=""
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};


