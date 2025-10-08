/**
 * User Data Type Definitions
 * Defines all user-related data structures
 */

import type { FlowType } from './question.types';

/**
 * Name data structure
 */
export interface NameData {
  name: string;
  nicknames: string[];
}

/**
 * Complete user form data structure
 * This represents all data collected from the question flow
 */
export interface UserFormData {
  wordType: FlowType;
  nameData: NameData;
  ageRange: string;
  relationship?: string;        // Only for 'theirs' flow
  occasion?: string;            // Only for 'theirs' flow
  interests: string[];
  faithHeritage?: string;
  wordMeaning: string[];
  languages: string[];
  wordPreference: string;
  emotionalImpact: string[];
}

/**
 * Partial user form data (for progressive form filling)
 */
export type PartialUserFormData = Partial<UserFormData>;

/**
 * User data payload for API calls
 * Includes legacy fields for compatibility
 */
export interface UserDataPayload extends UserFormData {
  language?: string; // Legacy compatibility
}


