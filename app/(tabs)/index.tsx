import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useTheme } from '@/context/ThemeContext';
import { QuickAction } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Moon, NotebookPen, Search, Sun, User, UserPlus, View } from 'lucide-react-native';
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useData } from '../../context/DataContext';

export default function HomeScreen() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useTheme();
  const isDark = colorMode === 'dark';
  const { contacts, prayers, getContactsForPrayer, clearAllData, getUnviewedPrayersCount } = useData();

  const recentPrayers = prayers.slice(0, 3);
  const unviewedCount = getUnviewedPrayersCount();

  const QuickActions : QuickAction[] = [
    {
      label: 'Add Contact',
      icon: UserPlus,
      action: () => router.push('/(tabs)/contacts?openModal=true' as any),
    },
    {
      label: 'Add Prayer',
      icon: NotebookPen,
      action: () => router.push('/(tabs)/prayers?openModal=true' as any),
    }
  ]

  const HeroHeader = () => {
  return (
    <Box className="relative" style={{ height: 420 }} >
      <ImageBackground
        source={require('@/assets/images/praise-dark.jpg')}
        style={styles.heroBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(17, 17, 17, 0.85)', 'rgba(77, 76, 76, 0.85)']}
          style={styles.gradientOverlay}
        >
          {/* Header Actions */}
          <HStack className="w-full px-5 pt-12 justify-between items-center">
            {/* Left Actions */}
            <HStack space="md" className="items-center">
              <Pressable
                onPress={() => router.push('/(tabs)/contacts' as any)}
                className="bg-white rounded-full p-3 shadow"
              >
                <Icon as={User} size="lg" className="text-typography-700" />
              </Pressable>
            </HStack>
            
            {/* Right Actions */}
            <HStack space="md" className="items-center">
              <Pressable
                onPress={() => router.push('/search' as any)}
                className="bg-white rounded-full p-3 shadow"
              >
                <Icon as={Search} size="lg" className="text-typography-700" />
              </Pressable>

              <Pressable
                onPress={toggleColorMode}
                className="bg-white rounded-full p-3 shadow"
              >
                <Icon as={isDark ? Sun : Moon} size="lg" className="text-typography-700" />
              </Pressable>
            </HStack>
          </HStack>

          {/* Header Text */}
          <VStack space="lg" className="items-center justify-start h-full px-10 mt-10">
            <VStack space="sm" className="items-center">
              <Text className="text-white text-5xl font-bold text-center">
                PRAY
              </Text>
              <HStack space="sm">
                <Text className="text-gray-300 text-4xl font-bold italic text-center">
                  WITHOUT
                </Text>
                <Text className="text-white text-4xl font-bold text-center">
                  CEASING
                </Text>
              </HStack>
              <Text className="text-white text-3xl font-bold text-center">
                - 1 THESSALONIANS
              </Text>
              <Text className="text-white text-4xl font-bold text-center">
                5:17
              </Text>
            </VStack>
          </VStack>
        </LinearGradient>
      </ImageBackground>
    </Box>
  );
  }

  return (
    <ScrollView className="flex-1 bg-background-150">
      {/* Hero Header */}
      <HeroHeader/>

      {/* Main Content */}
      <VStack space="lg" className="px-5 py-6">
        {/* Start Praying View */}
        {/* TODO replace a lot of this content with helpful options */}
        <Card variant="elevated" size="lg" className="bg-white p-5 -mt-20 z-10 rounded-2xl">
          <VStack space="md">
            <HStack className="items-center justify-between">
              <VStack space="xs">
                <Text size="sm" className="text-typography-500 font-medium">
                  Prayer Activity Today
                </Text>
                <Text size="2xl" className="font-bold text-typography-900">
                  {unviewedCount > 0 ? `${unviewedCount} ${unviewedCount === 1 ? 'Prayer' : 'Prayers'} left` : 'All Prayers Prayed For'}
                </Text>
              </VStack>
              <Pressable>
                <Text size="2xl">⋯</Text>
              </Pressable>
            </HStack>

            {/* Prayer View */}
            <Button
              className="bg-primary-500 py-4 rounded-full"
              onPress={() => router.push('/prayer-reel' as any)}
            >
              <HStack space="sm" className="items-center">
                <Icon as={View} size="lg" className="text-white" />
                <ButtonText className="text-white font-bold text-base">
                  Prayer View
                </ButtonText>
              </HStack>
            </Button>
          </VStack>
        </Card>

        {/* Quick Actions Section */}
        <Box>
          <HStack className="items-center justify-between mb-4">
            <Heading size="lg" className="text-typography-900">Quick Actions</Heading>
          </HStack>
          <HStack space="md">
            {QuickActions.map((action) => (
              <Pressable
                key={action.label}
                className="flex-1"
                onPress={action.action}
              >
                <Card variant="outline" size="sm" className="items-center p-5 bg-white rounded-xl">
                  <VStack space="sm" className="items-center">
                      <Icon as={action.icon} size="lg" className="text-primary-600" />
                    <Text size="sm" className="font-semibold text-center text-typography-900">
                      {action.label}
                    </Text>
                  </VStack>
                </Card>
              </Pressable>
            ))}
          </HStack>
        </Box>

        {/* Recent Prayers */}
        <Box>
          <Heading size="lg" className="text-typography-900 mb-4">Recent Prayers</Heading>
          <VStack space="sm">
            {recentPrayers.length > 0 ? (
              recentPrayers.map((prayer) => {
                const prayerContacts = getContactsForPrayer(prayer.id);
                const contactNames =
                  prayerContacts.length > 0
                    ? prayerContacts
                        //only want to show 2 contacts as it can get too long
                        .slice(0, 2)
                        .map(c => c.name)
                        .join(', ') +
                      (prayerContacts.length > 2 ? ', ...' : '')
                    : 'Unknown';
                
                return (
                  <Pressable
                    key={prayer.id}
                    onPress={() => router.push(`/(tabs)/prayers?openPrayerId=${prayer.id}` as any)}
                  >
                    <Card variant="elevated" size="md" className="p-4 bg-white">
                      <HStack space="lg" className="items-center">
                        <Box className="bg-primary-100 p-3 rounded-full">
                          <Icon as={NotebookPen} size="sm" className="text-primary-600" />
                        </Box>
                        <VStack space="xs" className="flex-1">
                          <Text size="md" className="font-semibold text-typography-900">
                            {prayer.title}
                          </Text>
                          <HStack space="xs" className="items-center flex-wrap">
                            <Text size="sm" className="text-typography-600">
                              {contactNames}
                            </Text>
                            {/* Show count of additional contacts if more than 2 */}
                            {prayerContacts.length > 2 && (
                              <Box className="bg-primary-100 px-2 py-0.5 rounded-full">
                                <Text size="2xs" className="text-primary-700 font-semibold">
                                  +{prayerContacts.length-2} people
                                </Text>
                              </Box>
                            )}
                          </HStack>
                          <Text size="xs" className="text-typography-500">
                            {new Date(prayer.createdAt).toLocaleDateString()}
                          </Text>
                        </VStack>
                        {prayer.isAnswered && (
                          <Box className="bg-black px-3 py-1.5 rounded-full">
                            <Text size="xs" className="text-white font-bold">✓ Answered</Text>
                          </Box>
                        )}
                      </HStack>
                    </Card>
                  </Pressable>
                );
              })
            ) : (
              <Card variant="filled" size="lg" className="items-center p-8 bg-white">
                <VStack space="md" className="items-center">
                  <Text size="lg" className="text-center text-typography-900 font-semibold">
                    No prayers yet
                  </Text>
                  <Text size="sm" className="text-center text-typography-600">
                    Start by adding a contact and creating your first prayer request.
                  </Text>
                  <Button
                    className="bg-primary-600 mt-2"
                    onPress={() => router.push('/(tabs)/contacts?openModal=true' as any)}
                  >
                    <ButtonText className="text-white font-semibold">Add Contact</ButtonText>
                  </Button>
                </VStack>
              </Card>
            )}
          </VStack>
        </Box>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heroBackground: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    width: '100%',
    height: '100%',
  },
});