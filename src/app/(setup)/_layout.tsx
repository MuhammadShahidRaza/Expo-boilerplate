import { Stack } from 'expo-router/stack';

export default function SetupLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
