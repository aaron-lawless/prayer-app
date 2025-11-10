import { Box } from '@/components/ui/box';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import React from 'react';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Prayer Tracker' }: HeaderProps) {
  const { colorMode, toggleColorMode } = useTheme();
  const router = useRouter();
  const isDark = colorMode === 'dark';

  // return (
  //   <Box className="w-full border-b border-outline-100 bg-background-0">
  //     <HStack className="items-center justify-between px-5 py-4">
  //       {/* Logo/Title */}
  //       <HStack className="items-center" space="sm">
  //         <Text size="xl" className="font-bold text-typography-900">
  //           {title}
  //         </Text>
  //       </HStack>

  //       {/* Right Actions */}
  //       <HStack space="md" className="items-center">
  //         <Pressable 
  //           onPress={() => router.push('/search' as any)}
  //           className="p-2"
  //         >
  //           <Icon as={Search} size="lg" className="text-typography-700" />
  //         </Pressable>
  //         <ThemeToggle currentMode={colorMode} onToggle={toggleColorMode} />
  //       </HStack>
  //     </HStack>
  //   </Box>
  // );
return (
  <Box
    className="w-full h-8"
    style={{ backgroundColor: 'rgba(17, 17, 17, 0.85)' }}
  />
);
}
