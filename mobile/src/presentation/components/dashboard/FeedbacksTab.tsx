// Presentation Component - Feedbacks Tab
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Funnel } from 'phosphor-react-native';
import type { Feedback } from '../../../domain/entities/Feedback';
import type { Language } from '../../../i18n';
import { t } from '../../../i18n';
import { colors } from '../../../theme/colors';
// Import the existing FeedbackListItem which expects FeedbackWithAI DTO
import { FeedbackListItem as FeedbackListItemBase } from '../../../components/FeedbackListItem';
import type { FeedbackWithAI } from '../../../types';

// Wrapper component that converts domain entity to DTO
function FeedbackListItem({ 
  feedback, 
  lang, 
  onPress 
}: { 
  feedback: import('../../../domain/entities/Feedback').Feedback;
  lang: Language;
  onPress: () => void;
}) {
  const dto: FeedbackWithAI = {
    id: feedback.id,
    type: feedback.type,
    comment: feedback.comment,
    status: feedback.status,
    createdAt: feedback.createdAt,
    updatedAt: feedback.updatedAt,
    aiAnalyzed: feedback.aiAnalyzed,
    aiSuggestedType: feedback.aiSuggestedType,
    aiConfidence: feedback.aiConfidence,
    aiPriority: feedback.aiPriority,
    aiSentiment: feedback.aiSentiment,
    aiCategory: feedback.aiCategory,
    aiSummary: feedback.aiSummary,
    aiActionItems: feedback.aiActionItems,
    aiLanguage: feedback.aiLanguage,
    aiUILanguage: feedback.aiUILanguage,
    aiTranslated: feedback.aiTranslated,
    aiResponse: feedback.aiResponse,
    aiTranslatedResponse: feedback.aiTranslatedResponse,
    aiScreenshotDesc: feedback.aiScreenshotDesc,
    duplicateOfId: feedback.duplicateOfId,
    similarityScore: feedback.similarityScore,
    team: feedback.team,
    assignedTo: feedback.assignedTo,
    rating: feedback.rating,
    ratingNote: feedback.ratingNote,
    screenshot: feedback.screenshot,
  };
  
  return <FeedbackListItemBase feedback={dto} lang={lang} onPress={onPress} />;
}
import type { StatusFilter } from '../../hooks/useDashboardViewModel';

interface FeedbacksTabProps {
  feedbacks: Feedback[];
  filteredFeedbacks: Feedback[];
  totalCount: number;
  filteredCount: number;
  statusFilter: StatusFilter;
  lang: Language;
  onFeedbackPress: (feedback: Feedback) => void;
  onFilterPress: () => void;
}

export function FeedbacksTab({
  feedbacks,
  filteredFeedbacks,
  totalCount,
  filteredCount,
  statusFilter,
  lang,
  onFeedbackPress,
  onFilterPress,
}: FeedbacksTabProps) {
  const renderItem = ({ item }: { item: Feedback }) => (
    <FeedbackListItem
      feedback={{
        id: item.id,
        type: item.type,
        comment: item.comment,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        aiAnalyzed: item.aiAnalyzed,
        aiSuggestedType: item.aiSuggestedType,
        aiConfidence: item.aiConfidence,
        aiPriority: item.aiPriority,
        aiSentiment: item.aiSentiment,
        aiCategory: item.aiCategory,
        aiSummary: item.aiSummary,
        aiActionItems: item.aiActionItems,
        aiLanguage: item.aiLanguage,
        aiUILanguage: item.aiUILanguage,
        aiTranslated: item.aiTranslated,
        aiResponse: item.aiResponse,
        aiTranslatedResponse: item.aiTranslatedResponse,
        aiScreenshotDesc: item.aiScreenshotDesc,
        duplicateOfId: item.duplicateOfId,
        similarityScore: item.similarityScore,
        team: item.team,
        assignedTo: item.assignedTo,
        rating: item.rating,
        ratingNote: item.ratingNote,
        screenshot: item.screenshot,
      }}
      lang={lang}
      onPress={() => onFeedbackPress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {statusFilter !== 'ALL'
          ? t('feedback.no_feedbacks_filter', lang)
          : t('feedback.no_feedbacks', lang)}
      </Text>
      <Text style={styles.emptyText}>
        {statusFilter !== 'ALL'
          ? t('feedback.no_feedbacks_filter_desc', lang) || 'Try adjusting your filters'
          : t('feedback.no_feedbacks_desc', lang)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filter Header */}
      <View style={styles.filterHeader}>
        <Text style={styles.filterCount}>
          {filteredCount} / {totalCount} feedbacks
        </Text>
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Funnel size={16} color={colors.brand[500]} weight="duotone" />
          <Text style={styles.filterButtonText}>
            {statusFilter === 'ALL'
              ? t('filter.all', lang)
              : t(`status.${statusFilter}`, lang)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feedbacks List */}
      <FlashList
        data={filteredFeedbacks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={150}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  filterCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.brand[50],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.brand[600],
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
});
