import { useState } from 'react';
import { Robot, PaperPlaneTilt, Sparkle, CircleNotch, CheckCircle, Warning } from '@phosphor-icons/react';
import type { AIInsight, FeedbackType, Language } from '../../types';
import { getPlainLabel as getLabel } from '../../lib/labels';

interface AIDemoProps {
  lang: Language;
}

export function AIDemo({ lang }: AIDemoProps) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<FeedbackType>('BUG');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIInsight | null>(null);

  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3333/ai/test-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          type,
          provider: 'MOONSHOT',
          apiKey: 'demo-key',
          model: 'kimi-k1',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      }
    } catch (error) {
      console.error('Demo analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const examples = [
    { text: 'The app crashes when I click the checkout button', type: 'BUG' as const },
    { text: 'It would be great if you could add dark mode', type: 'IDEA' as const },
    { text: 'How do I reset my password?', type: 'OTHER' as const },
  ];

  return (
    <div className="bg-linear-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <Robot size={24} weight="regular" className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Try AI Analysis</h3>
          <p className="text-sm text-gray-500">See how the AI triages feedback in real-time</p>
        </div>
      </div>

      {/* Example Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => {
              setMessage(ex.text);
              setType(ex.type);
            }}
            className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            {ex.text.slice(0, 30)}...
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-3 mb-6">
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as FeedbackType)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="BUG">Bug</option>
            <option value="IDEA">Idea</option>
            <option value="OTHER">Other</option>
          </select>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a feedback message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          />
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !message.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
          >
            {analyzing ? (
              <CircleNotch size={16} weight="regular" className="animate-spin" />
            ) : (
              <PaperPlaneTilt size={16} weight="regular" />
            )}
            Analyze
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl p-5 border border-purple-100 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <Sparkle size={20} weight="regular" className="text-purple-600" />
            <h4 className="font-semibold text-purple-800">AI Analysis Result</h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {/* Type */}
            <div className={`p-3 rounded-lg border ${
              result.suggestedType !== type
                ? 'bg-amber-50 border-amber-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <p className="text-xs text-gray-500 mb-1">Suggested Type</p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">{getLabel(result.suggestedType, lang)}</p>
                {result.suggestedType !== type && (
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <Warning size={12} weight="fill" />
                    Mismatch
                  </span>
                )}
              </div>
            </div>

            {/* Priority */}
            <div className={`p-3 rounded-lg border ${
              result.priority === 'CRITICAL' ? 'bg-red-50 border-red-200' :
              result.priority === 'HIGH' ? 'bg-orange-50 border-orange-200' :
              result.priority === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <p className="text-xs text-gray-500 mb-1">Priority</p>
              <p className="font-medium text-gray-800">{getLabel(result.priority, lang)}</p>
            </div>

            {/* Sentiment */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Sentiment</p>
              <p className="font-medium text-gray-800">{getLabel(result.sentiment, lang)}</p>
            </div>

            {/* Category */}
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
              <p className="text-xs text-gray-500 mb-1">Category</p>
              <p className="font-medium text-gray-800">{getLabel(result.category, lang)}</p>
            </div>
          </div>

          {/* Summary */}
          {result.summary && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Summary</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{result.summary}</p>
            </div>
          )}

          {/* Action Items */}
          {result.actionItems && result.actionItems.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Action Items</p>
              <ul className="space-y-1">
                {result.actionItems.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <CheckCircle size={16} weight="regular" className="text-green-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Response */}
          {result.suggestedResponse && (
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <p className="text-xs text-purple-600 mb-1">AI Suggested Response</p>
              <p className="text-sm text-gray-700">{result.suggestedResponse}</p>
            </div>
          )}

          {/* Confidence */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Detected Language: {result.language.toUpperCase()}</span>
            <span>Confidence: {Math.round(result.confidence * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
