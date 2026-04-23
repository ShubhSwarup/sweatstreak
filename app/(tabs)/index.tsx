import React, { useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Badge } from '@/components/common/Badge';
import { useDashboardStore } from '@/stores/dashboard.store';
import { useAuthStore } from '@/stores/auth.store';
import { colors, spacing, radius } from '@/constants/theme';
// ─── FTU Dashboard ────────────────────────────────────────────────────────────
function FTUDashboard({ name }: { name: string }) {

  return (
    <View style={styles.ftuContainer}>
      <Text variant="h1" style={styles.ftuWelcome}>Welcome,{'\n'}{name}!</Text>
      <Text variant="body" color={colors.textSecondary} style={styles.ftuSub}>
        Let's build your first workout.
      </Text>

      <TouchableOpacity style={styles.optionCard} onPress={() => router.push({ pathname: '/(tabs)/workouts', params: { mode: 'quickStart' } })} activeOpacity={0.8}>
        <View style={styles.optionIcon}><Text style={{ fontSize: 20 }}>⚡</Text></View>
        <View style={styles.optionInfo}>
          <Text variant="h4">Quick Start</Text>
          <Text variant="caption" color={colors.textSecondary}>Jump into a recommended routine</Text>
        </View>
        <Text color={colors.textMuted}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionCard} onPress={() => router.push('/(tabs)/workouts')} activeOpacity={0.8}>
        <View style={styles.optionIcon}><Text style={{ fontSize: 20 }}>+</Text></View>
        <View style={styles.optionInfo}>
          <Text variant="h4">Build From Scratch</Text>
          <Text variant="caption" color={colors.textSecondary}>Choose your own exercises</Text>
        </View>
        <Text color={colors.textMuted}>›</Text>
      </TouchableOpacity>

      <Button title="Start Your First Workout" onPress={() => router.push({ pathname: '/(tabs)/workouts', params: { mode: 'quickStart' } })} style={styles.ftuBtn} />
    </View>
  );
}

// ─── Volume Chart ─────────────────────────────────────────────────────────────
function VolumeChart({ volumeByDay }: { volumeByDay: Record<string, number> }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const values = Object.values(volumeByDay);
  const max = Math.max(...values, 1);
  const today = new Date().getDay();
  const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.chartRow}>
      {days.map((day, i) => {
        const vol = values[i] ?? 0;
        const barH = Math.max((vol / max) * 60, vol > 0 ? 6 : 2);
        const isToday = dayMap[today] === day;
        return (
          <View key={day} style={styles.chartCol}>
            <View style={[styles.bar, { height: barH, backgroundColor: isToday ? colors.green : vol > 0 ? colors.greenDark : colors.border }]} />
            <Text style={[styles.dayLabel, isToday && { color: colors.green }]}>{day.charAt(0)}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const { user } = useAuthStore();
  const {
    isFirstTimeUser, streak, xp, lastWorkout, weeklyVolume,
    volumeByDay, todayPlan, isLoading, fetch,
  } = useDashboardStore();

  useEffect(() => { fetch(); }, []);

  const isRestDay = todayPlan?.today?.type === 'rest';
  const isWorkoutDay = todayPlan?.today?.type === 'workout';
  const dayProgress = todayPlan ? (todayPlan.currentIndex / todayPlan.totalDays) : 0;
  const xpToNext = Math.ceil(Math.pow(xp.level, 2) * 50) - xp.total;

  if (isFirstTimeUser) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.appName}>SWEATSTREAK</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <FTUDashboard name={user?.name?.split(' ')[0] ?? 'Athlete'} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.[0] ?? 'A'}</Text></View>
        <Text style={styles.appName}>SWEATSTREAK</Text>
        <TouchableOpacity style={styles.streakBadge} onPress={() => router.push('/(tabs)/progress')}>
          <Text style={styles.streakText}>🔥 {streak.current} days</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetch} tintColor={colors.green} />}
      >
        {/* TODAY'S SESSION / REST DAY card */}
        {isRestDay && (
          <Card elevated style={styles.todayCard}>
            <Badge label="ACTIVE RECOVERY" color={colors.green} bgColor={colors.greenMuted} />
            <View style={styles.restRow}>
              <View style={{ flex: 1 }}>
                <Text variant="h1" style={{ marginVertical: spacing.sm }}>Rest Day</Text>
                <Text variant="body" color={colors.textSecondary}>Recovery is part of the process.</Text>
                <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
                  {todayPlan.planName} · Day {todayPlan.currentIndex + 1} of {todayPlan.totalDays}
                </Text>
                <ProgressBar progress={dayProgress} height={4} style={{ marginTop: spacing.sm }} />
                <Text variant="caption" color={colors.green} style={{ marginTop: spacing.sm }}>NEXT WORKOUT TOMORROW</Text>
              </View>
              <Text style={styles.moonIcon}>🌙</Text>
            </View>
            <View style={styles.restBtns}>
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile/plans')}><Text variant="caption" color={colors.green}>VIEW PLAN</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => {}}><Text variant="caption" color={colors.textSecondary}>BROWSE EXERCISES</Text></TouchableOpacity>
            </View>
          </Card>
        )}

        {isWorkoutDay && (
          <Card elevated style={styles.todayCard}>
            <View style={styles.todayTop}>
              <Badge label="TODAY'S SESSION" color={colors.green} bgColor={colors.greenMuted} />
              {todayPlan.skippedDays > 0 && <Badge label={`${todayPlan.skippedDays} SKIPPED`} color={colors.warning} bgColor={colors.warningMuted} />}
            </View>
            <Text variant="h2" style={{ marginVertical: spacing.sm }}>{todayPlan.today.label ?? todayPlan.today.template?.name ?? 'Workout'}</Text>
            <Text variant="caption" color={colors.textSecondary}>
              {todayPlan.planName} · Day {todayPlan.currentIndex + 1} of {todayPlan.totalDays} · {Math.round(dayProgress * 100)}% complete
            </Text>
            <ProgressBar progress={dayProgress} height={4} style={{ marginVertical: spacing.md }} />
            <Button
              title="START WORKOUT ▶"
              onPress={() => {
                if (todayPlan.today.template?.id) {
                  router.push({ pathname: '/(tabs)/workouts/active', params: { templateId: todayPlan.today.template.id } });
                } else {
                  router.push('/(tabs)/workouts/active');
                }
              }}
            />
            <TouchableOpacity style={styles.changeLink} onPress={() => router.push({ pathname: '/(tabs)/workouts', params: { mode: 'swap', replacingName: todayPlan.today.label } })}>
              <Text variant="caption" color={colors.green}>Change Workout</Text>
            </TouchableOpacity>
          </Card>
        )}

        {!todayPlan && (
          <Card elevated style={styles.noPlanCard}>
            <Text variant="h4">No plan active</Text>
            <Text variant="caption" color={colors.textSecondary} style={{ marginTop: spacing.xs }}>Set up a training plan to get structured workouts.</Text>
            <Button title="Set Up a Plan" onPress={() => router.push('/(tabs)/workouts/create-plan')} variant="secondary" size="md" style={{ marginTop: spacing.lg }} />
          </Card>
        )}

        {/* RANK STATUS */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/(tabs)/profile')}>
          <Card style={styles.sectionCard}>
            <Text variant="label" color={colors.textMuted}>RANK STATUS</Text>
            <View style={styles.levelRow}>
              <Text variant="h1">Level {xp.level}</Text>
            </View>
            <ProgressBar progress={1 - (xpToNext / (xp.level * 50 + 400))} height={6} style={{ marginVertical: spacing.sm }} />
            <Text variant="caption" color={colors.textSecondary}>{xpToNext} XP to next level</Text>
          </Card>
        </TouchableOpacity>

        {/* WEEKLY VOLUME */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text variant="label" color={colors.textMuted}>WEEKLY VOLUME</Text>
            <Badge label="ON TRACK" color={colors.green} bgColor={colors.greenMuted} />
          </View>
          <Text variant="h1" style={{ marginVertical: spacing.sm }}>{weeklyVolume.toLocaleString()} KG</Text>
          <VolumeChart volumeByDay={volumeByDay} />
        </Card>

        {/* PREVIOUS SESSION */}
        {lastWorkout && (
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/(tabs)/progress')}>
            <Card style={[styles.sectionCard, { marginBottom: spacing.xxxl }]}>
              <Text variant="label" color={colors.textMuted}>PREVIOUS SESSION</Text>
              <View style={styles.lastWorkoutRow}>
                <Text style={styles.clockIcon}>🕐</Text>
                <View style={{ flex: 1 }}>
                  <Text variant="h4">{lastWorkout.name}</Text>
                  <Text variant="caption" color={colors.textSecondary}>
                    {new Date(lastWorkout.date).toLocaleDateString()} · {Math.round(lastWorkout.duration / 60)} min
                  </Text>
                </View>
                <Text variant="h4" color={colors.green}>{lastWorkout.volume.toLocaleString()} KG</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, gap: spacing.md },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.greenMuted, borderWidth: 1, borderColor: colors.greenBorder, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '700', color: colors.green },
  appName: { flex: 1, fontSize: 16, fontWeight: '800', color: colors.green, letterSpacing: 1 },
  streakBadge: { backgroundColor: colors.greenMuted, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.greenBorder },
  streakText: { fontSize: 13, fontWeight: '600', color: colors.green },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  // FTU
  ftuContainer: { paddingTop: spacing.xl, gap: spacing.lg },
  ftuWelcome: { fontSize: 34, lineHeight: 42 },
  ftuSub: { marginBottom: spacing.xl },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  optionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.greenMuted, alignItems: 'center', justifyContent: 'center' },
  optionInfo: { flex: 1 },
  ftuBtn: { marginTop: spacing.xl },
  // Cards
  todayCard: { marginBottom: spacing.lg },
  todayTop: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, flexWrap: 'wrap' },
  changeLink: { alignItems: 'center', marginTop: spacing.md },
  restRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  restBtns: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.lg },
  moonIcon: { fontSize: 48, opacity: 0.3 },
  noPlanCard: { marginBottom: spacing.lg },
  sectionCard: { marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  levelRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80, marginTop: spacing.md },
  chartCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: spacing.xs },
  bar: { width: '60%', borderRadius: 3, minHeight: 2 },
  dayLabel: { fontSize: 10, color: colors.textMuted },
  lastWorkoutRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  clockIcon: { fontSize: 22 },
});
