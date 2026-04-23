import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from './Text';
import { colors, spacing } from '../../constants/theme';
import { useSessionStore } from '../../stores/session.store';
import { useSessionTimer } from '../../hooks/useSessionTimer';

export const SessionMiniBanner: React.FC = () => {
  const { hasActiveSession, sessionStatus, activeSession } = useSessionStore();
  const { formattedTime } = useSessionTimer();

  if (!hasActiveSession || !activeSession) return null;

  const isPaused = sessionStatus === 'paused';

  return (
    <TouchableOpacity
      style={[styles.banner, { borderLeftColor: isPaused ? colors.warning : colors.green }]}
      onPress={() => router.push('/(tabs)/workouts/active')}
      activeOpacity={0.9}
    >
      <View style={styles.left}>
        <View style={[styles.dot, { backgroundColor: isPaused ? colors.warning : colors.green }]} />
        <Text style={styles.name} numberOfLines={1}>{activeSession.name}</Text>
      </View>
      <Text style={[styles.timer, { color: isPaused ? colors.warning : colors.green }]}>{formattedTime}</Text>
      <View style={[styles.pill, { backgroundColor: isPaused ? colors.warningMuted : colors.greenMuted }]}>
        <Text style={[styles.pillText, { color: isPaused ? colors.warning : colors.green }]}>
          {isPaused ? 'PAUSED' : 'ACTIVE'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderLeftWidth: 3, gap: spacing.md,
  },
  left: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  name: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, flex: 1 },
  timer: { fontSize: 13, fontWeight: '700' },
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  pillText: { fontSize: 10, fontWeight: '700' },
});
