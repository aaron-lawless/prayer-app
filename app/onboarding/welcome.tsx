import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Users } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading/index.native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1a1a1a', '#0f0f0f', '#000000']}
      style={styles.container}
    >
      <VStack space="4xl" className="flex-1 justify-between px-8 py-12 mt-16 mb-10">

        {/* Illustration Area */}
        <View className="items-center justify-center flex-1">
          <View className="relative w-72 h-72">
            {/* Background circle */}
            <View className="absolute top-8 left-8 w-56 h-56 bg-gray-600 rounded-full" />
            
            {/* Illustration placeholder - using icon as placeholder */}
            <View className="absolute top-16 left-16 w-40 h-40 items-center justify-center">
              <Users color="white" size={120} strokeWidth={1.5} />
            </View>

            {/* Decorative dots */}
            <View className="absolute top-12 left-8 w-3 h-3 bg-gray-400 rounded-full" />
            <View className="absolute top-24 left-4 w-2 h-2 bg-gray-500 rounded-full" />
            <View className="absolute bottom-16 right-12 w-3 h-3 bg-gray-500 rounded-full" />
            <View className="absolute bottom-8 right-8 w-2 h-2 bg-gray-400 rounded-full" />
          </View>
        </View>

        {/* Content */}
        <VStack space="lg" className="items-center">
          <Heading size="3xl" className="text-white text-center font-bold">
            Pray Together,{'\n'}Grow Together
          </Heading>
          <Text className="text-white/80 text-center text-base leading-6 px-4">
            Connect with your community through prayer. Track prayer requests and celebrate answered prayers together.
          </Text>
        </VStack>

        {/* CTA Buttons */}
        <VStack space="md" className="mt-8 mb-10">
          <Button
            size="xl"
            className="bg-white rounded-full"
            onPress={() => router.push('/onboarding/name')}
          >
            <ButtonText className="text-black font-semibold text-lg">
              Let's Get Started
            </ButtonText>
          </Button>
        </VStack>
      </VStack>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
