/**
 * TextOptionsQuestion Component
 * Radio options with custom text input for "Other"
 * 
 * Single Responsibility: Render radio options + custom text
 * Props: 6 (under the 7-prop limit)
 */

import { useState, useEffect } from 'react';
import { RadioButton, Input } from '@/modules/ui';
import type { QuestionOption } from '@/types';
import type { QuestionComponentProps } from '../QuestionRegistry';

interface TextOptionsQuestionProps extends QuestionComponentProps {
  options?: QuestionOption[];
  placeholder?: string;
}

/**
 * Text options question component (radio + custom text)
 */
export const TextOptionsQuestion: React.FC<TextOptionsQuestionProps> = ({
  value,
  onChange,
  onComplete,
  options = [],
  placeholder = 'Please specify...',
  error,
}) => {
  const selectedValue = (value as string) || '';
  const [customText, setCustomText] = useState('');
  const [otherSelected, setOtherSelected] = useState(false);
  
  // Determine if custom text is shown
  const showCustomInput = otherSelected;

  // Initialize custom text if value doesn't match options (only for actual custom values, not empty)
  useEffect(() => {
    if (!selectedValue || typeof selectedValue !== 'string') return;
    
    const trimmedValue = selectedValue.trim();
    if (trimmedValue && trimmedValue !== 'other' && !options.find(o => o.value === selectedValue)) {
      setCustomText(selectedValue);
      setOtherSelected(true);
    }
  }, [selectedValue, options]);

  const handleOptionChange = (newValue: string) => {
    if (newValue === 'other') {
      setOtherSelected(true);
      onChange('');
      setCustomText('');
    } else {
      setOtherSelected(false);
      onChange(newValue);
      setCustomText('');
      // Auto-advance for non-other options
      if (onComplete) {
        setTimeout(onComplete, 300);
      }
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCustomText(text);
    onChange(text);
  };

  return (
    <>
      {/* Radio options in a grid layout */}
      <div className="fyw-grid fyw-grid-cols-1 md:fyw-grid-cols-2 fyw-gap-2 fyw-mb-2">
        {options.map((option) => {
          const isChecked = option.value === 'other' 
            ? otherSelected
            : selectedValue === option.value;
          
          return (
            <RadioButton
              key={option.value}
              value={option.value}
              label={option.label}
              checked={Boolean(isChecked)}
              onChange={handleOptionChange}
            />
          );
        })}
      </div>

      {/* Custom text input */}
      {showCustomInput && (
        <div className="fyw-flex fyw-gap-2 fyw-mb-2 fyw-items-stretch">
          <div className="fyw-flex-1 fyw-min-w-0">
            <Input
              value={customText}
              onChange={handleCustomTextChange}
              placeholder={placeholder}
              autoFocus={false}
              tabIndex={0}
            />
          </div>
        </div>
      )}
      
      {error && <p className="fyw-text-sm fyw-text-red-500 fyw-mt-2">{error}</p>}
    </>
  );
};

