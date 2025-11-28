import { Stack } from 'expo-router';
import 'react-native-reanimated';

import Header from '@/components/Header';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { DataProvider } from '@/context/DataContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import '@/global.css';

export const unstable_settings = {
  initialRouteName: 'index',
};

function RootLayoutContent() {
  const { colorMode } = useTheme();

  return (
    <GluestackUIProvider mode={colorMode}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(modal)" />
      </Stack>
    </GluestackUIProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <DataProvider>
        <RootLayoutContent />
      </DataProvider>
    </ThemeProvider>
  );
}
