import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Bug,
  Lightbulb,
  Question,
  HandsClapping,
  ChatTeardropText,
  Warning,
  CheckCircle,
  Clock,
  XCircle,
  Circle,
  Robot,
  Star,
} from 'phosphor-react-native';
import type { FeedbackWithAI, FeedbackType, Status, Priority, Language } from '../types';
import { t } from '../i18n';
import { colors } from '../theme/colors';

interface FeedbackListItemProps {
  feedback: FeedbackWithAI;
  lang: Language;
  onPress?: (feedback: FeedbackWithAI) => void;
}

const typeIcons: Record<FeedbackType, typeof Bug> = {
  BUG: Bug,
  IDEA: Lightbulb,
  QUESTION: Question,
  PRAISE: HandsClapping,
  HELP: ChatTeardropText,
  OTHER: ChatTeardropText,
};

const typeColors: Record<FeedbackType, string> = {
  BUG: colors.error,
  IDEA: colors.warning,
  QUESTION: colors.info,
  PRAISE: colors.success,
  HELP: colors.brand[500],
  OTHER: colors.gray[500],
};

const statusIcons: Record<Status, typeof CheckCircle> = {
  PENDING: Clock,
  IN_PROGRESS: Warning,
  RESOLVED: CheckCircle,
  CLOSED: XCircle,
  REJECTED: XCircle,
};

const statusColors: Record<Status, string> = {
  PENDING: colors.warning,
  IN_PROGRESS: colors.info,
  RESOLVED: colors.success,
  CLOSED: colors.gray[500],
  REJECTED: colors.error,
};

const priorityColors: Record<Priority, string> = {
  CRITICAL: colors.error,
  HIGH: colors.warning,
  MEDIUM: colors.info,
  LOW: colors.gray[500],
};

export function FeedbackListItem({ feedback, lang, onPress }: FeedbackListItemProps) {
  const TypeIcon = typeIcons[feedback.type];
  const typeColor = typeColors[feedback.type];
  const StatusIcon = statusIcons[feedback.status];
  const statusColor = statusColors[feedback.status];
  const priorityColor = feedback.aiPriority ? priorityColors[feedback.aiPriority] : colors.gray[400];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'pt-BR' ? 'pt-BR' : lang, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateComment = (comment: string, maxLength: number = 80) => {
    if (comment.length <= maxLength) return comment;
    return comment.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(feedback)}
      activeOpacity={0.7}
    >
      {/* Header with type and status */}
      <View style={styles.header}>
        <View style={[styles.typeBadge, { backgroundColor: typeColor + '15' }]}>
          <TypeIcon size={14} color={typeColor} weight="duotone" />
          <Text style={[styles.typeText, { color: typeColor }]}>
            {t(`type.${feedback.type}` as any, lang)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
          <StatusIcon size={12} color={statusColor} weight="duotone" />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {t(`status.${feedback.status}` as any, lang)}
          </Text>
        </View>
      </View>

      {/* Comment */}
      <Text style={styles.comment}>{truncateComment(feedback.comment)}</Text>

      {/* AI Summary if available */}
      {feedback.aiSummary && (
        <View style={styles.aiSummaryContainer}>
          <Robot size={12} color={colors.brand[500]} />
          <Text style={styles.aiSummary} numberOfLines={2}>
            {feedback.aiSummary}
          </Text>
        </View>
      )}

      {/* Footer with metadata */}
      <View style={styles.footer}>
        <View style={styles.metaLeft}>
          {/* Priority badge */}
          {feedback.aiPriority && (
            <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '15' }]}>
              <Circle size={8} color={priorityColor} weight="fill" />
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {t(`priority.${feedback.aiPriority}` as any, lang)}
              </Text>
            </View>
          )}

          {/* AI Analyzed indicator */}
          {feedback.aiAnalyzed && (
            <View style={styles.aiBadge}>
              <Robot size={10} color={colors.brand[500]} />
              <Text style={styles.aiText}>AI</Text>
            </View>
          )}

          {/* Rating indicator */}
          {feedback.rating && (
            <View style={styles.ratingBadge}>
              <Star
                size={10}
                color={feedback.rating === 'POSITIVE' ? colors.success : colors.error}
                weight="fill"
              />
            </View>
          )}
        </View>

        <Text style={styles.date}>{formatDate(feedback.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  comment: {
    fontSize: 14,
    color: colors.gray[800],
    lineHeight: 20,
    marginBottom: 10,
  },
  aiSummaryContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: colors.brand[50],
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  aiSummary: {
    flex: 1,
    fontSize: 12,
    color: colors.brand[700],
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.brand[100],
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  aiText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.brand[600],
  },
  ratingBadge: {
    backgroundColor: colors.gray[100],
    padding: 4,
    borderRadius: 4,
  },
  date: {
    fontSize: 11,
    color: colors.gray[400],
  },
});
