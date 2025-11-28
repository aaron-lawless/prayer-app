import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Users } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, Animated, Dimensions, StyleSheet, View } from 'react-native';

const { height } = Dimensions.get('window');

interface SplashScreenProps {
  onFadeComplete?: () => void;
}

export default function SplashScreen({ onFadeComplete }: SplashScreenProps) {
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const [shouldFadeOut, setShouldFadeOut] = React.useState(false);

  // Trigger fade out when onFadeComplete is provided
  React.useEffect(() => {
    if (onFadeComplete && !shouldFadeOut) {
      setShouldFadeOut(true);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        onFadeComplete();
      });
    }
  }, [onFadeComplete]);

  return (
    <LinearGradient
      colors={['#1a1a1a', '#0f0f0f', '#000000']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Logo Circle */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Users size={65} color="#000000" fill="#FFFFFF" />
          </View>
          
          {/* Spinner */}
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size={50} color="#FFFFFF" />
          </View>
        </View>

      </Animated.View>

      {/* Bottom decoration */}
      <View style={styles.bottomGlow} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logoCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  spinnerContainer: {
    marginTop: 45,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 4,
  },
  appName: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 32,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 6,
  },
  subtitle: {
    marginTop: 40,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: height * 0.3,
    backgroundColor: 'transparent',
  },
});
