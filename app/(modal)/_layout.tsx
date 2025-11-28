import { Stack } from 'expo-router';
import Header from '@/components/Header';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
     <Stack.Screen
        name="profile"
        options={{ 
          headerShown: true,
          header: () => <Header />,
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="search"
        options={{ 
          headerShown: true,
          header: () => <Header />,
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="settings"
        options={{ 
          headerShown: true,
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
  );
}
