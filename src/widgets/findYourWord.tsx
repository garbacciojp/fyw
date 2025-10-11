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

    // Ensure viewport supports safe area insets (for iPhone notch/home bar)
    this.ensureSafeAreaSupport();

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
   * Ensure viewport meta tag is optimized for all mobile devices
   * Handles iOS safe areas AND general mobile browser compatibility
   */
  private ensureSafeAreaSupport(): void {
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    
    if (!viewport) {
      // Create viewport meta tag if it doesn't exist
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    
    // Universal mobile viewport configuration
    // Works on iOS, Android, tablets, all modern mobile browsers
    const requiredSettings = [
      'width=device-width',
      'initial-scale=1',
      'viewport-fit=cover', // iOS safe area support (gracefully ignored on other devices)
    ];
    
    let content = viewport.content;
    
    // Add missing settings
    requiredSettings.forEach(setting => {
      const key = setting.split('=')[0];
      if (!content.includes(key)) {
        content = content + (content ? ', ' : '') + setting;
      }
    });
    
    viewport.content = content;
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

