import { Bug, Lightbulb, ChatCircle, Question, Heart, HandHeart } from '@phosphor-icons/react';
import type { FeedbackType } from '../../types';
import type { Language } from '../../lib/i18n/lang';
import { t } from '../../lib/i18n';

interface TypeSelectionStepProps {
  language: Language;
  onSelect: (type: FeedbackType) => void;
}

const feedbackTypes = [
  { type: 'BUG' as FeedbackType, icon: Bug, color: 'text-red-500', bg: 'bg-red-50 hover:bg-red-100' },
  { type: 'IDEA' as FeedbackType, icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50 hover:bg-yellow-100' },
  { type: 'HELP' as FeedbackType, icon: HandHeart, color: 'text-orange-500', bg: 'bg-orange-50 hover:bg-orange-100' },
  { type: 'PRAISE' as FeedbackType, icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50 hover:bg-pink-100' },
  { type: 'QUESTION' as FeedbackType, icon: Question, color: 'text-purple-500', bg: 'bg-purple-50 hover:bg-purple-100' },
  { type: 'OTHER' as FeedbackType, icon: ChatCircle, color: 'text-blue-500', bg: 'bg-blue-50 hover:bg-blue-100' },
];

export function TypeSelectionStep({ language, onSelect }: TypeSelectionStepProps) {
  return (
    <div className="px-6 py-4">
      <p className="text-gray-600 text-center mb-4">
        {t('widget.select_type', language)}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {feedbackTypes.map(({ type, icon: Icon, color, bg }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl ${bg} transition-all duration-200 group cursor-pointer border-2 border-transparent hover:border-gray-200`}
            aria-label={t(`type.${type}`, language)}
          >
            <Icon size={24} weight="regular" className={color} />
            <span className="font-medium text-gray-700 group-hover:text-gray-900 flex-1 text-left">
              {t(`type.${type}`, language)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
