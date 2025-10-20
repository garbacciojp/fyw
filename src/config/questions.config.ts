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
    getSubtitle: (flow: FlowType) => 
      flow === FLOW_TYPES.MINE 
        ? "We'll use this information to find the perfect word for your jewellery."
        : "We'll use this information to find the perfect word for their jewellery.",
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
    getSubtitle: (flow: FlowType) => flow === FLOW_TYPES.MINE 
      ? 'This helps us suggest words that resonate with your generation.'
      : 'This helps us suggest words that resonate with their generation.',
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
    getSubtitle: () => 'This helps us understand the context and find the perfect word.',
    options: [
      { value: 'friend', label: 'A Friend' },
      { value: 'colleague', label: 'Colleague' },
      { value: 'mentor-teacher', label: 'Mentor / Teacher' },
      { value: 'child', label: 'My Child' },
      { value: 'grandparent', label: 'My Grandparent' },
      { value: 'parent', label: 'My Parent' },
      { value: 'partner-spouse', label: 'Partner / Spouse' },
      { value: 'sibling', label: 'Sibling' },
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
    getSubtitle: () => 'This helps us find words that match the occasion.',
    options: [
      { value: 'anniversary', label: 'Anniversary' },
      { value: 'birthday', label: 'Birthday' },
      { value: 'christmas', label: 'Christmas' },
      { value: 'condolences', label: 'Condolences' },
      { value: 'friendship', label: 'Friendship' },
      { value: 'graduation', label: 'Graduation' },
      { value: 'new-baby-parenthood', label: 'New Baby / Parenthood' },
      { value: 'retirement', label: 'Retirement' },
      { value: 'romantic', label: 'Romantic' },
      { value: 'wedding', label: 'Wedding' },
      { value: 'just-because', label: 'Just Because' },
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
        : 'What are their interests? (Select up to 3)',
    maxSelections: 3,
    allowCustom: true,
    options: [
      { value: 'Art / Creativity', label: 'Art / Creativity' },
      { value: 'Family / Friends', label: 'Family / Friends' },
      { value: 'Fashion / Style', label: 'Fashion / Style' },
      { value: 'Film', label: 'Film' },
      { value: 'Food / Cooking', label: 'Food / Cooking' },
      { value: 'Gaming', label: 'Gaming' },
      { value: 'History / Heritage', label: 'History / Heritage' },
      { value: 'Literature', label: 'Literature' },
      { value: 'Music / Rhythm', label: 'Music / Rhythm' },
      { value: 'Mythology / Legends', label: 'Mythology / Legends' },
      { value: 'Nature / Outdoors', label: 'Nature / Outdoors' },
      { value: 'Pop Culture', label: 'Pop Culture' },
      { value: 'Reading / Writing', label: 'Reading / Writing' },
      { value: 'Spirituality / Faith', label: 'Spirituality / Faith' },
      { value: 'Sport / Movement', label: 'Sport / Movement' },
      { value: 'Tech / Innovation', label: 'Tech / Innovation' },
      { value: 'Travel', label: 'Travel' },
      { value: 'Wellness', label: 'Wellness' },
      { value: "Not Sure", label: "Not Sure" },
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
    getTitle: (flow: FlowType) => flow === FLOW_TYPES.MINE
      ? 'Is there a faith or heritage you connect with?'
      : 'Is there a faith or heritage they connect with?',
    getSubtitle: (flow: FlowType) => flow === FLOW_TYPES.MINE
      ? "Enter your faith or heritage if it's important to you."
      : "Enter their faith or heritage if it's important to them.",
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
    getSubtitle: () => 'Choose one that best matches what you want.',
    buttonLayout: 'single-column' as const,
    getOptions: (flow: FlowType) => flow === FLOW_TYPES.MINE ? [
      { value: 'Experience / concept', label: 'A word that inspires you' },
      { value: 'Mood / feeling', label: 'A word that expresses you' },
      { value: 'Mysterious / Unique', label: 'A word that is mysterious' },
      { value: 'Personal trait', label: "A word that's personal" },
      { value: 'Value / ideal', label: 'A word that reflects your values' },
    ] : [
      { value: 'Experience / concept', label: 'A word that inspires them' },
      { value: 'Mood / feeling', label: 'A word that expresses them' },
      { value: 'Mysterious / Unique', label: 'A word that is mysterious' },
      { value: 'Personal trait', label: "A word that's personal" },
      { value: 'Value / ideal', label: 'A word that reflects their values' },
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
    getSubtitle: () => 'Choose one language:',
    placeholder: 'Type your preferred language...',
    options: [
      { value: 'English', label: 'English' },
      { value: 'Arabic', label: 'Arabic' },
      { value: 'Chinese', label: 'Chinese' },
      { value: 'Greek', label: 'Greek' },
      { value: 'Hindi', label: 'Hindi' },
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
      { value: 'common', label: 'Recognisable' },
      { value: 'poetic', label: 'Symbolic' },
      { value: 'rare', label: 'Rare' },
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
      { value: 'Comforting', label: 'Comforting' },
      { value: 'Empowering', label: 'Empowering' },
      { value: 'Grounding', label: 'Grounding' },
      { value: 'Mysterious', label: 'Mysterious' },
      { value: 'Playful', label: 'Playful' },
      { value: 'Romantic', label: 'Romantic' },
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

