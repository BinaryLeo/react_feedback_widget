import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Icon } from 'phosphor-react-native';
import { colors } from '../theme/colors';
import { FeedbackType } from '../types';

interface FeedbackTypeButtonProps {
  type: FeedbackType;
  label: string;
  description?: string;
  icon: Icon;
  color: string;
  bgColor: string;
  isSelected: boolean;
  onPress: () => void;
}

export function FeedbackTypeButton({
  label,
  description,
  icon: IconComponent,
  color,
  bgColor,
  isSelected,
  onPress,
}: FeedbackTypeButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: bgColor },
        isSelected && styles.selected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <IconComponent size={28} color={color} weight="fill" />
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color }]}>{label}</Text>
        {description && (
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.brand[500],
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 2,
  },
});
