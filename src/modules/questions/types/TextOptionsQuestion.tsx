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
  
  // Determine if custom text is shown
  const showCustomInput = selectedValue === 'other' || 
    (selectedValue && !options.find(o => o.value === selectedValue));

  // Initialize custom text if value doesn't match options
  useEffect(() => {
    if (selectedValue && !options.find(o => o.value === selectedValue)) {
      setCustomText(selectedValue);
    }
  }, [selectedValue, options]);

  const handleOptionChange = (newValue: string) => {
    if (newValue === 'other') {
      onChange('');
      setCustomText('');
    } else {
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
    <div className="fyw-space-y-3">
      {/* Radio options */}
      {options.map((option) => {
        const isChecked = option.value === 'other' 
          ? showCustomInput 
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

      {/* Custom text input */}
      {showCustomInput && (
        <div className="fyw-mt-4 fyw-animate-fadeIn">
          <Input
            value={customText}
            onChange={handleCustomTextChange}
            placeholder={placeholder}
            autoFocus
          />
        </div>
      )}
      
      {error && <p className="fyw-text-sm fyw-text-red-500 fyw-mt-2">{error}</p>}
    </div>
  );
};

