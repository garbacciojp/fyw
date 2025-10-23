/**
 * Widget Type Definitions
 * Defines widget configuration and component prop types
 */

import type { ReactNode } from 'react';

/**
 * Widget render mode
 * - overlay: Full-screen modal (default, backwards compatible)
 * - inline: Embedded in container without overlay
 */
export type WidgetMode = 'overlay' | 'inline';

/**
 * Widget configuration options
 */
export interface WidgetConfig {
  apiUrl?: string;
  theme?: string;
  debug?: boolean;
  onClose?: () => void;
  autoOpen?: boolean;
  mode?: WidgetMode;
  container?: string | HTMLElement;
}

/**
 * App screen types
 */
export type AppScreen = 'welcome' | 'questions' | 'loading' | 'results';

/**
 * Component base props
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

/**
 * Error state
 */
export interface ErrorState {
  hasError: boolean;
  message?: string;
}

/**
 * Navigation state
 */
export interface NavigationState {
  canGoBack: boolean;
  canGoNext: boolean;
  currentIndex: number;
  totalSteps: number;
  progress: number;
}

