/**
 * useFormData Hook
 * Manages form state with auto-save and persistence
 * 
 * Single Responsibility: Form data state management
 */

import { useState, useCallback, useEffect } from 'react';
import type { FlowType, UserFormData, PartialUserFormData } from '@/types';

/**
 * Hook options
 */
interface UseFormDataOptions {
  flowType: FlowType;
  onSave?: (data: PartialUserFormData) => void;
  autoSave?: boolean;
  autoSaveDelay?: number;
}

/**
 * Hook return type
 */
interface UseFormDataReturn {
  formData: PartialUserFormData;
  updateField: <K extends keyof UserFormData>(key: K, value: UserFormData[K]) => void;
  updateMultipleFields: (fields: Partial<UserFormData>) => void;
  resetForm: () => void;
  isComplete: () => boolean;
  getFieldValue: <K extends keyof UserFormData>(key: K) => UserFormData[K] | undefined;
}

/**
 * Initial form data structure
 */
const createInitialFormData = (flowType: FlowType): PartialUserFormData => ({
  wordType: flowType,
  interests: [],
  wordMeaning: [],
  languages: [],
  emotionalImpact: [],
});

/**
 * Custom hook for form data management
 */
export const useFormData = (options: UseFormDataOptions): UseFormDataReturn => {
  const { flowType, onSave, autoSave = true, autoSaveDelay = 500 } = options;

  // Initialize form data
  const [formData, setFormData] = useState<PartialUserFormData>(() =>
    createInitialFormData(flowType)
  );

  // Auto-save with debounce
  useEffect(() => {
    if (!autoSave || !onSave) return;

    const timer = setTimeout(() => {
      onSave(formData);
    }, autoSaveDelay);

    return () => clearTimeout(timer);
  }, [formData, onSave, autoSave, autoSaveDelay]);

  // Update single field
  const updateField = useCallback(
    <K extends keyof UserFormData>(key: K, value: UserFormData[K]) => {
      setFormData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // Update multiple fields at once
  const updateMultipleFields = useCallback((fields: Partial<UserFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(createInitialFormData(flowType));
  }, [flowType]);

  // Check if form is complete
  const isComplete = useCallback((): boolean => {
    const required: (keyof UserFormData)[] = [
      'nameData',
      'ageRange',
      'interests',
      'wordMeaning',
      'languages',
      'wordPreference',
      'emotionalImpact',
    ];

    // Add theirs-specific required fields
    if (flowType === 'theirs') {
      required.push('relationship', 'occasion');
    }

    return required.every((key) => {
      const value = formData[key];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return 'name' in value && typeof value.name === 'string' && value.name.length > 0;
      }
      return !!value;
    });
  }, [formData, flowType]);

  // Get field value
  const getFieldValue = useCallback(
    <K extends keyof UserFormData>(key: K): UserFormData[K] | undefined => {
      return formData[key] as UserFormData[K] | undefined;
    },
    [formData]
  );

  return {
    formData,
    updateField,
    updateMultipleFields,
    resetForm,
    isComplete,
    getFieldValue,
  };
};


