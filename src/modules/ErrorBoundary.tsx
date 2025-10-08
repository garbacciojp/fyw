/**
 * ErrorBoundary Component
 * Catches and handles React errors gracefully
 * 
 * Single Responsibility: Error boundary for React tree
 */

import React, { Component, type ReactNode } from 'react';
import { Button } from './ui';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component
 * Catches errors in child components and displays fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Widget Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fyw-flex fyw-items-center fyw-justify-center fyw-h-full fyw-p-8">
          <div className="fyw-text-center fyw-max-w-md">
            <h2 className="fyw-text-2xl fyw-font-light fyw-text-fyw-white fyw-mb-4">
              Something went wrong
            </h2>
            <p className="fyw-text-fyw-gray-400 fyw-mb-6">
              We encountered an error. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
            
            {/* Error details (development only) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="fyw-mt-6 fyw-text-left fyw-text-xs fyw-text-fyw-gray-500">
                <summary className="fyw-cursor-pointer fyw-mb-2">Error Details</summary>
                <pre className="fyw-bg-fyw-gray-900 fyw-p-4 fyw-rounded fyw-overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


