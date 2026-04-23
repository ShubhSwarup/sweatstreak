import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { ProgressBar } from '@/components/common/ProgressBar';
import { useAuthStore } from '@/stores/auth.store';
import { useDashboardStore } from '@/stores/dashboard.store';
import { colors, spacing, radius } from '@/constants/theme';

const MENU = [
  { icon: '🗓', label: 'My Plans', route: '/(tabs)/profile/plans' as const },
  { icon: '🤖', label: 'AI Suggestions', route: '/(tabs)/profile/ai-suggestions' as const },
  { icon: '💪', label: 'Exercise Library', route: null },
  { icon: '👥', label: 'Friends', route: '/(tabs)/profile/friends' as const },
  { icon: '⚙️', label: 'Settings', route: '/(tabs)/profile/settings' as const },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { xp, streak } = useDashboardStore();

  const xpToNext = Math.ceil(Math.pow(xp.level, 2) * 50) - xp.total;
  const xpForLevel = Math.ceil(Math.pow(xp.level - 1, 2) * 50);
  const xpProgress = (xp.total - xpForLevel) / (Math.ceil(Math.pow(xp.level, 2) * 50) - xpForLevel);
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'A';

  const handleLogout = () => Alert.alert('Log Out', 'Are you sure?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Log Out', style: 'destructive', onPress: logout },
  ]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text variant="h2">Profile</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile/settings')}>
          <Text style={{ fontSize: 22 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
          <View>
            <Text variant="h2">{user?.name ?? 'Athlete'}</Text>
            <Text variant="caption" color={colors.textMuted}>{user?.email}</Text>
          </View>
        </View>

        {/* XP Card */}
        <Card elevated style={styles.xpCard}>
          <View style={styles.xpRow}>
            <View>
              <Text variant="label" color={colors.textMuted}>ATHLETE RANK</Text>
              <Text variant="h1" color={colors.green}>Level {xp.level}</Text>
              <Text variant="caption" color={colors.textSecondary}>{xp.total.toLocaleString()} XP total</Text>
            </View>
            <Text style={styles.trophy}>🏆</Text>
          </View>
          <ProgressBar progress={Math.max(0, Math.min(1, xpProgress))} height={8} style={{ marginVertical: spacing.md }} />
          <Text variant="caption" color={colors.textMuted}>{xpToNext} XP to Level {xp.level + 1}</Text>
        </Card>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}><Text variant="h3" color={colors.green}>{streak.current}</Text><Text variant="label" color={colors.textMuted}>CURRENT STREAK</Text></View>
          <View style={styles.stat}><Text variant="h3" color={colors.green}>{streak.longest}</Text><Text variant="label" color={colors.textMuted}>BEST STREAK</Text></View>
          <View style={styles.stat}><Text variant="h3" color={colors.green}>47</Text><Text variant="label" color={colors.textMuted}>TOTAL WORKOUTS</Text></View>
        </View>

        {/* Menu */}
        <Card style={styles.menuCard} noPad>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuRow, i < MENU.length - 1 && styles.menuRowBorder]}
              onPress={() => item.route ? router.push(item.route) : null}
              activeOpacity={0.7}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text variant="bodyLg" style={{ flex: 1 }}>{item.label}</Text>
              <Text color={colors.textMuted}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text color={colors.danger} style={{ fontWeight: '500' }}>🚪 Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  avatarSection: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl, marginBottom: spacing.xl },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.greenMuted, borderWidth: 2, borderColor: colors.greenBorder, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 26, fontWeight: '700', color: colors.green },
  xpCard: { marginBottom: spacing.xl },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  trophy: { fontSize: 48 },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center', gap: spacing.xs, borderWidth: 1, borderColor: colors.border },
  menuCard: { marginBottom: spacing.xl },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  menuRowBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.border },
  menuIcon: { fontSize: 20, width: 28 },
  logoutBtn: { alignItems: 'center', paddingVertical: spacing.xl },
});
