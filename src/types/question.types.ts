/**
 * Question Type Definitions
 * Defines all question-related types and interfaces
 */

/**
 * Available question types in the widget
 */
export type QuestionType = 
  | 'name-with-nicknames'
  | 'radio'
  | 'text-with-options'
  | 'multi-select-with-custom'
  | 'text-input';

/**
 * Question flow types
 */
export type FlowType = 'mine' | 'theirs';

/**
 * Question option for radio/select inputs
 */
export interface QuestionOption {
  value: string;
  label: string;
}

/**
 * Form data keys - maps to UserFormData interface
 */
export type FormDataKey = keyof UserFormData;

/**
 * Question configuration interface
 * Defines structure for each question in the flow
 */
export interface QuestionConfig {
  id: string;
  flowType: 'both' | 'mine' | 'theirs';
  type: QuestionType;
  formDataKey: FormDataKey;
  required: boolean;
  
  // Dynamic properties based on flow
  getQuestionNumber: (flow: FlowType) => number;
  getTotalQuestions: (flow: FlowType) => number;
  getTitle: (flow: FlowType) => string;
  getSubtitle?: (flow: FlowType) => string;
  
  // Optional question-specific config
  options?: QuestionOption[];
  getOptions?: (flow: FlowType) => QuestionOption[];
  maxSelections?: number;
  allowCustom?: boolean;
  placeholder?: string;
  buttonLayout?: 'single-column' | 'two-columns';
}

/**
 * Validation rules for questions
 */
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
}

// Import UserFormData for the FormDataKey type
import type { UserFormData } from './user.types';


