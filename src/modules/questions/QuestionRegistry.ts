/**
 * Question Registry
 * Maps question types to their component implementations
 * 
 * Single Responsibility: Type-to-Component mapping
 * 
 * RULE: To add a new question type, add entry here (and in config)
 */

import type { ComponentType } from 'react';
import type { QuestionType } from '@/types';
import { NameQuestion } from './types/NameQuestion';
import { RadioQuestion } from './types/RadioQuestion';
import { TextOptionsQuestion } from './types/TextOptionsQuestion';
import { MultiSelectQuestion } from './types/MultiSelectQuestion';
import { TextInputQuestion } from './types/TextInputQuestion';

import type { FlowType } from '@/types';

/**
 * Question component props interface
 * All question components must accept these props
 */
export interface QuestionComponentProps {
  value: unknown;
  onChange: (value: unknown) => void;
  onComplete?: () => void;
  error?: string;
  flowType?: FlowType;
}

/**
 * Question type registry
 * Maps question types to their React components
 */
export const QuestionRegistry: Record<QuestionType, ComponentType<QuestionComponentProps>> = {
  'name-with-nicknames': NameQuestion,
  radio: RadioQuestion,
  'text-with-options': TextOptionsQuestion,
  'multi-select-with-custom': MultiSelectQuestion,
  'text-input': TextInputQuestion,
};

/**
 * Get component for question type
 */
export const getQuestionComponent = (type: QuestionType): ComponentType<QuestionComponentProps> => {
  const Component = QuestionRegistry[type];
  
  if (!Component) {
    throw new Error(`Unknown question type: ${type}`);
  }
  
  return Component;
};


