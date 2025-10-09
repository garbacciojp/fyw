/**
 * Button Component
 * Reusable button with variants
 * 
 * Single Responsibility: Render styled button
 * Props: 7 (at the limit - consider splitting if more needed)
 */

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/core';
import type { ButtonVariant, ButtonSize } from '@/types';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

/**
 * Button component with multiple variants and sizes
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const baseClasses = cn(
    'fyw-font-medium fyw-rounded-lg',
    'fyw-transition-all fyw-duration-200',
    'fyw-inline-flex fyw-items-center fyw-justify-center fyw-gap-2',
    'focus:fyw-outline-none focus:fyw-ring-2 focus:fyw-ring-fyw-white/20',
    'disabled:fyw-opacity-50 disabled:fyw-cursor-not-allowed',
    fullWidth && 'fyw-w-full'
  );

  const variantClasses = {
    primary: cn(
      'fyw-bg-fyw-white fyw-text-fyw-black',
      'hover:fyw-bg-fyw-gray-100',
      'active:fyw-bg-fyw-gray-200',
      '!fyw-rounded-none'
    ),
    secondary: cn(
      'fyw-bg-transparent fyw-text-fyw-white',
      'fyw-border-[1px] fyw-border-solid fyw-border-fyw-white',
      'hover:fyw-border-fyw-gray-100',
      '!fyw-rounded-none'
    ),
    ghost: cn('fyw-bg-transparent fyw-text-fyw-gray-400', 'hover:fyw-text-fyw-white'),
  };

  const sizeClasses = {
    sm: 'fyw-px-4 fyw-py-2 fyw-text-sm',
    md: 'fyw-px-6 fyw-py-3 fyw-text-base',
    lg: 'fyw-px-12 fyw-py-4 fyw-text-base',
  };

  // Check if children is "Continue →" and split it
  const renderButtonContent = () => {
    if (typeof children === 'string' && children === 'Continue →') {
      return (
        <div className="fyw-flex fyw-items-center fyw-justify-center fyw-gap-2">
          <div>Continue</div>
          <div>→</div>
        </div>
      );
    }
    
    return children;
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {renderButtonContent()}
    </button>
  );
};


