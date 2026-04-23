import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/stores/auth.store';
import { colors, spacing, radius } from '@/constants/theme';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    clearError();
    setLocalError('');
    if (password !== confirmPassword) { setLocalError('Passwords do not match'); return; }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters'); return; }
    await register(name, email, password);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Text color={colors.textSecondary}>← Back</Text>
          </TouchableOpacity>
          <Text variant="h1" style={styles.title}>Create Account</Text>
          <Text variant="body" color={colors.textSecondary} style={styles.subtitle}>Join thousands of athletes tracking their gains.</Text>

          <View style={styles.form}>
            {(error || localError) && (
              <View style={styles.errorBox}>
                <Text variant="caption" color={colors.danger}>{error || localError}</Text>
              </View>
            )}
            {(['Full Name', 'Email', 'Password', 'Confirm Password'] as const).map((label, i) => (
              <View key={label} style={styles.fieldGroup}>
                <Text variant="label" color={colors.textMuted}>{label}</Text>
                <TextInput
                  style={styles.input}
                  value={[name, email, password, confirmPassword][i]}
                  onChangeText={[setName, setEmail, setPassword, setConfirmPassword][i]}
                  placeholder={['Alex Johnson', 'your@email.com', '••••••••', '••••••••'][i]}
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={i >= 2}
                  keyboardType={i === 1 ? 'email-address' : 'default'}
                  autoCapitalize={i === 0 ? 'words' : 'none'}
                />
              </View>
            ))}
            <Button title="Create Account" onPress={handleRegister} loading={isLoading} style={{ marginTop: spacing.md }} />
          </View>

          <View style={styles.footer}>
            <Text variant="caption" color={colors.textMuted}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text variant="caption" color={colors.green}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingVertical: spacing.xl },
  back: { marginBottom: spacing.xl },
  title: { marginBottom: spacing.sm },
  subtitle: { marginBottom: spacing.xxxl },
  form: { gap: spacing.lg },
  errorBox: { backgroundColor: colors.dangerMuted, borderRadius: radius.md, padding: spacing.md },
  fieldGroup: { gap: spacing.xs },
  input: {
    backgroundColor: colors.input, borderRadius: radius.md, padding: spacing.lg,
    color: colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: colors.border,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxxl },
});
