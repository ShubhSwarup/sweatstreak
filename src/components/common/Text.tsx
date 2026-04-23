import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

interface Props extends TextProps {
  variant?: 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodyLg' | 'caption' | 'label';
  color?: string;
}

export const Text: React.FC<Props> = ({ variant = 'body', color, style, ...props }) => (
  <RNText style={[styles[variant], { color: color ?? colors.textPrimary }, style]} {...props} />
);

const styles = StyleSheet.create({
  hero:   { fontSize: 36, fontWeight: '700' },
  h1:     { fontSize: 28, fontWeight: '700' },
  h2:     { fontSize: 22, fontWeight: '600' },
  h3:     { fontSize: 18, fontWeight: '600' },
  h4:     { fontSize: 16, fontWeight: '600' },
  body:   { fontSize: 14, fontWeight: '400' },
  bodyLg: { fontSize: 16, fontWeight: '400' },
  caption:{ fontSize: 12, fontWeight: '400' },
  label:  { fontSize: 11, fontWeight: '500', letterSpacing: 0.8, textTransform: 'uppercase' },
});
