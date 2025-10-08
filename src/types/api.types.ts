/**
 * API Type Definitions
 * Defines structures for API requests and responses
 */

import type { UserDataPayload } from './user.types';

/**
 * OpenAI API response structure
 */
export interface OpenAIResponse {
  id: string;
  model: string;
  status: string;
  output?: Array<{
    content: Array<{
      text: string;
    }>;
  }>;
  output_text?: string; // Legacy field
}

/**
 * Word suggestion structure
 */
export interface WordSuggestion {
  word: string;
  pronunciation: string;
  origin: string;
  type: string;
  category: string;
  description: string;
}

/**
 * Complete jewelry name suggestion response
 */
export interface JewelryNameSuggestion {
  words: WordSuggestion[];
  rawResponse: string;
  metadata: {
    responseId: string;
    model: string;
    timestamp: number;
  };
}

/**
 * API service interface
 */
export interface APIService {
  generateSuggestions: (userData: UserDataPayload) => Promise<JewelryNameSuggestion>;
  testConnection: () => Promise<{ success: boolean; error?: string }>;
}

/**
 * API error structure
 */
export interface APIError {
  message: string;
  code?: string;
  details?: unknown;
}


