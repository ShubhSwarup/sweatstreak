import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, radius } from '../../constants/theme';

interface Props {
  label: string;
  color?: string;
  bgColor?: string;
}

export const Badge: React.FC<Props> = ({ label, color = colors.textPrimary, bgColor = colors.border }) => (
  <View style={[styles.badge, { backgroundColor: bgColor }]}>
    <Text style={{ fontSize: 10, fontWeight: '600', color }}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full },
});
