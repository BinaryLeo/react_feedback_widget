import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Robot,
  Translate,
  Shield,
  TestTube,
  FloppyDisk,
  Warning,
  CaretDown,
  X,
  Check,
} from 'phosphor-react-native';
import { useAppStore } from '../store';
import { aiService } from '../services/api';
import { Button, Input } from '../components/ui';
import type { AIConfig, Language } from '../types';
import { getSupportedLanguages, t } from '../i18n';
import { colors } from '../theme/colors';

const MODELS: Record<string, string[]> = {
  MOONSHOT: ['kimi-k2.5', 'kimi-k2-turbo-preview'],
  ANTHROPIC: ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-haiku-4-20250514'],
};

const CUSTOM_MODEL_OPTION = '__CUSTOM__';

interface SettingsScreenProps {
  lang: Language;
}

export function SettingsScreen({ lang }: SettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, aiConfig, setAIConfig } = useAppStore();
  
  const [config, setConfig] = useState<Partial<AIConfig>>({
    provider: 'NONE',
    model: '',
    apiKey: '',
    enabled: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModelModal, setShowModelModal] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [customModelInput, setCustomModelInput] = useState('');
  const [apiKeyModified, setApiKeyModified] = useState(false);

  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await aiService.getConfig();
      if (data.config) {
        const providerModels = MODELS[data.config.provider || 'NONE'] || [];
        const isCustom = !!(data.config.model && !providerModels.includes(data.config.model));
        setConfig({
          provider: data.config.provider || 'NONE',
          model: data.config.model || '',
          apiKey: data.config.apiKey === '***' ? '••••••••••••••••••••' : (data.config.apiKey || ''),
          enabled: data.config.enabled || false,
        });
        setIsCustomModel(isCustom);
        setCustomModelInput(isCustom ? data.config.model : '');
        setApiKeyModified(false);
        setAIConfig(data.config);
      }
    } catch (err) {
      setError(t('common.error', lang));
    } finally {
      setIsLoading(false);
    }
  }, [lang, setAIConfig]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const finalModel = isCustomModel ? customModelInput : config.model;
      
      // Only send apiKey if it was modified (not the *** placeholder)
      const apiKeyToSend = apiKeyModified ? config.apiKey : undefined;
      
      await aiService.updateConfig({
        provider: config.provider || 'NONE',
        model: finalModel || '',
        apiKey: apiKeyToSend,
        enabled: config.enabled || false,
        features: {
          autoCategorize: true,
          validateType: true,
          priorityScoring: true,
          sentimentAnalysis: true,
          autoResponse: true,
          screenshotAnalysis: true,
          duplicateDetection: true,
          smartRouting: true,
          languageDetection: true,
        },
        thresholds: {
          minConfidence: 0.7,
          duplicateThreshold: 0.85,
        },
      });
      
      // Reload config to get the updated state with *** for apiKey
      await loadConfig();
      
      Alert.alert(t('common.success', lang), t('settings.saved', lang));
    } catch (err) {
      setError(t('common.error', lang));
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    try {
      setIsTesting(true);
      setError(null);
      const finalModel = isCustomModel ? customModelInput : config.model;
      
      let apiKeyToUse = config.apiKey || '';
      
      // If apiKey wasn't modified and shows placeholder dots, fetch the real key from backend
      if (!apiKeyModified && config.apiKey?.includes('•••')) {
        const fullConfigResult = await aiService.getFullConfig();
        if (!fullConfigResult.success || !fullConfigResult.config?.apiKey) {
          Alert.alert(
            t('common.error', lang),
            'Please re-enter your API key to test the connection'
          );
          setIsTesting(false);
          return;
        }
        apiKeyToUse = fullConfigResult.config.apiKey;
      }
      
      const result = await aiService.testConnection(
        config.provider || 'MOONSHOT',
        apiKeyToUse,
        finalModel || 'kimi-k2.5'
      );
      Alert.alert(
        result.success ? t('common.success', lang) : t('common.error', lang),
        result.success 
          ? t('settings.test_success', lang) 
          : (result.error || t('settings.test_failed', lang))
      );
    } catch (err: any) {
      Alert.alert(t('common.error', lang), err?.message || t('settings.test_failed', lang));
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.brand[600]} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('nav.settings', lang)}</Text>
        <Text style={styles.subtitle}>{t('admin.settings_desc', lang)}</Text>
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <Warning size={20} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Language Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Translate size={20} color={colors.brand[600]} weight="duotone" />
          <Text style={styles.sectionTitle}>{t('admin.language', lang)}</Text>
        </View>
        <Text style={styles.sectionDesc}>{t('widget.language_desc', lang)}</Text>
        <View style={styles.languageGrid}>
          {getSupportedLanguages().map((langOption) => (
            <Button
              key={langOption.code}
              variant={language === langOption.code ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setLanguage(langOption.code as Language)}
              style={styles.languageButton}
            >
              {langOption.name}
            </Button>
          ))}
        </View>
      </View>

      {/* AI Configuration Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Robot size={20} color={colors.brand[600]} weight="duotone" />
          <Text style={styles.sectionTitle}>{t('admin.ai_config', lang)}</Text>
        </View>
        <Text style={styles.sectionDesc}>{t('admin.ai_config_desc', lang)}</Text>

        {/* AI Toggle */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>{t('settings.enable_ai', lang)}</Text>
            <Text style={styles.toggleDesc}>{t('settings.enable_ai_desc', lang)}</Text>
          </View>
          <Switch
            value={config.enabled}
            onValueChange={(enabled) => setConfig({ ...config, enabled })}
            trackColor={{ false: colors.gray[300], true: colors.brand[500] }}
            thumbColor={colors.white}
          />
        </View>

        {config.enabled && (
          <>
            {/* Provider Selection */}
            <Text style={styles.fieldLabel}>{t('admin.ai_provider', lang)}</Text>
            <View style={styles.providerGrid}>
              {['NONE', 'MOONSHOT', 'ANTHROPIC'].map((provider) => (
                <Button
                  key={provider}
                  variant={config.provider === provider ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => setConfig({ ...config, provider: provider as any })}
                  style={styles.providerButton}
                >
                  <Text style={styles.providerButtonText}>
                    {provider === 'NONE' ? t('settings.disabled', lang) : provider}
                  </Text>
                </Button>
              ))}
            </View>

            {config.provider !== 'NONE' && (
              <>
                {/* Model Selection */}
                <Text style={styles.fieldLabel}>{t('admin.ai_model', lang)}</Text>
                <TouchableOpacity
                  style={styles.modelSelector}
                  onPress={() => setShowModelModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modelSelectorText}>
                    {isCustomModel 
                      ? customModelInput || t('settings.custom_model', lang)
                      : config.model || t('settings.select_model', lang)
                    }
                  </Text>
                  <CaretDown size={20} color={colors.gray[500]} />
                </TouchableOpacity>

                {/* Custom Model Input */}
                {isCustomModel && (
                  <View style={styles.customModelContainer}>
                    <Input
                      label={t('settings.custom_model_label', lang)}
                      placeholder={t('settings.custom_model_placeholder', lang)}
                      value={customModelInput}
                      onChangeText={setCustomModelInput}
                      autoFocus
                    />
                  </View>
                )}

                <Input
                  label={t('admin.ai_key', lang)}
                  placeholder="sk-..."
                  value={config.apiKey}
                  onChangeText={(apiKey) => {
                    setConfig({ ...config, apiKey });
                    setApiKeyModified(true);
                  }}
                  secureTextEntry
                />
                <View style={styles.buttonRow}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onPress={handleTest}
                    isLoading={isTesting}
                    style={styles.actionButton}
                  >
                    <TestTube size={16} color={colors.gray[800]} weight="duotone" />
                    {' '}{t('settings.test_connection', lang)}
                  </Button>
                </View>
              </>
            )}
          </>
        )}
      </View>

      {/* Security Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={20} color={colors.brand[600]} weight="duotone" />
          <Text style={styles.sectionTitle}>{t('admin.security', lang)}</Text>
        </View>
        <Text style={styles.sectionDesc}>{t('admin.security_desc', lang)}</Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{t('admin.security_info', lang)}</Text>
        </View>
      </View>

      {/* Save Button */}
      <Button
        onPress={handleSave}
        isLoading={isSaving}
        style={styles.saveButton}
      >
        <FloppyDisk size={18} color={colors.white} weight="duotone" />
        {' '}{t('common.save', lang)}
      </Button>

      {/* Model Selection Modal */}
      <Modal
        visible={showModelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.select_model', lang)}</Text>
              <TouchableOpacity
                onPress={() => setShowModelModal(false)}
                style={styles.modalClose}
              >
                <X size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            {/* Provider Models */}
            {MODELS[config.provider || 'NONE']?.map((model) => (
              <TouchableOpacity
                key={model}
                style={[
                  styles.modelOption,
                  !isCustomModel && config.model === model && styles.modelOptionActive,
                ]}
                onPress={() => {
                  setConfig({ ...config, model });
                  setIsCustomModel(false);
                  setShowModelModal(false);
                }}
              >
                <Text style={[
                  styles.modelOptionText,
                  !isCustomModel && config.model === model && styles.modelOptionTextActive,
                ]}>
                  {model}
                </Text>
                {!isCustomModel && config.model === model && (
                  <Check size={20} color={colors.brand[500]} weight="bold" />
                )}
              </TouchableOpacity>
            ))}

            {/* Divider */}
            <View style={styles.modalDivider} />

            {/* Custom Model Option */}
            <TouchableOpacity
              style={[
                styles.modelOption,
                isCustomModel && styles.modelOptionActive,
              ]}
              onPress={() => {
                setIsCustomModel(true);
                setShowModelModal(false);
              }}
            >
              <Text style={[
                styles.modelOptionText,
                isCustomModel && styles.modelOptionTextActive,
              ]}>
                {t('settings.custom_model', lang)}
              </Text>
              {isCustomModel && (
                <Check size={20} color={colors.brand[500]} weight="bold" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[600],
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.errorLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    flex: 1,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[800],
  },
  sectionDesc: {
    fontSize: 13,
    color: colors.gray[500],
    marginBottom: 16,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageButton: {
    flex: 1,
    minWidth: '45%',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[800],
    marginBottom: 4,
  },
  toggleDesc: {
    fontSize: 13,
    color: colors.gray[500],
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 8,
    marginTop: 8,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  providerButton: {
    flex: 1,
    marginBottom: 8,
  },
  providerButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: colors.brand[50],
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.brand[500],
  },
  infoText: {
    fontSize: 13,
    color: colors.gray[600],
    lineHeight: 18,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 32,
  },
  modelSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  modelSelectorText: {
    fontSize: 15,
    color: colors.gray[800],
  },
  customModelContainer: {
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[900],
  },
  modalClose: {
    padding: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: 12,
  },
  modelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  modelOptionActive: {
    backgroundColor: colors.brand[50],
  },
  modelOptionText: {
    fontSize: 16,
    color: colors.gray[800],
  },
  modelOptionTextActive: {
    fontWeight: '600',
    color: colors.brand[700],
  },
});
