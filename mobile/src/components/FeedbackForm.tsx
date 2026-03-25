import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle,
  Bug,
  Lightbulb,
  ChatCircleDots,
  Lifebuoy,
  Heart,
  Question,
  Warning,
  Globe,
} from 'phosphor-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import type { FeedbackType, Language, AIAnalysis } from '../types';
import { colors } from '../theme/colors';
import { useAISubmit } from '../hooks/useAI';
import { aiService } from '../services/api';
import { useAppStore } from '../store';
import { t, detectLanguage } from '../i18n';
import { FeedbackTypeButton } from './FeedbackTypeButton';
import { ScreenshotButton } from './ScreenshotButton';
import { TypeValidationAlert, DuplicateAlert, AIInsightsPanel, AIResponseBox } from './ai';
import * as ImagePicker from 'expo-image-picker';

const feedbackTypes: Array<{
  type: FeedbackType;
  icon: typeof Bug;
}> = [
  { type: 'BUG', icon: Bug },
  { type: 'IDEA', icon: Lightbulb },
  { type: 'HELP', icon: Lifebuoy },
  { type: 'PRAISE', icon: Heart },
  { type: 'QUESTION', icon: Question },
  { type: 'OTHER', icon: ChatCircleDots },
];

type FormStep = 'type' | 'form' | 'success';

interface FeedbackFormProps {
  onClose: () => void;
}

export function FeedbackForm({ onClose }: FeedbackFormProps) {
  const { language, setLanguage, aiConfig } = useAppStore();
  const [step, setStep] = useState<FormStep>('type');
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [comment, setComment] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const [forceSubmit, setForceSubmit] = useState(false);
  const [submittedFeedbackId, setSubmittedFeedbackId] = useState<string | null>(null);
  
  // State for pre-submission AI analysis (guardrail) - only runs on submit
  const [preSubmitAnalysis, setPreSubmitAnalysis] = useState<AIAnalysis | null>(null);
  const [checkingRelevance, setCheckingRelevance] = useState(false);

  const { submitFeedback, analyzing, insight, error, resetInsight } = useAISubmit();

  // Update detected language
  useEffect(() => {
    if (comment.trim().length >= 5) {
      const detected = detectLanguage(comment);
      setDetectedLang(detected);
    }
  }, [comment]);

  // Reset pre-submit analysis when comment changes (user edited the message)
  useEffect(() => {
    if (preSubmitAnalysis) {
      setPreSubmitAnalysis(null);
      setForceSubmit(false);
    }
  }, [comment]);

  const handleTypeSelect = (type: FeedbackType) => {
    setSelectedType(type);
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('type');
      setSelectedType(null);
      setComment('');
      setScreenshot(null);
      resetInsight();
      setPreSubmitAnalysis(null);
      setForceSubmit(false);
    } else {
      onClose();
    }
  };

  const handleTypeChange = (newType: FeedbackType) => {
    setSelectedType(newType);
  };

  const captureScreenshot = useCallback(async () => {
    setIsCapturing(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert(t('error.capture_failed', language));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setScreenshot(`data:image/png;base64,${result.assets[0].base64}`);
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      alert(t('error.capture_failed', language));
    } finally {
      setIsCapturing(false);
    }
  }, [language]);

  const removeScreenshot = () => {
    setScreenshot(null);
  };

  const handleSubmit = async () => {
    if (!selectedType || !comment.trim()) return;

    console.log('Submit clicked. forceSubmit:', forceSubmit, 'preSubmitAnalysis:', preSubmitAnalysis?.isRelevant);

    // If AI is enabled and we haven't checked relevance yet, do it now
    if (aiConfig?.enabled && !forceSubmit && !preSubmitAnalysis) {
      console.log('Running pre-submit guardrail check...');
      setCheckingRelevance(true);
      try {
        // Run AI analysis first (without submitting)
        const result = await aiService.analyzeFeedback(
          comment.trim(),
          selectedType,
          aiConfig.provider,
          aiConfig.apiKey,
          aiConfig.model
        );

        console.log('Pre-submit analysis result:', result);

        if (result.success && result.data) {
          // Check if content is irrelevant
          if (result.data.isRelevant === false) {
            console.log('Content marked as irrelevant, showing guardrail');
            // Show guardrail warning, don't submit yet
            setPreSubmitAnalysis(result.data);
            setCheckingRelevance(false);
            return;
          }
          console.log('Content is relevant, proceeding with submission');
        } else {
          console.log('Analysis returned no data or failed:', result.error);
        }
      } catch (err) {
        console.log('Pre-submit analysis failed, proceeding with submission:', err);
      }
      setCheckingRelevance(false);
    }

    console.log('Proceeding with actual submission...');
    // Proceed with actual submission
    const result = await submitFeedback({
      type: selectedType,
      comment: comment.trim(),
      screenshot,
      language: detectedLang || language,
      uiLanguage: language,
    });

    console.log('Submission result:', result);

    if (result.success) {
      setSubmittedFeedbackId(result.data?.id || null);
      setStep('success');
    } else {
      console.error('Submission failed:', result.error);
      alert(result.error || t('error.submit_failed', language));
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form after close
    setTimeout(() => {
      setStep('type');
      setSelectedType(null);
      setComment('');
      setScreenshot(null);
      resetInsight();
      setPreSubmitAnalysis(null);
      setForceSubmit(false);
      setSubmittedFeedbackId(null);
    }, 300);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageSelector(false);
  };

  const getTypeColor = (type: FeedbackType) => {
    switch (type) {
      case 'BUG':
        return { color: colors.bug[500], bgColor: colors.bug[100] };
      case 'IDEA':
        return { color: colors.idea[500], bgColor: colors.idea[100] };
      case 'HELP':
        return { color: colors.help[500], bgColor: colors.help[100] };
      case 'PRAISE':
        return { color: colors.praise[500], bgColor: colors.praise[100] };
      case 'QUESTION':
        return { color: colors.question[500], bgColor: colors.question[100] };
      case 'OTHER':
        return { color: colors.other[500], bgColor: colors.other[100] };
      default:
        return { color: colors.gray[500], bgColor: colors.gray[100] };
    }
  };

  const renderHeader = () => {
    const title =
      step === 'type'
        ? t('widget.title', language)
        : step === 'form'
        ? t(`type.${selectedType}` as any, language)
        : t('widget.thank_you', language);

    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>
    );
  };

  const renderLanguageSelector = () => {
    const languages: Language[] = ['en', 'es', 'pt-BR', 'zh'];

    return (
      <View style={styles.languageSelectorContainer}>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setShowLanguageSelector(!showLanguageSelector)}
        >
          <Globe size={18} color={colors.gray[600]} />
          <Text style={styles.languageButtonText}>
            {t(`lang.${language}` as any, language)}
          </Text>
        </TouchableOpacity>

        {showLanguageSelector && (
          <View style={styles.languageDropdown}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageOption,
                  language === lang && styles.languageOptionActive,
                ]}
                onPress={() => handleLanguageChange(lang)}
              >
                <Text
                  style={[
                    styles.languageOptionText,
                    language === lang && styles.languageOptionTextActive,
                  ]}
                >
                  {t(`lang.${lang}` as any, lang)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderTypeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.subtitle}>{t('widget.subtitle', language)}</Text>
      {renderLanguageSelector()}
      <View style={styles.typeButtonsContainer}>
        {feedbackTypes.map((item) => {
          const { color, bgColor } = getTypeColor(item.type);
          return (
            <FeedbackTypeButton
              key={item.type}
              type={item.type}
              label={t(`type.${item.type}` as any, language)}
              description={t(`type.${item.type}_desc` as any, language)}
              icon={item.icon}
              color={color}
              bgColor={bgColor}
              isSelected={selectedType === item.type}
              onPress={() => handleTypeSelect(item.type)}
            />
          );
        })}
      </View>
    </View>
  );

  const renderIrrelevantAlert = () => {
    // Show guardrail warning from PRE-SUBMIT analysis
    // This happens only when user clicks submit, not on every keystroke
    console.log('renderIrrelevantAlert check:', {
      aiEnabled: aiConfig?.enabled,
      hasPreSubmitAnalysis: !!preSubmitAnalysis,
      isRelevant: preSubmitAnalysis?.isRelevant,
      forceSubmit,
    });
    
    if (!aiConfig?.enabled || !preSubmitAnalysis || preSubmitAnalysis.isRelevant !== false || forceSubmit) {
      return null;
    }

    return (
      <View style={styles.irrelevantContainer}>
        <View style={styles.irrelevantIconContainer}>
          <Warning size={24} color={colors.error} weight="fill" />
        </View>
        <View style={styles.irrelevantContent}>
          <Text style={styles.irrelevantTitle}>
            {t('widget.irrelevant_title', language)}
          </Text>
          <Text style={styles.irrelevantText}>
            {preSubmitAnalysis.suggestedResponse || t('widget.irrelevant_message', language)}
          </Text>
          <TouchableOpacity
            style={styles.forceSubmitButton}
            onPress={() => setForceSubmit(true)}
          >
            <Text style={styles.forceSubmitButtonText}>
              {t('widget.send_anyway', language)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFormStep = () => {
    const showAIAnalysis = aiConfig?.enabled && insight?.analyzed;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.formScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* AI Analyzing */}
          {analyzing && (
            <View style={styles.analyzingContainer}>
              <ActivityIndicator size="small" color={colors.brand[500]} />
              <Text style={styles.analyzingText}>
                {t('widget.analyzing', language)}
              </Text>
            </View>
          )}

          {/* Irrelevant Alert */}
          {renderIrrelevantAlert()}

          {/* Type Validation Alert */}
          {showAIAnalysis && selectedType && (
            <TypeValidationAlert
              insight={insight}
              currentType={selectedType}
              onTypeChange={handleTypeChange}
              lang={language}
            />
          )}

          {/* Duplicate Alert */}
          {showAIAnalysis && (
            <DuplicateAlert insight={insight} lang={language} />
          )}

          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder={t('widget.placeholder', language)}
            placeholderTextColor={colors.gray[400]}
            value={comment}
            onChangeText={setComment}
            maxLength={1000}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {t('widget.char_count', language, { count: String(comment.length) })}
          </Text>

          {/* AI Insights Panel */}
          {showAIAnalysis && <AIInsightsPanel insight={insight} lang={language} />}

          <ScreenshotButton
            screenshot={screenshot}
            onCapture={captureScreenshot}
            onRemove={removeScreenshot}
            isCapturing={isCapturing}
          />

          {/* Checking relevance indicator */}
          {checkingRelevance && (
            <View style={styles.analyzingContainer}>
              <ActivityIndicator size="small" color={colors.brand[500]} />
              <Text style={styles.analyzingText}>{t('widget.analyzing', language)}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              ((!comment.trim() || analyzing || checkingRelevance || (preSubmitAnalysis?.isRelevant === false && !forceSubmit)) &&
                styles.submitButtonDisabled),
            ]}
            onPress={handleSubmit}
            disabled={!comment.trim() || analyzing || checkingRelevance || (preSubmitAnalysis?.isRelevant === false && !forceSubmit)}
          >
            {analyzing ? (
              <ActivityIndicator color={colors.white} />
            ) : checkingRelevance ? (
              <ActivityIndicator color={colors.white} />
            ) : preSubmitAnalysis?.isRelevant === false && !forceSubmit ? (
              <Text style={styles.submitButtonText}>
                {t('widget.not_related', language) || 'Not related to our platform'}
              </Text>
            ) : (
              <Text style={styles.submitButtonText}>
                {t('widget.send', language)}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  const renderSuccessStep = () => (
    <View style={styles.successContainer}>
      <View style={styles.successIcon}>
        <CheckCircle size={48} color={colors.success} weight="fill" />
      </View>
      <Text style={styles.successTitle}>{t('widget.thank_you', language)}</Text>
      <Text style={styles.successText}>{t('widget.thank_you_message', language)}</Text>
      
      {/* AI Response with Rating */}
      {aiConfig?.enabled && insight?.suggestedResponse && (
        <View style={styles.aiResponseContainer}>
          <AIResponseBox
            insight={insight}
            lang={language}
            feedbackId={submittedFeedbackId}
          />
        </View>
      )}
      
      {/* Close Button */}
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>{t('common.close', language) || 'Close'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      {renderHeader()}
      <View style={styles.content}>
        {step === 'type' && renderTypeStep()}
        {step === 'form' && renderFormStep()}
        {step === 'success' && renderSuccessStep()}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('widget.powered_by', language)}</Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.brand[500],
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.gray[500],
  },
  stepContainer: {
    flex: 1,
    padding: 24,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 16,
  },
  typeButtonsContainer: {
    gap: 12,
  },
  languageSelectorContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.gray[100],
    borderRadius: 20,
  },
  languageButtonText: {
    fontSize: 14,
    color: colors.gray[700],
    fontWeight: '500',
  },
  languageDropdown: {
    position: 'absolute',
    top: 44,
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
    padding: 8,
    minWidth: 180,
  },
  languageOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  languageOptionActive: {
    backgroundColor: colors.brand[100],
  },
  languageOptionText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  languageOptionTextActive: {
    color: colors.brand[600],
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    padding: 24,
  },
  textInput: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.gray[800],
    minHeight: 140,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: colors.gray[400],
    textAlign: 'right',
    marginTop: 8,
    marginBottom: 8,
  },
  analyzingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: colors.brand[50],
    borderRadius: 8,
    marginBottom: 12,
  },
  analyzingText: {
    fontSize: 14,
    color: colors.brand[600],
    fontWeight: '500',
  },
  irrelevantContainer: {
    flexDirection: 'row',
    backgroundColor: colors.errorLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  irrelevantIconContainer: {
    marginRight: 12,
  },
  irrelevantContent: {
    flex: 1,
  },
  irrelevantTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 4,
  },
  irrelevantText: {
    fontSize: 13,
    color: colors.gray[700],
    marginBottom: 12,
  },
  forceSubmitButton: {
    backgroundColor: colors.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  forceSubmitButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.brand[500],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: 'center',
  },
  aiResponseContainer: {
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  closeButton: {
    marginTop: 24,
    backgroundColor: colors.gray[200],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
  },
});
