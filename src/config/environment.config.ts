/**
 * Environment Configuration
 * Manages environment variables and runtime config
 * 
 * Single Responsibility: Environment variable management
 * 
 * ⚠️ SECURITY: OpenAI credentials are NOT stored here - they're on the server only!
 * The widget only needs to know the API base URL to call our secure backend.
 */

/**
 * Environment configuration object
 */
export const env = {
  /**
   * API Base URL - our backend server that proxies to OpenAI
   */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',

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

  if (!env.apiBaseUrl) {
    errors.push('VITE_API_BASE_URL is not configured');
  }

  // Validate API base URL format
  if (env.apiBaseUrl && !env.apiBaseUrl.startsWith('http')) {
    errors.push('VITE_API_BASE_URL must start with http:// or https://');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};


