/**
 * OpenAI Service
 * Handles jewellery name suggestions by calling Digital Ocean server API
 * 
 * Single Responsibility: API integration with backend server
 * 
 * ⚠️ SECURITY: API key stays on server, widget only calls our backend
 */

import type { UserDataPayload, JewelryNameSuggestion, WordSuggestion, OpenAIResponse, FlowType } from '@/types';
import { API_CONFIG, QUESTIONS } from '@/config';

/**
 * OpenAI Service Class
 * Calls Digital Ocean server which proxies to OpenAI
 */
class OpenAIService {
  private readonly apiBaseUrl: string;

  constructor() {
    // Get API base URL from environment or use default
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

    console.log('🔧 OpenAI Service configured with API URL:', this.apiBaseUrl);
  }

  /**
   * Filter payload to only include fields relevant to the current flow
   * This prevents sending mixed data when users switch between flows
   */
  private filterPayloadByFlow(userData: UserDataPayload): Partial<UserDataPayload> {
    const flowType = userData.wordType as FlowType;
    const filtered: Partial<UserDataPayload> = {};

    // Get all form data keys from the questions config
    QUESTIONS.forEach((question) => {
      const shouldInclude = question.flowType === 'both' || question.flowType === flowType;
      
      if (shouldInclude) {
        const key = question.formDataKey;
        if (userData[key] !== undefined) {
          // Type assertion is safe here as we're copying from validated UserDataPayload
          (filtered as any)[key] = userData[key];
        }
      }
    });

    // Always include wordType as it's required
    filtered.wordType = userData.wordType;

    console.log(`📋 Filtered payload for '${flowType}' flow:`, Object.keys(filtered));

    return filtered;
  }

  /**
   * Generate jewellery name suggestions
   * Calls our backend server which proxies to OpenAI (keeps API key secure)
   */
  async generateSuggestions(userData: UserDataPayload): Promise<JewelryNameSuggestion> {
    // Filter data to only include fields relevant to current flow
    const sanitizedData = this.filterPayloadByFlow(userData);

    console.log('🚀 Generating suggestions for:', { wordType: sanitizedData.wordType });

    // Make API request to our server (not directly to OpenAI)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/suggest-words`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData: sanitizedData }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`API error (${response.status}): ${errorText}`);
      }

      const apiResponse: OpenAIResponse = await response.json();
      return this.processResponse(apiResponse);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
  }

  /**
   * Process OpenAI API response
   * Handles multiple response formats from different model versions
   */
  private processResponse(response: OpenAIResponse): JewelryNameSuggestion {
    let responseText = '';

    // Format 1: Stored Prompts API (newer format)
    if (response.output && Array.isArray(response.output) && response.output[0]) {
      const outputMessage = response.output[0];
      if (outputMessage.content && Array.isArray(outputMessage.content) && outputMessage.content[0]) {
        responseText = outputMessage.content[0].text || '';
      }
    }

    // Format 2: Legacy stored prompts format
    if (!responseText && response.output_text) {
      responseText = response.output_text;
    }

    // Format 3: Chat completions format (if using different model)
    if (!responseText && (response as any).choices && Array.isArray((response as any).choices)) {
      const choice = (response as any).choices[0];
      if (choice?.message?.content) {
        responseText = choice.message.content;
      } else if (choice?.text) {
        responseText = choice.text;
      }
    }

    // Format 4: Direct text response
    if (!responseText && (response as any).text) {
      responseText = (response as any).text;
    }

    if (!responseText) {
      console.error('❌ Could not extract response. Available fields:', Object.keys(response));
      throw new Error('Could not extract response from API - unknown format');
    }

    console.log('✅ Received response from OpenAI');

    // Parse JSON response
    const words = this.parseJSONResponse(responseText);

    return {
      words,
      rawResponse: responseText,
      metadata: {
        responseId: response.id,
        model: response.model,
        timestamp: Date.now(),
      },
    };
  }

  /**
   * Parse JSON response from OpenAI
   * Expected format: { "words": [ { word, pronunciation, origin, type, category, description }, ... ] }
   */
  private parseJSONResponse(responseText: string): WordSuggestion[] {
    try {
      // Clean up response text
      let cleanedText = responseText.trim();

      // Remove markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Remove control characters (0x00-0x1F except tab, newline, carriage return)
      // This fixes "Bad control character in string literal" errors
      cleanedText = cleanedText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

      // Try to find JSON object or array
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }

      const parsedData = JSON.parse(cleanedText);

      // Handle both { words: [...] } and direct array [...] formats
      const wordsArray = parsedData.words || (Array.isArray(parsedData) ? parsedData : null);

      if (!wordsArray || !Array.isArray(wordsArray)) {
        throw new Error('Response does not contain expected "words" array');
      }

      // Map and validate each word suggestion
      return wordsArray.map((word: unknown, index: number) => {
        const suggestion = word as WordSuggestion;
        
        // Validate required fields
        if (!suggestion.word || !suggestion.pronunciation || !suggestion.origin || 
            !suggestion.type || !suggestion.category || !suggestion.description) {
          console.warn(`⚠️ Incomplete word suggestion at index ${index}:`, suggestion);
        }

        return {
          word: suggestion.word || 'Unknown',
          pronunciation: suggestion.pronunciation || 'unknown',
          origin: suggestion.origin || 'Unknown',
          type: suggestion.type || 'noun',
          category: suggestion.category || 'Uncategorized',
          description: suggestion.description || 'No description available',
        };
      });
    } catch (error) {
      console.error('❌ Failed to parse JSON response:', error);
      console.error('Raw response text:', responseText);
      throw new Error('Failed to parse suggestions from API');
    }
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();

