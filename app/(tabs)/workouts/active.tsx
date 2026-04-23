import React, { useState, useRef, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Animated,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Text } from "@/components/common/Text";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { ExerciseSetRow } from "@/components/common/ExerciseSetRow";
import { useSessionStore } from "@/stores/session.store";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { colors, spacing, radius } from "@/constants/theme";
import type { SessionExercise } from "@/types";

// ─── Rest Timer Modal ─────────────────────────────────────────────────────────
function RestTimerModal({
  visible,
  seconds,
  exerciseName,
  setInfo,
  onClose,
  onAddTime,
}: {
  visible: boolean;
  seconds: number;
  exerciseName: string;
  setInfo: string;
  onClose: () => void;
  onAddTime: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const total = useRef(seconds);

  React.useEffect(() => {
    if (!visible) return;
    setRemaining((total.current = seconds));
    const iv = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(iv);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onClose();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [visible]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const progress = 1 - remaining / total.current;
  const circumference = 2 * Math.PI * 54;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={rt.overlay}>
        <View style={rt.sheet}>
          <View style={rt.handle} />
          <Text variant="label" color={colors.textMuted} style={rt.label}>
            REST TIMER
          </Text>
          <View style={rt.timerContainer}>
            <Text style={rt.timerText}>
              {m}:{s.toString().padStart(2, "0")}
            </Text>
          </View>
          <Text variant="caption" color={colors.textSecondary} style={rt.info}>
            {exerciseName} — {setInfo}
          </Text>
          <View style={rt.btns}>
            <TouchableOpacity style={rt.skipBtn} onPress={onClose}>
              <Text variant="caption" color={colors.textSecondary}>
                Skip Rest
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={rt.addBtn} onPress={onAddTime}>
              <Text variant="caption" color={colors.green}>
                +30s
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Plate Calculator Modal ───────────────────────────────────────────────────
function PlateCalcModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [target, setTarget] = useState("100");
  const [barWeight, setBarWeight] = useState("20");

  const plates = [20, 15, 10, 5, 2.5, 1.25];
  const calcPlates = () => {
    const t = parseFloat(target) || 0;
    const b = parseFloat(barWeight) || 20;
    let remaining = (t - b) / 2;
    const result: { weight: number; count: number }[] = [];
    for (const p of plates) {
      if (remaining >= p) {
        const count = Math.floor(remaining / p);
        result.push({ weight: p, count });
        remaining -= count * p;
      }
    }
    return result;
  };

  const result = calcPlates();
  const total =
    parseFloat(barWeight) +
    result.reduce((sum, p) => sum + p.weight * p.count * 2, 0);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={rt.overlay}>
        <View style={rt.sheet}>
          <View style={rt.handle} />
          <Text variant="h3" style={{ marginBottom: spacing.xl }}>
            Plate Calculator
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              marginBottom: spacing.lg,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="label" color={colors.textMuted}>
                Target Weight (kg)
              </Text>
              <TextInput
                style={pc.input}
                value={target}
                onChangeText={setTarget}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="label" color={colors.textMuted}>
                Bar Weight (kg)
              </Text>
              <View style={{ flexDirection: "row", gap: spacing.xs }}>
                {[15, 20, 25].map((w) => (
                  <TouchableOpacity
                    key={w}
                    onPress={() => setBarWeight(String(w))}
                    style={[
                      pc.barPreset,
                      barWeight === String(w) && pc.barPresetActive,
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        color:
                          barWeight === String(w)
                            ? colors.green
                            : colors.textSecondary,
                      }}
                    >
                      {w}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <Card style={pc.resultCard}>
            <Text
              variant="label"
              color={colors.textMuted}
              style={{ marginBottom: spacing.md }}
            >
              PLATES PER SIDE
            </Text>
            {result.length === 0 ? (
              <Text color={colors.textMuted}>Bar only</Text>
            ) : (
              result.map((p) => (
                <View key={p.weight} style={pc.plateRow}>
                  <Text variant="body">{p.count}×</Text>
                  <View
                    style={[
                      pc.plateViz,
                      {
                        width: p.weight * 2 + 20,
                        backgroundColor:
                          p.weight >= 20
                            ? "#E53935"
                            : p.weight >= 10
                            ? "#1E88E5"
                            : colors.greenDark,
                      },
                    ]}
                  />
                  <Text variant="body" color={colors.textSecondary}>
                    {p.weight} kg
                  </Text>
                </View>
              ))
            )}
            <View style={pc.totalRow}>
              <Text variant="caption" color={colors.textMuted}>
                Total: {total} kg
              </Text>
              {Math.abs(total - parseFloat(target)) < 0.01 ? (
                <Badge
                  label="✓ EXACT"
                  color={colors.green}
                  bgColor={colors.greenMuted}
                />
              ) : (
                <Badge
                  label={`≈ ${total} kg`}
                  color={colors.warning}
                  bgColor={colors.warningMuted}
                />
              )}
            </View>
          </Card>
          <Button
            title="Done"
            onPress={onClose}
            style={{ marginTop: spacing.xl }}
          />
        </View>
      </View>
    </Modal>
  );
}

// ─── Exercise Block ───────────────────────────────────────────────────────────
function ExerciseBlock({
  exercise,
  exerciseIndex,
  onCompleteSet,
  onAddSet,
  onRemove,
  onOpenPlateCalc,
  onUpdateSet,
}: {
  exercise: SessionExercise;
  exerciseIndex: number;
  onCompleteSet: (setIndex: number) => void;
  onAddSet: () => void;
  onRemove: () => void;
  onOpenPlateCalc: () => void;
  onUpdateSet: (setIndex: number, data: any) => void;
}) {
  const completedSets = exercise.sets.filter((s) => s.completed).length;

  return (
    <Card style={styles.exerciseCard}>
      {/* Header */}
      <View style={styles.exHeader}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
              flexWrap: "wrap",
            }}
          >
            <Text variant="h4">{exercise.name}</Text>
            <Badge
              label={exercise.exerciseType}
              color={colors.textMuted}
              bgColor={colors.border}
            />
          </View>
          {exercise.lastPerformance && (
            <Text
              variant="caption"
              color={colors.textMuted}
              style={{ marginTop: 2 }}
            >
              Last: {exercise.lastPerformance.weight}kg ×{" "}
              {exercise.lastPerformance.reps}
            </Text>
          )}
        </View>
        {exercise.suggestion && (
          <View
            style={[
              styles.suggestionPill,
              {
                backgroundColor:
                  exercise.suggestion.action === "increase"
                    ? colors.greenMuted
                    : colors.border,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "700",
                color:
                  exercise.suggestion.action === "increase"
                    ? colors.green
                    : colors.textSecondary,
              }}
            >
              {exercise.suggestion.action === "increase" ? "↑" : "→"}{" "}
              {exercise.suggestion.weight}kg
            </Text>
          </View>
        )}
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <Text style={{ fontSize: 16, color: colors.textMuted }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Set column headers */}
      <View style={styles.setHeaders}>
        <Text style={styles.setHeaderText}>SET</Text>
        <Text style={[styles.setHeaderText, { width: 52 }]}>PREV</Text>
        <Text style={[styles.setHeaderText, { flex: 1 }]}>KG</Text>
        <Text style={[styles.setHeaderText, { flex: 0.8 }]}>REPS</Text>
        <Text style={[styles.setHeaderText, { width: 36 }]}>✓</Text>
      </View>

      {/* Sets */}
      {exercise.sets.map((set, si) => (
        <ExerciseSetRow
          key={set.id || si}
          set={set}
          previousWeight={exercise.lastPerformance?.weight}
          previousReps={exercise.lastPerformance?.reps}
          onWeightChange={(val) =>
            onUpdateSet(si, { weight: parseFloat(val) || null })
          }
          onRepsChange={(val) =>
            onUpdateSet(si, { reps: parseInt(val) || null })
          }
          onComplete={() => onCompleteSet(si)}
          onPlateCalc={onOpenPlateCalc}
        />
      ))}

      {/* Add set */}
      <TouchableOpacity onPress={onAddSet} style={styles.addSetBtn}>
        <Text variant="caption" color={colors.green}>
          + Add Set
        </Text>
      </TouchableOpacity>

      {/* Progress */}
      <Text
        variant="caption"
        color={colors.textMuted}
        style={{ marginTop: spacing.sm }}
      >
        {completedSets}/{exercise.sets.length} sets completed
      </Text>
    </Card>
  );
}

// ─── Active Session Screen ────────────────────────────────────────────────────
export default function ActiveSessionScreen() {
  const params = useLocalSearchParams<{ templateId?: string }>();
  const {
    activeSession,
    hasActiveSession,
    isLoading,
    startSession,
    completeSet,
    createSet,
    updateSet,
    removeExercise,
    finishSession,
    pauseSession,
    discardSession,
  } = useSessionStore();
  const { formattedTime } = useSessionTimer();

  const [restTimerVisible, setRestTimerVisible] = useState(false);
  const [plateCalcVisible, setPlateCalcVisible] = useState(false);
  const [restInfo, setRestInfo] = useState({
    seconds: 90,
    exerciseName: "",
    setInfo: "",
  });
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [finishResult, setFinishResult] = useState<any>(null);

  const [initializing, setInitializing] = useState(!hasActiveSession);
  const [startError, setStartError] = useState(false);

  React.useEffect(() => {
    if (hasActiveSession) {
      setInitializing(false);
      return;
    }
    startSession({ template: params.templateId })
      .then(() => setInitializing(false))
      .catch(() => {
        setInitializing(false);
        setStartError(true);
      });
  }, []);

  if (initializing || (isLoading && !activeSession)) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color={colors.green} size="large" />
          <Text
            variant="caption"
            color={colors.textMuted}
            style={{ marginTop: spacing.md }}
          >
            Starting workout...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (startError || !activeSession) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: spacing.xl,
          }}
        >
          <Text
            variant="h4"
            style={{ textAlign: "center", marginBottom: spacing.md }}
          >
            Failed to start workout
          </Text>
          <Text
            variant="body"
            color={colors.textMuted}
            style={{ textAlign: "center", marginBottom: spacing.xl }}
          >
            Check your connection and try again.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="secondary"
          />
        </View>
      </SafeAreaView>
    );
  }

  const session = activeSession;

  const handleCompleteSet = (exerciseIndex: number, setIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const ex = session.exercises[exerciseIndex];
    const set = ex.sets[setIndex];

    if (!set?.id) return;

    completeSet(set.id);

    setRestInfo({
      seconds: ex.restSeconds,
      exerciseName: ex.name,
      setInfo: `Set ${setIndex + 1}`,
    });

    setRestTimerVisible(true);
  };

  const handleAddSet = (exerciseId: string) => {
    createSet(exerciseId);
  };

  const handleRemoveExercise = (exerciseIndex: number) => {
    Alert.alert("Remove Exercise", "Remove this exercise from the session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeExercise(exerciseIndex),
      },
    ]);
  };

  const handleFinish = async () => {
    Alert.alert(
      "Finish Workout",
      "Are you sure you want to finish this session?",
      [
        { text: "Keep Going", style: "cancel" },
        {
          text: "Finish",
          onPress: async () => {
            try {
              const result = await finishSession();
              setFinishResult(result);
              setSummaryVisible(true);
            } catch {
              Alert.alert("Error", "Failed to save workout. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleSessionAction = () => {
    Alert.alert("Session Actions", session.name, [
      { text: "Cancel", style: "cancel" },
      {
        text: "⏸ Pause Session",
        onPress: () => {
          pauseSession();
          router.back();
        },
      },
      {
        text: "🗑 Discard Session",
        style: "destructive",
        onPress: () =>
          Alert.alert("Discard?", "This will delete all logged sets.", [
            { text: "Keep", style: "cancel" },
            {
              text: "Discard",
              style: "destructive",
              onPress: () => {
                discardSession();
                router.replace("/(tabs)/workouts");
              },
            },
          ]),
      },
    ]);
  };

  const totalSets = session.exercises.reduce(
    (sum, ex) => sum + ex.sets.length,
    0
  );
  const completedSets = session.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  );
  const progress = totalSets > 0 ? completedSets / totalSets : 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text color={colors.textSecondary} style={{ fontSize: 22 }}>
            ‹
          </Text>
        </TouchableOpacity>
        <Text
          variant="h4"
          numberOfLines={1}
          style={{ flex: 1, textAlign: "center" }}
        >
          {session.name}
        </Text>
        <Text style={styles.timer}>{formattedTime}</Text>
        <TouchableOpacity onPress={handleSessionAction} style={styles.moreBtn}>
          <Text color={colors.textSecondary}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Exercises */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {session.exercises.map((ex, ei) => (
          <ExerciseBlock
            key={`${ex.exerciseId}_${ei}`}
            exercise={ex}
            exerciseIndex={ei}
            onCompleteSet={(si) => handleCompleteSet(ei, si)}
            onAddSet={() => handleAddSet(ex.exerciseId)}
            onRemove={() => handleRemoveExercise(ei)}
            onOpenPlateCalc={() => setPlateCalcVisible(true)}
            onUpdateSet={(si, data) => {
              const set = ex.sets[si];
              if (!set?.id) return;
              updateSet(set.id, data);
            }}
          />
        ))}

        {/* Add Exercise */}
        <TouchableOpacity style={styles.addExBtn}>
          <Text color={colors.green}>+ Add Exercise</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.timerBtn}
          onPress={() => setRestTimerVisible(true)}
        >
          <Text variant="caption" color={colors.textSecondary}>
            ⏱ REST
          </Text>
        </TouchableOpacity>
        <Button
          title="FINISH WORKOUT"
          onPress={handleFinish}
          variant="secondary"
          style={{ flex: 1 }}
        />
      </View>

      {/* Rest Timer */}
      <RestTimerModal
        visible={restTimerVisible}
        seconds={restInfo.seconds}
        exerciseName={restInfo.exerciseName}
        setInfo={restInfo.setInfo}
        onClose={() => setRestTimerVisible(false)}
        onAddTime={() => {}}
      />

      {/* Plate Calculator */}
      <PlateCalcModal
        visible={plateCalcVisible}
        onClose={() => setPlateCalcVisible(false)}
      />

      {/* Session Summary */}
      {summaryVisible && finishResult && (
        <Modal visible animationType="slide">
          <SafeAreaView style={styles.summaryContainer}>
            <ScrollView contentContainerStyle={styles.summaryScroll}>
              <Text style={styles.summaryEmoji}>💪</Text>
              <Text
                variant="h2"
                color={colors.green}
                style={{ textAlign: "center" }}
              >
                WORKOUT COMPLETE
              </Text>
              <Text
                variant="h3"
                style={{ textAlign: "center", marginTop: spacing.sm }}
              >
                {session.name}
              </Text>

              <View style={styles.statsGrid}>
                {[
                  {
                    label: "Duration",
                    value: `${Math.round(finishResult.summary.duration / 60)}m`,
                  },
                  {
                    label: "Volume",
                    value: `${finishResult.summary.totalVolume.toLocaleString()} kg`,
                  },
                  {
                    label: "Sets",
                    value: String(finishResult.summary.totalSets),
                  },
                  {
                    label: "Exercises",
                    value: String(finishResult.summary.totalExercises),
                  },
                ].map(({ label, value }) => (
                  <View key={label} style={styles.statCard}>
                    <Text variant="label" color={colors.textMuted}>
                      {label}
                    </Text>
                    <Text variant="h3" color={colors.green}>
                      {value}
                    </Text>
                  </View>
                ))}
              </View>

              {finishResult.personalRecords?.length > 0 && (
                <Card style={styles.prSection}>
                  <Text
                    variant="label"
                    color={colors.gold}
                    style={{ marginBottom: spacing.md }}
                  >
                    🏆 PERSONAL RECORDS
                  </Text>
                  {finishResult.personalRecords.map((pr: any, i: number) => (
                    <View key={i} style={styles.prRow}>
                      <Text variant="body">
                        {pr.exerciseName ?? "Exercise"}
                      </Text>
                      <Badge
                        label={`${pr.type.toUpperCase()} PR`}
                        color={colors.gold}
                        bgColor={colors.goldMuted}
                      />
                      <Text variant="body" color={colors.green}>
                        {pr.value} kg
                      </Text>
                    </View>
                  ))}
                </Card>
              )}

              <Card style={styles.xpCard}>
                <Text variant="label" color={colors.textMuted}>
                  XP EARNED
                </Text>
                <Text
                  variant="h2"
                  color={colors.green}
                  style={{ marginTop: spacing.xs }}
                >
                  +{finishResult.xp.earned} XP
                </Text>
                <Text variant="caption" color={colors.textSecondary}>
                  {finishResult.streak.continued
                    ? `🔥 ${finishResult.streak.current} day streak!`
                    : "Keep it up!"}
                </Text>
              </Card>

              <Button
                title="DONE"
                onPress={() => {
                  setSummaryVisible(false);
                  router.replace("/(tabs)");
                }}
                style={{ marginTop: spacing.xl }}
              />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  progressBar: { height: 3, backgroundColor: colors.border },
  progressFill: { height: "100%", backgroundColor: colors.green },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  backBtn: { width: 36, alignItems: "flex-start" },
  timer: { fontSize: 15, fontWeight: "700", color: colors.green },
  moreBtn: { width: 36, alignItems: "flex-end" },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  exerciseCard: { marginBottom: spacing.lg },
  exHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  suggestionPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  removeBtn: { padding: spacing.xs },
  setHeaders: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  setHeaderText: {
    fontSize: 9,
    fontWeight: "600",
    color: colors.textMuted,
    textAlign: "center",
    width: 24,
    letterSpacing: 0.5,
  },
  addSetBtn: { alignSelf: "center", paddingVertical: spacing.md },
  addExBtn: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    borderStyle: "dashed",
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  bottomBar: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.xl,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  timerBtn: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryContainer: { flex: 1, backgroundColor: colors.bg },
  summaryScroll: { paddingHorizontal: spacing.xl, paddingVertical: spacing.xl },
  summaryEmoji: { fontSize: 60, textAlign: "center", marginBottom: spacing.md },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: "40%",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  prSection: { marginBottom: spacing.lg },
  prRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  xpCard: { marginBottom: spacing.lg, gap: spacing.xs },
});

const rt = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.sheetBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    paddingBottom: 40,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: spacing.xl,
  },
  label: { marginBottom: spacing.xl },
  timerContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: colors.greenBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  timerText: { fontSize: 40, fontWeight: "700", color: colors.textPrimary },
  info: { textAlign: "center", marginBottom: spacing.xl },
  btns: { flexDirection: "row", gap: spacing.xl },
  skipBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.greenMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.greenBorder,
  },
});

const pc = StyleSheet.create({
  input: {
    backgroundColor: colors.input,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  barPreset: {
    flex: 1,
    paddingVertical: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  barPresetActive: {
    borderColor: colors.greenBorder,
    backgroundColor: colors.greenMuted,
  },
  resultCard: { width: "100%", gap: spacing.sm },
  plateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  plateViz: { height: 20, borderRadius: 4, minWidth: 20 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
});
