/**
 * DebugPanel Component
 * Real-time API payload visualization for development
 * 
 * Single Responsibility: Display API data for debugging
 * Props: 4 (under the 7-prop limit)
 */

import { useState } from 'react';
import type { UserDataPayload } from '@/types';
import { cn } from '@/core';

interface DebugPanelProps {
  formData: Partial<UserDataPayload>;
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Debug panel for viewing form data and API payload
 * Only visible in development mode
 */
export const DebugPanel: React.FC<DebugPanelProps> = ({
  formData,
  isVisible,
  onToggle,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Build clean API payload (remove undefined/empty values)
  const buildApiPayload = (): Partial<UserDataPayload> => {
    return JSON.parse(
      JSON.stringify(formData, (key, value) => {
        if (
          value === null ||
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return undefined;
        }
        return value;
      })
    );
  };

  const cleanPayload = buildApiPayload();

  // Collapsed state button
  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className={cn(
          'fyw-absolute fyw-top-5 fyw-left-5',
          'fyw-z-[100]',
          'fyw-px-3 fyw-py-2',
          'fyw-bg-black/70 fyw-text-white',
          'fyw-border fyw-border-white/20',
          'fyw-rounded fyw-text-xs',
          'fyw-cursor-pointer fyw-font-mono',
          'hover:fyw-bg-black/90 fyw-transition',
          className
        )}
      >
        ▶ DEBUG: API Data
      </button>
    );
  }

  // Expanded state panel
  return (
    <div
      className={cn(
        'fyw-absolute fyw-top-5 fyw-left-5',
        'fyw-w-[calc(100%-40px)] fyw-max-h-[80vh]',
        'fyw-bg-slate-800/95 fyw-backdrop-blur-lg',
        'fyw-border-2 fyw-border-white/30',
        'fyw-rounded-lg fyw-overflow-hidden',
        'fyw-z-[100] fyw-font-mono fyw-text-xs',
        className
      )}
    >
      {/* Header */}
      <div className="fyw-flex fyw-justify-between fyw-items-center fyw-px-4 fyw-py-3 fyw-bg-slate-900/80 fyw-border-b fyw-border-white/10 fyw-text-white">
        <div className="fyw-flex fyw-items-center fyw-gap-2">
          <span className="fyw-text-green-500 fyw-text-[8px]">●</span>
          <span className="fyw-font-medium">DEBUG: API Data</span>
        </div>
        <div className="fyw-flex fyw-gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="fyw-bg-transparent fyw-border-none fyw-text-slate-400 fyw-cursor-pointer fyw-text-sm hover:fyw-text-white fyw-transition"
          >
            {isExpanded ? '−' : '+'}
          </button>
          <button
            onClick={onToggle}
            className="fyw-bg-transparent fyw-border-none fyw-text-slate-400 fyw-cursor-pointer fyw-text-sm hover:fyw-text-white fyw-transition"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="fyw-max-h-[60vh] fyw-overflow-auto fyw-p-4">
          {/* Current Data */}
          <div className="fyw-mb-4">
            <div className="fyw-text-slate-400 fyw-text-[10px] fyw-mb-2 fyw-uppercase fyw-tracking-wide">
              Current Data:
            </div>
            <pre className="fyw-m-0 fyw-p-3 fyw-bg-black/30 fyw-rounded fyw-text-slate-200 fyw-text-[10px] fyw-leading-relaxed fyw-overflow-auto fyw-whitespace-pre-wrap">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>

          {/* API Payload Preview */}
          <div className="fyw-mb-4">
            <div className="fyw-text-slate-400 fyw-text-[10px] fyw-mb-2 fyw-uppercase fyw-tracking-wide">
              API Payload (Sent to server):
            </div>
            <pre className="fyw-m-0 fyw-p-3 fyw-bg-green-500/10 fyw-border fyw-border-green-500/20 fyw-rounded fyw-text-green-400 fyw-text-[10px] fyw-leading-relaxed fyw-overflow-auto fyw-whitespace-pre-wrap">
              {JSON.stringify(cleanPayload, null, 2)}
            </pre>
          </div>

          {/* Storage Info */}
          <div className="fyw-mb-4">
            <div className="fyw-text-slate-400 fyw-text-[10px] fyw-mb-2 fyw-uppercase fyw-tracking-wide">
              Storage Info:
            </div>
            <div className="fyw-p-3 fyw-bg-black/20 fyw-rounded fyw-text-slate-300 fyw-text-[10px] fyw-space-y-1">
              <div>
                <span className="fyw-text-green-500">●</span> Has stored data:{' '}
                {Object.keys(formData).length > 0 ? 'Yes' : 'No'}
              </div>
              <div>
                Data size: {new Blob([JSON.stringify(formData)]).size} bytes
              </div>
              <div>
                Auto-saved: {formData.wordType ? 'Enabled' : 'Pending'}
              </div>
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(cleanPayload, null, 2));
            }}
            className="fyw-w-full fyw-mt-3 fyw-px-3 fyw-py-2 fyw-bg-blue-500/10 fyw-border fyw-border-blue-500/30 fyw-rounded fyw-text-blue-400 fyw-text-[10px] fyw-cursor-pointer fyw-font-mono hover:fyw-bg-blue-500/20 fyw-transition"
          >
            Copy API Payload
          </button>
        </div>
      )}
    </div>
  );
};

