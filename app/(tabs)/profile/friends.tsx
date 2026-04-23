import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { colors, spacing } from '@/constants/theme';

export default function FriendsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text color={colors.textSecondary} style={{ fontSize: 22 }}>‹</Text></TouchableOpacity>
        <Text variant="h3" style={{ flex: 1, marginLeft: spacing.md }}>Friends</Text>
      </View>
      <View style={styles.center}>
        <Text style={styles.emoji}>👥</Text>
        <Text variant="h2" style={{ textAlign: 'center', marginBottom: spacing.md }}>Coming Soon</Text>
        <Text variant="body" color={colors.textSecondary} style={{ textAlign: 'center', maxWidth: 280 }}>
          Connect with friends, compare workouts, share PRs, and stay motivated together.
        </Text>
        <Button title="Notify Me" onPress={() => {}} variant="secondary" style={{ marginTop: spacing.xl, paddingHorizontal: spacing.xxxl }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  emoji: { fontSize: 72, marginBottom: spacing.xl },
});
