/**
 * useValidation Hook
 * Handles form field validation
 * 
 * Single Responsibility: Input validation logic
 */

import { useState, useCallback } from 'react';
import { z } from 'zod';

/**
 * Validation result
 */
interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Hook return type
 */
interface UseValidationReturn {
  errors: Record<string, string>;
  validateField: (fieldName: string, value: unknown, schema: z.ZodSchema) => ValidationResult;
  clearError: (fieldName: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
}

/**
 * Custom hook for form validation
 */
export const useValidation = (): UseValidationReturn => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate a single field
  const validateField = useCallback(
    (fieldName: string, value: unknown, schema: z.ZodSchema): ValidationResult => {
      try {
        schema.parse(value);
        // Clear error if validation passes
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return { isValid: true };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.errors[0]?.message || 'Validation error';
          setErrors((prev) => ({
            ...prev,
            [fieldName]: errorMessage,
          }));
          return { isValid: false, error: errorMessage };
        }
        return { isValid: false, error: 'Unknown validation error' };
      }
    },
    []
  );

  // Clear error for a specific field
  const clearError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Check if there are any errors
  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    validateField,
    clearError,
    clearAllErrors,
    hasErrors,
  };
};


