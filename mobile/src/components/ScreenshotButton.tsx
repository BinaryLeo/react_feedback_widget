import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { Camera, X } from 'phosphor-react-native';
import { colors } from '../theme/colors';
import { t, Language } from '../i18n';

interface ScreenshotButtonProps {
  screenshot: string | null;
  onCapture: () => void;
  onRemove: () => void;
  isCapturing: boolean;
  language?: Language;
}

export function ScreenshotButton({
  screenshot,
  onCapture,
  onRemove,
  isCapturing,
  language = 'en',
}: ScreenshotButtonProps) {
  if (screenshot) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: screenshot }} style={styles.image} />
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <X size={16} color={colors.white} weight="bold" />
        </TouchableOpacity>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{t('widget.screenshot_attached', language)}</Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onCapture}
      disabled={isCapturing}
      activeOpacity={0.7}
    >
      <Camera size={20} color={colors.gray[500]} />
      <Text style={styles.buttonText}>
        {isCapturing
          ? t('widget.capturing', language)
          : t('widget.attach_screenshot', language)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  label: {
    color: colors.white,
    fontSize: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: colors.gray[600],
    fontSize: 14,
    fontWeight: '500',
  },
});
