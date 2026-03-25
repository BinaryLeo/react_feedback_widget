// Presentation Component - Tab Bar
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SquaresFour, List } from 'phosphor-react-native';
import { colors } from '../../../theme/colors';
import type { TabType } from '../../hooks/useDashboardViewModel';

interface TabBarProps {
  activeTab: TabType;
  feedbacksCount: number;
  onTabChange: (tab: TabType) => void;
}

export function TabBar({ activeTab, feedbacksCount, onTabChange }: TabBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'stats' && styles.tabButtonActive]}
        onPress={() => onTabChange('stats')}
        activeOpacity={0.8}
      >
        <SquaresFour
          size={18}
          color={activeTab === 'stats' ? colors.white : colors.gray[600]}
          weight={activeTab === 'stats' ? 'fill' : 'regular'}
        />
        <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>
          Stats
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'feedbacks' && styles.tabButtonActive]}
        onPress={() => onTabChange('feedbacks')}
        activeOpacity={0.8}
      >
        <List
          size={18}
          color={activeTab === 'feedbacks' ? colors.white : colors.gray[600]}
          weight={activeTab === 'feedbacks' ? 'fill' : 'regular'}
        />
        <Text style={[styles.tabText, activeTab === 'feedbacks' && styles.tabTextActive]}>
          Feedbacks ({feedbacksCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: colors.brand[500],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[600],
  },
  tabTextActive: {
    color: colors.white,
  },
});
