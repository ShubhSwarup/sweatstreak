import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { colors, spacing, radius } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text color={colors.textSecondary}>← Back</Text>
        </TouchableOpacity>
        <Text variant="h1" style={styles.title}>Forgot Password</Text>
        {sent ? (
          <View style={styles.successBox}>
            <Text variant="h4" color={colors.green}>Email Sent!</Text>
            <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
              Check your inbox for password reset instructions.
            </Text>
            <Button title="Back to Login" onPress={() => router.replace('/(auth)/login')} style={{ marginTop: spacing.xl }} />
          </View>
        ) : (
          <View style={styles.form}>
            <Text variant="body" color={colors.textSecondary}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
            <View style={styles.fieldGroup}>
              <Text variant="label" color={colors.textMuted}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {/* TODO: wire up to POST /api/auth/forgot-password */}
            <Button title="Send Reset Link" onPress={() => setSent(true)} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingVertical: spacing.xl },
  back: { marginBottom: spacing.xl },
  title: { marginBottom: spacing.xxxl },
  form: { gap: spacing.xl },
  fieldGroup: { gap: spacing.xs },
  input: {
    backgroundColor: colors.input, borderRadius: radius.md, padding: spacing.lg,
    color: colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: colors.border,
  },
  successBox: { gap: spacing.sm },
});
