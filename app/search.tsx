import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useData } from '@/context/DataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';

const RECENT_SEARCHES_KEY = '@prayer_app_recent_searches';
const MAX_RECENT_SEARCHES = 5;

interface SearchResult {
  type: 'contact' | 'prayer';
  id: string;
  title: string;
  subtitle: string;
  date: Date;
}

export default function SearchScreen() {
  const router = useRouter();
  const { contacts, prayers } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      performSearch(searchQuery);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery, contacts, prayers]);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;

      let updatedSearches = [trimmedQuery, ...recentSearches.filter(s => s !== trimmedQuery)];
      updatedSearches = updatedSearches.slice(0, MAX_RECENT_SEARCHES);
      
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const removeRecentSearch = async (query: string) => {
    try {
      const updatedSearches = recentSearches.filter(s => s !== query);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error removing recent search:', error);
    }
  };

  const performSearch = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search contacts
    contacts.forEach(contact => {
      const searchableText = [
        contact.name,
        contact.email,
        contact.phone,
        contact.relationship,
        contact.notes
      ].filter(Boolean).join(' ').toLowerCase();

      if (searchableText.includes(lowerQuery)) {
        results.push({
          type: 'contact',
          id: contact.id,
          title: contact.name,
          subtitle: contact.relationship || contact.email || 'Contact',
          date: contact.updatedAt
        });
      }
    });

    // Search prayers
    prayers.forEach(prayer => {
      const searchableText = [
        prayer.title,
        prayer.description,
        prayer.category,
        ...(prayer.tags || [])
      ].filter(Boolean).join(' ').toLowerCase();

      if (searchableText.includes(lowerQuery)) {
        const prayerContacts = contacts.filter(c => prayer.contactIds.includes(c.id));
        const contactNames = prayerContacts.length > 0 
          ? prayerContacts.map(c => c.name).join(', ')
          : prayer.category || 'Prayer';
        
        results.push({
          type: 'prayer',
          id: prayer.id,
          title: prayer.title,
          subtitle: prayerContacts.length > 0 ? `For ${contactNames}` : contactNames,
          date: prayer.updatedAt
        });
      }
    });

    // Sort by date (most recent first)
    results.sort((a, b) => b.date.getTime() - a.date.getTime());
    setSearchResults(results);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    saveRecentSearch(query);
  };

  const handleResultPress = (result: SearchResult) => {
    saveRecentSearch(searchQuery);
    
    if (result.type === 'contact') {
      router.push(`/(tabs)/contacts?openContactId=${result.id}` as any);
    } else {
      router.push(`/(tabs)/prayers?openPrayerId=${result.id}` as any);
    }
  };

  return (
    <Box className="flex-1 bg-background-50">
      {/* Header */}
      <Box className="bg-background-0 border-b border-outline-100">
        <HStack className="items-center px-4 py-3" space="md">
          <Pressable onPress={() => router.back()}>
            <Icon as={ArrowLeft} size="xl" className="text-typography-900" />
          </Pressable>
          <Box className="flex-1">
            <Input
              variant="outline"
              size="md"
              className="flex-1"
            >
              <InputSlot className="pl-3">
                <InputIcon as={Search} className="text-typography-500" />
              </InputSlot>
              <InputField
                placeholder="Search contacts and prayers..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearchSubmit}
                autoFocus
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <InputSlot className="pr-3">
                  <Pressable onPress={() => setSearchQuery('')}>
                    <InputIcon as={X} className="text-typography-500" />
                  </Pressable>
                </InputSlot>
              )}
            </Input>
          </Box>
        </HStack>
      </Box>

      <ScrollView className="flex-1">
        <VStack space="lg" className="p-5">
          {!isSearching && recentSearches.length > 0 && (
            <Box>
              <HStack className="items-center justify-between mb-3">
                <Heading size="lg" className="text-typography-900">Recent Searches</Heading>
                <Pressable onPress={clearRecentSearches}>
                  <Text size="sm" className="text-primary-500 font-medium">Clear All</Text>
                </Pressable>
              </HStack>
              <VStack space="sm">
                {recentSearches.map((search, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleRecentSearchPress(search)}
                  >
                    <Card variant="outline" size="md" className="p-3">
                      <HStack className="items-center justify-between">
                        <HStack className="items-center flex-1" space="md">
                          <Icon as={Clock} size="sm" className="text-typography-500" />
                          <Text size="md" className="text-typography-900 flex-1">{search}</Text>
                        </HStack>
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(search);
                          }}
                          className="p-1"
                        >
                          <Icon as={X} size="sm" className="text-typography-400" />
                        </Pressable>
                      </HStack>
                    </Card>
                  </Pressable>
                ))}
              </VStack>
            </Box>
          )}

          {isSearching && searchResults.length > 0 && (
            <Box>
              <Heading size="lg" className="text-typography-900 mb-3">
                Results ({searchResults.length})
              </Heading>
              <VStack space="sm">
                {searchResults.map((result) => (
                  <Pressable
                    key={`${result.type}-${result.id}`}
                    onPress={() => handleResultPress(result)}
                  >
                    <Card variant="elevated" size="md" className="p-4">
                      <VStack space="xs">
                        <HStack className="items-center justify-between">
                          <Text size="lg" className="font-semibold text-typography-900 flex-1">
                            {result.title}
                          </Text>
                          <Box 
                            className={`px-2 py-1 rounded ${
                              result.type === 'contact' 
                                ? 'bg-primary-100' 
                                : 'bg-secondary-100'
                            }`}
                          >
                            <Text 
                              size="xs" 
                              className={`font-medium ${
                                result.type === 'contact'
                                  ? 'text-primary-700'
                                  : 'text-secondary-700'
                              }`}
                            >
                              {/* TODO change this from icons to proper icons */}
                              {result.type === 'contact' ? '👤 Contact' : '🙏 Prayer'}
                            </Text>
                          </Box>
                        </HStack>
                        <Text size="sm" className="text-typography-600">
                          {result.subtitle}
                        </Text>
                        <Text size="xs" className="text-typography-500">
                          Updated {new Date(result.date).toLocaleDateString()}
                        </Text>
                      </VStack>
                    </Card>
                  </Pressable>
                ))}
              </VStack>
            </Box>
          )}

          {isSearching && searchResults.length === 0 && (
            <Box className="items-center justify-center py-12">
              <Icon as={Search} size="xl" className="text-typography-300 mb-3" />
              <Text size="lg" className="text-typography-600 text-center">
                No results found for "{searchQuery}"
              </Text>
              <Text size="sm" className="text-typography-500 text-center mt-2">
                Try searching with different keywords
              </Text>
            </Box>
          )}

          {!isSearching && recentSearches.length === 0 && (
            <Box className="items-center justify-center py-12">
              <Icon as={Search} size="xl" className="text-typography-300 mb-3" />
              <Text size="lg" className="text-typography-600 text-center">
                Search contacts and prayers
              </Text>
              <Text size="sm" className="text-typography-500 text-center mt-2">
                Start typing to find what you're looking for
              </Text>
            </Box>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
}
