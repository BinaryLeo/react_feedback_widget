import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput as RNTextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ShieldCheck,
  FloppyDisk,
  Warning,
  Factory,
} from 'phosphor-react-native';
import { aiService } from '../services/api';
import { Button } from '../components/ui';
import type { GuardrailConfig, Language } from '../types';
import { t } from '../i18n';
import { colors } from '../theme/colors';

interface GuardrailScreenProps {
  lang: Language;
}

export function GuardrailScreen({ lang }: GuardrailScreenProps) {
  const insets = useSafeAreaInsets();
  const [config, setConfig] = useState<{
    enabled: boolean;
    businessContext: string;
  }>({
    enabled: false,
    businessContext: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await aiService.getConfig();
      if (data.config) {
        setConfig({
          enabled: !!data.config.businessContext,
          businessContext: data.config.businessContext || '',
        });
      }
    } catch (err) {
      setError(t('common.error', lang));
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      // Get current AI config first
      const currentConfig = await aiService.getConfig();
      // Update only the businessContext
      await aiService.updateConfig({
        provider: currentConfig.config?.provider || 'NONE',
        model: currentConfig.config?.model || '',
        apiKey: undefined, // Don't change API key
        enabled: currentConfig.config?.enabled || false,
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
        businessContext: config.enabled ? config.businessContext : undefined,
      });
      Alert.alert(t('common.success', lang), t('settings.saved', lang));
    } catch (err) {
      setError(t('common.error', lang));
    } finally {
      setIsSaving(false);
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
        <Text style={styles.title}>{t('nav.guardrail', lang)}</Text>
        <Text style={styles.subtitle}>{t('admin.guardrail_desc', lang)}</Text>
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <Warning size={20} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Main Section */}
      <View style={styles.section}>
        {/* Enable Toggle */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>{t('guardrail.enabled', lang)}</Text>
            <Text style={styles.toggleDesc}>{t('guardrail.enabled_desc', lang)}</Text>
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
            {/* Business Context */}
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Factory size={16} color={colors.brand[600]} />
                <Text style={styles.fieldLabel}>{t('guardrail.business_context', lang)}</Text>
              </View>
              <Text style={styles.fieldDesc}>{t('guardrail.business_context_desc', lang)}</Text>
              <RNTextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder={t('guardrail.placeholder', lang)}
                value={config.businessContext}
                onChangeText={(businessContext) =>
                  setConfig({ ...config, businessContext })
                }
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          </>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoHeader}>
          <ShieldCheck size={20} color={colors.success} weight="duotone" />
          <Text style={styles.infoTitle}>{t('guardrail.how_it_works', lang)}</Text>
        </View>
        <View style={styles.infoList}>
          <Text style={styles.infoItem}>• {t('guardrail.info_1', lang)}</Text>
          <Text style={styles.infoItem}>• {t('guardrail.info_2', lang)}</Text>
          <Text style={styles.infoItem}>• {t('guardrail.info_3', lang)}</Text>
          <Text style={styles.infoItem}>• {t('guardrail.info_4', lang)}</Text>
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
  fieldContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  fieldLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[800],
  },
  fieldDesc: {
    fontSize: 13,
    color: colors.gray[500],
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.gray[900],
    backgroundColor: colors.white,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  keywordInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  keywordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.gray[900],
    backgroundColor: colors.white,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  keywordTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brand[100],
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  keywordText: {
    fontSize: 13,
    color: colors.brand[700],
    fontWeight: '500',
  },
  removeButton: {
    padding: 2,
  },
  infoSection: {
    backgroundColor: colors.successLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[800],
  },
  infoList: {
    gap: 6,
  },
  infoItem: {
    fontSize: 13,
    color: colors.gray[600],
    lineHeight: 18,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});
