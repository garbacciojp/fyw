/**
 * Application Constants
 * Pure data - no logic, no imports except types
 */

/**
 * Question type constants
 */
export const QUESTION_TYPES = {
  NAME_WITH_NICKNAMES: 'name-with-nicknames',
  RADIO: 'radio',
  TEXT_WITH_OPTIONS: 'text-with-options',
  MULTI_SELECT_WITH_CUSTOM: 'multi-select-with-custom',
  TEXT_INPUT: 'text-input',
} as const;

/**
 * Flow type constants
 */
export const FLOW_TYPES = {
  MINE: 'mine',
  THEIRS: 'theirs',
} as const;

/**
 * App screen constants
 */
export const APP_SCREENS = {
  WELCOME: 'welcome',
  QUESTIONS: 'questions',
  LOADING: 'loading',
  RESULTS: 'results',
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  FORM_DATA: 'fyw_form_data',
  SESSION_KEY: 'fyw_session_key',
  TIMESTAMP: 'fyw_timestamp',
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  TIMEOUT_MS: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RATE_LIMIT_REQUESTS: 5,
  RATE_LIMIT_WINDOW_MS: 60000, // 1 minute
} as const;

/**
 * UI configuration
 */
export const UI_CONFIG = {
  MAX_NICKNAME_COUNT: 3,
  MAX_MULTI_SELECT: 5,
  DEBOUNCE_MS: 500,
  ANIMATION_DURATION_MS: 300,
  MOBILE_IMAGE_PREVIEW_HEIGHT: '360px', // Height of image preview window on mobile devices
} as const;

/**
 * File size limits
 */
export const SIZE_LIMITS = {
  MAX_FILE_LINES: 300,
  MAX_COMPONENT_PROPS: 7,
} as const;


