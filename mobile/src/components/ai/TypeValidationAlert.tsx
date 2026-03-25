import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Warning, ArrowRight } from 'phosphor-react-native';
import type { AIAnalysis, FeedbackType, Language } from '../../types';
import { t } from '../../i18n';
import { colors } from '../../theme/colors';

interface TypeValidationAlertProps {
  insight: AIAnalysis;
  currentType: FeedbackType;
  onTypeChange: (type: FeedbackType) => void;
  lang: Language;
}

export function TypeValidationAlert({
  insight,
  currentType,
  onTypeChange,
  lang,
}: TypeValidationAlertProps) {
  if (!insight.typeValidation || insight.typeValidation.isCorrect) {
    return null;
  }

  const { suggestedType, reason } = insight.typeValidation;

  const getTypeLabel = (type: string) => {
    return t(`type.${type}` as any, lang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Warning size={20} color={colors.warning} weight="fill" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>
          {t('widget.type_mismatch_title', lang)}
        </Text>
        <Text style={styles.description}>
          {t('widget.type_mismatch_desc', lang, {
            suggested: getTypeLabel(suggestedType),
            current: getTypeLabel(currentType),
          })}
        </Text>
        {reason && (
          <Text style={styles.reason}>
            {t('widget.type_mismatch_reason', lang, {
              suggested: getTypeLabel(suggestedType),
              reason,
            })}
          </Text>
        )}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => onTypeChange(suggestedType)}
        >
          <Text style={styles.switchButtonText}>
            {t('widget.switch_to', lang)} {getTypeLabel(suggestedType)}
          </Text>
          <ArrowRight size={16} color={colors.white} weight="bold" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.warningLight,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.warning,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.gray[700],
    marginBottom: 4,
  },
  reason: {
    fontSize: 12,
    color: colors.gray[600],
    fontStyle: 'italic',
    marginBottom: 12,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warning,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 8,
  },
  switchButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});
