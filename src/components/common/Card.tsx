import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';

interface Props extends ViewProps {
  elevated?: boolean;
  noPad?: boolean;
}

export const Card: React.FC<Props> = ({ elevated, noPad, style, children, ...props }) => (
  <View style={[styles.card, elevated && styles.elevated, noPad && styles.noPad, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  elevated: { backgroundColor: colors.cardElevated },
  noPad: { padding: 0 },
});
