import type { Language, FeedbackType, Priority, Sentiment, Category, Team, Status } from '../types';
import { t, type TranslationKey } from './i18n';

/**
 * Get translated label for any enum type
 */
export function getLabel(
  type: FeedbackType | Priority | Sentiment | Category | Team | Status | string,
  lang: Language = 'en'
): string {
  // Handle null/undefined
  if (!type) return '';
  
  // Strip any prefixes like "type.", "priority.", "category.", "team.", "sentiment."
  let key = type.toString();
  if (key.includes('.')) {
    key = key.split('.').pop() || key;
  }
  key = key.toUpperCase();
  
  // Check for emoji versions first
  if (['BUG', 'IDEA', 'OTHER', 'HELP', 'PRAISE', 'QUESTION'].includes(key)) {
    return t(`type.${key}_emoji` as TranslationKey, lang);
  }
  if (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(key)) {
    return t(`priority.${key}_emoji` as TranslationKey, lang);
  }
  if (['FRUSTRATED', 'HAPPY', 'NEUTRAL', 'ANGRY', 'CONFUSED'].includes(key)) {
    return t(`sentiment.${key}_emoji` as TranslationKey, lang);
  }
  if (['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(key)) {
    return t(`status.${key}_emoji` as TranslationKey, lang);
  }
  
  // Teams - check lowercase
  const lowerKey = key.toLowerCase();
  if (['dev', 'design', 'support', 'product', 'security', 'finance'].includes(lowerKey)) {
    return t(`team.${lowerKey}_emoji` as TranslationKey, lang);
  }
  
  // Category - try uppercase first
  return t(`category.${key}_emoji` as TranslationKey, lang);
}

/**
 * Get plain text label without emoji
 */
export function getPlainLabel(
  type: FeedbackType | Priority | Sentiment | Category | Team | Status | string,
  lang: Language = 'en'
): string {
  // Handle null/undefined
  if (!type) return '';
  
  // Strip any prefixes like "type.", "priority.", "category.", "team.", "sentiment."
  let key = type.toString();
  if (key.includes('.')) {
    key = key.split('.').pop() || key;
  }
  key = key.toUpperCase();
  
  if (['BUG', 'IDEA', 'OTHER', 'HELP', 'PRAISE', 'QUESTION'].includes(key)) {
    return t(`type.${key}` as TranslationKey, lang);
  }
  if (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(key)) {
    return t(`priority.${key}` as TranslationKey, lang);
  }
  if (['FRUSTRATED', 'HAPPY', 'NEUTRAL', 'ANGRY', 'CONFUSED'].includes(key)) {
    return t(`sentiment.${key}` as TranslationKey, lang);
  }
  if (['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(key)) {
    return t(`status.${key}` as TranslationKey, lang);
  }
  
  // Teams - check lowercase
  const lowerKey = key.toLowerCase();
  if (['dev', 'design', 'support', 'product', 'security', 'finance'].includes(lowerKey)) {
    return t(`team.${lowerKey}` as TranslationKey, lang);
  }
  
  return t(`category.${key}` as TranslationKey, lang);
}

/**
 * Get provider display name
 */
export function getProviderLabel(provider: string, lang: Language = 'en'): string {
  return t(`provider.${provider}` as TranslationKey, lang);
}

/**
 * Get provider description
 */
export function getProviderDescription(provider: string, lang: Language = 'en'): string {
  return t(`provider.${provider}_desc` as TranslationKey, lang);
}

/**
 * Get model display name
 */
export function getModelLabel(modelId: string, lang: Language = 'en'): string {
  return t(`model.${modelId}` as TranslationKey, lang);
}

/**
 * Get model description
 */
export function getModelDescription(modelId: string, lang: Language = 'en'): string {
  return t(`model.${modelId}_desc` as TranslationKey, lang);
}

/**
 * Get feature display name
 */
export function getFeatureLabel(featureKey: string, lang: Language = 'en'): string {
  return t(`feature.${featureKey}` as TranslationKey, lang);
}

/**
 * Get feature description
 */
export function getFeatureDescription(featureKey: string, lang: Language = 'en'): string {
  return t(`feature.${featureKey}_desc` as TranslationKey, lang);
}
