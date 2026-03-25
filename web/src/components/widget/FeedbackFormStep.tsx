import { Camera, Trash, Image, ArrowLeft, CircleNotch } from '@phosphor-icons/react';
import type { FeedbackType, Language, AIInsight } from '../../types';
import { t } from '../../lib/i18n';
import { getPlainLabel } from '../../lib/labels';

interface FeedbackFormStepProps {
  language: Language;
  selectedType: FeedbackType;
  comment: string;
  screenshot: string | null;
  isCapturing: boolean;
  analyzing: boolean;
  onCommentChange: (value: string) => void;
  onScreenshotCapture: () => void;
  onScreenshotRemove: () => void;
  onBack: () => void;
  onSubmit: () => void;
  children?: React.ReactNode; // For AI alerts and panels
}

export function FeedbackFormStep({
  language,
  selectedType,
  comment,
  screenshot,
  isCapturing,
  analyzing,
  onCommentChange,
  onScreenshotCapture,
  onScreenshotRemove,
  onBack,
  onSubmit,
  children,
}: FeedbackFormStepProps) {
  const isSubmitDisabled = analyzing || !comment.trim();

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      className="px-6 py-4 space-y-4"
    >
      {/* Type indicator */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <span>{t('widget.feedback_type', language)}:</span>
        <span className="font-medium text-gray-700">
          {getPlainLabel(selectedType, language)}
        </span>
      </div>

      {/* Comment textarea */}
      <div>
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder={t('widget.comment_placeholder', language)}
          maxLength={5000}
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          aria-label={t('widget.comment_label', language)}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{comment.length}/5000</span>
        </div>
      </div>

      {/* Screenshot */}
      <div>
        {screenshot ? (
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img 
              src={screenshot} 
              alt={t('widget.screenshot_preview', language)}
              className="w-full h-32 object-cover"
            />
            <button
              type="button"
              onClick={onScreenshotRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              aria-label={t('widget.remove_screenshot', language)}
            >
              <Trash size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onScreenshotCapture}
            disabled={isCapturing}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            {isCapturing ? (
              <CircleNotch size={18} className="animate-spin" />
            ) : (
              <Camera size={18} />
            )}
            {t('widget.add_screenshot', language)}
          </button>
        )}
      </div>

      {/* AI Alerts and Panels */}
      {children}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {t('common.back', language)}
        </button>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {analyzing ? (
            <>
              <CircleNotch size={18} className="animate-spin" />
              {t('widget.analyzing', language)}
            </>
          ) : (
            t('widget.send', language)
          )}
        </button>
      </div>
    </form>
  );
}
