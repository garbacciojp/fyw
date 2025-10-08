/**
 * Environment Configuration
 * Manages environment variables and runtime config
 * 
 * Single Responsibility: Environment variable management
 */

/**
 * Environment configuration object
 */
export const env = {
  /**
   * OpenAI configuration
   */
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    promptId: import.meta.env.VITE_OPENAI_PROMPT_ID || '',
  },

  /**
   * Debug mode
   */
  debug: import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.DEV,

  /**
   * Check if debug is enabled
   */
  isDebugEnabled(): boolean {
    return this.debug;
  },

  /**
   * Check if production mode
   */
  isProduction(): boolean {
    return import.meta.env.PROD;
  },
} as const;

/**
 * Validate environment configuration
 */
export const validateEnvironment = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!env.openai.apiKey) {
    errors.push('VITE_OPENAI_API_KEY is not configured');
  }

  if (!env.openai.promptId) {
    errors.push('VITE_OPENAI_PROMPT_ID is not configured');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};


