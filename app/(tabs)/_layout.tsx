import { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { View } from 'react-native';
import { useAuthStore } from '@/stores/auth.store';
import { SessionMiniBanner } from '@/components/common/SessionMiniBanner';
import { colors } from '@/constants/theme';

function TabIcon({ focused, icon }: { focused: boolean; icon: string }) {
  return (
    <View style={{ opacity: focused ? 1 : 0.4 }}>
    </View>
  );
}

export default function TabsLayout() {
  const { isLoggedIn, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/(auth)/login');
    }
  }, [isLoggedIn, isLoading]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SessionMiniBanner />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.border,
            borderTopWidth: 0.5,
            height: 56,
            paddingBottom: 6,
          },
          tabBarActiveTintColor: colors.green,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <View style={{ width: 22, height: 22 }} /> }} />
        <Tabs.Screen name="workouts" options={{ title: 'Workouts', tabBarIcon: ({ color }) => <View style={{ width: 22, height: 22 }} /> }} />
        <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color }) => <View style={{ width: 22, height: 22 }} /> }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <View style={{ width: 22, height: 22 }} /> }} />
      </Tabs>
    </View>
  );
}
