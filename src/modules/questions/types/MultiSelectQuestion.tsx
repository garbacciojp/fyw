/**
 * MultiSelectQuestion Component
 * Multiple-choice checkbox group with optional custom input
 * 
 * Single Responsibility: Render multi-select checkboxes
 * Props: 7 (at the limit)
 */

import { useState } from 'react';
import { Checkbox, Input, Button } from '@/modules/ui';
import { cn } from '@/core';
import type { QuestionOption } from '@/types';
import type { QuestionComponentProps } from '../QuestionRegistry';

interface MultiSelectQuestionProps extends QuestionComponentProps {
  options?: QuestionOption[];
  maxSelections?: number;
  allowCustom?: boolean;
}

/**
 * Multi-select question component with optional custom input
 */
export const MultiSelectQuestion: React.FC<MultiSelectQuestionProps> = ({
  value,
  onChange,
  options = [],
  maxSelections = 5,
  allowCustom = false,
  error,
}) => {
  const selectedValues = (value as string[]) || [];
  const [customItem, setCustomItem] = useState('');

  // Check if custom input should be shown
  const showCustomInput = allowCustom && 
    (selectedValues.includes('Other') || 
     selectedValues.some(v => !options.find(o => o.value === v)));

  // Toggle selection
  const toggleItem = (itemValue: string) => {
    if (selectedValues.includes(itemValue)) {
      // Deselect
      onChange(selectedValues.filter((v) => v !== itemValue));
    } else if (selectedValues.length < maxSelections) {
      // Select (if under limit)
      onChange([...selectedValues, itemValue]);
    }
  };

  // Add custom item
  const addCustomItem = () => {
    const trimmed = customItem.trim();
    if (trimmed && selectedValues.length < maxSelections) {
      onChange([...selectedValues, trimmed]);
      setCustomItem('');
    }
  };

  return (
    <div className="fyw-space-y-4">
      {/* Checkbox grid */}
      <div className="fyw-grid fyw-grid-cols-1 md:fyw-grid-cols-2 fyw-gap-3">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const isDisabled = !isSelected && selectedValues.length >= maxSelections;

          return (
            <Checkbox
              key={option.value}
              label={option.label}
              checked={isSelected}
              onChange={() => !isDisabled && toggleItem(option.value)}
              disabled={isDisabled}
              className={cn(isDisabled && 'fyw-cursor-not-allowed')}
            />
          );
        })}
      </div>

      {/* Custom input */}
      {showCustomInput && (
        <div className="fyw-flex fyw-gap-2 fyw-animate-fadeIn">
          <Input
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
            placeholder="Type your own..."
            onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
            disabled={selectedValues.length >= maxSelections}
          />
          <Button
            onClick={addCustomItem}
            disabled={!customItem.trim() || selectedValues.length >= maxSelections}
          >
            Add
          </Button>
        </div>
      )}

      {/* Selection count */}
      <p className="fyw-text-sm fyw-text-fyw-gray-500">
        {selectedValues.length} of {maxSelections} selected
      </p>
      
      {error && <p className="fyw-text-sm fyw-text-red-500">{error}</p>}
    </div>
  );
};

