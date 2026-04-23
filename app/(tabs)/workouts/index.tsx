import React, { useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { TemplateCard } from '@/components/common/TemplateCard';
import { Badge } from '@/components/common/Badge';
import { useModeResolver } from '@/hooks/useModeResolver';
import { useWorkoutStore } from '@/stores/workout.store';
import { useSessionStore } from '@/stores/session.store';
import { usePlanStore } from '@/stores/plan.store';
import { colors, spacing, radius } from '@/constants/theme';

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];

export default function WorkoutHubScreen() {
  const ctx = useModeResolver();
  const { templates, systemTemplates, userTemplates, suggestedExercises, fetchTemplates, fetchExercises, fetchSuggestedExercises, searchQuery, setSearchQuery, selectedMuscleGroup, setMuscleGroup } = useWorkoutStore();
  const { activeSession, sessionStatus, startSession } = useSessionStore();
  const { todayWorkout } = usePlanStore();

  useEffect(() => { fetchTemplates(); fetchExercises(); fetchSuggestedExercises(); }, []);

  const startEmpty = async () => {
    await startSession({ name: 'My Workout' });
    router.push('/(tabs)/workouts/active');
  };

  const startFromTemplate = async (templateId: string, templateName: string) => {
    try {
      await startSession({ name: templateName, template: templateId });
      router.push('/(tabs)/workouts/active');
    } catch {
      Alert.alert('Error', 'Could not start workout. Please try again.');
    }
  };

  // ── Resume Mode ─────────────────────────────────────────────────────────────
  if (ctx.mode === 'resume' && activeSession) {
    const isPaused = sessionStatus === 'paused';
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text variant="h2">Workouts</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/workouts/create-template')}><Text color={colors.green} style={{ fontSize: 24 }}>+</Text></TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Card elevated style={[styles.resumeCard, { borderColor: isPaused ? colors.warning : colors.greenBorder, borderWidth: 1 }]}>
            <View style={styles.resumeTop}>
              <View style={[styles.pulseDot, { backgroundColor: isPaused ? colors.warning : colors.green }]} />
              <Badge label={isPaused ? 'PAUSED' : 'ACTIVE'} color={isPaused ? colors.warning : colors.green} bgColor={isPaused ? colors.warningMuted : colors.greenMuted} />
            </View>
            <Text variant="h2" style={{ marginVertical: spacing.sm }}>{activeSession.name}</Text>
            <Text variant="body" color={colors.textSecondary}>{activeSession.exercises.length} exercises · tap to continue</Text>
            <Button title="RESUME WORKOUT" onPress={() => router.push('/(tabs)/workouts/active')} style={{ marginTop: spacing.lg }} />
          </Card>
          <TemplateSection title="YOUR TEMPLATES" templates={userTemplates} onPlay={startFromTemplate} />
          <TemplateSection title="SYSTEM TEMPLATES" templates={systemTemplates} onPlay={startFromTemplate} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Plan Mode ────────────────────────────────────────────────────────────────
  if (ctx.mode === 'plan' && todayWorkout?.today?.type === 'workout') {
    const t = todayWorkout.today.template;
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text variant="h2">Workouts</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/workouts/create-template')}><Text color={colors.green} style={{ fontSize: 24 }}>+</Text></TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Card elevated style={styles.planCard}>
            <Badge label="TODAY'S WORKOUT" color={colors.green} bgColor={colors.greenMuted} />
            <Text variant="h2" style={{ marginVertical: spacing.sm }}>{todayWorkout.today.label ?? t?.name ?? 'Workout'}</Text>
            {t?.exercises && (
              <View style={styles.exercisePreview}>
                {t.exercises.slice(0, 3).map((ex) => (
                  <Text key={ex.exercise} variant="caption" color={colors.textSecondary}>
                    · {ex.exerciseName} {ex.sets}×{ex.repRange?.min}-{ex.repRange?.max}
                  </Text>
                ))}
                {t.exercises.length > 3 && <Text variant="caption" color={colors.textMuted}>+{t.exercises.length - 3} more</Text>}
              </View>
            )}
            <Button title="START THIS WORKOUT" onPress={() => t ? startFromTemplate(t.id, t.name) : startEmpty()} style={{ marginTop: spacing.lg }} />
            <TouchableOpacity style={styles.swapLink} onPress={() => router.setParams({ mode: 'swap' })}>
              <Text variant="caption" color={colors.textSecondary}>Swap Workout</Text>
            </TouchableOpacity>
          </Card>
          <TemplateSection title="OTHER TEMPLATES" templates={templates} onPlay={startFromTemplate} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Quick Start / Default / Swap Mode ────────────────────────────────────────
  const isSwap = ctx.mode === 'swap';
  const isQuickStart = ctx.mode === 'quickStart';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text variant="h2">Workouts</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/workouts/create-template')}><Text color={colors.green} style={{ fontSize: 24 }}>+</Text></TouchableOpacity>
      </View>

      {isSwap && (
        <View style={styles.swapBanner}>
          <Text variant="caption" color={colors.warning}>Replacing: {ctx.replacingName ?? 'Today\'s Workout'}</Text>
          <Text variant="caption" color={colors.textMuted}>Select a template to swap to</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search templates, exercises..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
          {MUSCLE_GROUPS.map((mg) => (
            <TouchableOpacity
              key={mg}
              style={[styles.filterChip, selectedMuscleGroup === (mg === 'All' ? null : mg) && styles.filterChipActive]}
              onPress={() => setMuscleGroup(mg === 'All' ? null : mg)}
            >
              <Text style={[styles.filterText, selectedMuscleGroup === (mg === 'All' ? null : mg) && styles.filterTextActive]}>{mg}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Suggested */}
        {!isSwap && (
          <View style={styles.section}>
            <SectionHeader title="SUGGESTED FOR YOU" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
              {suggestedExercises.slice(0, 5).map((ex) => (
                <TouchableOpacity key={ex.id} style={styles.exChip}>
                  <Text variant="caption" color={colors.textPrimary} style={{ fontWeight: '600' }}>{ex.name}</Text>
                  <Text style={{ fontSize: 10, color: colors.textMuted }}>{ex.muscleGroup}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Your Templates */}
        {!isQuickStart && userTemplates.length > 0 && (
          <TemplateSection title="YOUR TEMPLATES" templates={userTemplates} onPlay={startFromTemplate} />
        )}

        {/* System Templates */}
        <TemplateSection title="SYSTEM TEMPLATES" templates={isQuickStart ? systemTemplates.slice(0, 4) : systemTemplates} onPlay={startFromTemplate} />

        {/* Empty Start */}
        <View style={styles.emptyStartSection}>
          <Button title="Start Empty Workout" onPress={startEmpty} variant="secondary" />
          {!isQuickStart && (
            <Button title="Create Plan" onPress={() => router.push('/(tabs)/workouts/create-plan')} variant="ghost" style={{ marginTop: spacing.sm }} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title, onViewAll }: { title: string; onViewAll?: () => void }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text variant="label" color={colors.textMuted}>{title}</Text>
      {onViewAll && <TouchableOpacity onPress={onViewAll}><Text variant="caption" color={colors.green}>View All</Text></TouchableOpacity>}
    </View>
  );
}

function TemplateSection({ title, templates, onPlay }: { title: string; templates: any[]; onPlay: (id: string, name: string) => void }) {
  if (!templates.length) return null;
  return (
    <View style={styles.section}>
      <SectionHeader title={title} />
      {templates.map((t) => <TemplateCard key={t.id} template={t} onPlay={() => onPlay(t.id, t.name)} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.input, borderRadius: radius.md, paddingHorizontal: spacing.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  searchIcon: { fontSize: 14, marginRight: spacing.xs },
  searchInput: { flex: 1, paddingVertical: spacing.md, color: colors.textPrimary, fontSize: 14 },
  filterScroll: { marginBottom: spacing.lg },
  filterRow: { gap: spacing.sm, paddingRight: spacing.xl },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.greenMuted, borderColor: colors.greenBorder },
  filterText: { fontSize: 12, color: colors.textSecondary },
  filterTextActive: { color: colors.green, fontWeight: '600' },
  section: { marginBottom: spacing.xl },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  hScroll: { gap: spacing.md, paddingRight: spacing.xl },
  exChip: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, gap: spacing.xs, minWidth: 100 },
  emptyStartSection: { marginTop: spacing.md, marginBottom: spacing.xxxl },
  resumeCard: { marginBottom: spacing.xl },
  resumeTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pulseDot: { width: 8, height: 8, borderRadius: 4 },
  planCard: { marginBottom: spacing.xl },
  exercisePreview: { gap: spacing.xs, marginTop: spacing.sm },
  swapLink: { alignItems: 'center', marginTop: spacing.md },
  swapBanner: { marginHorizontal: spacing.xl, marginBottom: spacing.md, padding: spacing.md, backgroundColor: colors.warningMuted, borderRadius: radius.md, borderWidth: 1, borderColor: colors.warning, gap: spacing.xs },
});
