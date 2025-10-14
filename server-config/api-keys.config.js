/**
 * API Keys Configuration
 * Centralized config for OpenAI API key management and retry logic
 * 
 * WHAT: Defines API key rotation strategy and retry parameters
 * Following: Config-driven architecture principle
 */

import dotenv from 'dotenv';

// Load environment variables FIRST (before anything else)
dotenv.config();

/**
 * Retry configuration for API calls
 * @type {Object}
 */
export const RETRY_CONFIG = {
  // Maximum number of retry attempts across all keys
  MAX_TOTAL_ATTEMPTS: 3,
  
  // Timeout for each API request (30 seconds as per OpenAI recommendation)
  REQUEST_TIMEOUT_MS: 30000,
  
  // Delay between retry attempts (in milliseconds)
  RETRY_DELAY_MS: 1000,
  
  // Errors that should trigger a retry with next key
  RETRYABLE_ERROR_CODES: [
    408, // Request Timeout
    429, // Too Many Requests (rate limit)
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ],
  
  // Network errors that should trigger retry
  RETRYABLE_ERROR_NAMES: [
    'AbortError',      // Timeout
    'TimeoutError',    // Timeout
    'ECONNRESET',      // Connection reset
    'ETIMEDOUT',       // Connection timeout
    'ECONNREFUSED',    // Connection refused
  ],
};

/**
 * Get API keys from environment variables
 * Supports multiple keys: OPENAI_API_KEY, OPENAI_API_KEY_2, OPENAI_API_KEY_3
 * All keys use the SAME prompt ID
 * 
 * @returns {Array<{key: string, label: string}>} Array of API key configurations
 */
export function getAPIKeyConfigs() {
  const configs = [];
  
  // Primary key (required)
  const primaryKey = process.env.OPENAI_API_KEY;
  if (primaryKey) {
    configs.push({
      key: primaryKey,
      label: 'Primary',
    });
  }
  
  // Secondary key (optional)
  const secondaryKey = process.env.OPENAI_API_KEY_2;
  if (secondaryKey) {
    configs.push({
      key: secondaryKey,
      label: 'Secondary',
    });
  }
  
  // Tertiary key (optional)
  const tertiaryKey = process.env.OPENAI_API_KEY_3;
  if (tertiaryKey) {
    configs.push({
      key: tertiaryKey,
      label: 'Tertiary',
    });
  }
  
  return configs;
}

/**
 * Get the shared prompt ID
 * @returns {string} The prompt ID used by all keys
 */
export function getPromptId() {
  return process.env.OPENAI_PROMPT_ID;
}

/**
 * Validate API key configuration
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateAPIKeyConfig() {
  const configs = getAPIKeyConfigs();
  const promptId = getPromptId();
  const errors = [];
  
  // Check for at least one API key
  if (configs.length === 0) {
    errors.push('No API keys found. Set OPENAI_API_KEY in environment variables.');
  }
  
  // Check for prompt ID
  if (!promptId) {
    errors.push('OPENAI_PROMPT_ID not found in environment variables.');
  }
  
  // Validate prompt ID format
  if (promptId && !promptId.startsWith('pmpt_')) {
    errors.push('Prompt ID appears to be invalid (should start with "pmpt_")');
  }
  
  // Validate each API key format
  configs.forEach((config) => {
    if (config.key && !config.key.startsWith('sk-')) {
      errors.push(`API key ${config.label} appears to be invalid (should start with "sk-")`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    keyCount: configs.length,
  };
}

