import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useSessionStore } from '@/stores/session.store';
import { templatesApi } from '@/api/templates.api';
import { colors, spacing, radius } from '@/constants/theme';
import type { WorkoutTemplate } from '@/types';

export default function TemplateDetailScreen() {
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const [template, setTemplate] = useState<WorkoutTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const { startSession } = useSessionStore();

  useEffect(() => {
    templatesApi.getTemplateById(templateId).then((t) => { setTemplate(t); setLoading(false); }).catch(() => setLoading(false));
  }, [templateId]);

  const handleStart = async () => {
    if (!template) return;
    await startSession({ name: template.name, template: template.id });
    router.push('/(tabs)/workouts/active');
  };

  if (loading || !template) return (
    <SafeAreaView style={styles.safe}><View style={styles.center}><Text color={colors.textMuted}>Loading...</Text></View></SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text></TouchableOpacity>
        <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }} numberOfLines={1}>{template.name}</Text>
        {!template.isSystem && (
          <TouchableOpacity><Text variant="caption" color={colors.green}>Edit</Text></TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Meta card */}
        <Card elevated style={styles.metaCard}>
          <View style={styles.metaRow}>
            <View style={styles.metaStat}>
              <Text variant="h2" color={colors.green}>{template.exercises.length}</Text>
              <Text variant="label" color={colors.textMuted}>EXERCISES</Text>
            </View>
            <View style={styles.dividerV} />
            <View style={styles.metaStat}>
              <Text variant="h2" color={colors.green}>{template.estimatedDuration ?? '—'}</Text>
              <Text variant="label" color={colors.textMuted}>DURATION</Text>
            </View>
            <View style={styles.dividerV} />
            <View style={styles.metaStat}>
              <Text variant="caption" color={colors.green} style={{ textAlign: 'center', fontWeight: '600' }}>
                {template.muscleGroups?.slice(0, 2).join('\n') ?? '—'}
              </Text>
              <Text variant="label" color={colors.textMuted}>FOCUS</Text>
            </View>
          </View>
          {template.isSystem && <Badge label="SYSTEM TEMPLATE" color={colors.textMuted} bgColor={colors.border} />}
        </Card>

        {/* Exercises */}
        <Text variant="label" color={colors.textMuted} style={styles.sectionLabel}>EXERCISES</Text>
        {template.exercises.map((ex, i) => (
          <TouchableOpacity key={ex.exercise} activeOpacity={0.8}>
            <Card style={styles.exCard}>
              <View style={styles.exRow}>
                <View style={styles.exNum}><Text style={{ fontSize: 12, fontWeight: '700', color: colors.textMuted }}>{i + 1}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text variant="h4">{ex.exerciseName}</Text>
                  <Text variant="caption" color={colors.textSecondary}>
                    {ex.sets} sets · {ex.repRange ? `${ex.repRange.min}–${ex.repRange.max} reps` : '—'} · {ex.restSeconds}s rest
                  </Text>
                </View>
                <Text color={colors.textMuted}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button title="START WORKOUT ▶" onPress={handleStart} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  metaCard: { marginBottom: spacing.xl },
  metaRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: spacing.md },
  metaStat: { alignItems: 'center', gap: spacing.xs },
  dividerV: { width: 0.5, height: 40, backgroundColor: colors.border },
  sectionLabel: { marginBottom: spacing.md },
  exCard: { marginBottom: spacing.sm, padding: spacing.lg },
  exRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  exNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  bottomBar: { padding: spacing.xl, borderTopWidth: 0.5, borderTopColor: colors.border },
});
