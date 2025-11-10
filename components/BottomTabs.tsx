import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/context/ThemeContext';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

interface BottomTab {
  icon: LucideIcon;
  label: string;
  route: string;
  disabled?: boolean;
}

interface BottomTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: BottomTab[];
}

export default function BottomTabs({ activeTab, setActiveTab, tabs }: BottomTabsProps) {
  const { colorMode } = useTheme();
  const isDark = colorMode === 'dark';

  return (
    <Box 
      className="w-full bg-white border-t border-outline-100" 
      style={styles.container}
    >
      <HStack className="items-center justify-around h-full px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.route;

          return (
            <Pressable
              key={tab.route}
              onPress={() => !tab.disabled && setActiveTab(tab.route)}
              disabled={tab.disabled}
              className="flex-1 items-center justify-center"
            >
              <VStack space="xs" className="items-center">
                {/* Icon with circular background when active */}
                <Box 
                  className={`rounded-full p-2 ${
                    isActive ? 'bg-primary-500' : 'bg-transparent'
                  }`}
                >
                  <Icon 
                    size={24} 
                    color={isActive ? '#FFFFFF' : '#6B7280'}
                    strokeWidth={2}
                  />
                </Box>
                
                {/* Label */}
                <Text 
                  size="2xs"
                  className={`${
                    isActive 
                      ? 'text-primary-600 font-bold' 
                      : tab.disabled 
                      ? 'text-typography-400' 
                      : 'text-typography-500 font-medium'
                  }`}
                >
                  {tab.label}
                </Text>
              </VStack>
            </Pressable>
          );
        })}
      </HStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  }
});
