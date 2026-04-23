import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { colors, spacing } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text variant="hero">404</Text>
      <Text variant="h3" style={{ marginTop: spacing.md }}>Screen not found</Text>
      <Button title="Go Home" onPress={() => router.replace('/(tabs)')} style={{ marginTop: spacing.xl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 20 },
});
