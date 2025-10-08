/**
 * Class Name Utility
 * Combines class names conditionally
 * 
 * Single Responsibility: Class name composition
 */

/**
 * Conditionally join class names
 * @param classes - Class names to join
 * @returns Combined class name string
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};


