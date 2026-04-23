import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { sessionsApi } from '@/api/sessions.api';
import { useDashboardStore } from '@/stores/dashboard.store';
import { colors, spacing, radius } from '@/constants/theme';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

type CalendarDay = {
  workouts: { id: string; name: string; duration: number }[];
  totalVolume: number;
  hasPR: boolean;
};

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<Record<string, CalendarDay>>({});
  const [calLoading, setCalLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const startDate = `${year}-${pad(month + 1)}-01`;
    const endDate = `${year}-${pad(month + 1)}-${pad(new Date(year, month + 1, 0).getDate())}`;
    setCalLoading(true);
    sessionsApi.getCalendar(startDate, endDate)
      .then((data) => setCalendarData((data as Record<string, CalendarDay>) ?? {}))
      .catch(() => {})
      .finally(() => setCalLoading(false));
  }, [year, month]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const pad = (n: number) => n.toString().padStart(2, '0');
  const getKey = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`;
  const today = new Date();

  return (
    <View>
      {/* Month nav */}
      <View style={cal.nav}>
        <TouchableOpacity onPress={() => setCurrentDate(new Date(year, month - 1, 1))}>
          <Text color={colors.green} style={{ fontSize: 20 }}>‹</Text>
        </TouchableOpacity>
        <Text variant="h3">{MONTHS[month]} {year}</Text>
        <TouchableOpacity onPress={() => setCurrentDate(new Date(year, month + 1, 1))}>
          <Text color={colors.green} style={{ fontSize: 20 }}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day labels */}
      <View style={cal.weekRow}>
        {DAYS.map((d, i) => <Text key={i} style={cal.dayLabel}>{d}</Text>)}
      </View>

      {calLoading ? (
        <ActivityIndicator color={colors.green} style={{ marginVertical: spacing.xl }} />
      ) : (
        <View style={cal.grid}>
          {cells.map((d, i) => {
            if (!d) return <View key={i} style={cal.cell} />;
            const key = getKey(d);
            const data = calendarData[key];
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
            const isSelected = selectedDay === key;
            return (
              <TouchableOpacity
                key={i}
                style={[cal.cell, isSelected && cal.cellSelected]}
                onPress={() => setSelectedDay(key === selectedDay ? null : key)}
              >
                <Text style={[cal.cellText, isToday && cal.todayText, isSelected && cal.selectedText]}>{d}</Text>
                {data && <View style={[cal.dot, { backgroundColor: data.hasPR ? colors.gold : colors.green }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Selected day detail */}
      {selectedDay && calendarData[selectedDay] && (
        <Card style={{ marginTop: spacing.md }}>
          <Text variant="label" color={colors.textMuted} style={{ marginBottom: spacing.sm }}>
            {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          {calendarData[selectedDay].workouts.map((w, i) => (
            <TouchableOpacity
              key={i}
              style={cal.sessionRow}
              onPress={() => router.push(`/(tabs)/progress/session/${w.id}` as any)}
            >
              <Text variant="body">{w.name}</Text>
              <Text variant="caption" color={colors.textSecondary}>{Math.round(w.duration / 60)} min</Text>
              <Text color={colors.textMuted}>›</Text>
            </TouchableOpacity>
          ))}
          {calendarData[selectedDay].hasPR && (
            <Badge label="🏆 PR DAY" color={colors.gold} bgColor={colors.goldMuted} />
          )}
        </Card>
      )}
    </View>
  );
}

function ChartsView() {
  const { volumeByDay, topExercises, fetch } = useDashboardStore();

  useEffect(() => { fetch(); }, []);

  // Build last 7 days of volume from dashboard data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  const weeklyData = last7.map(d => volumeByDay[d] ?? 0);
  const maxVol = Math.max(...weeklyData, 1);
  const dayLabels = last7.map(d => DAYS[new Date(d + 'T00:00:00').getDay()]);
  const maxExVol = topExercises[0]?.volume ?? 1;

  return (
    <View>
      <Text variant="label" color={colors.textMuted} style={styles.sectionLabel}>WEEKLY VOLUME</Text>
      <Card style={{ marginBottom: spacing.xl }}>
        <View style={styles.barChart}>
          {weeklyData.map((v, i) => (
            <View key={i} style={styles.barCol}>
              <View style={[
                styles.volBar,
                { height: Math.max((v / maxVol) * 80, v > 0 ? 4 : 2), backgroundColor: i === 6 ? colors.green : colors.greenDark },
              ]} />
              <Text style={styles.barLabel}>{dayLabels[i]}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Text variant="label" color={colors.textMuted} style={styles.sectionLabel}>TOP EXERCISES THIS MONTH</Text>
      {topExercises.length === 0 ? (
        <Card>
          <Text variant="caption" color={colors.textMuted} style={{ textAlign: 'center', padding: spacing.lg }}>
            Complete workouts to see your top exercises
          </Text>
        </Card>
      ) : (
        topExercises.slice(0, 5).map((ex) => (
          <TouchableOpacity key={ex.exerciseId} onPress={() => router.push(`/(tabs)/progress/exercise/${ex.exerciseId}` as any)}>
            <Card style={styles.exRow}>
              <View style={{ flex: 1 }}>
                <Text variant="h4">{ex.name}</Text>
                <Text variant="caption" color={colors.textSecondary}>{ex.volume.toLocaleString()} kg total volume</Text>
              </View>
              <View style={styles.miniBar}>
                <View style={[styles.miniBarFill, { width: `${(ex.volume / maxExVol) * 100}%`, backgroundColor: colors.green }]} />
              </View>
              <Text color={colors.textMuted}>›</Text>
            </Card>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

export default function ProgressScreen() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'charts'>('calendar');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text variant="h2">Progress</Text>
      </View>

      <View style={styles.segmentRow}>
        {(['calendar', 'charts'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.segment, activeTab === tab && styles.segmentActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.segmentText, activeTab === tab && styles.segmentTextActive]}>
              {tab === 'calendar' ? 'Calendar' : 'Charts'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'calendar' ? <CalendarView /> : <ChartsView />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  segmentRow: { flexDirection: 'row', marginHorizontal: spacing.xl, marginBottom: spacing.lg, backgroundColor: colors.card, borderRadius: radius.md, padding: 3, borderWidth: 1, borderColor: colors.border },
  segment: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: radius.sm },
  segmentActive: { backgroundColor: colors.cardElevated },
  segmentText: { fontSize: 13, fontWeight: '500', color: colors.textMuted },
  segmentTextActive: { color: colors.textPrimary },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  sectionLabel: { marginBottom: spacing.md },
  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 },
  barCol: { flex: 1, alignItems: 'center', gap: spacing.xs },
  volBar: { width: '70%', borderRadius: 3, minHeight: 2 },
  barLabel: { fontSize: 10, color: colors.textMuted },
  exRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  miniBar: { width: 60, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  miniBarFill: { height: '100%', borderRadius: 3 },
});

const cal = StyleSheet.create({
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  weekRow: { flexDirection: 'row', marginBottom: spacing.sm },
  dayLabel: { flex: 1, textAlign: 'center', fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  cellSelected: { backgroundColor: colors.greenMuted, borderRadius: radius.sm },
  cellText: { fontSize: 13, color: colors.textSecondary },
  todayText: { color: colors.textPrimary, fontWeight: '700' },
  selectedText: { color: colors.green },
  dot: { width: 5, height: 5, borderRadius: 3 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.border },
});
