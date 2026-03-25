// Dashboard Screen - Thin Layer
// Only responsible for coordinating UI components
// Business logic is in the ViewModel and Use Cases
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Language } from '../i18n';
import { useDashboardViewModel } from '../presentation/hooks/useDashboardViewModel';
import {
  StatsTab,
  FeedbacksTab,
  FeedbackDetailModal,
  ErrorState,
  TabBar,
} from '../presentation/components/dashboard';
import { LoadingSpinner } from '../components/ui';
import { colors } from '../theme/colors';

interface DashboardScreenProps {
  lang: Language;
}

export function DashboardScreen({ lang }: DashboardScreenProps) {
  const insets = useSafeAreaInsets();
  const viewModel = useDashboardViewModel(lang);

  // Loading state
  if (viewModel.isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LoadingSpinner fullScreen text="Loading..." />
      </View>
    );
  }

  // Error state
  if (viewModel.error || !viewModel.stats) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ErrorState
          error={viewModel.error || 'Failed to load dashboard data'}
          lang={lang}
          isRefreshing={viewModel.isRefreshing}
          onRetry={() => viewModel.fetchData(true)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Tab Bar */}
      <TabBar
        activeTab={viewModel.activeTab}
        feedbacksCount={viewModel.totalFeedbacks}
        onTabChange={viewModel.setActiveTab}
      />

      {/* Tab Content */}
      <View style={styles.content}>
        {viewModel.activeTab === 'stats' ? (
          <StatsTab
            stats={viewModel.stats}
            lang={lang}
            isRefreshing={viewModel.isRefreshing}
            onRefresh={viewModel.handleRefresh}
            onNavigateToFeedbacks={(filter) => {
              viewModel.setStatusFilter(filter);
              viewModel.setActiveTab('feedbacks');
            }}
          />
        ) : (
          <FeedbacksTab
            feedbacks={viewModel.feedbacks}
            filteredFeedbacks={viewModel.filteredFeedbacks}
            totalCount={viewModel.totalFeedbacks}
            filteredCount={viewModel.filteredCount}
            statusFilter={viewModel.statusFilter}
            lang={lang}
            onFeedbackPress={viewModel.handleFeedbackPress}
            onFilterPress={() => viewModel.setShowFilterModal(true)}
          />
        )}
      </View>

      {/* Feedback Detail Modal */}
      <FeedbackDetailModal
        visible={viewModel.showStatusModal}
        feedback={viewModel.selectedFeedback}
        lang={lang}
        isUpdating={viewModel.isUpdating}
        onClose={() => viewModel.setShowStatusModal(false)}
        onStatusUpdate={viewModel.handleStatusUpdate}
        onTypeUpdate={viewModel.handleTypeUpdate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    flex: 1,
  },
});
