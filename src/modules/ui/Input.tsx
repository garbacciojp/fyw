/**
 * Input Component
 * Text input with label and error handling
 * 
 * Single Responsibility: Render text input field
 * Props: 6 (under the 7-prop limit)
 */

import type { InputHTMLAttributes } from 'react';
import { cn } from '@/core';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Text input component with label and validation
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  required,
  ...props
}) => {
  return (
    <div className="fyw-w-full">
      {/* Label */}
      {label && (
        <label className="fyw-block fyw-text-sm fyw-font-medium fyw-text-fyw-white fyw-mb-8">
          {label}
          {required && <span className="fyw-text-red-500 fyw-ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        className={cn(
          // Layout & Sizing - unique to FYW widget
          'fyw-w-full fyw-px-4 fyw-py-4',
          // Background & Border - unique FYW design with sharp corners and white border
          'fyw-bg-[#1a1a1a] fyw-border fyw-border-solid fyw-border-fyw-white',
          'fyw-rounded-none', // Zero border radius
          // Typography - unique FYW styling (centered text)
          'fyw-text-fyw-white fyw-text-base fyw-text-center',
          'placeholder:fyw-text-fyw-gray-500 placeholder:fyw-text-center',
          // Focus States - unique FYW interaction
          'focus:fyw-outline-none focus:fyw-border-fyw-white',
          'focus:fyw-bg-[#1f1f1f]',
          // Transitions - smooth FYW experience
          'fyw-transition-all fyw-duration-200',
          // Disabled State
          'disabled:fyw-opacity-50 disabled:fyw-cursor-not-allowed',
          // Error State
          error ? 'fyw-border-red-500 focus:fyw-border-red-500' : '',
          className
        )}
        required={required}
        {...props}
      />

      {/* Error message */}
      {error && <p className="fyw-mt-2 fyw-text-sm fyw-text-red-500">{error}</p>}

      {/* Helper text */}
      {helperText && !error && (
        <p className="fyw-mt-2 fyw-text-sm fyw-text-fyw-gray-400">{helperText}</p>
      )}
    </div>
  );
};


