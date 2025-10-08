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
  return (
    <label
      className={cn(
        'fyw-flex fyw-items-center fyw-p-4 fyw-rounded-lg',
        'fyw-border-2 fyw-cursor-pointer',
        'fyw-transition-all fyw-duration-200',
        checked
          ? 'fyw-bg-fyw-gray-900 fyw-border-fyw-white'
          : 'fyw-bg-transparent fyw-border-fyw-gray-700 hover:fyw-border-fyw-gray-600',
        disabled && 'fyw-opacity-50 fyw-cursor-not-allowed',
        className
      )}
    >
      {/* Hidden native checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="fyw-sr-only"
      />

      {/* Custom checkbox indicator */}
      <div
        className={cn(
          'fyw-flex-shrink-0 fyw-w-5 fyw-h-5 fyw-rounded-md',
          'fyw-border-2 fyw-mr-3',
          'fyw-flex fyw-items-center fyw-justify-center',
          checked ? 'fyw-border-fyw-white fyw-bg-fyw-white' : 'fyw-border-fyw-gray-600'
        )}
      >
        {checked && (
          <svg
            className="fyw-w-3 fyw-h-3 fyw-text-fyw-black"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
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


