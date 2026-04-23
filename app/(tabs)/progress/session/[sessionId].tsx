import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { sessionsApi } from '@/api/sessions.api';
import { colors, spacing, radius } from '@/constants/theme';
import type { WorkoutSession } from '@/types';

export default function PastSessionDetailScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setIsLoading(false); return; }
    sessionsApi.getSessionById(sessionId)
      .then(setSession)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text>
          </TouchableOpacity>
          <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }}>Session</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.green} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text>
          </TouchableOpacity>
          <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }}>Not found</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="body" color={colors.textMuted}>Could not load this session.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const date = new Date(session.startedAt).toLocaleDateString();
  const duration = session.durationSeconds ? `${Math.round(session.durationSeconds / 60)}m` : '--';
  const totalVolume = session.sessionSummary?.totalVolume ?? 0;
  const totalSets = session.sessionSummary?.totalSets ?? 0;
  const personalRecords = session.sessionSummary?.personalRecords ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text>
        </TouchableOpacity>
        <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }} numberOfLines={1}>{session.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          {[
            { label: 'Date', value: date },
            { label: 'Duration', value: duration },
            { label: 'Volume', value: `${totalVolume.toLocaleString()}kg` },
            { label: 'Sets', value: String(totalSets) },
          ].map(({ label, value }) => (
            <View key={label} style={styles.stat}>
              <Text variant="h4" color={colors.green}>{value}</Text>
              <Text variant="label" color={colors.textMuted}>{label}</Text>
            </View>
          ))}
        </View>

        {personalRecords.length > 0 && (
          <Card style={{ marginBottom: spacing.lg }}>
            <Text variant="label" color={colors.gold} style={{ marginBottom: spacing.md }}>🏆 PERSONAL RECORDS</Text>
            {personalRecords.map((pr, i) => (
              <View key={i} style={styles.prRow}>
                <Text variant="body">{pr.exerciseName ?? 'Exercise'}</Text>
                <Badge label={`${pr.type.toUpperCase()} PR`} color={colors.gold} bgColor={colors.goldMuted} />
                <Text variant="body" color={colors.green}>{pr.value} kg</Text>
              </View>
            ))}
          </Card>
        )}

        <Text variant="label" color={colors.textMuted} style={{ marginBottom: spacing.md }}>EXERCISES</Text>
        {session.exercises.map((ex, i) => (
          <Card key={i} style={{ marginBottom: spacing.md }}>
            <Text variant="h4" style={{ marginBottom: spacing.md }}>{ex.name}</Text>
            <View style={styles.setHeader}>
              {['SET', 'WEIGHT', 'REPS'].map((h) => (
                <Text key={h} style={styles.setHeaderText}>{h}</Text>
              ))}
            </View>
            {ex.sets.map((set, si) => (
              <View key={si} style={[styles.setRow, set.isPR && styles.setRowPR]}>
                <Text style={styles.setCell}>{set.setNumber}</Text>
                <Text style={[styles.setCell, { color: set.isPR ? colors.gold : colors.textPrimary }]}>
                  {set.weight != null ? `${set.weight} kg` : '--'}
                </Text>
                <Text style={styles.setCell}>{set.reps ?? '--'}</Text>
                {set.isPR && <Badge label="PR" color={colors.gold} bgColor={colors.goldMuted} />}
              </View>
            ))}
            {ex.summary && (
              <View style={styles.exSummary}>
                <Text variant="caption" color={colors.textMuted}>
                  Best: {ex.summary.bestWeight}kg × {ex.summary.bestReps} · Volume: {ex.summary.volume.toLocaleString()}kg
                </Text>
              </View>
            )}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  stat: { flex: 1, minWidth: '40%', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg, gap: spacing.xs, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  prRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xs },
  setHeader: { flexDirection: 'row', marginBottom: spacing.xs },
  setHeaderText: { flex: 1, fontSize: 10, fontWeight: '600', color: colors.textMuted, textAlign: 'center', textTransform: 'uppercase' },
  setRow: { flexDirection: 'row', paddingVertical: spacing.xs, alignItems: 'center' },
  setRowPR: { backgroundColor: 'rgba(255,215,0,0.05)', borderRadius: radius.sm },
  setCell: { flex: 1, fontSize: 14, color: colors.textPrimary, textAlign: 'center' },
  exSummary: { marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 0.5, borderTopColor: colors.border },
});
