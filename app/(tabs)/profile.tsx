import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading/index.native';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useData } from '@/context/DataContext';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle, Clock, Heart, User, Users } from 'lucide-react-native';

export default function ProfileScreen() {
  const { prayers, contacts, userName } = useData();

  // Calculate stats
  const answeredPrayers = prayers.filter(p => p.isAnswered).length;
  const activePrayers = prayers.filter(p => !p.isAnswered).length;

  const StatCard = ({ 
    icon: IconComponent, 
    label, 
    value,
    color = 'primary'
  }: { 
    icon: any; 
    label: string; 
    value: number | string;
    color?: 'primary' | 'success' | 'warning' | 'error';
  }) => {
    const colorClasses = {
      primary: 'bg-primary-100 text-primary-600',
      success: 'bg-success-100 text-success-600',
      warning: 'bg-warning-100 text-warning-600',
      error: 'bg-error-100 text-error-600',
    };

    return (
      <Card variant="outline" size="md" className="flex-1 p-4 bg-white">
        <VStack space="md" className="items-center">
          <Box className={`p-3 rounded-full ${colorClasses[color].split(' ')[0]}`}>
            <Icon 
              as={IconComponent} 
              size="xl" 
              className={colorClasses[color].split(' ')[1]} 
            />
          </Box>
          <VStack space="xs" className="items-center">
            <Heading size="2xl" className="text-typography-900">
              {value}
            </Heading>
            <Text size="sm" className="text-typography-600 text-center">
              {label}
            </Text>
          </VStack>
        </VStack>
      </Card>
    );
  };

  return (
    <ScrollView className="flex-1 bg-background-50">
      <VStack space="lg" className="px-5 py-6">
        <Pressable onPress={() => router.back()}>
          <Icon as={ArrowLeft} size="xl" className="text-typography-900 mt-4" />
        </Pressable>

        {/* Profile Header */}
        <VStack space="md" className="items-center mt-4">
          <Avatar size="2xl" className="bg-primary-500">
            <Icon as={User} size="xl" className="text-white" />
          </Avatar>
          <VStack space="xs" className="items-center">
            <Text size="xl" className="text-typography-600 font-semibold">
                {userName || 'User'}
            </Text>
          </VStack>
        </VStack>

        {/* Stats Section */}
        <VStack space="sm" className="mt-4">
          <Text size="sm" className="text-typography-500 font-semibold uppercase tracking-wide px-1">
            Your Stats
          </Text>
          
          {/* Row 1: Contacts and Total Prayers */}
          <HStack space="md">
            <StatCard
              icon={Users}
              label="Contacts"
              value={contacts.length}
              color="primary"
            />
            <StatCard
              icon={Heart}
              label="Total Prayers"
              value={prayers.length}
              color="primary"
            />
          </HStack>

          {/* Row 2: Active and Answered */}
          <HStack space="md">
            <StatCard
              icon={Clock}
              label="Active"
              value={activePrayers}
              color="warning"
            />
            <StatCard
              icon={CheckCircle}
              label="Answered"
              value={answeredPrayers}
              color="success"
            />
          </HStack>
        </VStack>

        {/* Encouragement Message */}
        {answeredPrayers > 0 && (
          <Card variant="outline" size="md" className="p-4 bg-success-50 border-success-200">
            <VStack space="xs">
              <Text size="sm" className="font-semibold text-success-900">
                Praise God!
              </Text>
              <Text size="sm" className="text-success-800">
                You've seen {answeredPrayers} answered {answeredPrayers === 1 ? 'prayer' : 'prayers'}. Keep trusting in His perfect timing!
              </Text>
            </VStack>
          </Card>
        )}
      </VStack>
    </ScrollView>
  );
}
