/**
 * Images Configuration
 * Maps question numbers to their corresponding images
 * 
 * RULE: To add/modify images, edit ONLY this file
 * RULE: Images are data, not code
 */

/**
 * Base URL for assets
 * In production, assets are served from Digital Ocean alongside the widget
 */
const ASSET_BASE_URL = import.meta.env.PROD 
  ? 'https://fyw-lrqe8.ondigitalocean.app/widget/v2'
  : '';

/**
 * Question image mapping
 * Each question number (1-10) maps to a specific image
 * Note: Q1 uses PRYA_GIF.jpg (no "_1" suffix)
 */
export const QUESTION_IMAGES: Record<number, string> = {
  1: `${ASSET_BASE_URL}/images/PRYA_GIF.jpg`,
  2: `${ASSET_BASE_URL}/images/PRYA_GIF_2.jpg`,
  3: `${ASSET_BASE_URL}/images/PRYA_GIF_3.jpg`,
  4: `${ASSET_BASE_URL}/images/PRYA_GIF_4.jpg`,
  5: `${ASSET_BASE_URL}/images/PRYA_GIF_5.jpg`,
  6: `${ASSET_BASE_URL}/images/PRYA_GIF_6.jpg`,
  7: `${ASSET_BASE_URL}/images/PRYA_GIF_7.jpg`,
  8: `${ASSET_BASE_URL}/images/PRYA_GIF_8.jpg`,
  9: `${ASSET_BASE_URL}/images/PRYA_GIF_9.jpg`,
  10: `${ASSET_BASE_URL}/images/PRYA_GIF_10.jpg`,
} as const;

/**
 * Default/fallback image for welcome screen or when no question is active
 */
export const DEFAULT_IMAGE = `${ASSET_BASE_URL}/images/homepage-product.jpg`;

/**
 * Loading/Results screen images
 * Based on flow type:
 * - "mine" (YOUR WORD) = 8 questions → shows PRYA_GIF_8.jpg
 * - "theirs" (THEIR WORD) = 10 questions → shows PRYA_GIF_10.jpg
 */
export const LOADING_RESULTS_IMAGES = {
  mine: `${ASSET_BASE_URL}/images/PRYA_GIF_8.jpg`,
  theirs: `${ASSET_BASE_URL}/images/PRYA_GIF_10.jpg`,
} as const;

/**
 * Get image for a specific question number
 */
export const getQuestionImage = (questionNumber: number): string => {
  return QUESTION_IMAGES[questionNumber] || DEFAULT_IMAGE;
};

/**
 * Get image for loading screen based on flow type
 */
export const getLoadingImage = (flowType: 'mine' | 'theirs'): string => {
  return LOADING_RESULTS_IMAGES[flowType];
};

/**
 * Get image for results screen based on flow type
 */
export const getResultsImage = (flowType: 'mine' | 'theirs'): string => {
  return LOADING_RESULTS_IMAGES[flowType];
};

