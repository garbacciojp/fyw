/**
 * Input Validation
 * Additional validation beyond Zod schemas
 * 
 * Single Responsibility: Additional input validation
 */

/**
 * Check if string contains profanity (basic implementation)
 * In production, use a comprehensive profanity filter library
 */
export const containsProfanity = (input: string): boolean => {
  // Basic profanity check
  // In production, integrate with a proper profanity filter
  const profanityPatterns: string[] = [
    // Add common profanity patterns here
    // This is a placeholder - implement proper filtering
  ];

  const lowerInput = input.toLowerCase();
  return profanityPatterns.some((pattern) => lowerInput.includes(pattern));
};

/**
 * Check if input looks like an injection attempt
 */
export const looksLikeInjection = (input: string): boolean => {
  // Check for common injection patterns
  const injectionPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /data:text\/html/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  return injectionPatterns.some((pattern) => pattern.test(input));
};

/**
 * Validate email format (if needed in future)
 */
export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Check input length is within bounds
 */
export const isWithinLengthBounds = (
  input: string,
  min: number = 0,
  max: number = 1000
): boolean => {
  return input.length >= min && input.length <= max;
};

/**
 * Comprehensive input validation
 */
export const validateInput = (
  input: string,
  options: {
    minLength?: number;
    maxLength?: number;
    allowProfanity?: boolean;
    checkInjection?: boolean;
  } = {}
): { valid: boolean; error?: string } => {
  const {
    minLength = 0,
    maxLength = 1000,
    allowProfanity = false,
    checkInjection = true,
  } = options;

  // Length check
  if (!isWithinLengthBounds(input, minLength, maxLength)) {
    return {
      valid: false,
      error: `Input must be between ${minLength} and ${maxLength} characters`,
    };
  }

  // Injection check
  if (checkInjection && looksLikeInjection(input)) {
    return { valid: false, error: 'Input contains invalid characters' };
  }

  // Profanity check
  if (!allowProfanity && containsProfanity(input)) {
    return { valid: false, error: 'Input contains inappropriate content' };
  }

  return { valid: true };
};

