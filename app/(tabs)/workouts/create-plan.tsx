import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { ProgressBar } from '@/components/common/ProgressBar';
import { plansApi } from '@/api/plans.api';
import { useWorkoutStore } from '@/stores/workout.store';
import { colors, spacing, radius } from '@/constants/theme';

type DayType = 'workout' | 'rest';
interface PlanDay { order: number; type: DayType; label: string; templateId?: string; templateName?: string }

const STEPS = ['Name', 'Build Days', 'Review'];

export default function CreatePlanScreen() {
  const [step, setStep] = useState(0);
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState<PlanDay[]>([
    { order: 1, type: 'workout', label: 'Day 1' },
    { order: 2, type: 'rest', label: 'Rest' },
    { order: 3, type: 'workout', label: 'Day 2' },
  ]);
  const [saving, setSaving] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState<number | null>(null);
  const { templates, fetchTemplates, isLoadingTemplates } = useWorkoutStore();

  const openTemplatePicker = (dayIndex: number) => {
    if (templates.length === 0) fetchTemplates();
    setShowTemplatePicker(dayIndex);
  };

  const addDay = () => setDays((d) => [...d, { order: d.length + 1, type: 'workout', label: `Day ${d.filter((x) => x.type === 'workout').length + 1}` }]);

  const toggleDayType = (index: number) => setDays((d) => d.map((day, i) => i === index ? { ...day, type: day.type === 'workout' ? 'rest' : 'workout', templateId: undefined, templateName: undefined } : day));

  const removeDay = (index: number) => setDays((d) => d.filter((_, i) => i !== index).map((day, i) => ({ ...day, order: i + 1 })));

  const assignTemplate = (dayIndex: number, templateId: string, templateName: string) => {
    setDays((d) => d.map((day, i) => i === dayIndex ? { ...day, templateId, templateName } : day));
    setShowTemplatePicker(null);
  };

  const handleSave = async () => {
    if (!planName.trim()) { Alert.alert('Name required'); return; }
    if (days.filter((d) => d.type === 'workout').length === 0) { Alert.alert('Add workout days'); return; }
    setSaving(true);
    try {
      await plansApi.createPlan({
        name: planName,
        days: days.map((d) => ({ ...d, exercises: [] })),
      });
      Alert.alert('Plan Created!', 'Your training plan is now active.', [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]);
    } catch {
      Alert.alert('Error', 'Failed to create plan.');
    } finally { setSaving(false); }
  };

  const workoutDays = days.filter((d) => d.type === 'workout').length;
  const restDays = days.filter((d) => d.type === 'rest').length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : router.back()}>
          <Text color={colors.textSecondary}>‹ {step > 0 ? 'Back' : 'Cancel'}</Text>
        </TouchableOpacity>
        <Text variant="h3" style={{ flex: 1, textAlign: 'center' }}>Create Plan</Text>
        <Text variant="caption" color={colors.textMuted}>Step {step + 1}/3</Text>
      </View>

      {/* Step indicator */}
      <View style={styles.stepRow}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, i <= step && styles.stepDotActive]}><Text style={{ fontSize: 11, fontWeight: '700', color: i <= step ? '#000' : colors.textMuted }}>{i + 1}</Text></View>
            <Text style={{ fontSize: 10, color: i <= step ? colors.green : colors.textMuted }}>{s}</Text>
          </View>
        ))}
      </View>
      <ProgressBar progress={(step + 1) / 3} height={2} style={{ marginHorizontal: spacing.xl, marginBottom: spacing.xl }} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Step 0: Name */}
        {step === 0 && (
          <View style={styles.stepContent}>
            <Text variant="h2" style={styles.stepTitle}>Name Your Plan</Text>
            <TextInput style={styles.nameInput} value={planName} onChangeText={setPlanName} placeholder="e.g. 8-Week Hypertrophy" placeholderTextColor={colors.textMuted} autoFocus />
            <TextInput style={styles.descInput} value={description} onChangeText={setDescription} placeholder="Description (optional)" placeholderTextColor={colors.textMuted} multiline />
            <Button title="Next →" onPress={() => { if (!planName.trim()) { Alert.alert('Name required'); return; } setStep(1); }} style={{ marginTop: spacing.xl }} />
          </View>
        )}

        {/* Step 1: Build Days */}
        {step === 1 && (
          <View>
            <Text variant="h2" style={styles.stepTitle}>Build Your Schedule</Text>
            <Text variant="body" color={colors.textSecondary} style={{ marginBottom: spacing.xl }}>
              Add workout and rest days. You can assign templates or add exercises to each day.
            </Text>

            {days.map((day, i) => (
              <Card key={i} style={[styles.dayCard, day.type === 'rest' && styles.dayCardRest]}>
                <View style={styles.dayRow}>
                  <Text variant="caption" color={colors.textMuted}>DAY {day.order}</Text>
                  <View style={styles.dayToggle}>
                    <TouchableOpacity style={[styles.typeBtn, day.type === 'workout' && styles.typeBtnActive]} onPress={() => day.type !== 'workout' && toggleDayType(i)}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: day.type === 'workout' ? '#000' : colors.textMuted }}>Workout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.typeBtn, day.type === 'rest' && styles.typeBtnRest]} onPress={() => day.type !== 'rest' && toggleDayType(i)}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: day.type === 'rest' ? colors.textMuted : colors.textMuted }}>Rest</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => removeDay(i)}><Text color={colors.danger} style={{ fontSize: 16 }}>✕</Text></TouchableOpacity>
                </View>

                {day.type === 'workout' && (
                  <TouchableOpacity style={styles.templatePicker} onPress={() => openTemplatePicker(i)}>
                    <Text variant="caption" color={day.templateName ? colors.textPrimary : colors.textMuted}>
                      {day.templateName ?? 'Tap to assign a template'}
                    </Text>
                    <Text variant="caption" color={colors.green}>{day.templateName ? 'Change' : '+'}</Text>
                  </TouchableOpacity>
                )}
              </Card>
            ))}

            {showTemplatePicker !== null && (
              <Card style={styles.pickerCard}>
                <Text variant="label" color={colors.textMuted} style={{ marginBottom: spacing.md }}>SELECT TEMPLATE FOR DAY {(showTemplatePicker ?? 0) + 1}</Text>
                {isLoadingTemplates ? (
                  <ActivityIndicator color={colors.green} style={{ paddingVertical: spacing.lg }} />
                ) : templates.map((t) => (
                  <TouchableOpacity key={t.id} style={styles.pickerRow} onPress={() => assignTemplate(showTemplatePicker, t.id, t.name)}>
                    <Text variant="body">{t.name}</Text>
                    <Text variant="caption" color={colors.textMuted}>{t.exercises.length} exercises</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setShowTemplatePicker(null)} style={{ marginTop: spacing.md }}>
                  <Text variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>Cancel</Text>
                </TouchableOpacity>
              </Card>
            )}

            <TouchableOpacity style={styles.addDayBtn} onPress={addDay}>
              <Text color={colors.green}>+ Add Day</Text>
            </TouchableOpacity>

            <Button title="Next →" onPress={() => setStep(2)} style={{ marginTop: spacing.xl }} />
          </View>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <View>
            <Text variant="h2" style={styles.stepTitle}>Review Plan</Text>
            <Card elevated style={{ marginBottom: spacing.xl }}>
              <Text variant="h3">{planName}</Text>
              <View style={styles.reviewStats}>
                <View style={styles.reviewStat}><Text variant="h3" color={colors.green}>{days.length}</Text><Text variant="label" color={colors.textMuted}>TOTAL DAYS</Text></View>
                <View style={styles.reviewStat}><Text variant="h3" color={colors.green}>{workoutDays}</Text><Text variant="label" color={colors.textMuted}>WORKOUTS</Text></View>
                <View style={styles.reviewStat}><Text variant="h3" color={colors.green}>{restDays}</Text><Text variant="label" color={colors.textMuted}>REST DAYS</Text></View>
              </View>
            </Card>

            {days.map((day, i) => (
              <View key={i} style={styles.reviewDay}>
                <View style={[styles.reviewDot, { backgroundColor: day.type === 'workout' ? colors.green : colors.border }]} />
                <View>
                  <Text variant="body">Day {day.order} — {day.type === 'rest' ? '🌙 Rest' : day.templateName ?? 'Workout'}</Text>
                  {day.type === 'workout' && !day.templateName && <Text variant="caption" color={colors.warning}>No template assigned</Text>}
                </View>
              </View>
            ))}

            <Button title="Activate This Plan" onPress={handleSave} loading={saving} style={{ marginTop: spacing.xl }} />
            <Button title="Save as Draft" onPress={handleSave} variant="ghost" style={{ marginTop: spacing.sm }} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, gap: spacing.md },
  stepRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  stepItem: { alignItems: 'center', gap: spacing.xs },
  stepDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: colors.green },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  stepContent: {},
  stepTitle: { marginBottom: spacing.xl },
  nameInput: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, paddingVertical: spacing.lg, borderBottomWidth: 0.5, borderBottomColor: colors.border, marginBottom: spacing.lg },
  descInput: { fontSize: 15, color: colors.textSecondary, paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.border, marginBottom: spacing.xl },
  dayCard: { marginBottom: spacing.md },
  dayCardRest: { opacity: 0.7 },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  dayToggle: { flexDirection: 'row', backgroundColor: colors.border, borderRadius: radius.sm, overflow: 'hidden', flex: 1 },
  typeBtn: { flex: 1, paddingVertical: spacing.xs, alignItems: 'center' },
  typeBtnActive: { backgroundColor: colors.green },
  typeBtnRest: { backgroundColor: colors.cardElevated },
  templatePicker: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderTopWidth: 0.5, borderTopColor: colors.border, marginTop: spacing.sm },
  pickerCard: { marginBottom: spacing.lg },
  pickerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  addDayBtn: { alignItems: 'center', paddingVertical: spacing.lg, borderWidth: 1, borderColor: colors.greenBorder, borderStyle: 'dashed', borderRadius: radius.md },
  reviewStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.lg },
  reviewStat: { alignItems: 'center', gap: spacing.xs },
  reviewDay: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  reviewDot: { width: 10, height: 10, borderRadius: 5 },
});
