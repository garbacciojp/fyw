/**
 * useDebounce Hook
 * Debounces a value for delayed updates
 * 
 * Single Responsibility: Debounce logic
 */

import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500)
 * @returns The debounced value
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};


