import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading/index.native';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@/components/ui/modal';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useData } from '@/context/DataContext';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { AlertTriangle, ArrowLeft, BookOpen, ChevronRight, Moon, Sun, Trash2, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert } from 'react-native';

type ModalType = 'instructions' | 'clearPrayers' | 'clearAllData' | 'clearContacts' | null;

export default function SettingsScreen() {
  const { clearAllData, prayers, contacts, setPrayers, setContacts } = useData();
  const [showModal, setShowModal] = useState<ModalType>(null);

  const handleClearPrayers = async () => {
    try {
      // Clear prayers from AsyncStorage
      await AsyncStorage.setItem('@prayer_app_prayers', JSON.stringify([]));
      await AsyncStorage.removeItem('@prayer_app_viewed_prayers');
      await AsyncStorage.removeItem('@prayer_app_viewed_date');
      
      // Update context state immediately
      setPrayers([]);
      
      setShowModal(null);
      Alert.alert('Success', 'All prayers have been removed.');
    } catch (error) {
      console.error('Error clearing prayers:', error);
      Alert.alert('Error', 'Failed to clear prayers');
    }
  };

  const handleClearAllData = async () => {
    try {
      await clearAllData();
      setShowModal(null);
      Alert.alert('Success', 'All contacts and associated prayers have been removed');
    } catch (error) {
      console.error('Error clearing contacts:', error);
      Alert.alert('Error', 'Failed to clear contacts');
    }
  };

  const handleClearContacts = async () => {
    try {
      await AsyncStorage.setItem('@prayer_app_contacts', JSON.stringify([]));
      
      // Update context state immediately
      setContacts([]);
      
      setShowModal(null);
      Alert.alert('Success', 'All contacts have been removed.');
    } catch (error) {
      console.error('Error clearing contacts:', error);
      Alert.alert('Error', 'Failed to clear contacts');
    }
  };

  const SettingsOption = ({ 
    icon: IconComponent, 
    title, 
    description, 
    onPress,
    variant = 'default',
    badge
  }: { 
    icon: any; 
    title: string; 
    description: string; 
    onPress: () => void;
    variant?: 'default' | 'danger';
    badge?: string;
  }) => (
    <Pressable onPress={onPress}>
      <Card variant="outline" size="md" className="p-4 bg-white mb-3">
        <HStack space="md" className="items-center justify-between">
          <HStack space="md" className="items-center flex-1">
            <Box 
              className={`p-3 rounded-full ${
                variant === 'danger' ? 'bg-error-100' : 'bg-primary-100'
              }`}
            >
              <Icon 
                as={IconComponent} 
                size="lg" 
                className={variant === 'danger' ? 'text-error-600' : 'text-primary-600'} 
              />
            </Box>
            <VStack space="xs" className="flex-1">
              <HStack space="sm" className="items-center">
                <Text size="md" className="font-semibold text-typography-900">
                  {title}
                </Text>
                {badge && (
                  <Box className="bg-primary-500 px-2 py-0.5 rounded-full">
                    <Text size="2xs" className="text-white font-bold">
                      {badge}
                    </Text>
                  </Box>
                )}
              </HStack>
              <Text size="sm" className="text-typography-600">
                {description}
              </Text>
            </VStack>
          </HStack>
          <Icon as={ChevronRight} size="lg" className="text-typography-400" />
        </HStack>
      </Card>
    </Pressable>
  );

  return (
    <ScrollView className="flex-1 bg-background-50">
      <VStack space="lg" className="px-5 py-6">
        <Pressable onPress={() => router.back()}>
          <Icon as={ArrowLeft} size="xl" className="text-typography-900 mt-4" />
        </Pressable>
        {/* Header */}
        <VStack space="xs">
          <Heading size="2xl" className="text-typography-900">
            Settings
          </Heading>
          <Text size="sm" className="text-typography-600">
            Manage your prayer app preferences
          </Text>
        </VStack>

        {/* Help Section */}
        <VStack space="sm">
          <Text size="sm" className="text-typography-500 font-semibold uppercase tracking-wide px-1">
            Help
          </Text>
          <SettingsOption
            icon={BookOpen}
            title="Instructions"
            description="Learn how to use the prayer app"
            onPress={() => setShowModal('instructions')}
          />
        </VStack>

        {/* Data Management Section */}
        <VStack space="sm">
          <Text size="sm" className="text-typography-500 font-semibold uppercase tracking-wide px-1">
            Data Management
          </Text>
          <SettingsOption
            icon={Trash2}
            title="Clear Prayers"
            description="Remove all prayer requests"
            onPress={() => setShowModal('clearPrayers')}
            variant="danger"
            badge={`${prayers.length}`}
          />
          <SettingsOption
            icon={Users}
            title="Clear Contacts"
            description="Remove all contacts"
            onPress={() => setShowModal('clearContacts')}
            variant="danger"
            badge={`${contacts.length}`}
          />
          <SettingsOption
            icon={Trash2}
            title="Clear All Data"
            description="Remove all data from the app"
            onPress={() => setShowModal('clearAllData')}
            variant="danger"
          />
        </VStack>

        {/* App Info */}
        <VStack space="xs" className="items-center mt-8 mb-4">
          <Text size="xs" className="text-typography-400">
            Prayer App
          </Text>
          <Text size="xs" className="text-typography-400">
            Version 1.0.0
          </Text>
        </VStack>
      </VStack>

      {/* Instructions Modal */}
      <Modal isOpen={showModal === 'instructions'} onClose={() => setShowModal(null)}>
        <ModalBackdrop />
        <ModalContent className="bg-white max-w-md">
          <ModalHeader>
            <VStack space="xs">
              <HStack space="sm" className="items-center">
                <Icon as={BookOpen} size="lg" className="text-primary-600" />
                <Heading size="lg" className="text-typography-900">
                  How to Use Prayer App
                </Heading>
              </HStack>
            </VStack>
          </ModalHeader>
          <ModalBody>
            <ScrollView className="max-h-96">
              <VStack space="lg">
                {/* Getting Started */}
                <VStack space="sm">
                  <Text size="md" className="font-bold text-typography-900">
                    Getting Started
                  </Text>
                  <Text size="sm" className="text-typography-700 leading-5">
                    Welcome to your personal prayer companion! This app helps you organize and remember to pray for the people and situations that matter most.
                  </Text>
                </VStack>

                {/* Adding Contacts */}
                <VStack space="sm">
                  <Text size="md" className="font-bold text-typography-900">
                    1. Add Contacts
                  </Text>
                  <Text size="sm" className="text-typography-700 leading-5">
                    Start by adding people you want to pray for. Tap the <Text className="font-semibold">"Contacts"</Text> tab and press the <Text className="font-semibold">"+"</Text> button to add a new contact with their name, email, and phone.
                  </Text>
                </VStack>

                {/* Creating Prayers */}
                <VStack space="sm">
                  <Text size="md" className="font-bold text-typography-900">
                    2. Create Prayer Requests
                  </Text>
                  <Text size="sm" className="text-typography-700 leading-5">
                    Go to the <Text className="font-semibold">"Prayers"</Text> tab and tap <Text className="font-semibold">"+"</Text> to create a prayer request. Give it a title, description, and associate it with one or more contacts. You can also set the urgency level.
                  </Text>
                </VStack>

                {/* Prayer View */}
                <VStack space="sm">
                  <Text size="md" className="font-bold text-typography-900">
                    3. Use Prayer View
                  </Text>
                  <Text size="sm" className="text-typography-700 leading-5">
                    From the home screen, tap <Text className="font-semibold">"Prayer View"</Text> to see your prayers one at a time. Swipe through each prayer, and the app will track which ones you've prayed for today.
                  </Text>
                </VStack>

                {/* Mark as Answered */}
                <VStack space="sm">
                  <Text size="md" className="font-bold text-typography-900">
                    4. Mark Prayers as Answered
                  </Text>
                  <Text size="sm" className="text-typography-700 leading-5">
                    When God answers a prayer, edit the prayer request and mark it as <Text className="font-semibold">"Answered"</Text>. Answered prayers won't appear in your daily prayer view.
                  </Text>
                </VStack>

                {/* Search */}
                <VStack space="sm">
                  <Text size="md" className="font-bold text-typography-900">
                    5. Search & Organize
                  </Text>
                  <Text size="sm" className="text-typography-700 leading-5">
                    Use the search icon on the home screen to quickly find specific prayers or contacts. You can filter by urgency, status, or search by keywords.
                  </Text>
                </VStack>

                {/* Daily Routine */}
                <VStack space="sm">
                  <Text size="md" className="font-bold text-typography-900">
                    Daily Prayer Routine
                  </Text>
                  <Text size="sm" className="text-typography-700 leading-5">
                    Each day, open the app and use Prayer View to go through your prayer list. The counter on the home screen shows how many prayers you haven't prayed for yet today. Your viewed prayers reset each day.
                  </Text>
                </VStack>
              </VStack>
            </ScrollView>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              className="flex-1"
              onPress={() => setShowModal(null)}
            >
              <ButtonText>Close</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Clear Prayers Modal */}
      <Modal isOpen={showModal === 'clearPrayers'} onClose={() => setShowModal(null)}>
        <ModalBackdrop />
        <ModalContent className="bg-white max-w-md">
          <ModalHeader>
            <VStack space="xs">
              <HStack space="sm" className="items-center">
                <Icon as={AlertTriangle} size="lg" className="text-error-600" />
                <Heading size="lg" className="text-typography-900">
                  Clear All Prayers?
                </Heading>
              </HStack>
            </VStack>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Text size="sm" className="text-typography-700 leading-5">
                This will permanently delete all <Text className="font-bold">{prayers.length} prayer requests</Text> from your app. Your contacts will remain untouched.
              </Text>
              <Box className="bg-error-50 p-3 rounded-lg">
                <Text size="sm" className="text-error-900 font-semibold">
                  ⚠️ This action cannot be undone
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack space="md" className="w-full">
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => setShowModal(null)}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                className="flex-1 bg-error-600"
                onPress={handleClearPrayers}
              >
                <ButtonText className="text-white">Clear Prayers</ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Clear Contacts Modal */}
      <Modal isOpen={showModal === 'clearContacts'} onClose={() => setShowModal(null)}>
        <ModalBackdrop />
        <ModalContent className="bg-white max-w-md">
          <ModalHeader>
            <VStack space="xs">
              <HStack space="sm" className="items-center">
                <Icon as={AlertTriangle} size="lg" className="text-error-600" />
                <Heading size="lg" className="text-typography-900">
                  Clear All Contacts?
                </Heading>
              </HStack>
            </VStack>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Text size="sm" className="text-typography-700 leading-5">
                This will permanently delete all <Text className="font-bold">{contacts.length} contacts</Text> from your app. Your prayer requests will remain, but they will no longer be associated with these contacts.
              </Text>
              <Box className="bg-error-50 p-3 rounded-lg">
                <Text size="sm" className="text-error-900 font-semibold">
                  ⚠️ This action cannot be undone
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack space="md" className="w-full">
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => setShowModal(null)}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                className="flex-1 bg-error-600"
                onPress={handleClearContacts}
              >
                <ButtonText className="text-white">Clear Contacts</ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Clear All Data Modal */}
      <Modal isOpen={showModal === 'clearAllData'} onClose={() => setShowModal(null)}>
        <ModalBackdrop />
        <ModalContent className="bg-white max-w-md">
          <ModalHeader>
            <VStack space="xs">
              <HStack space="sm" className="items-center">
                <Icon as={AlertTriangle} size="lg" className="text-error-600" />
                <Heading size="lg" className="text-typography-900">
                  Clear All Data?
                </Heading>
              </HStack>
            </VStack>
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Text size="sm" className="text-typography-700 leading-5">
                This will permanently delete:
              </Text>
              <VStack space="xs" className="pl-4">
                <Text size="sm" className="text-typography-700">
                  • All <Text className="font-bold">{contacts.length} contacts</Text>
                </Text>
                <Text size="sm" className="text-typography-700">
                  • All <Text className="font-bold">{prayers.length} prayer requests</Text>
                </Text>
              </VStack>
              <Box className="bg-error-50 p-3 rounded-lg">
                <Text size="sm" className="text-error-900 font-semibold">
                  ⚠️ This action cannot be undone
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack space="md" className="w-full">
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => setShowModal(null)}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                className="flex-1 bg-error-600"
                onPress={handleClearAllData}
              >
                <ButtonText className="text-white">Clear All Data</ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
}
