import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from './Text';
import { Badge } from './Badge';
import { Card } from './Card';
import { colors, spacing, radius } from '../../constants/theme';
import type { WorkoutTemplate } from '../../types';

interface Props {
  template: WorkoutTemplate;
  onPlay?: () => void;
  compact?: boolean;
}

export const TemplateCard: React.FC<Props> = ({ template, onPlay, compact }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => router.push(`/(tabs)/workouts/${template.id}`)}
  >
    <Card style={compact ? styles.compact : styles.card}>
      <View style={styles.header}>
        <View style={styles.info}>
          {template.isSystem && (
            <Badge label="SYSTEM" color={colors.textMuted} bgColor={colors.border} />
          )}
          <Text variant="h4">{template.name}</Text>
          <Text variant="caption" color={colors.textSecondary}>
            {template.exercises.length} exercises · {template.estimatedDuration ?? '—'}
          </Text>
        </View>
        {onPlay && (
          <TouchableOpacity style={styles.playBtn} onPress={onPlay} activeOpacity={0.8}>
            <Text style={styles.playIcon}>▶</Text>
          </TouchableOpacity>
        )}
      </View>
      {!compact && template.muscleGroups && (
        <View style={styles.tags}>
          {template.muscleGroups.slice(0, 3).map((mg) => (
            <Badge key={mg} label={mg} color={colors.textSecondary} bgColor={colors.border} />
          ))}
        </View>
      )}
    </Card>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  compact: { padding: spacing.md, marginBottom: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, gap: spacing.xs },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md },
  playBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.greenMuted, borderWidth: 1, borderColor: colors.greenBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  playIcon: { color: colors.green, fontSize: 14 },
});
