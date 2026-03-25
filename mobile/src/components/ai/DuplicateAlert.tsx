import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Copy } from 'phosphor-react-native';
import type { AIAnalysis, Language } from '../../types';
import { t } from '../../i18n';
import { colors } from '../../theme/colors';

interface DuplicateAlertProps {
  insight: AIAnalysis;
  lang: Language;
}

export function DuplicateAlert({ insight, lang }: DuplicateAlertProps) {
  if (!insight.isDuplicate) {
    return null;
  }

  const similarity = insight.similarFeedbacks?.[0]?.similarity;
  const similarityPercent = similarity ? Math.round(similarity * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Copy size={20} color={colors.info} weight="fill" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>
          {t('widget.possible_duplicate', lang)}
        </Text>
        <Text style={styles.description}>
          {similarityPercent}% {t('detail.similarity', lang).toLowerCase()}
        </Text>
        {insight.similarFeedbacks && insight.similarFeedbacks.length > 0 && (
          <View style={styles.similarList}>
            {insight.similarFeedbacks.slice(0, 2).map((item, index) => (
              <View key={item.id} style={styles.similarItem}>
                <Text style={styles.similarText} numberOfLines={1}>
                  • {item.summary || item.summary}
                </Text>
                <Text style={styles.similarSimilarity}>
                  {Math.round(item.similarity * 100)}%
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.infoLight,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
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
    color: colors.info,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.gray[700],
    marginBottom: 8,
  },
  similarList: {
    gap: 8,
  },
  similarItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 8,
  },
  similarText: {
    fontSize: 12,
    color: colors.gray[700],
    flex: 1,
    marginRight: 8,
  },
  similarSimilarity: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.info,
  },
});
