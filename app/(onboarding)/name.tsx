import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { UserCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useData } from '@/context/DataContext';
import { Heading } from '@/components/ui/heading/index.native';

export default function NameScreen() {
  const router = useRouter();
  const { addContact, setHasCompletedOnboarding, setUserName } = useData();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      // Save the user's name
      await setUserName(name.trim());
      
      // Create the first contact with the user's name and "Other" category
      await addContact({
        name: name.trim(),
        relationship: 'Other',
        notes: 'My profile',
      });

      // Navigate to the instructions screen
      router.push('/instructions');
    } catch (error) {
      console.error('Error creating contact:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#0f0f0f', '#000000']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <VStack space="4xl" className="flex-1 justify-between px-8 py-12 mt-20">

          {/* Content */}
          <VStack space="2xl" className="flex-1 justify-center pb-20">
            {/* Icon */}
            <View className="items-center mb-8">
              <View className="w-32 h-32 bg-white/10 rounded-full items-center justify-center">
                <UserCircle color="white" size={80} strokeWidth={1.5} />
              </View>
            </View>

            {/* Heading */}
            <VStack space="md" className="items-center">
              <Heading size="2xl" className="text-white text-center font-bold">
                What's your name?
              </Heading>
              <Text className="text-white/80 text-center text-base leading-6 px-4">
                Let's get to know you better. This will help personalize your prayer experience.
              </Text>
            </VStack>

            {/* Input */}
            <VStack space="md" className="mt-8">
              <Input
                size="xl"
                className="bg-white/10 border-white/20 rounded-2xl"
              >
                <InputField
                  placeholder="Enter your name"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={name}
                  onChangeText={setName}
                  className="text-white text-lg px-4"
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                />
              </Input>
            </VStack>
          </VStack>

          {/* CTA Button */}
          <VStack space="md">
            <Button
              size="xl"
              className={`rounded-full ${name.trim() ? 'bg-white' : 'bg-white/20'}`}
              onPress={handleContinue}
              isDisabled={!name.trim() || isSubmitting}
            >
              <ButtonText className={`${name.trim() ? 'text-black' : 'text-white'} font-semibold text-lg`}>
                {isSubmitting ? 'Creating...' : 'Continue'}
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
});
