import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { colors, spacing, radius } from '@/constants/theme';

const SUGGESTIONS = [
  { id: 1, title: 'Focus on Chest Today', reason: "You haven't trained chest in 5 days. Time to hit it.", exercises: ['Bench Press', 'Incline Press', 'Cable Fly'], type: 'muscle', icon: '💪' },
  { id: 2, title: 'Increase Your Squat', reason: 'You\'ve hit 8 reps at 100 kg consistently. Time to go heavier.', detail: 'Current: 100 kg → Suggested: 102.5 kg', type: 'progression', icon: '📈' },
  { id: 3, title: 'Try a Full Body Day', reason: 'Your volume is 15% lower this week. A full body session will help.', type: 'volume', icon: '⚡' },
];

export default function AISuggestionsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text></TouchableOpacity>
        <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }}>AI Suggestions</Text>
        <Text style={{ fontSize: 20 }}>🤖</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Based on your recent performance and training history.
        </Text>
        {SUGGESTIONS.map((s) => (
          <Card key={s.id} elevated style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>{s.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text variant="h4">{s.title}</Text>
                <Badge
                  label={s.type.toUpperCase()}
                  color={s.type === 'progression' ? colors.green : s.type === 'volume' ? colors.warning : colors.textSecondary}
                  bgColor={s.type === 'progression' ? colors.greenMuted : s.type === 'volume' ? colors.warningMuted : colors.border}
                />
              </View>
            </View>
            <Text variant="body" color={colors.textSecondary} style={styles.reason}>{s.reason}</Text>
            {s.exercises && (
              <View style={styles.exerciseList}>
                {s.exercises.map((ex) => <Text key={ex} variant="caption" color={colors.textSecondary}>· {ex}</Text>)}
              </View>
            )}
            {s.detail && <Text variant="caption" color={colors.green} style={{ marginTop: spacing.sm }}>{s.detail}</Text>}
            <View style={styles.cardActions}>
              {s.type !== 'progression' && <Button title="Start This Workout" onPress={() => router.push('/(tabs)/workouts/active')} size="md" style={{ flex: 1 }} />}
              {s.type === 'progression' && <Button title="Got it 👍" onPress={() => {}} size="md" variant="secondary" style={{ flex: 1 }} />}
              <Button title="Dismiss" onPress={() => {}} variant="ghost" size="md" />
            </View>
          </Card>
        ))}
        <Card style={styles.comingSoon}>
          <Text variant="label" color={colors.textMuted} style={{ textAlign: 'center', marginBottom: spacing.sm }}>MORE AI FEATURES COMING SOON</Text>
          <Text variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>Personalized workout plans, nutrition tips, recovery analysis, and more.</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  subtitle: { marginBottom: spacing.xl },
  card: { marginBottom: spacing.lg },
  cardHeader: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', marginBottom: spacing.md },
  icon: { fontSize: 28 },
  reason: { marginBottom: spacing.md },
  exerciseList: { gap: spacing.xs, marginBottom: spacing.md },
  cardActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  comingSoon: { alignItems: 'center', marginTop: spacing.lg, opacity: 0.6 },
});
