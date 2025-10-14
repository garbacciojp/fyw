/**
 * RadioButton Component
 * Custom styled radio button
 * 
 * Single Responsibility: Render radio button
 * Props: 5 (under the 7-prop limit)
 */

import { cn } from '@/core';

interface RadioButtonProps {
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Styled radio button component
 */
export const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      onChange(value);
    }
  };

  return (
    <label
      onClick={handleClick}
      className={cn(
        // Layout & Sizing - matching Input component
        'fyw-w-full fyw-px-4 fyw-py-4',
        // Background & Border - conditional styling based on checked state
        'fyw-border fyw-border-solid fyw-rounded-none',
        // Conditional styling: white background + black text when checked, dark background + white text when unchecked
        checked
          ? 'fyw-bg-fyw-white fyw-text-fyw-black fyw-font-semibold fyw-border-fyw-white'
          : 'fyw-bg-[#1a1a1a] fyw-text-fyw-white fyw-border-fyw-white',
        // Typography - centered text
        'fyw-text-base fyw-text-center',
        // Interaction states
        'fyw-cursor-pointer fyw-transition-all fyw-duration-200',
        // Focus/hover state - conditional based on checked state
        checked
          ? 'hover:fyw-bg-fyw-gray-100 focus-within:fyw-bg-fyw-gray-100'
          : 'hover:fyw-bg-[#1f1f1f] focus-within:fyw-bg-[#1f1f1f]',
        // Disabled state
        disabled && 'fyw-opacity-50 fyw-cursor-not-allowed'
      )}
      style={{
        textTransform: 'none',
      }}
    >
      {/* Hidden native radio - no interaction */}
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={() => {}} // Controlled by label click
        disabled={disabled}
        tabIndex={-1}
        className="fyw-sr-only fyw-pointer-events-none"
      />

      {/* Label text - centered like Input */}
      <span className="fyw-text-base fyw-text-center">
        {label}
      </span>
    </label>
  );
};


