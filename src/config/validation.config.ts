/**
 * Validation Configuration
 * Zod schemas for runtime validation
 */

import { z } from 'zod';

/**
 * Name data validation
 */
export const NameDataSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  nicknames: z.array(z.string().max(30, 'Nickname is too long')).max(3),
});

/**
 * Age range validation
 */
export const AgeRangeSchema = z.enum([
  '16-25',
  '26-35',
  '36-45',
  '46-55',
  '56-65',
  '65+',
]);

/**
 * Flow type validation
 */
export const FlowTypeSchema = z.enum(['mine', 'theirs']);

/**
 * Relationship validation
 */
export const RelationshipSchema = z.enum([
  'sibling',
  'partner-spouse',
  'friend',
  'child',
  'parent',
  'grandparent',
  'mentor-teacher',
  'colleague',
  'other',
]);

/**
 * Occasion validation
 */
export const OccasionSchema = z.enum([
  'birthday',
  'anniversary',
  'wedding',
  'christmas',
  'graduation',
  'new-baby-parenthood',
  'friendship',
  'retirement',
  'romantic',
  'condolences',
  'just-because',
  'other',
]);

/**
 * Interests validation
 */
export const InterestsSchema = z.array(z.string().max(100)).min(1).max(5);

/**
 * Faith/Heritage validation
 */
export const FaithHeritageSchema = z.string().min(1).max(100);

/**
 * Word meaning validation
 */
export const WordMeaningSchema = z.array(z.string()).min(1).max(5);

/**
 * Languages validation
 */
export const LanguagesSchema = z.array(z.string()).min(1).max(5);

/**
 * Word preference validation
 */
export const WordPreferenceSchema = z.enum(['common', 'rare', 'poetic']);

/**
 * Emotional impact validation
 */
export const EmotionalImpactSchema = z.array(z.string()).min(1).max(5);

/**
 * Complete user form data validation
 */
export const UserFormDataSchema = z.object({
  wordType: FlowTypeSchema,
  nameData: NameDataSchema,
  ageRange: AgeRangeSchema,
  relationship: RelationshipSchema.optional(),
  occasion: OccasionSchema.optional(),
  interests: InterestsSchema,
  faithHeritage: FaithHeritageSchema.optional(),
  wordMeaning: WordMeaningSchema,
  languages: LanguagesSchema,
  wordPreference: WordPreferenceSchema,
  emotionalImpact: EmotionalImpactSchema,
});

/**
 * Validate user form data
 */
export const validateFormData = (data: unknown) => {
  return UserFormDataSchema.safeParse(data);
};


