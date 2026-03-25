import { useState } from 'react';
import { Sparkle, Users, FileText, CheckSquare, X } from '@phosphor-icons/react';
import type { AIInsight, Language } from '../../types';
import { t } from '../../lib/i18n';
import { getPlainLabel } from '../../lib/labels';
import { getSentimentIcon, getPriorityIcon, getCategoryIcon, getTypeIcon } from '../../lib/icons';

type TabType = 'overview' | 'details' | 'actions';

interface AIInsightsPanelProps {
  insight: AIInsight;
  lang: Language;
  onClose?: () => void;
}

// Priority config with icon size
const PriorityDisplay = ({ priority, className }: { priority: string; className?: string }) => {
  const PriorityIcon = getPriorityIcon(priority);
  return <PriorityIcon size={24} weight="fill" className={className} />;
};

export function AIInsightsPanel({ insight, lang, onClose }: AIInsightsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  if (!insight.analyzed) return null;

  // Minimalist gray scale styling
  const priorityStyles: Record<string, { bg: string; border: string; iconColor: string }> = {
    CRITICAL: { bg: 'bg-gray-100', border: 'border-gray-300', iconColor: 'text-gray-700' },
    HIGH: { bg: 'bg-gray-50', border: 'border-gray-200', iconColor: 'text-gray-600' },
    MEDIUM: { bg: 'bg-gray-50', border: 'border-gray-200', iconColor: 'text-gray-500' },
    LOW: { bg: 'bg-gray-50', border: 'border-gray-200', iconColor: 'text-gray-400' },
  };

  const priority = priorityStyles[insight.priority] || priorityStyles.MEDIUM;
  const SentimentIcon = getSentimentIcon(insight.sentiment);
  const CategoryIcon = getCategoryIcon(insight.category);
  const TypeIcon = getTypeIcon(insight.suggestedType);

  const hasDetails = insight.summary || (insight.actionItems && insight.actionItems.length > 0);
  const hasActions = insight.actionItems && insight.actionItems.length > 0;

  return (
    <div className="rounded-xl border border-purple-100 bg-linear-to-br from-purple-50/50 to-indigo-50/30 animate-fadeIn overflow-hidden">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-purple-100/50 border-b border-purple-100">
        <div className="flex items-center gap-2">
          <Sparkle size={16} weight="fill" className="text-purple-600" />
          <span className="font-semibold text-sm text-purple-800">AI Analysis</span>
          <span className="text-xs text-purple-500">
            {Math.round(insight.confidence * 100)}% confidence
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-purple-200/50 rounded">
            <X size={14} className="text-purple-600" />
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-purple-100/50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
            activeTab === 'overview' 
              ? 'bg-purple-100/50 text-purple-700 border-b-2 border-purple-500' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-purple-50/30'
          }`}
        >
          Overview
        </button>
        {hasDetails && (
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'details' 
                ? 'bg-purple-100/50 text-purple-700 border-b-2 border-purple-500' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-purple-50/30'
            }`}
          >
            Details
          </button>
        )}
        {hasActions && (
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'actions' 
                ? 'bg-purple-100/50 text-purple-700 border-b-2 border-purple-500' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-purple-50/30'
            }`}
          >
            Actions ({insight.actionItems?.length})
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="p-3">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-2">
            {/* Priority - Icon + Label */}
            <div className={`px-2 py-2 rounded-lg border ${priority.bg} ${priority.border} text-center`}>
              <div className={`mx-auto mb-1 ${priority.iconColor}`}>
                <PriorityDisplay priority={insight.priority} />
              </div>
              <p className="text-[10px] uppercase text-gray-500">{t('feedback.priority', lang)}</p>
              <p className="font-semibold text-xs text-gray-700">{getPlainLabel(insight.priority, lang)}</p>
            </div>

            {/* Sentiment - Icon Only */}
            <div className="bg-white/60 px-2 py-2 rounded-lg border border-gray-100 text-center">
              <SentimentIcon size={24} weight="regular" className="mx-auto mb-1 text-gray-400" />
              <p className="font-semibold text-xs text-gray-600">{getPlainLabel(insight.sentiment, lang)}</p>
            </div>

            {/* Category - Icon + Label */}
            <div className="bg-white/60 px-2 py-2 rounded-lg border border-gray-100 text-center">
              <CategoryIcon size={22} weight="regular" className="mx-auto mb-1 text-gray-400" />
              <p className="font-semibold text-xs text-gray-600 wrap-break-word">{getPlainLabel(insight.category, lang)}</p>
            </div>

            {/* Type or Team - Icon + Label */}
            {insight.team ? (
              <div className="bg-white/60 px-2 py-2 rounded-lg border border-gray-100 text-center">
                <Users size={22} weight="regular" className="mx-auto mb-1 text-gray-400" />
                <p className="font-semibold text-xs text-gray-600 wrap-break-word">{getPlainLabel(insight.team, lang)}</p>
              </div>
            ) : (
              <div className="bg-white/60 px-2 py-2 rounded-lg border border-gray-100 text-center">
                <TypeIcon size={22} weight="regular" className="mx-auto mb-1 text-gray-400" />
                <p className="font-semibold text-xs text-gray-600">{getPlainLabel(insight.suggestedType, lang)}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && insight.summary && (
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <FileText size={14} weight="regular" className="text-gray-400" />
                <p className="text-xs font-medium text-gray-600">Summary</p>
              </div>
              <p className="text-sm text-gray-700 bg-white/60 px-3 py-2 rounded-lg border border-gray-100 leading-relaxed wrap-break-word">
                {insight.summary}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'actions' && hasActions && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <CheckSquare size={14} weight="regular" className="text-gray-400" />
              <p className="text-xs font-medium text-gray-600">Suggested Actions</p>
            </div>
            <ul className="space-y-1.5">
              {insight.actionItems?.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span className="bg-white/60 px-2 py-1 rounded flex-1 text-sm wrap-break-word">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
