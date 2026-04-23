import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useAuthStore } from '@/stores/auth.store';
import { useSessionStore } from '@/stores/session.store';
import { usePlanStore } from '@/stores/plan.store';

export default function RootLayout() {
  const { checkAuth, isLoggedIn } = useAuthStore();
  const { fetchActiveSession } = useSessionStore();
  const { fetch: fetchPlan } = usePlanStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      // Pre-load critical data on login
      fetchActiveSession();
      fetchPlan();
    }
  }, [isLoggedIn]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0d0d0d' } }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
