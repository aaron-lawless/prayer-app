import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Users, Plus, Eye, Check, Search, ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading/index.native';
import { useData } from '@/context/DataContext';

const { width, height } = Dimensions.get('window');

const INSTRUCTION_STEPS = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'Welcome to your personal prayer companion! This app helps you organize and remember to pray for the people and situations that matter most.',
  },
  {
    icon: Users,
    title: 'Add Contacts',
    description: 'Start by adding people you want to pray for. Tap the "Contacts" tab and press the "+" button to add a new contact with their name, email, and phone.',
  },
  {
    icon: Plus,
    title: 'Create Prayer Requests',
    description: 'Go to the "Prayers" tab and tap "+" to create a prayer request. Give it a title, description, and associate it with one or more contacts. You can also set the urgency level.',
  },
  {
    icon: Eye,
    title: 'Use Prayer View',
    description: 'From the home screen, tap "Prayer View" to see your prayers one at a time. Swipe through each prayer, and the app will track which ones you\'ve prayed for today.',
  },
  {
    icon: Check,
    title: 'Mark Prayers as Answered',
    description: 'When God answers a prayer, edit the prayer request and mark it as "Answered". Answered prayers won\'t appear in your daily prayer view.',
  },
  {
    icon: Search,
    title: 'Search & Organize',
    description: 'Use the search icon on the home screen to quickly find specific prayers or contacts. You can filter by urgency, status, or search by keywords.',
  },
];

export default function InstructionsScreen() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useData();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleTap = (side: 'left' | 'right') => {
    if (side === 'left' && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (side === 'right' && currentStep < INSTRUCTION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleContinue = async () => {
    setIsCompleting(true);
    try {
      // Mark onboarding as complete
      await setHasCompletedOnboarding(true);
      
      // Navigate to the main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsCompleting(false);
    }
  };

  const currentInstruction = INSTRUCTION_STEPS[currentStep];
  const IconComponent = currentInstruction.icon;

  return (
    <LinearGradient
      colors={['#1a1a1a', '#0f0f0f', '#000000']}
      style={styles.container}
    >
      <VStack space="4xl" className="flex-1 px-8 py-12 mt-10">
        
        {/* Progress Indicators */}
        <HStack space="xs" className="mt-8">
          {INSTRUCTION_STEPS.map((_, index) => (
            <View
              key={index}
              className={`flex-1 h-1 rounded-full ${
                index <= currentStep ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </HStack>

        {/* Tap Areas - Invisible overlays for Instagram-style navigation */}
        <View className="absolute inset-0 flex-row z-10">
          {/* Left tap area */}
          <Pressable 
            onPress={() => handleTap('left')}
            style={{ width: width * 0.35, height: height }}
            className="absolute left-0"
          />
          {/* Right tap area */}
          <Pressable 
            onPress={() => handleTap('right')}
            style={{ width: width * 0.35, height: height }}
            className="absolute right-0"
          />
        </View>

        {/* Navigation Hints - Subtle arrows */}
        <View className="absolute inset-y-0 left-4 right-4 flex-row justify-between items-center pointer-events-none z-0">
          {currentStep > 0 && (
            <View className="bg-white/10 p-2 rounded-full">
              <ChevronLeft color="white" size={20} opacity={0.6} />
            </View>
          )}
          <View className="flex-1" />
          {currentStep < INSTRUCTION_STEPS.length - 1 && (
            <View className="bg-white/10 p-2 rounded-full">
              <ChevronRight color="white" size={20} opacity={0.6} />
            </View>
          )}
        </View>

        {/* Content */}
        <VStack space="2xl" className="flex-1 justify-center items-center z-0 pointer-events-none">
          {/* Icon */}
          <View className="items-center mb-8">
            <View className="w-32 h-32 bg-white/10 rounded-full items-center justify-center">
              <IconComponent color="white" size={80} strokeWidth={1.5} />
            </View>
          </View>

          {/* Step Number */}
          <Text className="text-white/60 text-sm tracking-wider uppercase">
            Step {currentStep + 1} of {INSTRUCTION_STEPS.length}
          </Text>

          {/* Title & Description */}
          <VStack space="md" className="items-center px-4">
            <Heading size="2xl" className="text-white text-center font-bold">
              {currentInstruction.title}
            </Heading>
            <Text className="text-white/80 text-center text-base leading-6 max-w-md">
              {currentInstruction.description}
            </Text>
          </VStack>
        </VStack>

        {/* Bottom Section */}
        <VStack space="md" className="z-20 pointer-events-auto">
          {currentStep === INSTRUCTION_STEPS.length - 1 ? (
            // Show continue button on last step
            <Button
              size="xl"
              className="bg-white rounded-full"
              onPress={handleContinue}
              disabled={isCompleting}
            >
              <ButtonText className="text-black font-semibold text-lg">
                {isCompleting ? 'Loading...' : 'Continue to Application'}
              </ButtonText>
            </Button>
          ) : (
            // Show hint text for tapping
            <Text className="text-white/60 text-center text-sm">
              Tap left or right to navigate
            </Text>
          )}
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
