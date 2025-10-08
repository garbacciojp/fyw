/**
 * Input Sanitization
 * Uses DOMPurify to prevent XSS attacks
 * 
 * Single Responsibility: Sanitize user inputs
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize configuration for different input types
 */
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [] as string[], // Strip ALL HTML
  ALLOWED_ATTR: [] as string[],
} as const;

/**
 * Sanitize name input
 * Allows letters, spaces, hyphens, apostrophes
 */
export const sanitizeName = (input: string): string => {
  // Remove HTML
  const cleaned = DOMPurify.sanitize(input, SANITIZE_CONFIG);

  // Allow only letters (including unicode), spaces, hyphens, apostrophes
  const safe = cleaned.replace(/[^\p{L}\p{M}\s\-']/gu, '').trim();

  // Limit length
  return safe.substring(0, 50);
};

/**
 * Sanitize custom text input
 * More permissive than name (allows punctuation)
 */
export const sanitizeCustomText = (input: string, maxLength = 100): string => {
  // Remove HTML
  const cleaned = DOMPurify.sanitize(input, SANITIZE_CONFIG);

  // Allow letters, numbers, spaces, and common punctuation
  const safe = cleaned.replace(/[^\p{L}\p{M}\p{N}\s\-&.,!?']/gu, '').trim();

  // Limit length
  return safe.substring(0, maxLength);
};

/**
 * Validate against predefined list
 * Used for dropdown/radio options
 */
export const validateAgainstList = (input: string, allowedValues: string[]): string | null => {
  return allowedValues.includes(input) ? input : null;
};

/**
 * Sanitize array of strings
 */
export const sanitizeArray = (
  inputs: string[],
  sanitizer: (input: string) => string = sanitizeCustomText
): string[] => {
  return inputs.map(sanitizer).filter((s) => s.length > 0);
};

/**
 * Sanitize all user form data
 */
export const sanitizeFormData = (data: Record<string, unknown>): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeCustomText(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = sanitizeArray(value as string[]);
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeFormData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};


