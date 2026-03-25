import { useState, useRef, useCallback } from 'react';
import { ChatText, Bug, Lightbulb, ChatCircle, X, Camera, ArrowLeft, CheckCircle, CircleNotch, Trash, Image, Globe, Question, Heart, HandHeart } from '@phosphor-icons/react';
import { toPng } from 'html-to-image';
import type { FeedbackType, Language, AIInsight } from '../types';
import { t, detectLanguage, supportedLanguages } from '../lib/i18n';
import { getPlainLabel } from '../lib/labels';
import { getPriorityIcon, getCategoryIcon } from '../lib/icons';
import { useAppStore } from '../lib/store';
import { useAIConfig, useAISubmit, useAIPreview } from '../hooks/useAIConfig';
import { TypeValidationAlert, TypeMatchBadge } from './ai/TypeValidationAlert';
import { AIDuplicateAlert } from './ai/AIDuplicateAlert';
import { AIInsightsPanel } from './ai/AIInsightsPanel';
import { AIResponseBox } from './ai/AIResponseBox';
import { useDraggableWidget, getPositionClasses } from '../hooks/useDraggableWidget';
import DropZones from './DropZones';

type FormStep = 'type' | 'form' | 'success';

const feedbackTypes: Array<{ type: FeedbackType; icon: typeof Bug; color: string; bg: string }> = [
  { type: 'BUG', icon: Bug, color: 'text-red-500', bg: 'bg-red-50 hover:bg-red-100' },
  { type: 'IDEA', icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-50 hover:bg-yellow-100' },
  { type: 'HELP', icon: HandHeart, color: 'text-orange-500', bg: 'bg-orange-50 hover:bg-orange-100' },
  { type: 'PRAISE', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50 hover:bg-pink-100' },
  { type: 'QUESTION', icon: Question, color: 'text-purple-500', bg: 'bg-purple-50 hover:bg-purple-100' },
  { type: 'OTHER', icon: ChatCircle, color: 'text-blue-500', bg: 'bg-blue-50 hover:bg-blue-100' },
];

export default function FeedbackWidget() {
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<FormStep>('type');
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [comment, setComment] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [justDragged, setJustDragged] = useState(false);

  // Global State (Zustand)
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const widgetPosition = useAppStore((state) => state.widgetPosition);
  const setWidgetPosition = useAppStore((state) => state.setWidgetPosition);

  // AI State
  const { config, isEnabled } = useAIConfig();
  const { submitFeedback, analyzing, insight, error, resetInsight } = useAISubmit();
  const { previewing, preview, runNow, resetPreview } = useAIPreview();
  // true once the user has seen the type-mismatch alert and clicked "Send anyway"
  const [triageConfirmed, setTriageConfirmed] = useState(false);
  const [submittedFeedbackId, setSubmittedFeedbackId] = useState<string | null>(null);
  const [triageError, setTriageError] = useState<string | null>(null);

  const widgetRef = useRef<HTMLDivElement>(null);

  // Draggable Widget Hook
  const {
    buttonRef,
    dragState,
    currentPosition,
    isDragging,
    draggedPosition,
    hoverPosition,
    handleMouseDown
  } = useDraggableWidget({
    position: widgetPosition,
    onPositionChange: setWidgetPosition,
    isOpen
  });

  const handleOpen = useCallback(() => {
    // Don't open if we just finished dragging
    if (justDragged || isDragging || dragState === 'dragging') {
      return;
    }

    setIsOpen(true);
    setStep('type');
    setSelectedType(null);
    setComment('');
    setScreenshot(null);
    setCaptureError(null);
    resetInsight();
    resetPreview();
    setTriageConfirmed(false);
    setTriageError(null);
    setSubmittedFeedbackId(null);
  }, [justDragged, isDragging, dragState, resetInsight, resetPreview]);

  // Track when drag ends to prevent click
  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    if (isDragging || dragState === 'dragging' || justDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    handleOpen();
  }, [isDragging, dragState, justDragged, handleOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleTypeSelect = (type: FeedbackType) => {
    setSelectedType(type);
    setStep('form');
  };

  const handleTypeChange = (newType: FeedbackType) => {
    setSelectedType(newType);
    resetInsight();
    resetPreview();
    // Reset triage confirmation when type changes (for type mismatch flow)
    setTriageConfirmed(false);
  };

  const handleBack = () => {
    setStep('type');
    setSelectedType(null);
    resetInsight();
    resetPreview();
    setTriageConfirmed(false);
  };

  const captureScreenshot = useCallback(async () => {
    setIsCapturing(true);
    setCaptureError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      if (widgetRef.current) {
        widgetRef.current.style.visibility = 'hidden';
      }

      const dataUrl = await toPng(document.documentElement, {
        quality: 0.8,
        pixelRatio: 1,
        cacheBust: true,
      });

      if (widgetRef.current) {
        widgetRef.current.style.visibility = 'visible';
      }

      if (dataUrl && dataUrl.startsWith('data:image/png')) {
        setScreenshot(dataUrl);
      } else {
        throw new Error('Invalid screenshot');
      }
    } catch (error) {
      console.error('Screenshot error:', error);
      if (widgetRef.current) {
        widgetRef.current.style.visibility = 'visible';
      }
      setCaptureError(t('error.capture_failed', language));
      setTimeout(() => setCaptureError(null), 4000);
    } finally {
      setIsCapturing(false);
    }
  }, [language]);

  const removeScreenshot = () => {
    setScreenshot(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !comment.trim()) return;
    setTriageError(null);

    // --- AI Triage Gate ---
    if (isEnabled && comment.trim().length >= 10) {
      let activePreview: typeof preview = preview;
      try {
        if (!activePreview) {
          activePreview = await runNow(comment.trim(), selectedType);
        }
      } catch {
        // Server error (500 etc.) — block submission and show error
        setTriageError(t('error.ai_analysis_failed', language));
        return;
      }

      // STRICT: Block irrelevant messages completely (no override)
      if (activePreview && activePreview.isRelevant === false) {
        return;
      }

      // Allow type mismatch to be corrected (user can change type)
      const hasMismatch =
        activePreview?.typeValidation &&
        !activePreview.typeValidation.isCorrect;

      if (hasMismatch && !triageConfirmed) {
        return;
      }
    }
    // ----------------------

    const detectedLang = detectLanguage(comment);

    const result = await submitFeedback({
      type: selectedType,
      comment: comment.trim(),
      screenshot,
      language: detectedLang,
      uiLanguage: language,
    });

    if (result.success) {
      setSubmittedFeedbackId(result.data?.id || null);
      setStep('success');
      // Widget stays open for user to rate the AI response
    }
  };

  const getHeaderTitle = () => {
    if (step === 'type') return t('widget.title', language);
    if (step === 'form') return selectedType ? getPlainLabel(selectedType, language) : '';
    return t('widget.thank_you', language);
  };

  // Determine widget panel position based on button position
  const getPanelPositionClass = () => {
    switch (currentPosition) {
      case 'bottom-right':
        return 'bottom-20 right-0';
      case 'bottom-left':
        return 'bottom-20 left-0';
      case 'top-right':
        return 'top-18 right-0';
      case 'top-left':
        return 'top-18 left-0';
      default:
        return 'bottom-20 right-0';
    }
  };

  // Check if panel should animate from bottom or top
  const getPanelAnimation = () => {
    if (currentPosition.includes('bottom')) {
      return 'animate-slideInUp';
    }
    return 'animate-slideInDown';
  };

  // Get button styles during drag
  const getButtonStyles = (): React.CSSProperties => {
    if (isDragging && draggedPosition) {
      return {
        position: 'fixed',
        left: draggedPosition.x,
        top: draggedPosition.y,
        zIndex: 100,
        transition: 'none',
      };
    }
    return {};
  };

  // Get container classes
  const getContainerClasses = () => {
    return `${getPositionClasses(currentPosition)} z-50 font-sans`;
  };

  return (
    <>
      {/* Drop Zones Overlay */}
      <DropZones
        isVisible={isDragging}
        currentPosition={currentPosition}
        hoverPosition={hoverPosition}
      />

      <div ref={widgetRef} className={getContainerClasses()}>
        {/* Floating Button */}
        {!isOpen && (
          <button
            ref={buttonRef}
            onMouseDown={handleMouseDown}
            onClick={handleButtonClick}
            style={getButtonStyles()}
            className={`
              flex items-center justify-center w-14 h-14
              bg-brand-500 hover:bg-brand-400
              text-white rounded-full shadow-lg
              ${isDragging
                ? 'shadow-2xl scale-110 cursor-grabbing ring-4 ring-purple-400/50'
                : 'hover:shadow-xl hover:scale-110 cursor-grab'
              }
              transition-all duration-200
              select-none
            `}
            aria-label="Open feedback"
            title={isDragging ? 'Drop in a highlighted zone' : 'Click to open, drag to move'}
          >
            {/* Inner icon */}
            <ChatText size={24} weight="regular" className="pointer-events-none" />

            {/* Ripple effect when dragging */}
            {isDragging && (
              <>
                <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                <span className="absolute -inset-2 rounded-full border-2 border-purple-400/30 animate-pulse" />
              </>
            )}
          </button>
        )}

        {/* Widget Panel */}
        {isOpen && (
          <div className={`
            ${getPanelAnimation()}
            w-100 max-h-[85vh] overflow-y-auto
            bg-white rounded-2xl shadow-2xl overflow-hidden
            absolute ${getPanelPositionClass()}
          `}>
            {/* Header */}
            <div className="bg-brand-500 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              {step === 'form' ? (
                <button
                  onClick={handleBack}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowLeft size={20} weight="regular" />
                </button>
              ) : (
                <div className="w-7" />
              )}
              <span className="font-semibold text-lg">{getHeaderTitle()}</span>

              <div className="flex items-center gap-2">
                {/* Language Selector */}
                {step === 'type' && (
                  <div className={`relative ${currentPosition.startsWith('top-') ? 'mt-4' : ''}`}>
                    <button
                      onClick={() => setShowLangMenu(!showLangMenu)}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Globe size={16} weight="regular" />
                    </button>

                    {showLangMenu && (
                      <div className={`absolute right-0 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20 animate-fadeIn ${currentPosition.startsWith('top-') ? 'top-full mt-4' : 'top-full mt-2'}`}>
                        {supportedLanguages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code);
                              setShowLangMenu(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                              language === lang.code ? 'text-purple-600 bg-purple-50' : 'text-gray-700'
                            }`}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="flex-1 text-left">{lang.name}</span>
                            {language === lang.code && <CheckCircle size={16} weight="regular" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={20} weight="regular" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Step 1: Select Type */}
              {step === 'type' && (
                <div className="space-y-3 animate-fadeIn">
                  <p className="text-gray-600 text-center">{t('widget.subtitle', language)}</p>

                  {feedbackTypes.map(({ type, icon: Icon, color, bg }) => (
                    <button
                      key={type}
                      onClick={() => handleTypeSelect(type)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl ${bg} transition-all duration-200 group cursor-pointer`}
                    >
                      <Icon size={24} weight="regular" className={color} />
                      <span className="font-medium text-gray-700 group-hover:text-gray-900 flex-1 text-left">
                        {getPlainLabel(type, language)}
                      </span>
                      <ArrowLeft size={16} weight="regular" className="rotate-180 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Form */}
              {step === 'form' && selectedType && (
                <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
                  <textarea
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      // reset triage result when user edits the message
                      if (preview) {
                        resetPreview();
                        setTriageConfirmed(false);
                      }
                      if (triageError) setTriageError(null);
                    }}
                    placeholder={t('widget.placeholder', language)}
                    className="w-full h-32 p-4 bg-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-gray-700 placeholder-gray-500"
                    required
                    maxLength={1000}
                  />

                  {/* Determine active insight: prefer post-submit, fall back to preview */}
                  {(() => {
                    const activeInsight = insight ?? preview;
                    return (
                      <>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{comment.length}/1000</span>
                          {previewing && (
                            <span className="flex items-center gap-1 text-purple-500">
                              <CircleNotch size={12} weight="regular" className="animate-spin" />
                              {t('widget.analyzing', language)}
                            </span>
                          )}
                          {!previewing && isEnabled && activeInsight?.analyzed && (
                            <TypeMatchBadge insight={activeInsight} currentType={selectedType} lang={language} />
                          )}
                        </div>

                        {/* Guardrail: irrelevant message - STRICT BLOCKING */}
                        {isEnabled && activeInsight?.analyzed && activeInsight.isRelevant === false && (
                          <div className="rounded-xl border border-red-200 bg-red-50/80 p-4 animate-fadeIn">
                            <div className="flex items-start gap-3">
                              <span className="text-xl shrink-0">🚫</span>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-red-800 mb-1">
                                  {t('widget.irrelevant_title', language)}
                                </p>
                                <p className="text-sm text-red-700">
                                  {activeInsight.translatedResponse || activeInsight.suggestedResponse || t('widget.irrelevant_message', language)}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setComment('');
                                    resetPreview();
                                  }}
                                  className="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                  {t('widget.try_again', language)}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* AI Type Validation */}
                        {isEnabled && activeInsight?.typeValidation && !activeInsight.typeValidation.isCorrect && !triageConfirmed && activeInsight.isRelevant !== false && (
                          <TypeValidationAlert
                            insight={activeInsight}
                            currentType={selectedType}
                            onTypeChange={handleTypeChange}
                            lang={language}
                          />
                        )}

                        {/* AI Duplicate Alert */}
                        {isEnabled && activeInsight?.isDuplicate && (
                          <AIDuplicateAlert insight={activeInsight} lang={language} />
                        )}
                      </>
                    );
                  })()}

                  {/* Screenshot Section */}
                  <div className="space-y-2">
                    {captureError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                        <X size={16} weight="regular" className="shrink-0" />
                        <span>{captureError}</span>
                      </div>
                    )}

                    {screenshot ? (
                      <div className="relative rounded-xl overflow-hidden border-2 border-brand-500/20 bg-gray-50">
                        <div className="relative">
                          <img src={screenshot} alt="Screenshot" className="w-full h-32 object-cover object-top" />
                          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <Image size={16} weight="regular" className="text-brand-500" />
                            <span className="text-sm text-gray-600">{t('widget.screenshot_attached', language)}</span>
                          </div>
                          <button
                            type="button"
                            onClick={removeScreenshot}
                            className="flex items-center gap-1 px-2 py-1 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash size={16} weight="regular" />
                            {t('widget.remove_screenshot', language)}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={captureScreenshot}
                        disabled={isCapturing}
                        className="w-full flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 hover:border-brand-500 hover:bg-brand-500/5 rounded-xl transition-all duration-200 disabled:opacity-50 cursor-pointer group"
                      >
                        {isCapturing ? (
                          <>
                            <CircleNotch size={24} weight="regular" className="animate-spin text-brand-500" />
                            <span className="text-brand-500 font-medium">{t('widget.capturing', language)}</span>
                          </>
                        ) : (
                          <>
                            <Camera size={24} weight="regular" className="text-gray-400 group-hover:text-brand-500 transition-colors" />
                            <span className="text-gray-600 group-hover:text-brand-500 font-medium transition-colors">
                              {t('widget.attach_screenshot', language)}
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* AI Insights Panel */}
                  {analyzing && (
                    <div className="flex items-center justify-center gap-2 p-4 bg-purple-50 rounded-xl">
                      <CircleNotch size={20} weight="regular" className="animate-spin text-brand-500" />
                      <span className="text-brand-500 font-medium">{t('widget.analyzing', language)}</span>
                    </div>
                  )}

                  {isEnabled && (insight ?? preview)?.analyzed && !analyzing && !previewing && (
                    <AIInsightsPanel insight={(insight ?? preview)!} lang={language} />
                  )}

                  {/* Submit Button */}
                  {(() => {
                    // Use preview (real-time) for pre-submission validation
                    const isIrrelevant = preview?.isRelevant === false;
                    const isMismatch = preview?.typeValidation && !preview.typeValidation.isCorrect && !triageConfirmed && preview.isRelevant !== false;
                    const isTriageBlocked = isEnabled && (isIrrelevant || isMismatch);
                    
                    return (
                      <button
                        type="submit"
                        disabled={analyzing || previewing || !comment.trim() || isTriageBlocked}
                        className="w-full py-3 bg-brand-500 hover:bg-brand-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {analyzing || previewing ? (
                          <>
                            <CircleNotch size={20} weight="regular" className="animate-spin" />
                            {previewing ? t('widget.analyzing', language) : t('widget.sending', language)}
                          </>
                        ) : (
                          isIrrelevant ? t('widget.not_related', language) || 'Not related to our platform' :
                          isMismatch ? t('widget.review_type_first', language) || 'Review type first' :
                          t('widget.send', language)
                        )}
                      </button>
                    );
                  })()}

                  {triageError && (
                    <p className="text-sm text-red-600 text-center">{triageError}</p>
                  )}

                  {error && (
                    <p className="text-sm text-red-600 text-center">{t('error.submit_failed', language)}</p>
                  )}
                </form>
              )}

              {/* Step 3: Success */}
              {step === 'success' && (
                <div className="text-center py-8 animate-fadeIn space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} weight="regular" className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('widget.thank_you', language)}</h3>
                    <p className="text-gray-600">{t('widget.thank_you_message', language)}</p>
                  </div>

                  {/* AI Response - Now available for rating after submit */}
                  {isEnabled && insight?.suggestedResponse && (
                    <div className="mt-4 px-4">
                      <AIResponseBox
                        insight={insight}
                        userComment={comment}
                        lang={language}
                        feedbackId={submittedFeedbackId}
                      />
                    </div>
                  )}

                  {/* AI Analysis Summary - Minimal */}
                  {isEnabled && insight?.analyzed && (
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
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 text-center text-xs">
              {isEnabled && config ? (
                <span className="text-purple-600">Powered by Feedback Widget AI</span>
              ) : (
                <span className="text-gray-500">{t('widget.powered_by', language)}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
