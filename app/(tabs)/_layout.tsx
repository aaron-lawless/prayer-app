import BottomTabs from '@/components/BottomTabs';
import Header from '@/components/Header';
import { Box } from '@/components/ui/box';
import { Routes } from '@/types';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Heart, Home, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('index');

  // Update active tab based on current route
  useEffect(() => {
    const route = pathname.split('/').pop() || 'index';
    setActiveTab(route === '' ? 'index' : route);
  }, [pathname]);

  const bottomTabs : Routes[] = [
    {
      icon: Home,
      label: 'Home',
      route: 'index',
      showHeader: true
    },
    {
      icon: Users,
      label: 'Contacts',
      route: 'contacts',
      showHeader: true
    },
    {
      icon: Heart,
      label: 'Prayers',
      route: 'prayers',
      showHeader: true
    },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'index') {
      router.push('/(tabs)/' as any);
    } else {
      router.push(`/(tabs)/${tab}` as any);
    }
  };

  const showHeader = bottomTabs.find(tab => tab.route === activeTab)?.showHeader ?? true;
  const headerTitle = bottomTabs.find(tab => tab.route === activeTab)?.label || 'Prayer Tracker';

  return (
    <Box className="flex-1">
      <StatusBar />
      
      {/* Header */}
      {showHeader && <Header title={headerTitle} />}

      {/* Content */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="home" options={{ href: null }} />
        <Tabs.Screen name="contacts" />
        <Tabs.Screen name="prayers" />
      </Tabs>

      {/* Custom Bottom Tabs */}
      <BottomTabs
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        tabs={bottomTabs}
      />
    </Box>
  );
}