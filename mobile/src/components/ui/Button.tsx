import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type TouchableOpacityProps,
} from 'react-native';
import { colors } from '../../theme/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  style,
  ...props
}: ButtonProps) {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    (disabled || isLoading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.textBase,
    styles[`${variant}Text`],
    styles[`${size}Text`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.brand[600]}
        />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  primary: {
    backgroundColor: colors.brand[600],
  },
  secondary: {
    backgroundColor: colors.gray[200],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontWeight: '600',
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.gray[800],
  },
  outlineText: {
    color: colors.gray[700],
  },
  ghostText: {
    color: colors.brand[600],
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
});
