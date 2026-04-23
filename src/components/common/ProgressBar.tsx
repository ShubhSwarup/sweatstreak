import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

interface Props { progress: number; height?: number; color?: string; bgColor?: string }

export const ProgressBar: React.FC<Props> = ({ progress, height = 4, color = colors.green, bgColor = colors.border }) => (
  <View style={[styles.track, { height, backgroundColor: bgColor }]}>
    <View style={[styles.fill, { width: `${Math.min(Math.max(progress * 100, 0), 100)}%`, backgroundColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  track: { width: '100%', borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
});
