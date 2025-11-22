import { Stack } from 'expo-router';
import 'react-native-reanimated';

import Header from '@/components/Header';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { DataProvider } from '@/context/DataContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import '@/global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { colorMode } = useTheme();

  return (
    <GluestackUIProvider mode={colorMode}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profile"
          options={{ 
            headerShown: true,
            // Use custom header component for search screen
            header: () => <Header />,
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="search"
          options={{ 
            headerShown: true,
            // Use custom header component for search screen
            header: () => <Header />,
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="settings"
          options={{ 
            // Use custom header component for settings screen
            header: () => <Header />,
            presentation: 'modal'
          }}
        />
        <Stack.Screen
          name="prayer-reel"
          options={{ 
            headerShown: false,
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom'
          }}
        />
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
