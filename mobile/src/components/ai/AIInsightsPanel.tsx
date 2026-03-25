import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sparkle, CaretDoubleUp, CaretUp, Minus, CaretDown, Smiley, SmileyMeh, SmileySad, SmileyAngry, SmileyXEyes } from 'phosphor-react-native';
import type { AIAnalysis, Language, Priority, Sentiment } from '../../types';
import { t } from '../../i18n';
import { colors } from '../../theme/colors';

interface AIInsightsPanelProps {
  insight: AIAnalysis;
  lang: Language;
}

const PriorityIcons: Record<Priority, typeof CaretDoubleUp> = {
  CRITICAL: CaretDoubleUp,
  HIGH: CaretUp,
  MEDIUM: Minus,
  LOW: CaretDown,
};

const PriorityColors: Record<Priority, string> = {
  CRITICAL: colors.critical,
  HIGH: colors.high,
  MEDIUM: colors.medium,
  LOW: colors.low,
};

const SentimentIcons: Record<Sentiment, typeof Smiley> = {
  HAPPY: Smiley,
  NEUTRAL: SmileyMeh,
  FRUSTRATED: SmileySad,
  ANGRY: SmileyAngry,
  CONFUSED: SmileyXEyes,
};

const SentimentColors: Record<Sentiment, string> = {
  HAPPY: colors.success,
  NEUTRAL: colors.gray[500],
  FRUSTRATED: colors.warning,
  ANGRY: colors.error,
  CONFUSED: colors.info,
};

export function AIInsightsPanel({ insight, lang }: AIInsightsPanelProps) {
  if (!insight.analyzed) {
    return null;
  }

  const PriorityIcon = insight.priority ? PriorityIcons[insight.priority] : null;
  const SentimentIcon = insight.sentiment ? SentimentIcons[insight.sentiment] : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sparkle size={16} color={colors.brand[500]} weight="fill" />
        <Text style={styles.headerText}>{t('widget.ai_analysis', lang)}</Text>
      </View>

      <View style={styles.content}>
        {/* Summary */}
        {insight.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('detail.ai_summary', lang)}</Text>
            <Text style={styles.summaryText}>{insight.summary}</Text>
          </View>
        )}

        {/* Priority & Sentiment */}
        <View style={styles.badgesContainer}>
          {insight.priority && PriorityIcon && (
            <View style={[styles.badge, { backgroundColor: PriorityColors[insight.priority] + '20' }]}>
              <PriorityIcon size={14} color={PriorityColors[insight.priority]} weight="fill" />
              <Text style={[styles.badgeText, { color: PriorityColors[insight.priority] }]}>
                {t(`priority.${insight.priority}`, lang)}
              </Text>
            </View>
          )}
          {insight.sentiment && SentimentIcon && (
            <View style={[styles.badge, { backgroundColor: SentimentColors[insight.sentiment] + '20' }]}>
              <SentimentIcon size={14} color={SentimentColors[insight.sentiment]} weight="fill" />
              <Text style={[styles.badgeText, { color: SentimentColors[insight.sentiment] }]}>
                {t(`sentiment.${insight.sentiment}`, lang)}
              </Text>
            </View>
          )}
        </View>

        {/* Category */}
        {insight.category && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('feedback.category', lang)}</Text>
            <Text style={styles.categoryText}>
              {t(`category.${insight.category}` as any, lang)}
            </Text>
          </View>
        )}

        {/* Action Items */}
        {insight.actionItems && insight.actionItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('detail.action_items', lang)}</Text>
            {insight.actionItems.map((item, index) => (
              <View key={index} style={styles.actionItem}>
                <Text style={styles.actionItemDot}>•</Text>
                <Text style={styles.actionItemText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Confidence */}
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>{t('widget.confidence', lang)}</Text>
          <View style={styles.confidenceBar}>
            <View
              style={[
                styles.confidenceFill,
                { width: `${Math.round(insight.confidence * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.confidenceValue}>
            {Math.round(insight.confidence * 100)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brand[50],
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.brand[600],
  },
  content: {
    gap: 12,
  },
  section: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[600],
    textTransform: 'uppercase',
  },
  summaryText: {
    fontSize: 14,
    color: colors.gray[800],
    lineHeight: 20,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 14,
    color: colors.gray[800],
  },
  actionItem: {
    flexDirection: 'row',
    gap: 8,
  },
  actionItemDot: {
    color: colors.brand[500],
    fontWeight: '700',
  },
  actionItemText: {
    fontSize: 13,
    color: colors.gray[700],
    flex: 1,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  confidenceLabel: {
    fontSize: 12,
    color: colors.gray[600],
  },
  confidenceBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: colors.brand[500],
    borderRadius: 2,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.brand[600],
    minWidth: 32,
    textAlign: 'right',
  },
});
