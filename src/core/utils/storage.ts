/**
 * Storage Utility
 * Encrypted localStorage operations
 * 
 * Single Responsibility: Data persistence
 */

import CryptoJS from 'crypto-js';
import { STORAGE_KEYS } from '@/config';
import type { PartialUserFormData } from '@/types';

/**
 * Storage class for encrypted data persistence
 */
class Storage {
  /**
   * Get or create session encryption key
   */
  private getSessionKey(): string {
    let key = sessionStorage.getItem(STORAGE_KEYS.SESSION_KEY);
    if (!key) {
      key = CryptoJS.lib.WordArray.random(256 / 8).toString();
      sessionStorage.setItem(STORAGE_KEYS.SESSION_KEY, key);
    }
    return key;
  }

  /**
   * Save form data with encryption
   */
  saveFormData(data: PartialUserFormData): void {
    try {
      const payload = {
        data,
        timestamp: Date.now(),
        version: '2.0',
      };

      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(payload),
        this.getSessionKey()
      ).toString();

      localStorage.setItem(STORAGE_KEYS.FORM_DATA, encrypted);
    } catch (error) {
      console.error('Failed to save form data:', error);
    }
  }

  /**
   * Load form data with decryption
   */
  loadFormData(): PartialUserFormData | null {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      if (!encrypted) return null;

      const decrypted = CryptoJS.AES.decrypt(encrypted, this.getSessionKey()).toString(
        CryptoJS.enc.Utf8
      );

      if (!decrypted) return null;

      const payload = JSON.parse(decrypted);

      // Check if data is stale (older than 24 hours)
      if (Date.now() - payload.timestamp > 24 * 60 * 60 * 1000) {
        this.clearFormData();
        return null;
      }

      return payload.data;
    } catch (error) {
      console.error('Failed to load form data:', error);
      this.clearFormData();
      return null;
    }
  }

  /**
   * Clear all stored form data
   */
  clearFormData(): void {
    localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
    sessionStorage.removeItem(STORAGE_KEYS.SESSION_KEY);
  }
}

// Export singleton instance
export const storage = new Storage();


