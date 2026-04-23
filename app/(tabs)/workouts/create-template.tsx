import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { templatesApi } from '@/api/templates.api';
import { useWorkoutStore } from '@/stores/workout.store';
import { colors, spacing, radius } from '@/constants/theme';
import type { TemplateExercise, Exercise } from '@/types';

export default function CreateTemplateScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<TemplateExercise[]>([]);
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const { allExercises, fetchExercises, isLoadingExercises } = useWorkoutStore();

  const openPicker = () => {
    if (allExercises.length === 0) fetchExercises({ limit: 200 });
    setShowPicker(true);
  };

  const addExercise = (ex: Exercise) => {
    setExercises((prev) => [...prev, {
      exercise: ex.id, exerciseName: ex.name, order: prev.length + 1,
      sets: 3, repRange: { min: 8, max: 12 }, restSeconds: 90,
    }]);
    setShowPicker(false);
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index).map((e, i) => ({ ...e, order: i + 1 })));
  };

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Name required', 'Please give your template a name.'); return; }
    if (exercises.length === 0) { Alert.alert('Add exercises', 'Add at least one exercise.'); return; }
    setSaving(true);
    try {
      await templatesApi.createTemplate({ name: name.trim(), description, exercises });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text color={colors.textSecondary}>Cancel</Text></TouchableOpacity>
        <Text variant="h3" style={{ flex: 1, textAlign: 'center' }}>Create Template</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text color={colors.green} style={{ fontWeight: '700' }}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <TextInput style={styles.nameInput} value={name} onChangeText={setName} placeholder="Template name..." placeholderTextColor={colors.textMuted} />
        <TextInput style={styles.descInput} value={description} onChangeText={setDescription} placeholder="Description (optional)" placeholderTextColor={colors.textMuted} multiline />

        <Text variant="label" color={colors.textMuted} style={styles.sectionLabel}>
          EXERCISES {exercises.length > 0 && `(${exercises.length})`}
        </Text>

        {exercises.map((ex, i) => (
          <Card key={i} style={styles.exCard}>
            <View style={styles.exRow}>
              <View style={styles.exNum}><Text style={{ fontSize: 12, color: colors.textMuted }}>{i + 1}</Text></View>
              <View style={{ flex: 1 }}>
                <Text variant="h4">{ex.exerciseName}</Text>
                <View style={styles.exConfigRow}>
                  <Text variant="caption" color={colors.textSecondary}>{ex.sets} sets · {ex.repRange?.min}–{ex.repRange?.max} reps · {ex.restSeconds}s</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeExercise(i)}>
                <Text color={colors.danger}>✕</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <TouchableOpacity style={styles.addExBtn} onPress={openPicker}>
          <Text color={colors.green}>+ Add Exercise</Text>
        </TouchableOpacity>

        {showPicker && (
          <Card style={styles.pickerCard}>
            <Text variant="label" color={colors.textMuted} style={{ marginBottom: spacing.md }}>SELECT EXERCISE</Text>
            {isLoadingExercises ? (
              <ActivityIndicator color={colors.green} style={{ paddingVertical: spacing.lg }} />
            ) : allExercises.map((ex) => (
              <TouchableOpacity key={ex.id} style={styles.pickerRow} onPress={() => addExercise(ex)}>
                <View style={{ flex: 1 }}>
                  <Text variant="body">{ex.name}</Text>
                  <Text variant="caption" color={colors.textMuted}>{ex.muscleGroup}</Text>
                </View>
                <Text color={colors.green}>+</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowPicker(false)} style={{ marginTop: spacing.md }}>
              <Text variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, gap: spacing.md },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  nameInput: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, paddingVertical: spacing.lg, borderBottomWidth: 0.5, borderBottomColor: colors.border, marginBottom: spacing.lg },
  descInput: { fontSize: 15, color: colors.textSecondary, paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.border, marginBottom: spacing.xl },
  sectionLabel: { marginBottom: spacing.md },
  exCard: { marginBottom: spacing.sm, padding: spacing.lg },
  exRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  exNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  exConfigRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  addExBtn: { alignItems: 'center', paddingVertical: spacing.xl, borderWidth: 1, borderColor: colors.greenBorder, borderStyle: 'dashed', borderRadius: radius.md, marginBottom: spacing.lg },
  pickerCard: {},
  pickerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.border },
});
