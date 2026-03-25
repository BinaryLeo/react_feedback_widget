import { Copy, ArrowSquareOut } from '@phosphor-icons/react';
import type { AIInsight, Language } from '../../types';
import { t } from '../../lib/i18n';

interface AIDuplicateAlertProps {
  insight: AIInsight;
  onViewSimilar?: (id: string) => void;
  lang: Language;
}

export function AIDuplicateAlert({ insight, onViewSimilar, lang }: AIDuplicateAlertProps) {
  if (!insight.isDuplicate && (!insight.similarFeedbacks || insight.similarFeedbacks.length === 0)) {
    return null;
  }

  const similar = insight.similarFeedbacks?.[0];

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 animate-fadeIn">
      <div className="flex items-start gap-3">
        <Copy size={20} weight="regular" className="text-blue-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-blue-800 mb-1">
            {t('widget.possible_duplicate', lang)}
          </p>

          {similar && (
            <div className="text-sm text-blue-700 mb-3">
              <p className="truncate">{similar.summary}</p>
              <p className="text-xs text-blue-500 mt-1">
                {Math.round(similar.similarity * 100)}% similar • {similar.type}
              </p>
            </div>
          )}

          {onViewSimilar && similar && (
            <button
              onClick={() => onViewSimilar(similar.id)}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowSquareOut size={16} weight="regular" />
              {t('widget.view_similar', lang)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
