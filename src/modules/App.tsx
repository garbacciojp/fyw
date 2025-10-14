/**
 * App Component
 * Main application orchestrator
 * 
 * Single Responsibility: Orchestrate app flow and state
 * 
 * This component composes all modules together following the
 * config → core → modules architecture
 */

import { useState, useCallback } from 'react';
import type { AppScreen, FlowType, PartialUserFormData, JewelryNameSuggestion, UserDataPayload } from '@/types';
import { useQuestionFlow, useFormData, storage } from '@/core';
import { openaiService } from '@/core/services';
import { AppShell, AppHeader, AppContent } from './layout';
import { WelcomeScreen, QuestionScreen, LoadingScreen, ResultsScreen } from './screens';
import { DebugPanel } from './debug';
import { APP_SCREENS, getQuestionImage, getLoadingImage, getResultsImage, DEFAULT_IMAGE, UI_CONFIG } from '@/config';

/**
 * Main application component
 */
export const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(APP_SCREENS.WELCOME as AppScreen);
  const [flowType, setFlowType] = useState<FlowType>('mine');
  const [suggestions, setSuggestions] = useState<JewelryNameSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(import.meta.env.DEV); // Show in dev mode only

  // Initialize form data with storage callback
  const { formData, updateField, resetForm, isComplete } = useFormData({
    flowType,
    onSave: (data: PartialUserFormData) => storage.saveFormData(data),
  });

  // Initialize question flow with formData for smart navigation on flow changes
  const questionFlow = useQuestionFlow({ flowType, formData });

  // Handle flow selection from welcome screen
  const handleSelectFlow = useCallback(
    (flow: FlowType) => {
      setFlowType(flow);
      updateField('wordType', flow);
      setScreen(APP_SCREENS.QUESTIONS as AppScreen);
    },
    [updateField]
  );

  // Handle switching between flows
  const handleSwitchFlow = useCallback(() => {
    const newFlow: FlowType = flowType === 'mine' ? 'theirs' : 'mine';
    setFlowType(newFlow);
    updateField('wordType', newFlow);
  }, [flowType, updateField]);

  // Handle navigation to next question
  const handleContinue = useCallback(async () => {
    if (questionFlow.isLast && isComplete()) {
      // Last question and form complete - generate suggestions
      setScreen(APP_SCREENS.LOADING as AppScreen);
      setError(null);

      try {
        const result = await openaiService.generateSuggestions(formData as UserDataPayload);
        setSuggestions(result);
        setScreen(APP_SCREENS.RESULTS as AppScreen);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate suggestions';
        setError(errorMessage);
        setScreen(APP_SCREENS.QUESTIONS as AppScreen);
      }
    } else {
      // Move to next question
      questionFlow.goToNext();
    }
  }, [questionFlow, isComplete, formData]);

  // Handle reset - stay on current track, go to question 1
  const handleReset = useCallback(() => {
    resetForm();
    storage.clearFormData();
    questionFlow.goToQuestion(0); // Go back to first question of current track
    setSuggestions(null);
    setError(null);
    // Keep screen on QUESTIONS and keep current flowType
  }, [resetForm, questionFlow]);

  // Handle close - return to welcome screen
  const handleClose = useCallback(() => {
    resetForm();
    storage.clearFormData();
    setScreen(APP_SCREENS.WELCOME as AppScreen);
    setFlowType('mine');
    setSuggestions(null);
    setError(null);
  }, [resetForm]);

  // Get current image based on screen and question
  const getCurrentImage = (): string => {
    if (screen === APP_SCREENS.QUESTIONS && questionFlow.currentQuestion) {
      const questionNumber = questionFlow.currentQuestion.getQuestionNumber(flowType);
      return getQuestionImage(questionNumber);
    }
    
    // Loading screen shows the last question image based on flow type
    if (screen === APP_SCREENS.LOADING) {
      return getLoadingImage(flowType);
    }
    
    // Results screen shows the last question image based on flow type
    if (screen === APP_SCREENS.RESULTS) {
      return getResultsImage(flowType);
    }
    
    return DEFAULT_IMAGE;
  };

  // Render current screen
  const renderScreen = () => {
    switch (screen) {
      case APP_SCREENS.WELCOME:
        return <WelcomeScreen onSelectFlow={handleSelectFlow} />;

      case APP_SCREENS.QUESTIONS: {
        const { currentQuestion } = questionFlow;
        if (!currentQuestion) return null;

        const questionValue = formData[currentQuestion.formDataKey];
        const canContinue = questionFlow.isQuestionComplete(currentQuestion, formData);

        return (
          <QuestionScreen
            config={currentQuestion}
            flowType={flowType}
            value={questionValue}
            onChange={(value: unknown) => {
              // Type assertion is safe here as we trust the question component
              updateField(currentQuestion.formDataKey, value as never);
            }}
            progressInfo={{
              progress: questionFlow.progress,
              questionNumber: currentQuestion.getQuestionNumber(flowType),
              totalQuestions: currentQuestion.getTotalQuestions(flowType),
            }}
            navigation={{
              onBack: !questionFlow.isFirst ? questionFlow.goToPrevious : undefined,
              onContinue: handleContinue,
              onReset: handleReset,
              onSwitchFlow: handleSwitchFlow,
              canContinue,
            }}
          />
        );
      }

      case APP_SCREENS.LOADING:
        return <LoadingScreen flowType={flowType} />;

      case APP_SCREENS.RESULTS:
        return suggestions ? (
          <ResultsScreen
            words={suggestions.words}
            userName={formData.nameData?.name || 'you'}
            flowType={flowType}
          />
        ) : null;

      default:
        return null;
    }
  };

  // Always use AppShell for consistent two-column desktop layout
  return (
    <AppShell 
      showVideo={true}
      imageSrc={getCurrentImage()}
      debugPanel={
        // Only render debug panel in development mode
        !import.meta.env.PROD ? (
          <DebugPanel
            formData={formData}
            isVisible={showDebugPanel}
            onToggle={() => setShowDebugPanel(!showDebugPanel)}
          />
        ) : undefined
      }
    >
      {screen === APP_SCREENS.WELCOME ? (
        // WelcomeScreen handles its own full-height layout
        renderScreen()
      ) : (
        // All other screens with scrollable content
        <div className="fyw-flex fyw-flex-col fyw-w-full fyw-overflow-hidden" style={{ height: '100%', maxHeight: '100%' }}>
          {/* Content area - scrollable with strict height constraint */}
          <div className="fyw-flex-1 fyw-overflow-y-auto fyw-overflow-x-hidden fyw-overscroll-none" style={{ overflowAnchor: 'none', maxHeight: '100%', WebkitOverflowScrolling: 'touch' }}>
            {/* Mobile Image Preview - Scrollable at top (hidden on desktop) */}
            <div 
              className="md:fyw-hidden fyw-w-full fyw-relative fyw-bg-gray-800 fyw-flex-shrink-0"
              style={{
                height: UI_CONFIG.MOBILE_IMAGE_PREVIEW_HEIGHT
              }}
            >
              <img 
                src={getCurrentImage()}
                alt="Custom jewellery product showcase"
                className="fyw-w-full fyw-h-full fyw-object-cover"
                style={{ objectPosition: 'center 75%' }}
              />
            </div>
            
            {/* Close button inside scrollable area */}
            <AppHeader onClose={handleClose} />
            
            {screen === APP_SCREENS.QUESTIONS || screen === APP_SCREENS.LOADING ? (
              // QuestionScreen and LoadingScreen handle their own layout
              renderScreen()
            ) : (
              // Results screen uses AppContent for proper scrolling
              <AppContent>
                {renderScreen()}
              </AppContent>
            )}
          </div>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="fyw-fixed fyw-bottom-4 fyw-right-4 fyw-bg-red-600 fyw-text-fyw-white fyw-px-6 fyw-py-4 fyw-rounded-lg fyw-shadow-lg fyw-max-w-md fyw-z-[100]">
          <p className="fyw-font-medium fyw-mb-2">Error</p>
          <p className="fyw-text-sm">{error}</p>
        </div>
      )}
    </AppShell>
  );
};


