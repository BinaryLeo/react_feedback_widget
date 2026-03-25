import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { colors } from '../../theme/colors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 'large',
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const content = (
    <>
      <ActivityIndicator size={size} color={colors.brand[600]} />
      {text && <Text style={styles.text}>{text}</Text>}
    </>
  );

  if (fullScreen) {
    return <View style={[styles.container, styles.fullScreen]}>{content}</View>;
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    zIndex: 100,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: colors.gray[600],
  },
});
