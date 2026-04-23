import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth.store';

export default function AuthLayout() {
  const { isLoggedIn, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0d0d0d' } }} />
  );
}
