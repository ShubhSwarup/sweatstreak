import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { colors, spacing, radius } from '@/constants/theme';

export default function SettingsScreen() {
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [defaultRest, setDefaultRest] = useState(90);
  const [autoTimer, setAutoTimer] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [timerSound, setTimerSound] = useState(true);

  const restOptions = [60, 90, 120, 180];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text></TouchableOpacity>
        <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {[{
          title: 'UNITS',
          rows: [(
            <View key="units" style={styles.settingRow}>
              <Text variant="body">Weight Unit</Text>
              <View style={styles.toggle}>
                {(['kg', 'lbs'] as const).map((u) => (
                  <TouchableOpacity key={u} style={[styles.toggleBtn, weightUnit === u && styles.toggleBtnActive]} onPress={() => setWeightUnit(u)}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: weightUnit === u ? '#000' : colors.textMuted }}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )],
        }, {
          title: 'WORKOUT',
          rows: [
            (
              <View key="autoTimer" style={styles.settingRow}>
                <View><Text variant="body">Auto-start rest timer</Text><Text variant="caption" color={colors.textMuted}>Starts automatically after each set</Text></View>
                <Switch value={autoTimer} onValueChange={setAutoTimer} trackColor={{ true: colors.green, false: colors.border }} thumbColor={autoTimer ? '#fff' : colors.textMuted} />
              </View>
            ),
            (
              <View key="defaultRest" style={styles.settingRow}>
                <Text variant="body">Default rest time</Text>
                <View style={styles.restRow}>
                  {restOptions.map((r) => (
                    <TouchableOpacity key={r} style={[styles.restBtn, defaultRest === r && styles.restBtnActive]} onPress={() => setDefaultRest(r)}>
                      <Text style={{ fontSize: 12, color: defaultRest === r ? '#000' : colors.textMuted }}>{r}s</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ),
          ],
        }, {
          title: 'NOTIFICATIONS',
          rows: [
            (<View key="notifs" style={styles.settingRow}><Text variant="body">Workout reminders</Text><Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: colors.green, false: colors.border }} thumbColor={notifications ? '#fff' : colors.textMuted} /></View>),
            (<View key="sound" style={styles.settingRow}><Text variant="body">Rest timer sound</Text><Switch value={timerSound} onValueChange={setTimerSound} trackColor={{ true: colors.green, false: colors.border }} thumbColor={timerSound ? '#fff' : colors.textMuted} /></View>),
          ],
        }, {
          title: 'ACCOUNT',
          rows: [
            (<TouchableOpacity key="name" style={styles.settingRow}><Text variant="body">Change Name</Text><Text color={colors.textMuted}>›</Text></TouchableOpacity>),
            (<TouchableOpacity key="email" style={styles.settingRow}><Text variant="body">Change Email</Text><Text color={colors.textMuted}>›</Text></TouchableOpacity>),
            (<TouchableOpacity key="pass" style={styles.settingRow}><Text variant="body">Change Password</Text><Text color={colors.textMuted}>›</Text></TouchableOpacity>),
          ],
        }].map((section) => (
          <View key={section.title} style={{ marginBottom: spacing.xl }}>
            <Text variant="label" color={colors.textMuted} style={styles.sectionLabel}>{section.title}</Text>
            <Card noPad>
              {section.rows.map((row, i) => (
                <View key={i} style={[styles.cardRow, i < section.rows.length - 1 && styles.cardRowBorder]}>{row}</View>
              ))}
            </Card>
          </View>
        ))}

        <Card style={styles.dangerCard}>
          <TouchableOpacity onPress={() => Alert.alert('Delete Account', 'This is permanent and cannot be undone.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive' }])}>
            <Text color={colors.danger} style={{ fontWeight: '500' }}>Delete Account</Text>
          </TouchableOpacity>
        </Card>

        <Text variant="caption" color={colors.textMuted} style={styles.version}>SweatStreak v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  sectionLabel: { marginBottom: spacing.sm },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  cardRow: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  cardRowBorder: { borderBottomWidth: 0.5, borderBottomColor: colors.border },
  toggle: { flexDirection: 'row', backgroundColor: colors.border, borderRadius: radius.sm, overflow: 'hidden' },
  toggleBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, minWidth: 44, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: colors.green },
  restRow: { flexDirection: 'row', gap: spacing.xs },
  restBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, backgroundColor: colors.border, borderRadius: radius.sm },
  restBtnActive: { backgroundColor: colors.green },
  dangerCard: { borderColor: colors.danger, borderWidth: 1, alignItems: 'center', marginBottom: spacing.xl },
  version: { textAlign: 'center', marginBottom: spacing.xl },
});
