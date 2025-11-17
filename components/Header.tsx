import { Box } from '@/components/ui/box';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import React from 'react';

export default function Header() {

return (
  <Box
    className="w-full h-16"
    style={{ backgroundColor: 'rgba(17, 17, 17, 0.85)' }}
  />
);
}
