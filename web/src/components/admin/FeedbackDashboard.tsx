import { useState, useEffect } from 'react';
import {
  Tray,
  Bug,
  Lightbulb,
  ChatCircle,
  HandHeart,
  Heart,
  Question,
  MagnifyingGlass,
  ArrowClockwise,
  Gear,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  CaretLeft,
  CaretRight,
  Sparkle,
  Clock,
  CheckCircle,
  XCircle,
  Faders,
  X,
} from '@phosphor-icons/react';
import type { FeedbackData, FeedbackType, Status } from '../../types';
import { useAppStore } from '../../lib/store';
import { t, supportedLanguages } from '../../lib/i18n';
import { getPlainLabel } from '../../lib/labels';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3333';
const PAGE_SIZE_LS_KEY = 'dashboard_page_size';
const PAGE_SIZE_OPTIONS = [10, 20, 30];

const typeIcons: Record<FeedbackType, any> = {
  BUG: Bug,
  IDEA: Lightbulb,
  OTHER: ChatCircle,
  HELP: HandHeart,
  PRAISE: Heart,
  QUESTION: Question,
};

const statusIcons: Record<Status, any> = {
  PENDING: Clock,
  IN_PROGRESS: Clock,
  RESOLVED: CheckCircle,
  CLOSED: XCircle,
  REJECTED: XCircle,
};

const statusColors: Record<Status, string> = {
  PENDING: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-600 border-blue-200',
  RESOLVED: 'bg-green-50 text-green-600 border-green-200',
  CLOSED: 'bg-gray-50 text-gray-600 border-gray-200',
  REJECTED: 'bg-red-50 text-red-600 border-red-200',
};

const ALL_TYPES: FeedbackType[] = ['BUG', 'IDEA', 'OTHER', 'HELP', 'PRAISE', 'QUESTION'];
const ALL_STATUSES: Status[] = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

export default function FeedbackDashboard() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<FeedbackType | 'ALL'>('ALL');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
    const saved = localStorage.getItem(PAGE_SIZE_LS_KEY);
    if (saved) {
      const n = parseInt(saved, 10);
      if (PAGE_SIZE_OPTIONS.includes(n)) setPageSize(n);
    }
  }, []);

  useEffect(() => { setPage(1); }, [search, pageSize, statusFilter, typeFilter]);

  const handlePageSize = (n: number) => {
    setPageSize(n);
    localStorage.setItem(PAGE_SIZE_LS_KEY, String(n));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/feedbacks`);
      const data = await res.json();
      if (data.success) setFeedbacks(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (id: string, status: Status) => {
    try {
      setUpdating(true);
      const res = await fetch(`${API_URL}/feedbacks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status } : f));
        if (selectedFeedback?.id === id) {
          setSelectedFeedback({ ...selectedFeedback, status });
        }
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    } finally {
      setUpdating(false);
    }
  };

  const updateFeedbackType = async (id: string, type: FeedbackType) => {
    try {
      setUpdating(true);
      const res = await fetch(`${API_URL}/feedbacks/${id}/type`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, type } : f));
        if (selectedFeedback?.id === id) {
          setSelectedFeedback({ ...selectedFeedback, type });
        }
      }
    } catch (e) {
      console.error('Failed to update type:', e);
    } finally {
      setUpdating(false);
    }
  };

  // Apply filters
  let filtered = feedbacks.filter(f =>
    f.comment.toLowerCase().includes(search.toLowerCase()) ||
    (f.aiSummary || '').toLowerCase().includes(search.toLowerCase())
  );
  
  if (statusFilter !== 'ALL') {
    filtered = filtered.filter(f => f.status === statusFilter);
  }
  if (typeFilter !== 'ALL') {
    filtered = filtered.filter(f => f.type === typeFilter);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Stats calculations
  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'PENDING').length,
    resolved: feedbacks.filter(f => f.status === 'RESOLVED').length,
    rejected: feedbacks.filter(f => f.status === 'REJECTED').length,
  };

  const typeStats = ALL_TYPES.map(type => ({
    type,
    count: feedbacks.filter(f => f.type === type).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <a href="/" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                <ArrowLeft size={18} />
              </a>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                  <Tray size={16} weight="bold" className="text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-gray-900 leading-tight">{t('dashboard.title', language)}</h1>
                  <p className="text-[11px] text-gray-400 leading-tight">{t('dashboard.subtitle', language)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchData}
                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <ArrowClockwise size={17} className={loading ? 'animate-spin' : ''} />
              </button>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none"
              >
                {supportedLanguages.map(l => (
                  <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                ))}
              </select>

              <a
                href="/settings"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-xs font-medium hover:bg-violet-100 transition-colors"
              >
                <Gear size={14} weight="bold" />
                {t('settings.title', language)}
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`bg-white rounded-xl border p-4 shadow-sm text-left transition-all ${
              statusFilter === 'ALL' ? 'border-violet-500 ring-2 ring-violet-100' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center mb-2">
              <Tray size={16} className="text-violet-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-[11px] text-gray-400">{t('stats.total', language)}</p>
          </button>

          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`bg-white rounded-xl border p-4 shadow-sm text-left transition-all ${
              statusFilter === 'PENDING' ? 'border-yellow-500 ring-2 ring-yellow-100' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center mb-2">
              <Clock size={16} className="text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            <p className="text-[11px] text-gray-400">{t('status.PENDING', language)}</p>
          </button>

          <button
            onClick={() => setStatusFilter('RESOLVED')}
            className={`bg-white rounded-xl border p-4 shadow-sm text-left transition-all ${
              statusFilter === 'RESOLVED' ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mb-2">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            <p className="text-[11px] text-gray-400">{t('status.RESOLVED', language)}</p>
          </button>

          <button
            onClick={() => setStatusFilter('REJECTED')}
            className={`bg-white rounded-xl border p-4 shadow-sm text-left transition-all ${
              statusFilter === 'REJECTED' ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mb-2">
              <XCircle size={16} className="text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            <p className="text-[11px] text-gray-400">{t('status.REJECTED', language)}</p>
          </button>
        </div>

        {/* Type Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
          {typeStats.map(({ type, count }) => {
            const Icon = typeIcons[type];
            return (
              <button
                key={type}
                onClick={() => setTypeFilter(typeFilter === type ? 'ALL' : type)}
                className={`bg-white rounded-xl border p-3 shadow-sm text-left transition-all ${
                  typeFilter === type ? 'border-violet-500 ring-2 ring-violet-100' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <Icon size={14} weight="regular" className="text-gray-400 mb-1" />
                <p className="text-lg font-bold text-gray-900">{count}</p>
                <p className="text-[10px] text-gray-400 truncate">{getPlainLabel(type, language)}</p>
              </button>
            );
          })}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-50">
            <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('filter.search_placeholder', language)}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'ALL')}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-700"
          >
            <option value="ALL">{t('filter.all_statuses', language) || 'All Statuses'}</option>
            {ALL_STATUSES.map(s => (
              <option key={s} value={s}>{t(`status.${s}`, language)}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as FeedbackType | 'ALL')}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-700"
          >
            <option value="ALL">{t('filter.all_types', language) || 'All Types'}</option>
            {ALL_TYPES.map(t => (
              <option key={t} value={t}>{getPlainLabel(t, language)}</option>
            ))}
          </select>

          <select
            value={pageSize}
            onChange={(e) => handlePageSize(Number(e.target.value))}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 text-gray-700"
          >
            {PAGE_SIZE_OPTIONS.map(n => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="space-y-2">
          {paginated.map((feedback) => {
            const Icon = typeIcons[feedback.type] || ChatCircle;
            const StatusIcon = statusIcons[feedback.status] || Clock;
            return (
              <div
                key={feedback.id}
                onClick={() => setSelectedFeedback(feedback)}
                className="bg-white px-5 py-4 rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <Icon size={18} weight="regular" className="text-gray-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {feedback.aiSummary || feedback.comment.slice(0, 100)}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {feedback.comment}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${statusColors[feedback.status]}`}>
                          {t(`status.${feedback.status}`, language)}
                        </span>
                        {feedback.rating === 'POSITIVE' && (
                          <span className="p-1 rounded-md bg-emerald-50 text-emerald-500" title="Rated helpful">
                            <ThumbsUp size={13} weight="fill" />
                          </span>
                        )}
                        {feedback.rating === 'NEGATIVE' && (
                          <span className="p-1 rounded-md bg-red-50 text-red-400" title={feedback.ratingNote || 'Rated not helpful'}>
                            <ThumbsDown size={13} weight="fill" />
                          </span>
                        )}
                        {feedback.aiAnalyzed && (
                          <span className="p-1 rounded-md bg-violet-50 text-violet-500" title="AI analysed">
                            <Sparkle size={13} weight="fill" />
                          </span>
                        )}
                      </div>
                    </div>

                    {feedback.rating === 'NEGATIVE' && feedback.ratingNote && (
                      <p className="text-[11px] text-red-400 mt-1 italic">"{feedback.ratingNote}"</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {feedback.aiPriority && (
                        <span className={`px-1.5 py-0.5 text-[11px] font-medium rounded ${
                          feedback.aiPriority === 'CRITICAL' ? 'bg-red-50 text-red-600' :
                          feedback.aiPriority === 'HIGH'     ? 'bg-orange-50 text-orange-600' :
                          feedback.aiPriority === 'MEDIUM'   ? 'bg-yellow-50 text-yellow-600' :
                                                               'bg-green-50 text-green-600'
                        }`}>
                          {feedback.aiPriority}
                        </span>
                      )}
                      {feedback.aiSentiment && (
                        <span className="text-[11px] text-gray-400">{feedback.aiSentiment}</span>
                      )}
                      <span className="text-[11px] text-gray-300 ml-auto">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Tray size={40} className="text-gray-300" />
            </div>
            <p className="text-base font-medium text-gray-600 mb-1">
              {statusFilter !== 'ALL' || typeFilter !== 'ALL' || search
                ? t('feedback.no_feedbacks_filter', language) || 'No feedbacks match your filters'
                : t('feedback.no_feedbacks', language)}
            </p>
            <p className="text-sm text-gray-400 text-center max-w-sm">
              {statusFilter !== 'ALL' || typeFilter !== 'ALL' || search
                ? t('feedback.try_different_filter', language) || 'Try adjusting your filters to see more results'
                : t('feedback.no_feedbacks_desc', language) || 'When users submit feedback, they will appear here'}
            </p>
            {(statusFilter !== 'ALL' || typeFilter !== 'ALL' || search) && (
              <button
                onClick={() => {
                  setStatusFilter('ALL');
                  setTypeFilter('ALL');
                  setSearch('');
                }}
                className="mt-4 px-4 py-2 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium hover:bg-violet-100 transition-colors"
              >
                {t('feedback.clear_filters', language) || 'Clear all filters'}
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between mt-5">
            <p className="text-xs text-gray-400">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 transition-colors"
              >
                <CaretLeft size={16} weight="bold" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === '…' ? (
                    <span key={`e${idx}`} className="w-8 text-center text-xs text-gray-300">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        page === p ? 'bg-violet-600 text-white' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 transition-colors"
              >
                <CaretRight size={16} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{t('feedback.detail_title', language) || 'Feedback Details'}</h2>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Type Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('feedback.type', language)}</label>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_TYPES.map(type => {
                    const Icon = typeIcons[type];
                    const isSelected = selectedFeedback.type === type;
                    return (
                      <button
                        key={type}
                        onClick={() => updateFeedbackType(selectedFeedback.id, type)}
                        disabled={updating}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                          isSelected
                            ? 'border-violet-500 bg-violet-50 text-violet-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <Icon size={16} weight={isSelected ? 'fill' : 'regular'} />
                        {getPlainLabel(type, language)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('feedback.status', language)}</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_STATUSES.map(status => {
                    const Icon = statusIcons[status];
                    const isSelected = selectedFeedback.status === status;
                    return (
                      <button
                        key={status}
                        onClick={() => updateFeedbackStatus(selectedFeedback.id, status)}
                        disabled={updating}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                          isSelected
                            ? statusColors[status].replace('bg-', 'bg-opacity-20 bg-')
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <Icon size={16} weight={isSelected ? 'fill' : 'regular'} />
                        {t(`status.${status}`, language)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('feedback.comment', language) || 'Comment'}</label>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedFeedback.comment}</p>
              </div>

              {/* AI Analysis */}
              {selectedFeedback.aiAnalyzed && (
                <div className="bg-violet-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-violet-900 mb-2 flex items-center gap-2">
                    <Sparkle size={16} />
                    {t('detail.ai_analysis', language)}
                  </h3>
                  {selectedFeedback.aiSummary && (
                    <p className="text-sm text-violet-800 mb-2">{selectedFeedback.aiSummary}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {selectedFeedback.aiPriority && (
                      <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-white/50 text-violet-700">
                        {selectedFeedback.aiPriority}
                      </span>
                    )}
                    {selectedFeedback.aiCategory && (
                      <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-white/50 text-violet-700">
                        {selectedFeedback.aiCategory}
                      </span>
                    )}
                    {selectedFeedback.aiSentiment && (
                      <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-white/50 text-violet-700">
                        {selectedFeedback.aiSentiment}
                      </span>
                    )}
                  </div>
                  {selectedFeedback.aiSuggestedType && selectedFeedback.aiSuggestedType !== selectedFeedback.type && (
                    <p className="text-xs text-violet-600 mt-2">
                      {t('widget.type_mismatch_desc', language)?.replace('{{suggested}}', getPlainLabel(selectedFeedback.aiSuggestedType as FeedbackType, language))?.replace('{{current}}', getPlainLabel(selectedFeedback.type, language))}
                    </p>
                  )}
                </div>
              )}

              {/* Metadata */}
              <div className="text-xs text-gray-400 pt-4 border-t border-gray-100">
                <p>ID: {selectedFeedback.id}</p>
                <p>{t('feedback.created_at', language)}: {new Date(selectedFeedback.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
