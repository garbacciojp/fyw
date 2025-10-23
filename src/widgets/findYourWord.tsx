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
import type { WidgetConfig, WidgetMode } from '@/types';

/**
 * Find Your Word Widget Class
 * Provides open() and close() methods for integration
 * Supports both overlay (modal) and inline (embedded) rendering modes
 */
class FindYourWordWidget {
  private root: Root | null = null;
  private container: HTMLElement | null = null;
  private config: WidgetConfig;
  private mode: WidgetMode;
  private targetContainer: HTMLElement | null = null;

  constructor(config: WidgetConfig = {}) {
    this.config = {
      debug: false,
      autoOpen: false,
      mode: 'overlay',
      ...config,
    };

    this.mode = this.config.mode || 'overlay';

    // Validate configuration on init
    this.validateConfig();

    // Auto-initialize inline mode if container is provided
    if (this.mode === 'inline' && this.config.container) {
      this.initInline(this.config.container);
    }
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
   * Initialize widget in inline mode
   * Renders widget directly in provided container
   */
  initInline(containerSelector: string | HTMLElement): boolean {
    if (this.container) {
      console.warn('Widget is already initialized');
      return false;
    }

    // Resolve container
    this.targetContainer = typeof containerSelector === 'string'
      ? document.querySelector(containerSelector)
      : containerSelector;

    if (!this.targetContainer) {
      console.error('Inline mode requires a valid container:', containerSelector);
      return false;
    }

    // Create widget root inside target container
    this.container = document.createElement('div');
    this.container.id = 'fyw-widget-root';
    this.container.classList.add('fyw-mode-inline');
    this.targetContainer.appendChild(this.container);

    // Render app in inline mode
    this.root = createRoot(this.container);
    this.root.render(
      <ErrorBoundary>
        <App mode="inline" onClose={this.config.onClose} />
      </ErrorBoundary>
    );

    if (this.config.debug) {
      console.log('✅ Widget initialized in inline mode');
    }

    return true;
  }

  /**
   * Open the widget in overlay mode
   */
  open(): void {
    // If widget is in inline mode, log warning
    if (this.mode === 'inline') {
      console.warn('Widget is in inline mode. Use initInline() instead of open().');
      return;
    }

    if (this.container) {
      console.warn('Widget is already open');
      return;
    }

    // Ensure viewport supports safe area insets (for iPhone notch/home bar)
    this.ensureSafeAreaSupport();

    // Create container
    this.container = document.createElement('div');
    this.container.id = 'fyw-widget-root';
    this.container.classList.add('fyw-mode-overlay');
    document.body.appendChild(this.container);

    // Prevent body scroll (overlay mode only)
    document.body.style.overflow = 'hidden';

    // Render app in overlay mode
    this.root = createRoot(this.container);
    this.root.render(
      <ErrorBoundary>
        <App mode="overlay" onClose={() => this.close()} />
      </ErrorBoundary>
    );

    if (this.config.debug) {
      console.log('✅ Widget opened in overlay mode');
    }
  }

  /**
   * Ensure viewport meta tag is optimized for all mobile devices
   * Handles iOS safe areas AND general mobile browser compatibility
   * Only applies in overlay mode (inline mode respects page viewport)
   */
  private ensureSafeAreaSupport(): void {
    // Skip in inline mode - page controls viewport
    if (this.mode === 'inline') {
      return;
    }

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
   * Close the widget (overlay mode) or destroy it (inline mode)
   */
  close(): void {
    if (!this.container || !this.root) {
      console.warn('Widget is not open');
      return;
    }

    // Unmount React
    this.root.unmount();
    this.root = null;

    // Remove container based on mode
    if (this.mode === 'overlay') {
      // Overlay mode: remove from body and restore scroll
      document.body.removeChild(this.container);
      document.body.style.overflow = '';
    } else {
      // Inline mode: remove from target container
      if (this.targetContainer && this.targetContainer.contains(this.container)) {
        this.targetContainer.removeChild(this.container);
      }
    }

    this.container = null;

    // Call close callback
    if (this.config.onClose) {
      this.config.onClose();
    }

    if (this.config.debug) {
      console.log(`✅ Widget closed (${this.mode} mode)`);
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

