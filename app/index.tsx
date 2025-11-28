import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useData } from '@/context/DataContext';

export default function Index() {
  const { loading, hasCompletedOnboarding } = useData();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If user hasn't completed onboarding, show welcome screen
  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding/welcome" />;
  }

  // Otherwise, go to main app
  return <Redirect href="/(tabs)" />;
}
