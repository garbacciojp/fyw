/**
 * Questions Configuration
 * ALL questions defined as pure data structures
 * 
 * RULE: To add/modify questions, edit ONLY this file
 * RULE: Questions are data, not code
 */

import type { QuestionConfig, FlowType } from '@/types';
import { QUESTION_TYPES, FLOW_TYPES } from './constants.config';

/**
 * ALL QUESTIONS DEFINED HERE
 * This is the single source of truth for the question flow
 */
export const QUESTIONS: QuestionConfig[] = [
  // ==========================================
  // Question 1: Name & Nicknames (Both flows)
  // ==========================================
  {
    id: 'name',
    flowType: 'both',
    type: QUESTION_TYPES.NAME_WITH_NICKNAMES as 'name-with-nicknames',
    formDataKey: 'nameData',
    required: true,
    getQuestionNumber: () => 1,
    getTotalQuestions: (flow: FlowType) => (flow === FLOW_TYPES.THEIRS ? 10 : 8),
    getTitle: () => "Let's start with the basics",
    getSubtitle: () => "We'll use this information to find the perfect word for your jewelry",
  },

  // ==========================================
  // Question 2: Age Range (Both flows)
  // ==========================================
  {
    id: 'age',
    flowType: 'both',
    type: QUESTION_TYPES.RADIO as 'radio',
    formDataKey: 'ageRange',
    required: true,
    getQuestionNumber: () => 2,
    getTotalQuestions: (flow: FlowType) => (flow === FLOW_TYPES.THEIRS ? 10 : 8),
    getTitle: (flow: FlowType) =>
      flow === FLOW_TYPES.MINE ? "What's your age range?" : "What's their age range?",
    getSubtitle: () => 'This helps us suggest words that resonate with their generation',
    options: [
      { value: '16-25', label: '16-25 years old' },
      { value: '26-35', label: '26-35 years old' },
      { value: '36-45', label: '36-45 years old' },
      { value: '46-55', label: '46-55 years old' },
      { value: '56-65', label: '56-65 years old' },
      { value: '65+', label: '65+ years old' },
    ],
  },

  // ==========================================
  // Question 3: Relationship (Theirs flow only)
  // ==========================================
  {
    id: 'relationship',
    flowType: 'theirs',
    type: QUESTION_TYPES.TEXT_WITH_OPTIONS as 'text-with-options',
    formDataKey: 'relationship',
    required: true,
    getQuestionNumber: () => 3,
    getTotalQuestions: () => 10,
    getTitle: () => 'What is your relationship to this person?',
    getSubtitle: () => 'This helps us understand the context and find the perfect word',
    options: [
      { value: 'sibling', label: 'Sibling' },
      { value: 'partner-spouse', label: 'Partner/Spouse' },
      { value: 'friend', label: 'Friend' },
      { value: 'child', label: 'They are my child' },
      { value: 'parent', label: 'They are my parent' },
      { value: 'grandparent', label: 'They are my grandparent' },
      { value: 'mentor-teacher', label: 'Mentor or teacher' },
      { value: 'colleague', label: 'Colleague' },
      { value: 'other', label: 'Other' },
    ],
  },

  // ==========================================
  // Question 4: Occasion (Theirs flow only)
  // ==========================================
  {
    id: 'occasion',
    flowType: 'theirs',
    type: QUESTION_TYPES.TEXT_WITH_OPTIONS as 'text-with-options',
    formDataKey: 'occasion',
    required: true,
    getQuestionNumber: () => 4,
    getTotalQuestions: () => 10,
    getTitle: () => 'What is this gift for?',
    getSubtitle: () => 'This helps us find words that match the occasion',
    options: [
      { value: 'birthday', label: 'Birthday' },
      { value: 'anniversary', label: 'Anniversary' },
      { value: 'wedding', label: 'Wedding' },
      { value: 'christmas', label: 'Christmas' },
      { value: 'graduation', label: 'Graduation' },
      { value: 'new-baby-parenthood', label: 'New baby/parenthood' },
      { value: 'friendship', label: 'Friendship' },
      { value: 'retirement', label: 'Retirement' },
      { value: 'romantic', label: 'Romantic' },
      { value: 'condolences', label: 'Condolences' },
      { value: 'just-because', label: 'Just because' },
      { value: 'other', label: 'Other' },
    ],
  },

  // ==========================================
  // Question 3/5: Interests (Both flows)
  // ==========================================
  {
    id: 'interests',
    flowType: 'both',
    type: QUESTION_TYPES.MULTI_SELECT_WITH_CUSTOM as 'multi-select-with-custom',
    formDataKey: 'interests',
    required: true,
    getQuestionNumber: (flow: FlowType) => (flow === FLOW_TYPES.MINE ? 3 : 5),
    getTotalQuestions: (flow: FlowType) => (flow === FLOW_TYPES.THEIRS ? 10 : 8),
    getTitle: (flow: FlowType) =>
      flow === FLOW_TYPES.MINE ? 'Tell us about yourself:' : 'Tell us about them:',
    getSubtitle: (flow: FlowType) =>
      flow === FLOW_TYPES.MINE
        ? 'What are your interests? (Select up to 3)'
        : 'What are their interests? (Select up to 3 if you know)',
    maxSelections: 3,
    allowCustom: true,
    options: [
      { value: 'Art & Creativity', label: 'Art & Creativity' },
      { value: 'Music & Rhythm', label: 'Music & Rhythm' },
      { value: 'Film', label: 'Film' },
      { value: 'Nature & Outdoors', label: 'Nature & Outdoors' },
      { value: 'Travel', label: 'Travel' },
      { value: 'Literature', label: 'Literature' },
      { value: 'Wellness', label: 'Wellness' },
      { value: 'Spirituality & Faith', label: 'Spirituality & Faith' },
      { value: 'Sport & Movement', label: 'Sport & Movement' },
      { value: 'Family & Friends', label: 'Family & Friends' },
      { value: 'Food & Cooking', label: 'Food & Cooking' },
      { value: 'Fashion & Style', label: 'Fashion & Style' },
      { value: 'History & Heritage', label: 'History & Heritage' },
      { value: 'Pop Culture', label: 'Pop Culture' },
      { value: 'Reading & Writing', label: 'Reading & Writing' },
      { value: 'Technology & Innovation', label: 'Technology & Innovation' },
      { value: 'Gaming', label: 'Gaming' },
      { value: 'Mythology & Legends', label: 'Mythology & Legends' },
      { value: "I'm Not Sure", label: "I'm Not Sure" },
      { value: 'Other', label: 'Other' },
    ],
  },

  // ==========================================
  // Question 4/6: Faith/Heritage (Both flows)
  // ==========================================
  {
    id: 'faithHeritage',
    flowType: 'both',
    type: QUESTION_TYPES.TEXT_INPUT as 'text-input',
    formDataKey: 'faithHeritage',
    required: false,
    getQuestionNumber: (flow: FlowType) => (flow === FLOW_TYPES.MINE ? 4 : 6),
    getTotalQuestions: (flow: FlowType) => (flow === FLOW_TYPES.THEIRS ? 10 : 8),
    getTitle: () => 'Is there a faith or heritage you connect with?',
    getSubtitle: () => "Enter your faith or heritage if it's important to you",
    placeholder: 'e.g., Christianity, Irish heritage, etc.',
  },

  // ==========================================
  // Question 5/7: Word Meaning (Both flows)
  // ==========================================
  {
    id: 'wordMeaning',
    flowType: 'both',
    type: QUESTION_TYPES.RADIO as 'radio',
    formDataKey: 'wordMeaning',
    required: true,
    getQuestionNumber: (flow: FlowType) => (flow === FLOW_TYPES.MINE ? 5 : 7),
    getTotalQuestions: (flow: FlowType) => (flow === FLOW_TYPES.THEIRS ? 10 : 8),
    getTitle: () => 'What kind of meaning do you want the word to have?',
    getSubtitle: () => 'Choose one that best matches what you want',
    options: [
      { value: 'Personal trait', label: 'Personal trait' },
      { value: 'A value or ideal', label: 'A value or ideal' },
      { value: 'A mood or feeling', label: 'A mood or feeling' },
      { value: 'A memorable experience or concept', label: 'A memorable experience or concept' },
      { value: 'Something unique or mysterious', label: 'Something unique or mysterious' },
    ],
  },

  // ==========================================
  // Question 6/8: Languages (Both flows)
  // ==========================================
  {
    id: 'languages',
    flowType: 'both',
    type: QUESTION_TYPES.TEXT_WITH_OPTIONS as 'text-with-options',
    formDataKey: 'languages',
    required: true,
    getQuestionNumber: (flow: FlowType) => (flow === FLOW_TYPES.MINE ? 6 : 8),
    getTotalQuestions: (flow: FlowType) => (flow === FLOW_TYPES.THEIRS ? 10 : 8),
    getTitle: () => 'Would you like the word to be in:',
    getSubtitle: () => 'Choose one language',
    placeholder: 'Type your preferred language...',
    options: [
      { value: 'English', label: 'English' },
      { value: 'Arabic', label: 'Arabic' },
      { value: 'Greek', label: 'Greek' },
      { value: 'Hindi', label: 'Hindi' },
      { value: 'Chinese', label: 'Chinese' },
      { value: 'Japanese', label: 'Japanese' },
      { value: 'Korean', label: 'Korean' },
      { value: 'Thai', label: 'Thai' },
      { value: "I don't mind", label: "I don't mind" },
      { value: 'other', label: 'Other' },
    ],
  },

  // ==========================================
  // Question 7/9: Word Preference (Both flows)
  // ==========================================
  {
    id: 'wordPreference',
    flowType: 'both',
    type: QUESTION_TYPES.RADIO as 'radio',
    formDataKey: 'wordPreference',
    required: true,
    getQuestionNumber: (flow: FlowType) => (flow === FLOW_TYPES.MINE ? 7 : 9),
    getTotalQuestions: (flow: FlowType) => (flow === FLOW_TYPES.THEIRS ? 10 : 8),
    getTitle: () => 'Do you prefer a word that is:',
    getSubtitle: () => 'Choose the style that appeals to you most',
    options: [
      { value: 'common', label: 'Common and easily recognised' },
      { value: 'rare', label: 'Rare or uncommon' },
      { value: 'poetic', label: 'A poetic or symbolic word' },
    ],
  },

  // ==========================================
  // Question 8/10: Emotional Impact (Both flows)
  // ==========================================
  {
    id: 'emotionalImpact',
    flowType: 'both',
    type: QUESTION_TYPES.TEXT_WITH_OPTIONS as 'text-with-options',
    formDataKey: 'emotionalImpact',
    required: true,
    getQuestionNumber: (flow: FlowType) => (flow === FLOW_TYPES.MINE ? 8 : 10),
    getTotalQuestions: (flow: FlowType) => (flow === FLOW_TYPES.THEIRS ? 10 : 8),
    getTitle: (flow: FlowType) =>
      flow === FLOW_TYPES.MINE
        ? 'How do you want the word to make you feel when you wear it?'
        : 'How do you want the word to make them feel when they wear it?',
    getSubtitle: () => 'Choose one feeling',
    options: [
      { value: 'Empowering', label: 'Empowering' },
      { value: 'Comforting', label: 'Comforting' },
      { value: 'Grounding', label: 'Grounding' },
      { value: 'Romantic', label: 'Romantic' },
      { value: 'Playful', label: 'Playful' },
      { value: 'Mysterious', label: 'Mysterious' },
      { value: 'other', label: 'Other' },
    ],
  },
];

/**
 * Get questions for a specific flow type
 */
export const getQuestionsForFlow = (flow: FlowType): QuestionConfig[] => {
  return QUESTIONS.filter((q) => q.flowType === 'both' || q.flowType === flow);
};

/**
 * Get question by ID
 */
export const getQuestionById = (id: string): QuestionConfig | undefined => {
  return QUESTIONS.find((q) => q.id === id);
};

/**
 * Get total question count for a flow
 */
export const getTotalQuestionsForFlow = (flow: FlowType): number => {
  return getQuestionsForFlow(flow).length;
};

/**
 * Validate questions configuration
 * Run this at application startup to catch config errors
 */
export const validateQuestionsConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check for duplicate IDs
  const ids = QUESTIONS.map((q) => q.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate question IDs: ${duplicates.join(', ')}`);
  }

  // Check for missing required fields
  QUESTIONS.forEach((q, index) => {
    if (!q.id) errors.push(`Question at index ${index} missing ID`);
    if (!q.type) errors.push(`Question ${q.id} missing type`);
    if (!q.formDataKey) errors.push(`Question ${q.id} missing formDataKey`);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

