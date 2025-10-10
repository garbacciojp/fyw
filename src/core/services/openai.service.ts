/**
 * OpenAI Service
 * Handles jewellery name suggestions using OpenAI API
 * 
 * Single Responsibility: OpenAI API integration
 * 
 * ⚠️ CRITICAL: This uses the same proven logic from v1
 */

import type { UserDataPayload, JewelryNameSuggestion, WordSuggestion, OpenAIResponse } from '@/types';
import { API_CONFIG } from '@/config';

/**
 * OpenAI Service Class
 */
class OpenAIService {
  private readonly apiKey: string;
  private readonly promptId: string;
  private readonly baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.promptId = import.meta.env.VITE_OPENAI_PROMPT_ID || '';

    if (!this.apiKey) {
      console.warn('⚠️ OpenAI API key not configured');
    }
  }

  /**
   * Generate jewellery name suggestions
   */
  async generateSuggestions(userData: UserDataPayload): Promise<JewelryNameSuggestion> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // User data is already validated by Zod schemas and sanitized by form inputs
    const sanitizedData = userData;

    console.log('🚀 Generating suggestions for:', { wordType: sanitizedData.wordType });

    // Prepare API payload - send raw JSON instead of natural language
    const payload = {
      prompt: {
        id: this.promptId,
        version: '1',
      },
      input: [{ 
        role: 'user', 
        content: JSON.stringify(sanitizedData) 
      }],
    };

    // Make API request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

    try {
      const response = await fetch(`${this.baseUrl}/responses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
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
   */
  private processResponse(response: OpenAIResponse): JewelryNameSuggestion {
    let responseText = '';

    // Extract response text from API response structure
    if (response.output && Array.isArray(response.output) && response.output[0]) {
      const outputMessage = response.output[0];
      if (outputMessage.content && Array.isArray(outputMessage.content) && outputMessage.content[0]) {
        responseText = outputMessage.content[0].text || '';
      }
    }

    // Fallback to legacy field
    if (!responseText && response.output_text) {
      responseText = response.output_text;
    }

    if (!responseText) {
      throw new Error('Could not extract response from API');
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

