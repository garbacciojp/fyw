/**
 * useQuestionFlow Hook
 * Manages question navigation and flow logic
 * 
 * Single Responsibility: Question navigation state and validation
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { FlowType, QuestionConfig, UserFormData } from '@/types';
import { getQuestionsForFlow } from '@/config';

/**
 * Hook options
 */
interface UseQuestionFlowOptions {
  flowType: FlowType;
  formData?: Partial<UserFormData>;
}

/**
 * Hook return type
 */
interface UseQuestionFlowReturn {
  currentQuestion: QuestionConfig;
  currentIndex: number;
  totalQuestions: number;
  questions: QuestionConfig[];
  progress: number;
  goToNext: () => void;
  goToPrevious: () => void;
  goToQuestion: (index: number) => void;
  goToNextIncomplete: (formData: Partial<UserFormData>) => void;
  isQuestionComplete: (question: QuestionConfig, formData: Partial<UserFormData>) => boolean;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Custom hook for managing question flow
 */
export const useQuestionFlow = (
  flowTypeOrOptions: FlowType | UseQuestionFlowOptions
): UseQuestionFlowReturn => {
  // Support both old and new API
  const options = typeof flowTypeOrOptions === 'string' 
    ? { flowType: flowTypeOrOptions, formData: undefined }
    : flowTypeOrOptions;
  
  const { flowType, formData } = options;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const previousFlowType = useRef<FlowType>(flowType);

  // Get questions for current flow (memoized)
  const questions = useMemo(() => getQuestionsForFlow(flowType), [flowType]);

  // Check if a question is complete (defined here for use in effect)
  const isQuestionComplete = useCallback(
    (question: QuestionConfig, formData: Partial<UserFormData>): boolean => {
      const value = formData[question.formDataKey];

      // If not required, always considered complete
      if (!question.required) return true;

      // Check based on question type
      switch (question.type) {
        case 'name-with-nicknames':
          return typeof value === 'object' && value !== null && 'name' in value && value.name?.trim().length > 0;

        case 'radio':
        case 'text-with-options':
          return typeof value === 'string' && value.length > 0;

        case 'multi-select-with-custom':
          return Array.isArray(value) && value.length > 0;

        case 'text-input':
          // For optional text inputs, consider them complete if they have a value or are not required
          return !question.required || (typeof value === 'string' && value.length > 0);

        default:
          return false;
      }
    },
    []
  );

  // Handle flow type changes - reset to appropriate question
  // ONLY run when flowType changes, NOT on every formData change
  useEffect(() => {
    // Check if flow type actually changed
    if (previousFlowType.current === flowType) {
      return; // No change, don't navigate
    }

    // Update ref for next comparison
    previousFlowType.current = flowType;

    // If no formData, just reset to first question
    if (!formData) {
      setCurrentIndex(0);
      return;
    }

    // Find the last completed question in the new flow
    let lastCompletedIndex = -1;
    for (let i = 0; i < questions.length; i++) {
      if (isQuestionComplete(questions[i], formData)) {
        lastCompletedIndex = i;
      } else {
        // Stop at first incomplete question
        break;
      }
    }

    // Set index to first incomplete question, or first question if none are complete
    const targetIndex = lastCompletedIndex === questions.length - 1
      ? lastCompletedIndex // All questions complete, stay on last
      : Math.max(0, lastCompletedIndex + 1); // Go to next incomplete (or first if none complete)

    setCurrentIndex(targetIndex);
  }, [flowType, formData, questions, isQuestionComplete]);

  // Current question
  const currentQuestion = questions[currentIndex];

  // Total questions
  const totalQuestions = questions.length;

  // Navigation functions
  const goToNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentIndex(index);
      }
    },
    [questions.length]
  );

  // Find and navigate to next incomplete question
  const goToNextIncomplete = useCallback(
    (formData: Partial<UserFormData>) => {
      const incompleteIndex = questions.findIndex(
        (q, i) => i > currentIndex && !isQuestionComplete(q, formData)
      );

      if (incompleteIndex !== -1) {
        setCurrentIndex(incompleteIndex);
      }
    },
    [currentIndex, questions, isQuestionComplete]
  );

  // Calculate progress percentage
  const progress = useMemo(() => {
    return Math.round(((currentIndex + 1) / questions.length) * 100);
  }, [currentIndex, questions.length]);

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    questions,
    progress,
    goToNext,
    goToPrevious,
    goToQuestion,
    goToNextIncomplete,
    isQuestionComplete,
    isFirst: currentIndex === 0,
    isLast: currentIndex === questions.length - 1,
  };
};


