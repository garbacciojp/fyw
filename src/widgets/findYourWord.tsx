/**
 * Find Your Word Widget Entry Point
 * Global API for widget integration
 * 
 * Single Responsibility: Widget initialization and global API
 */

import { createRoot, type Root } from 'react-dom/client';
import { App } from '@/modules/App';
import { ErrorBoundary } from '@/modules/ErrorBoundary';
import { validateQuestionsConfig } from '@/config';
import '@/styles/index.css';
import type { WidgetConfig } from '@/types';

/**
 * Find Your Word Widget Class
 * Provides open() and close() methods for integration
 */
class FindYourWordWidget {
  private root: Root | null = null;
  private container: HTMLElement | null = null;
  private config: WidgetConfig;

  constructor(config: WidgetConfig = {}) {
    this.config = {
      debug: false,
      autoOpen: false,
      ...config,
    };

    // Validate configuration on init
    this.validateConfig();
  }

  /**
   * Validate questions configuration
   */
  private validateConfig(): void {
    const validation = validateQuestionsConfig();
    if (!validation.valid) {
      console.error('❌ Questions configuration errors:', validation.errors);
      throw new Error('Invalid questions configuration');
    }
    
    if (this.config.debug) {
      console.log('✅ Questions configuration validated');
    }
  }

  /**
   * Open the widget
   */
  open(): void {
    if (this.container) {
      console.warn('Widget is already open');
      return;
    }

    // Create container
    this.container = document.createElement('div');
    this.container.id = 'fyw-widget-root';
    document.body.appendChild(this.container);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Render app
    this.root = createRoot(this.container);
    this.root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );

    if (this.config.debug) {
      console.log('✅ Widget opened');
    }
  }

  /**
   * Close the widget
   */
  close(): void {
    if (!this.container || !this.root) {
      console.warn('Widget is not open');
      return;
    }

    // Unmount React
    this.root.unmount();
    this.root = null;

    // Remove container
    document.body.removeChild(this.container);
    this.container = null;

    // Restore body scroll
    document.body.style.overflow = '';

    // Call close callback
    if (this.config.onClose) {
      this.config.onClose();
    }

    if (this.config.debug) {
      console.log('✅ Widget closed');
    }
  }

  /**
   * Check if widget is open
   */
  isOpen(): boolean {
    return this.container !== null;
  }
}

// Extend Window interface for widget API
declare global {
  interface Window {
    FindYourWordWidget?: FindYourWordWidgetType;
  }
}

// Export type for window declaration
export type FindYourWordWidgetType = FindYourWordWidget;

// Auto-initialize
const scripts = document.getElementsByTagName('script');
const currentScript = scripts[scripts.length - 1];
const autoOpen = currentScript?.getAttribute('data-auto-open') === 'true';
const debugMode = currentScript?.getAttribute('data-debug') === 'true';

// Create and expose global instance
const widgetInstance = new FindYourWordWidget({
  debug: debugMode,
  autoOpen,
});

// Expose to window object
window.FindYourWordWidget = widgetInstance;

// Auto-open if requested
if (autoOpen) {
  widgetInstance.open();
}

// Default export for IIFE mode (required by Vite library mode)
export default widgetInstance;

// For development (when running via Vite)
if (import.meta.env.DEV) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  }
}

