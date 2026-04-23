import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from './Text';
import { colors, radius, spacing } from '../../constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<Props> = ({
  title, onPress, variant = 'primary', size = 'lg',
  loading, disabled, style, textStyle, icon,
}) => {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[styles.base, styles[variant], styles[`size_${size}`], isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000' : colors.green} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, styles[`text_${variant}`], textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderRadius: radius.md },
  primary: { backgroundColor: colors.green },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.green },
  danger: { backgroundColor: colors.danger },
  ghost: { backgroundColor: 'transparent' },
  size_sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  size_md: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  size_lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
  disabled: { opacity: 0.5 },
  text: { fontWeight: '600', fontSize: 15 },
  text_primary: { color: '#000' },
  text_secondary: { color: colors.green },
  text_danger: { color: '#fff' },
  text_ghost: { color: colors.textSecondary },
});
