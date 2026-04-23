import React, { useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { usePlanStore } from '@/stores/plan.store';
import { colors, spacing, radius } from '@/constants/theme';

export default function PlanDetailScreen() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { allPlans, activePlan, isLoading, fetchAllPlans, skipDay, restartPlan } = usePlanStore();

  useEffect(() => {
    if (allPlans.length === 0) fetchAllPlans();
  }, []);

  const plan =
    allPlans.find((p) => p.id === planId) ??
    (activePlan?.id === planId ? activePlan : null);

  if (isLoading && !plan) {
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

  if (!plan) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text>
          </TouchableOpacity>
          <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }}>Plan not found</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="body" color={colors.textMuted}>Could not load plan details.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = plan.totalDays > 0 ? plan.currentDayIndex / plan.totalDays : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text>
        </TouchableOpacity>
        <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }} numberOfLines={1}>{plan.name}</Text>
        {plan.isActive && <Badge label="ACTIVE" color={colors.green} bgColor={colors.greenMuted} />}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card elevated style={{ marginBottom: spacing.xl }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm }}>
            <Text variant="caption" color={colors.textMuted}>Day {plan.currentDayIndex + 1} of {plan.totalDays}</Text>
            <Text variant="caption" color={colors.green}>{Math.round(progress * 100)}% complete</Text>
          </View>
          <ProgressBar progress={progress} height={8} style={{ marginBottom: spacing.lg }} />
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Button
              title="Skip Today →"
              onPress={() => Alert.alert('Skip Day?', 'Move to the next workout day?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Skip', onPress: skipDay },
              ])}
              variant="secondary" size="sm" style={{ flex: 1 }}
            />
            <Button
              title="Restart ↺"
              onPress={() => Alert.alert('Restart Plan?', 'Reset to Day 1?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Restart', style: 'destructive', onPress: restartPlan },
              ])}
              variant="ghost" size="sm" style={{ flex: 1 }}
            />
          </View>
        </Card>

        <Text variant="label" color={colors.textMuted} style={{ marginBottom: spacing.md }}>SCHEDULE</Text>
        {plan.days.map((day, i) => {
          const isCurrent = i === plan.currentDayIndex;
          const isPast = i < plan.currentDayIndex;
          const templateName = day.template?.name ?? day.label;
          return (
            <View key={i} style={[styles.dayRow, isCurrent && styles.dayRowCurrent]}>
              <View style={[styles.dayDot, { backgroundColor: isPast ? colors.green : isCurrent ? colors.green : colors.border }]}>
                {isPast && <Text style={{ fontSize: 10, color: '#000' }}>✓</Text>}
                {isCurrent && <View style={styles.dayDotPulse} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
                  <Text variant="body" style={{ opacity: isPast ? 0.5 : 1 }}>
                    {day.type === 'rest' ? '🌙 Rest Day' : templateName ?? `Day ${day.order}`}
                  </Text>
                  {isCurrent && <Badge label="TODAY" color={colors.green} bgColor={colors.greenMuted} />}
                </View>
                {day.type === 'workout' && day.template?.name && (
                  <Text variant="caption" color={colors.textMuted}>{day.template.name}</Text>
                )}
              </View>
              {isCurrent && day.type === 'workout' && (
                <TouchableOpacity
                  style={styles.playBtn}
                  onPress={() => {
                    if (day.template?.id) {
                      router.push({ pathname: '/(tabs)/workouts/active', params: { templateId: day.template.id } });
                    } else {
                      router.push('/(tabs)/workouts/active');
                    }
                  }}
                >
                  <Text style={{ color: colors.green, fontSize: 14 }}>▶</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, gap: spacing.sm },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  dayRowCurrent: { backgroundColor: colors.greenMuted, borderRadius: radius.md, paddingHorizontal: spacing.md, borderBottomWidth: 0 },
  dayDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dayDotPulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#000' },
  playBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.greenMuted, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.greenBorder },
});
