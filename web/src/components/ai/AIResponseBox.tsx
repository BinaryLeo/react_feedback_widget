import { Robot, Copy, Check, ThumbsUp, ThumbsDown, CaretDown, CaretUp, Translate } from '@phosphor-icons/react';
import { useState } from 'react';
import type { AIInsight, Language } from '../../types';
import { t } from '../../lib/i18n';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3333';

interface AIResponseBoxProps {
  insight: AIInsight;
  userComment: string;
  lang: Language;
  feedbackId?: string | null;
}

export function AIResponseBox({ insight, userComment, lang, feedbackId }: AIResponseBoxProps) {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState<'POSITIVE' | 'NEGATIVE' | null>(null);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [ratingNote, setRatingNote] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showTranslated, setShowTranslated] = useState(true); // Default to translated if available
  const [error, setError] = useState<string | null>(null);

  // Use translated response when available and user prefers it
  const hasTranslation = !!insight.translatedResponse && insight.translatedResponse !== insight.suggestedResponse;
  const displayResponse = (hasTranslation && showTranslated) 
    ? insight.translatedResponse 
    : insight.suggestedResponse;

  if (!insight.suggestedResponse) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayResponse!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitRating = async (value: 'POSITIVE' | 'NEGATIVE', note?: string) => {
    if (!feedbackId) {
      setError('Feedback ID not available');
      return;
    }
    if (submittingRating) return;
    
    setSubmittingRating(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/feedbacks/${feedbackId}/rate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: value, ratingNote: note || null }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      setRating(value);
      setShowNoteInput(false);
    } catch (err) {
      console.error('Rating error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleThumbsUp = () => {
    if (rating) return;
    submitRating('POSITIVE');
  };

  const handleThumbsDown = () => {
    if (rating) return;
    setShowNoteInput(true);
  };

  const handleNoteSubmit = () => {
    submitRating('NEGATIVE', ratingNote.trim() || undefined);
  };

  const responsePreview = displayResponse?.slice(0, 120) || '';
  const hasMore = (displayResponse?.length || 0) > 120;

  return (
    <div className="rounded-xl border border-indigo-200 bg-linear-to-br from-indigo-50/50 to-purple-50/30 overflow-hidden animate-fadeIn">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-indigo-100/50 border-b border-indigo-100">
        <div className="flex items-center gap-2">
          <Robot size={16} weight="fill" className="text-indigo-600" />
          <span className="font-semibold text-sm text-indigo-800">{t('widget.ai_response', lang)}</span>
          {hasTranslation && (
            <button
              onClick={() => setShowTranslated(!showTranslated)}
              className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-full transition-colors"
              title={showTranslated ? 'Show original' : 'Show translated'}
            >
              <Translate size={12} weight="bold" />
              {showTranslated ? 'Translated' : 'Original'}
            </button>
          )}
        </div>
        
        {/* Rating buttons - styled to fit UI */}
        <div className="flex items-center gap-1">
          {!rating && feedbackId && (
            <>
              <button
                onClick={handleThumbsUp}
                disabled={submittingRating}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors disabled:opacity-50"
                title="Helpful"
              >
                <ThumbsUp size={12} weight="bold" />
                Helpful
              </button>
              <button
                onClick={handleThumbsDown}
                disabled={submittingRating}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                title="Not helpful"
              >
                <ThumbsDown size={12} weight="bold" />
                Not helpful
              </button>
            </>
          )}
          {rating && (
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
              rating === 'POSITIVE' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {rating === 'POSITIVE' ? '✓ Helpful' : 'Noted'}
            </span>
          )}
          {!feedbackId && !rating && (
            <span className="text-xs text-gray-400">Rate after submit</span>
          )}
        </div>
      </div>

      {/* Response Content */}
      <div className="p-3">
        <div className="bg-white rounded-lg px-3 py-2.5 shadow-sm border border-indigo-100">
          <p className="text-sm text-gray-700 leading-relaxed wrap-break-word">
            {expanded ? displayResponse : responsePreview}
            {!expanded && hasMore && '...'}
          </p>
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-indigo-600 hover:text-indigo-700 mt-2 flex items-center gap-0.5 font-medium"
            >
              {expanded ? (
                <><CaretUp size={12} weight="bold" /> Show less</>
              ) : (
                <><CaretDown size={12} weight="bold" /> Read more</>
              )}
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            Error: {error}
          </div>
        )}

        {/* Negative rating note input */}
        {showNoteInput && !rating && (
          <div className="mt-3 space-y-2 animate-fadeIn p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 font-medium">What could be improved?</p>
            <textarea
              value={ratingNote}
              onChange={(e) => setRatingNote(e.target.value)}
              placeholder="Optional feedback..."
              maxLength={500}
              rows={2}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleNoteSubmit}
                disabled={submittingRating}
                className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {submittingRating ? 'Sending...' : 'Submit'}
              </button>
              <button
                onClick={() => setShowNoteInput(false)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Copy Action */}
      <div className="px-3 py-2 bg-indigo-50/30 border-t border-indigo-100 flex justify-end">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors shadow-sm"
        >
          {copied ? (
            <>
              <Check size={14} weight="bold" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={14} weight="regular" />
              Copy response
            </>
          )}
        </button>
      </div>
    </div>
  );
}
