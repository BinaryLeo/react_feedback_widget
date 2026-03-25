import { CheckCircle } from '@phosphor-icons/react';
import type { Language, AIInsight } from '../../types';
import { t } from '../../lib/i18n';
import { getPlainLabel } from '../../lib/labels';
import { getPriorityIcon, getCategoryIcon } from '../../lib/icons';

interface SuccessStepProps {
  language: Language;
  insight?: AIInsight | null;
}

export function SuccessStep({ language, insight }: SuccessStepProps) {
  return (
    <div className="px-6 py-8 text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle size={32} weight="regular" className="text-green-500" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {t('widget.thank_you', language)}
        </h3>
        <p className="text-gray-600">
          {t('widget.thank_you_message', language)}
        </p>
      </div>

      {/* AI Analysis Summary - Minimal */}
      {insight?.analyzed && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            {(() => {
              const PriorityIcon = getPriorityIcon(insight.priority);
              const CategoryIcon = getCategoryIcon(insight.category);
              return (
                <>
                  <span className="flex items-center gap-1">
                    <PriorityIcon size={12} weight="fill" className="text-gray-400" />
                    {getPlainLabel(insight.priority, language)}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="flex items-center gap-1">
                    <CategoryIcon size={12} weight="regular" className="text-gray-400" />
                    {getPlainLabel(insight.category, language)}
                  </span>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
