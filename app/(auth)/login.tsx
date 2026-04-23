import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/stores/auth.store';
import { colors, spacing, radius } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    clearError();
    await login(email, password);
  };


  // ─── DEMO SHORTCUT: remove in production ──────────────────────────────────
  const handleDemoLogin = async () => {
    await login('demo@sweatstreak.com', 'demo123');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoSection}>
            <Text style={styles.logo}>SWEATSTREAK</Text>
            <Text variant="caption" color={colors.textMuted}>Track. Progress. Dominate.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error && (
              <View style={styles.errorBox}>
                <Text variant="caption" color={colors.danger}>{error}</Text>
              </View>
            )}

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
                autoComplete="email"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text variant="label" color={colors.textMuted}>Password</Text>
              <View>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPass}
                  autoComplete="password"
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
                  <Text variant="caption" color={colors.textSecondary}>{showPass ? 'HIDE' : 'SHOW'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotLink}>
              <Text variant="caption" color={colors.green}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button title="Log In" onPress={handleLogin} loading={isLoading} style={styles.btn} />

            <View style={styles.divider}>
              <View style={styles.divLine} />
              <Text variant="caption" color={colors.textMuted}>or</Text>
              <View style={styles.divLine} />
            </View>

            {/* DEMO BUTTON — Remove in production */}
            <Button title="Continue as Demo User" onPress={handleDemoLogin} variant="secondary" style={styles.btn} />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text variant="caption" color={colors.textMuted}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text variant="caption" color={colors.green}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  container: { flexGrow: 1, paddingHorizontal: spacing.xl, justifyContent: 'center', paddingVertical: spacing.xxxl },
  logoSection: { alignItems: 'center', marginBottom: spacing.xxxl * 1.5 },
  logo: { fontSize: 32, fontWeight: '800', color: colors.green, letterSpacing: 2, marginBottom: spacing.xs },
  form: { gap: spacing.lg },
  errorBox: { backgroundColor: colors.dangerMuted, borderRadius: radius.md, padding: spacing.md },
  fieldGroup: { gap: spacing.xs },
  input: {
    backgroundColor: colors.input, borderRadius: radius.md, padding: spacing.lg,
    color: colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: colors.border,
  },
  eyeBtn: { position: 'absolute', right: spacing.lg, top: '50%', marginTop: -10 },
  forgotLink: { alignSelf: 'flex-end' },
  btn: {},
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  divLine: { flex: 1, height: 0.5, backgroundColor: colors.border },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxxl },
});
