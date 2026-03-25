// Presentation Component - Feedback Detail Modal
import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { X, Check } from 'phosphor-react-native';
import type { Feedback } from '../../../domain/entities/Feedback';
import type { Status, FeedbackType } from '../../../types';
import type { Language } from '../../../i18n';
import { t } from '../../../i18n';
import { colors } from '../../../theme/colors';

interface FeedbackDetailModalProps {
  visible: boolean;
  feedback: Feedback | null;
  lang: Language;
  isUpdating: boolean;
  onClose: () => void;
  onStatusUpdate: (status: Status) => void;
  onTypeUpdate: (type: FeedbackType) => void;
}

const feedbackTypes: FeedbackType[] = ['BUG', 'IDEA', 'OTHER', 'HELP', 'PRAISE', 'QUESTION'];
const statusOptions: Status[] = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];

export function FeedbackDetailModal({
  visible,
  feedback,
  lang,
  isUpdating,
  onClose,
  onStatusUpdate,
  onTypeUpdate,
}: FeedbackDetailModalProps) {
  if (!feedback) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{t('feedback.detail_title', lang)}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={colors.gray[500]} />
              </TouchableOpacity>
            </View>

            {/* Comment */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t('feedback.comment', lang)}:</Text>
              <Text style={styles.commentText}>{feedback.comment}</Text>
            </View>

            {/* Type Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('feedback.type', lang)}</Text>
              <View style={styles.optionsGrid}>
                {feedbackTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      feedback.type === type && styles.optionButtonActive,
                    ]}
                    onPress={() => onTypeUpdate(type)}
                    disabled={isUpdating || feedback.type === type}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      feedback.type === type && styles.optionButtonTextActive,
                    ]}>
                      {t(`type.${type}` as any, lang)}
                    </Text>
                    {feedback.type === type && (
                      <Check size={14} color={colors.white} weight="bold" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('feedback.status', lang)}</Text>
              <View style={styles.optionsGrid}>
                {statusOptions.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.optionButton,
                      feedback.status === status && styles.optionButtonActive,
                    ]}
                    onPress={() => onStatusUpdate(status)}
                    disabled={isUpdating || feedback.status === status}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      feedback.status === status && styles.optionButtonTextActive,
                    ]}>
                      {t(`status.${status}`, lang)}
                    </Text>
                    {feedback.status === status && (
                      <Check size={14} color={colors.white} weight="bold" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* AI Info */}
            {feedback.aiAnalyzed && (
              <View style={styles.aiSection}>
                <Text style={styles.aiTitle}>{t('widget.ai_analysis', lang)}</Text>
                {feedback.aiSummary && (
                  <Text style={styles.aiText}>{feedback.aiSummary}</Text>
                )}
                {feedback.aiPriority && (
                  <View style={styles.aiBadge}>
                    <Text style={styles.aiBadgeText}>
                      {t(`priority.${feedback.aiPriority}`, lang)}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Loading Indicator */}
            {isUpdating && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.brand[500]} />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  scroll: {
    maxHeight: '90%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[800],
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[600],
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: 12,
  },
  commentText: {
    fontSize: 15,
    color: colors.gray[700],
    lineHeight: 22,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  optionButtonActive: {
    backgroundColor: colors.brand[500],
  },
  optionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[700],
  },
  optionButtonTextActive: {
    color: colors.white,
  },
  aiSection: {
    backgroundColor: colors.brand[50],
    borderRadius: 12,
    padding: 16,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.brand[700],
    marginBottom: 8,
  },
  aiText: {
    fontSize: 14,
    color: colors.gray[700],
    marginBottom: 12,
  },
  aiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brand[500],
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
});
