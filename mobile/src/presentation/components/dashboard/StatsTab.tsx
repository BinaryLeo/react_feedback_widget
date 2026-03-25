// Presentation Component - Stats Tab
import React from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import {
  ChartBar,
  Clock,
  CheckCircle,
  WarningCircle,
  TrendUp,
  Users,
} from 'phosphor-react-native';
import type { DashboardStats } from '../../../domain/entities/DashboardStats';
import type { Language } from '../../../i18n';
import { t } from '../../../i18n';
import { colors } from '../../../theme/colors';
import { StatCard } from './StatCard';
import type { TabType, StatusFilter } from '../../hooks/useDashboardViewModel';

interface StatsTabProps {
  stats: DashboardStats;
  lang: Language;
  isRefreshing: boolean;
  onRefresh: () => void;
  onNavigateToFeedbacks: (filter: StatusFilter) => void;
}

export function StatsTab({
  stats,
  lang,
  isRefreshing,
  onRefresh,
  onNavigateToFeedbacks,
}: StatsTabProps) {
  const statCards = [
    {
      icon: ChartBar,
      label: t('admin.total_feedbacks', lang),
      value: stats.total,
      color: colors.brand[500],
      filter: 'ALL' as StatusFilter,
    },
    {
      icon: Clock,
      label: t('status.pending', lang),
      value: stats.pending,
      color: colors.warning,
      filter: 'PENDING' as StatusFilter,
    },
    {
      icon: CheckCircle,
      label: t('status.resolved', lang),
      value: stats.resolved,
      color: colors.success,
      filter: 'RESOLVED' as StatusFilter,
    },
    {
      icon: WarningCircle,
      label: t('status.rejected', lang),
      value: stats.rejected,
      color: colors.error,
      filter: 'REJECTED' as StatusFilter,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Stat Cards */}
      <View style={styles.cardsGrid}>
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            icon={card.icon}
            label={card.label}
            value={card.value}
            color={card.color}
            onPress={() => onNavigateToFeedbacks(card.filter)}
          />
        ))}
      </View>

      {/* Top Categories */}
      {stats.topCategories && stats.topCategories.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendUp size={20} color={colors.brand[600]} weight="duotone" />
            <Text style={styles.sectionTitle}>{t('admin.top_categories', lang)}</Text>
          </View>
          {stats.topCategories.map((category, index) => (
            <View key={index} style={styles.categoryRow}>
              <Text style={styles.categoryName}>
                {t(`category.${category.name}` as any, lang)}
              </Text>
              <Text style={styles.categoryCount}>{category.count}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Top Customers */}
      {stats.topCustomers && stats.topCustomers.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={colors.brand[600]} weight="duotone" />
            <Text style={styles.sectionTitle}>{t('admin.top_customers', lang)}</Text>
          </View>
          {stats.topCustomers.map((customer, index) => (
            <View key={index} style={styles.customerRow}>
              <Text style={styles.customerEmail}>{customer.email}</Text>
              <Text style={styles.customerCount}>{customer.count}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// Need to import Text
import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[800],
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  categoryName: {
    fontSize: 14,
    color: colors.gray[700],
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.brand[500],
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  customerEmail: {
    fontSize: 14,
    color: colors.gray[700],
  },
  customerCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.brand[500],
  },
});
