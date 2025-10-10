/**
 * Images Configuration
 * Maps question numbers to their corresponding images
 * 
 * RULE: To add/modify images, edit ONLY this file
 * RULE: Images are data, not code
 */

/**
 * Question image mapping
 * Each question number (1-10) maps to a specific image
 */
export const QUESTION_IMAGES: Record<number, string> = {
  1: '/images/PRYA_GIF_1.jpg',
  2: '/images/PRYA_GIF_2.jpg',
  3: '/images/PRYA_GIF_3.jpg',
  4: '/images/PRYA_GIF_4.jpg',
  5: '/images/PRYA_GIF_5.jpg',
  6: '/images/PRYA_GIF_6.jpg',
  7: '/images/PRYA_GIF_7.jpg',
  8: '/images/PRYA_GIF_8.jpg',
  9: '/images/PRYA_GIF_9.jpg',
  10: '/images/PRYA_GIF_10.jpg',
} as const;

/**
 * Default/fallback image for welcome screen or when no question is active
 */
export const DEFAULT_IMAGE = '/images/homepage-product.jpg';

/**
 * Get image for a specific question number
 */
export const getQuestionImage = (questionNumber: number): string => {
  return QUESTION_IMAGES[questionNumber] || DEFAULT_IMAGE;
};

