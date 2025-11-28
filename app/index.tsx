import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useData } from '@/context/DataContext';
import SplashScreen from '@/components/SplashScreen';

export default function Index() {
  const { loading, hasCompletedOnboarding } = useData();
  const [startFadeOut, setStartFadeOut] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    // Minimum splash display time
    const timer = setTimeout(() => {
      if (!loading) {
        setStartFadeOut(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Start fade out when loading is done (after minimum time)
    if (!loading) {
      const timer = setTimeout(() => setStartFadeOut(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleFadeComplete = () => {
    setSplashComplete(true);
  };

  if (!splashComplete) {
    return <SplashScreen onFadeComplete={startFadeOut ? handleFadeComplete : undefined} />;
  }

  // If user hasn't completed onboarding, show welcome screen
  if (!hasCompletedOnboarding) {
    return <Redirect href="/welcome" />;
  }

  // Otherwise, go to main app
  return <Redirect href="/(tabs)" />;
}
