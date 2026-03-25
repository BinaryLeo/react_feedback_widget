// Presentation Component - Error State
import React from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { WifiSlash } from 'phosphor-react-native';
import { Button } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import type { Language } from '../../../i18n';
import { t } from '../../../i18n';

interface ErrorStateProps {
  error: string;
  lang: Language;
  isRefreshing: boolean;
  onRetry: () => void;
}

export function ErrorState({
  error,
  lang,
  isRefreshing,
  onRetry,
}: ErrorStateProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRetry} />
      }
    >
      <WifiSlash size={64} color={colors.gray[400]} />
      <Text style={styles.title}>Connection Error</Text>
      <Text style={styles.message}>{error}</Text>
      
      <View style={styles.troubleshootingBox}>
        <Text style={styles.troubleshootingTitle}>Troubleshooting:</Text>
        <Text style={styles.troubleshootingText}>1. Check if backend is running:</Text>
        <Text style={styles.troubleshootingCode}>./start.sh</Text>
        <Text style={styles.troubleshootingText}>2. Verify API is accessible:</Text>
        <Text style={styles.troubleshootingCode}>http://localhost:3333/health</Text>
        <Text style={styles.troubleshootingText}>3. For iOS Simulator, try:</Text>
        <Text style={styles.troubleshootingCode}>http://127.0.0.1:3333</Text>
      </View>
      
      <Button onPress={onRetry} style={styles.retryButton}>
        {t('common.retry', lang)}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.gray[800],
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  troubleshootingBox: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  troubleshootingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray[800],
    marginBottom: 12,
  },
  troubleshootingText: {
    fontSize: 13,
    color: colors.gray[600],
    marginBottom: 4,
  },
  troubleshootingCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: colors.brand[600],
    backgroundColor: colors.brand[50],
    padding: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  retryButton: {
    minWidth: 120,
  },
});
