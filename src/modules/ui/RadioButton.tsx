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
  return (
    <label
      className={cn(
        'fyw-flex fyw-items-center fyw-p-4 fyw-rounded-lg',
        'fyw-border-2 fyw-cursor-pointer',
        'fyw-transition-all fyw-duration-200',
        checked
          ? 'fyw-bg-fyw-gray-900 fyw-border-fyw-white'
          : 'fyw-bg-transparent fyw-border-fyw-gray-700 hover:fyw-border-fyw-gray-600',
        disabled && 'fyw-opacity-50 fyw-cursor-not-allowed'
      )}
    >
      {/* Hidden native radio */}
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        disabled={disabled}
        className="fyw-sr-only"
      />

      {/* Custom radio indicator */}
      <div
        className={cn(
          'fyw-flex-shrink-0 fyw-w-5 fyw-h-5 fyw-rounded-full',
          'fyw-border-2 fyw-mr-3',
          'fyw-flex fyw-items-center fyw-justify-center',
          checked ? 'fyw-border-fyw-white' : 'fyw-border-fyw-gray-600'
        )}
      >
        {checked && <div className="fyw-w-2.5 fyw-h-2.5 fyw-rounded-full fyw-bg-fyw-white" />}
      </div>

      {/* Label text */}
      <span
        className={cn(
          'fyw-text-base',
          checked ? 'fyw-text-fyw-white fyw-font-medium' : 'fyw-text-fyw-gray-300'
        )}
      >
        {label}
      </span>
    </label>
  );
};


