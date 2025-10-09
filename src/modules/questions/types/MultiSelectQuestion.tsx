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

  // Get custom values (values not in options list)
  const customValues = selectedValues.filter(v => !options.find(o => o.value === v));
  
  // Check if custom input should be shown
  const showCustomInput = allowCustom && 
    (selectedValues.includes('Other') || customValues.length > 0);

  // Calculate actual selection count (excluding "Other" trigger)
  // "Other" is just a UI trigger, custom typed values count toward the limit
  const getActualCount = () => {
    return selectedValues.filter(v => v !== 'Other').length;
  };

  // Toggle selection
  const toggleItem = (itemValue: string) => {
    if (selectedValues.includes(itemValue)) {
      // Deselect - if deselecting "Other", also remove any custom values
      if (itemValue === 'Other') {
        onChange(selectedValues.filter((v) => v !== 'Other' && options.find(o => o.value === v)));
      } else {
        onChange(selectedValues.filter((v) => v !== itemValue));
      }
    } else {
      // For "Other", just add it as a trigger (doesn't count toward limit)
      if (itemValue === 'Other') {
        onChange([...selectedValues, itemValue]);
      } else if (getActualCount() < maxSelections) {
        // For regular items, check actual count
        onChange([...selectedValues, itemValue]);
      }
    }
  };

  // Add custom item
  const addCustomItem = () => {
    const trimmed = customItem.trim();
    if (trimmed && getActualCount() < maxSelections) {
      onChange([...selectedValues, trimmed]);
      setCustomItem('');
    }
  };

  // Remove custom item
  const removeCustomItem = (itemValue: string) => {
    onChange(selectedValues.filter((v) => v !== itemValue));
  };

  const actualCount = getActualCount();
  
  // Get only custom typed values (exclude "Other" and predefined options)
  const displayCustomValues = customValues.filter(v => v !== 'Other');

  return (
    <>
      {/* Checkbox grid */}
      <div className="fyw-grid fyw-grid-cols-1 md:fyw-grid-cols-2 fyw-gap-2 fyw-mb-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const isDisabled = option.value === 'Other' 
            ? false 
            : !isSelected && actualCount >= maxSelections;

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

      {/* Custom input - completely flat */}
      {showCustomInput && (
        <div className="fyw-flex fyw-gap-2 fyw-mb-2 fyw-items-stretch">
          <div className="fyw-flex-1 fyw-min-w-0">
            <Input
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              placeholder="Type your own..."
              onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
              disabled={actualCount >= maxSelections}
            />
          </div>
          <Button
            onClick={addCustomItem}
            disabled={!customItem.trim() || actualCount >= maxSelections}
            className="fyw-flex-shrink-0 fyw-px-6"
          >
            Add
          </Button>
        </div>
      )}

      {/* Display custom values inline */}
      {displayCustomValues.length > 0 && (
        <div className="fyw-flex fyw-flex-wrap fyw-gap-2 fyw-mb-2">
          {displayCustomValues.map((customValue) => (
            <div
              key={customValue}
              className="fyw-inline-flex fyw-items-center fyw-gap-2 fyw-px-3 fyw-py-1 fyw-bg-[#1a1a1a] fyw-border fyw-border-solid fyw-border-fyw-white fyw-text-fyw-white fyw-text-sm"
            >
              <span>{customValue}</span>
              <button
                onClick={() => removeCustomItem(customValue)}
                className="fyw-text-fyw-gray-400 hover:fyw-text-fyw-white fyw-text-lg fyw-leading-none"
                aria-label={`Remove ${customValue}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Selection count */}
      <p className="fyw-text-sm fyw-text-fyw-gray-500">
        {actualCount} of {maxSelections} selected
      </p>
      
      {error && <p className="fyw-text-sm fyw-text-red-500">{error}</p>}
    </>
  );
};

