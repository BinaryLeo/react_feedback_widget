import { Warning, CheckCircle, ArrowsLeftRight } from '@phosphor-icons/react';
import type { AIInsight, FeedbackType, Language } from '../../types';
import { t } from '../../lib/i18n';
import { getPlainLabel as getLabel } from '../../lib/labels';

interface TypeValidationAlertProps {
  insight: AIInsight;
  currentType: FeedbackType;
  onTypeChange: (type: FeedbackType) => void;
  lang: Language;
}

export function TypeValidationAlert({ insight, currentType, onTypeChange, lang }: TypeValidationAlertProps) {
  if (!insight.typeValidation || insight.typeValidation.isCorrect) {
    return null;
  }

  const { suggestedType, reason, confidence } = insight.typeValidation;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3 animate-fadeIn">
      <div className="flex items-start gap-2">
        <Warning size={16} weight="fill" className="text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-amber-800">
            {t('widget.type_mismatch_title', lang, {
              suggested: getLabel(suggestedType, lang),
              current: getLabel(currentType, lang),
            })}
          </p>
          <p className="text-xs text-amber-600/80 mt-0.5 line-clamp-2">
            {reason}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => onTypeChange(suggestedType)}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <ArrowsLeftRight size={12} weight="bold" />
              {t('widget.switch_to', lang)} {getLabel(suggestedType, lang)}
            </button>
            {confidence > 0 && (
              <span className="text-xs text-amber-600/60 ml-auto">
                {Math.round(confidence * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TypeMatchBadgeProps {
  insight: AIInsight;
  currentType: FeedbackType;
  lang: Language;
}

export function TypeMatchBadge({ insight, currentType, lang }: TypeMatchBadgeProps) {
  if (!insight.typeValidation || !insight.typeValidation.isCorrect) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 text-xs text-green-600 animate-fadeIn">
      <CheckCircle size={14} weight="fill" />
      <span>AI: {getLabel(currentType, lang)}</span>
      <span className="text-green-500/60">({Math.round(insight.confidence * 100)}%)</span>
    </div>
  );
}
