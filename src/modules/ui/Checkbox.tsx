/**
 * Checkbox Component
 * Custom styled checkbox
 * 
 * Single Responsibility: Render checkbox
 * Props: 5 (under the 7-prop limit)
 */

import { cn } from '@/core';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Styled checkbox component
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  className,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label
      onClick={handleClick}
      className={cn(
        // Layout & Sizing - matching Input and RadioButton components
        'fyw-w-full fyw-px-4 fyw-py-4',
        // Background & Border - matching Input component with square corners
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
          ? 'hover:fyw-bg-fyw-gray-100'
          : 'hover:fyw-bg-[#1f1f1f]',
        // Disabled state
        disabled && 'fyw-opacity-50 fyw-cursor-not-allowed',
        className
      )}
    >
      {/* Hidden native checkbox - no interaction */}
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {}} // Controlled by label click
        disabled={disabled}
        tabIndex={-1}
        className="fyw-sr-only fyw-pointer-events-none"
      />

      {/* Label text - centered like Input and RadioButton */}
      <span className="fyw-text-base fyw-text-center">
        {label}
      </span>
    </label>
  );
};


