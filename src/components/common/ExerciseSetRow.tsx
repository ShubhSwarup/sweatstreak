import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, spacing, radius } from '../../constants/theme';
import type { SetData } from '../../types';

interface Props {
  set: SetData;
  previousWeight?: number | null;
  previousReps?: number | null;
  onWeightChange: (val: string) => void;
  onRepsChange: (val: string) => void;
  onComplete: () => void;
  onPlateCalc?: () => void;
}

export const ExerciseSetRow: React.FC<Props> = ({
  set, previousWeight, previousReps,
  onWeightChange, onRepsChange, onComplete, onPlateCalc,
}) => (
  <View style={[styles.row, set.completed && styles.rowCompleted, set.isPR && styles.rowPR]}>
    {/* Set number */}
    <View style={styles.setNum}>
      <Text style={styles.setNumText}>{set.setNumber}</Text>
    </View>
    {/* Previous */}
    <Text style={styles.prev} numberOfLines={1}>
      {previousWeight && previousReps ? `${previousWeight}×${previousReps}` : '—'}
    </Text>
    {/* Weight input */}
    <View style={styles.inputWrap}>
      <TextInput
        style={styles.input}
        value={set.weight?.toString() ?? ''}
        onChangeText={onWeightChange}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.textMuted}
        editable={!set.completed}
        selectTextOnFocus
      />
      {onPlateCalc && !set.completed && (
        <TouchableOpacity onPress={onPlateCalc} style={styles.calcIcon}>
          <Text style={{ fontSize: 10, color: colors.textMuted }}>⚖</Text>
        </TouchableOpacity>
      )}
    </View>
    {/* Reps input */}
    <TextInput
      style={[styles.input, styles.repsInput]}
      value={set.reps?.toString() ?? ''}
      onChangeText={onRepsChange}
      keyboardType="number-pad"
      placeholder="0"
      placeholderTextColor={colors.textMuted}
      editable={!set.completed}
      selectTextOnFocus
    />
    {/* Complete button */}
    <TouchableOpacity
      style={[styles.checkBtn, set.completed && styles.checkBtnDone]}
      onPress={onComplete}
      disabled={set.completed}
    >
      <Text style={{ color: set.completed ? '#000' : colors.textMuted, fontSize: 14 }}>✓</Text>
    </TouchableOpacity>
    {/* PR badge */}
    {set.isPR && (
      <View style={styles.prBadge}>
        <Text style={styles.prText}>PR</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: radius.sm, marginBottom: 2,
  },
  rowCompleted: { backgroundColor: 'rgba(0,230,118,0.06)' },
  rowPR: { backgroundColor: 'rgba(255,215,0,0.06)' },
  setNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  setNumText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  prev: { width: 52, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  inputWrap: { flex: 1, position: 'relative' },
  input: {
    backgroundColor: colors.input, borderRadius: radius.sm, paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md, color: colors.textPrimary, fontSize: 14,
    textAlign: 'center', fontWeight: '600',
  },
  repsInput: { flex: 0.8 },
  calcIcon: { position: 'absolute', right: 6, top: '50%', marginTop: -8 },
  checkBtn: {
    width: 36, height: 36, borderRadius: radius.sm,
    backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  checkBtnDone: { backgroundColor: colors.green },
  prBadge: {
    backgroundColor: colors.goldMuted, borderRadius: 4,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  prText: { fontSize: 9, fontWeight: '700', color: colors.gold },
});
