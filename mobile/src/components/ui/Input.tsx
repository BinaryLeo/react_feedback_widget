import React from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { colors } from '../../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  style,
  ...props
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.gray[400]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.gray[900],
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
});
