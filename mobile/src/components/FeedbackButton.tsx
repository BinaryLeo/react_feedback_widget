import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ChatTeardropDots } from 'phosphor-react-native';
import { colors } from '../theme/colors';

interface FeedbackButtonProps {
  onPress: () => void;
}

export function FeedbackButton({ onPress }: FeedbackButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ChatTeardropDots size={32} color={colors.white} weight="fill" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brand[500],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 1,
  },
});
