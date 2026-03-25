// Presentation Component - Stat Card
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { IconComponent } from '../../../types/icons';
import { colors } from '../../../theme/colors';

interface StatCardProps {
  icon: IconComponent;
  label: string;
  value: number;
  color: string;
  onPress?: () => void;
}

export function StatCard({ icon: Icon, label, value, color, onPress }: StatCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Icon size={24} color={color} weight="duotone" />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[500],
    textAlign: 'center',
  },
});
