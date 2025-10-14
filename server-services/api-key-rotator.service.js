/**
 * API Key Rotator Service
 * Handles intelligent rotation and retry logic for OpenAI API calls
 * 
 * HOW: Implements retry logic with automatic failover to backup keys
 * Single Responsibility: API key rotation and request retry management
 * 
 * @see server-config/api-keys.config.js for configuration
 */

import { getAPIKeyConfigs, getPromptId, RETRY_CONFIG } from '../server-config/api-keys.config.js';

/**
 * API Key Rotator Service Class
 * Manages multiple API keys and automatically retries with fallback keys on failure
 */
export class APIKeyRotatorService {
  /**
   * @private
   * @type {Array<{key: string, label: string}>}
   */
  #apiKeys;
  
  /**
   * @private
   * @type {string}
   */
  #promptId;
  
  /**
   * @private
   * @type {number}
   */
  #currentKeyIndex;
  
  /**
   * @private
   * @type {Map<string, {failures: number, lastFailure: number}>}
   */
  #keyHealthTracker;
  
  constructor() {
    this.#apiKeys = getAPIKeyConfigs();
    this.#promptId = getPromptId();
    this.#currentKeyIndex = 0;
    this.#keyHealthTracker = new Map();
    
    if (this.#apiKeys.length === 0) {
      throw new Error('No API keys configured. Cannot initialize API Key Rotator.');
    }
    
    if (!this.#promptId) {
      throw new Error('No prompt ID configured. Cannot initialize API Key Rotator.');
    }
    
    console.log(`🔑 API Key Rotator initialized with ${this.#apiKeys.length} key(s)`);
  }
  
  /**
   * Get the current API key configuration
   * @returns {{key: string, label: string}}
   */
  getCurrentKey() {
    return this.#apiKeys[this.#currentKeyIndex];
  }
  
  /**
   * Get the prompt ID (same for all keys)
   * @returns {string}
   */
  getPromptId() {
    return this.#promptId;
  }
  
  /**
   * Rotate to the next available API key
   * @returns {{key: string, label: string} | null}
   */
  rotateToNextKey() {
    if (this.#apiKeys.length <= 1) {
      console.warn('⚠️ No additional keys available for rotation');
      return null;
    }
    
    const previousIndex = this.#currentKeyIndex;
    this.#currentKeyIndex = (this.#currentKeyIndex + 1) % this.#apiKeys.length;
    
    const previousKey = this.#apiKeys[previousIndex];
    const nextKey = this.#apiKeys[this.#currentKeyIndex];
    
    console.log(`🔄 Rotating from ${previousKey.label} to ${nextKey.label} key`);
    
    return nextKey;
  }
  
  /**
   * Record a failure for the current key
   * @param {string} keyLabel - Label of the key that failed
   * @param {Error} error - The error that occurred
   */
  recordFailure(keyLabel, error) {
    if (!this.#keyHealthTracker.has(keyLabel)) {
      this.#keyHealthTracker.set(keyLabel, { failures: 0, lastFailure: 0 });
    }
    
    const health = this.#keyHealthTracker.get(keyLabel);
    health.failures += 1;
    health.lastFailure = Date.now();
    
    console.warn(`⚠️ Key ${keyLabel} failure recorded. Total failures: ${health.failures}`);
  }
  
  /**
   * Record a success for the current key (resets failure count)
   * @param {string} keyLabel - Label of the key that succeeded
   */
  recordSuccess(keyLabel) {
    if (this.#keyHealthTracker.has(keyLabel)) {
      this.#keyHealthTracker.delete(keyLabel);
    }
  }
  
  /**
   * Check if an error is retryable
   * @param {Error|Object} error - The error to check
   * @param {number} statusCode - HTTP status code (if available)
   * @returns {boolean}
   */
  isRetryableError(error, statusCode = null) {
    // Check HTTP status codes
    if (statusCode && RETRY_CONFIG.RETRYABLE_ERROR_CODES.includes(statusCode)) {
      return true;
    }
    
    // Check error names (timeout, connection errors)
    if (error?.name && RETRY_CONFIG.RETRYABLE_ERROR_NAMES.includes(error.name)) {
      return true;
    }
    
    // Check error code property
    if (error?.code && RETRY_CONFIG.RETRYABLE_ERROR_NAMES.includes(error.code)) {
      return true;
    }
    
    // Check if it's a timeout error
    if (error?.message && error.message.toLowerCase().includes('timeout')) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Execute an API call with automatic retry and key rotation
   * @param {Function} apiCallFn - Async function that makes the API call
   *                                Receives (apiKey) as parameter
   * @returns {Promise<Object>} The successful API response
   * @throws {Error} If all retry attempts fail
   */
  async executeWithRetry(apiCallFn) {
    const attemptedKeys = new Set();
    let lastError = null;
    let attemptCount = 0;
    
    const maxAttempts = Math.min(
      RETRY_CONFIG.MAX_TOTAL_ATTEMPTS,
      this.#apiKeys.length
    );
    
    console.log(`🚀 Starting API request with up to ${maxAttempts} attempt(s)`);
    
    while (attemptCount < maxAttempts) {
      attemptCount++;
      const currentKey = this.getCurrentKey();
      
      // Skip if we already tried this key
      if (attemptedKeys.has(currentKey.label)) {
        console.log(`⏭️ Skipping ${currentKey.label} key (already attempted)`);
        this.rotateToNextKey();
        continue;
      }
      
      attemptedKeys.add(currentKey.label);
      
      console.log(`🔑 Attempt ${attemptCount}/${maxAttempts} using ${currentKey.label} key`);
      
      try {
        // Execute the API call with the current key
        const result = await apiCallFn(currentKey.key);
        
        // Success! Record it and return
        this.recordSuccess(currentKey.label);
        console.log(`✅ API request succeeded with ${currentKey.label} key`);
        
        return result;
        
      } catch (error) {
        lastError = error;
        const statusCode = error?.response?.status || error?.status;
        
        console.error(`❌ API request failed with ${currentKey.label} key:`, {
          error: error.message,
          statusCode,
          attempt: attemptCount,
        });
        
        // Record the failure
        this.recordFailure(currentKey.label, error);
        
        // Check if error is retryable
        const isRetryable = this.isRetryableError(error, statusCode);
        
        if (!isRetryable) {
          console.error(`🛑 Error is not retryable. Stopping retry attempts.`);
          throw error;
        }
        
        // If we have more attempts, rotate to next key
        if (attemptCount < maxAttempts) {
          const nextKey = this.rotateToNextKey();
          
          if (nextKey) {
            console.log(`⏳ Waiting ${RETRY_CONFIG.RETRY_DELAY_MS}ms before retry...`);
            await this.#sleep(RETRY_CONFIG.RETRY_DELAY_MS);
          } else {
            // No more keys available
            break;
          }
        }
      }
    }
    
    // All attempts failed
    console.error(`💥 All ${attemptCount} API request attempts failed`);
    
    throw new Error(
      `API request failed after ${attemptCount} attempt(s) with ${attemptedKeys.size} key(s). ` +
      `Last error: ${lastError?.message || 'Unknown error'}`
    );
  }
  
  /**
   * Get health status of all API keys
   * @returns {Array<{label: string, failures: number, lastFailure: number | null}>}
   */
  getHealthStatus() {
    return this.#apiKeys.map(key => ({
      label: key.label,
      failures: this.#keyHealthTracker.get(key.label)?.failures || 0,
      lastFailure: this.#keyHealthTracker.get(key.label)?.lastFailure || null,
    }));
  }
  
  /**
   * Reset health tracker (useful for testing or manual reset)
   */
  resetHealthTracker() {
    this.#keyHealthTracker.clear();
    console.log('🔄 API key health tracker reset');
  }
  
  /**
   * Sleep utility for retry delays
   * @private
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  #sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const apiKeyRotator = new APIKeyRotatorService();

