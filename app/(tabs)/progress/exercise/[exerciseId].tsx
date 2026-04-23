import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { exercisesApi } from '@/api/exercises.api';
import { sessionsApi } from '@/api/sessions.api';
import { colors, spacing, radius } from '@/constants/theme';
import type { Exercise } from '@/types';

type Suggestion = { weight: number; reps?: number; action: 'increase' | 'hold' | 'decrease' };
type LastPerf = { weight: number; reps: number } | null;

export default function ExerciseProgressDetail() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [lastPerf, setLastPerf] = useState<LastPerf>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!exerciseId) { setIsLoading(false); return; }
    Promise.all([
      exercisesApi.getExerciseById(exerciseId),
      sessionsApi.getSuggestion(exerciseId).catch(() => null),
      exercisesApi.getLastPerformance(exerciseId).catch(() => null),
    ]).then(([ex, sugg, lp]) => {
      setExercise(ex);
      setSuggestion(sugg);
      setLastPerf(lp);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, [exerciseId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text>
          </TouchableOpacity>
          <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }}>Loading...</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.green} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text>
          </TouchableOpacity>
          <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }}>Not found</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="body" color={colors.textMuted}>Could not load exercise data.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const bestWeight = lastPerf?.weight ?? suggestion?.weight ?? 0;
  const est1RM = bestWeight > 0 ? Math.round(bestWeight * 1.27) : null;
  const isIncrease = suggestion?.action === 'increase';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text>
        </TouchableOpacity>
        <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }} numberOfLines={1}>{exercise.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Best Weight', value: bestWeight > 0 ? `${bestWeight} kg` : '--' },
            { label: 'Est. 1RM', value: est1RM ? `${est1RM} kg` : '--' },
            { label: 'Type', value: exercise.exerciseType },
            { label: 'Muscle', value: exercise.muscleGroup },
          ].map(({ label, value }) => (
            <View key={label} style={styles.stat}>
              <Text variant="h4" color={colors.green}>{value}</Text>
              <Text variant="label" color={colors.textMuted}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Last performance */}
        {lastPerf && (
          <Card style={{ marginBottom: spacing.xl }}>
            <Text variant="label" color={colors.textMuted} style={{ marginBottom: spacing.md }}>LAST PERFORMANCE</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text variant="h1" color={colors.green}>{lastPerf.weight}</Text>
                <Text variant="caption" color={colors.textMuted}>kg</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text variant="h1" color={colors.green}>{lastPerf.reps}</Text>
                <Text variant="caption" color={colors.textMuted}>reps</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Progression suggestion */}
        {suggestion && (
          <Card style={[styles.suggestionCard, { borderColor: isIncrease ? colors.greenBorder : colors.border }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text variant="h4">
                  {isIncrease ? '↑ Increase Weight' : '→ Hold Weight'}
                </Text>
                <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>
                  {isIncrease
                    ? "You've been hitting your rep target. Time to go heavier."
                    : 'Keep working at this weight to build consistency.'}
                </Text>
              </View>
              <Badge
                label={suggestion.action.toUpperCase()}
                color={isIncrease ? colors.green : colors.textMuted}
                bgColor={isIncrease ? colors.greenMuted : colors.border}
              />
            </View>
            <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.md }}>
              Suggested: {suggestion.weight} kg{suggestion.reps ? ` × ${suggestion.reps} reps` : ''}
            </Text>
          </Card>
        )}

        {/* Empty state */}
        {!lastPerf && !suggestion && (
          <Card style={{ marginBottom: spacing.lg }}>
            <Text variant="caption" color={colors.textMuted} style={{ textAlign: 'center', padding: spacing.md }}>
              Complete a workout with this exercise to see progression data.
            </Text>
          </Card>
        )}

        {/* Exercise info */}
        {exercise.description && (
          <Card style={{ marginBottom: spacing.lg }}>
            <Text variant="label" color={colors.textMuted} style={{ marginBottom: spacing.sm }}>ABOUT</Text>
            <Text variant="body" color={colors.textSecondary}>{exercise.description}</Text>
          </Card>
        )}

        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <Card>
            <Text variant="label" color={colors.textMuted} style={{ marginBottom: spacing.sm }}>SECONDARY MUSCLES</Text>
            <Text variant="body" color={colors.textSecondary}>{exercise.secondaryMuscles.join(', ')}</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  stat: { flex: 1, minWidth: '40%', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg, gap: spacing.xs, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  suggestionCard: { borderWidth: 1, marginBottom: spacing.lg },
});
