import { Stack } from 'expo-router';
export default function WorkoutsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0d0d0d' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="active" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="[templateId]" />
      <Stack.Screen name="create-template" />
      <Stack.Screen name="create-plan" />
    </Stack>
  );
}
