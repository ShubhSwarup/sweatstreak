import React, { useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { usePlanStore } from '@/stores/plan.store';
import { colors, spacing, radius } from '@/constants/theme';

export default function PlanListScreen() {
  const { activePlan, allPlans, fetchAllPlans, activatePlan } = usePlanStore();
  useEffect(() => { fetchAllPlans(); }, []);

  const handleActivate = (planId: string, planName: string) => {
    Alert.alert('Activate Plan', `Switch to "${planName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Activate', onPress: () => activatePlan(planId) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text></TouchableOpacity>
        <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }}>My Plans</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/workouts/create-plan')}><Text color={colors.green}>+ Create</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {activePlan && (
          <>
            <Text variant="label" color={colors.textMuted} style={styles.sectionLabel}>ACTIVE PLAN</Text>
            <TouchableOpacity onPress={() => router.push(`/(tabs)/profile/plans/${activePlan.id}`)}>
              <Card elevated style={styles.activePlanCard}>
                <View style={styles.planHeader}>
                  <Text variant="h3">{activePlan.name}</Text>
                  <Badge label="ACTIVE" color={colors.green} bgColor={colors.greenMuted} />
                </View>
                <Text variant="caption" color={colors.textSecondary} style={{ marginVertical: spacing.sm }}>
                  Day {activePlan.currentDayIndex + 1} of {activePlan.totalDays} · {Math.round((activePlan.currentDayIndex / activePlan.totalDays) * 100)}% complete
                </Text>
                <ProgressBar progress={activePlan.currentDayIndex / activePlan.totalDays} height={6} />
                <Button title="Continue Plan" onPress={() => router.push(`/(tabs)/profile/plans/${activePlan.id}`)} style={{ marginTop: spacing.lg }} />
              </Card>
            </TouchableOpacity>
          </>
        )}

        {allPlans.filter((p) => !p.isActive).length > 0 && (
          <>
            <Text variant="label" color={colors.textMuted} style={styles.sectionLabel}>OTHER PLANS</Text>
            {allPlans.filter((p) => !p.isActive).map((plan) => (
              <Card key={plan.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text variant="h4">{plan.name}</Text>
                  <Text variant="caption" color={colors.textMuted}>{plan.totalDays} days</Text>
                </View>
                <TouchableOpacity onPress={() => router.push(`/(tabs)/profile/plans/${plan.id}`)}>
                  <Text variant="caption" color={colors.green} style={{ marginTop: spacing.xs }}>View Details ›</Text>
                </TouchableOpacity>
                <Button title="Activate" onPress={() => handleActivate(plan.id, plan.name)} variant="secondary" size="sm" style={{ marginTop: spacing.md, alignSelf: 'flex-start' }} />
              </Card>
            ))}
          </>
        )}

        {allPlans.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text variant="h3" style={{ textAlign: 'center' }}>No plans yet</Text>
            <Text variant="body" color={colors.textSecondary} style={{ textAlign: 'center', marginTop: spacing.sm }}>Create a training plan to structure your workouts.</Text>
            <Button title="Create Your First Plan" onPress={() => router.push('/(tabs)/workouts/create-plan')} style={{ marginTop: spacing.xl }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  sectionLabel: { marginBottom: spacing.md, marginTop: spacing.md },
  activePlanCard: { marginBottom: spacing.xl },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planCard: { marginBottom: spacing.md },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl * 2 },
  emptyEmoji: { fontSize: 60, marginBottom: spacing.lg },
});
