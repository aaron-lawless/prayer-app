import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useData } from '@/context/DataContext';
import { Prayer } from '@/types';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  ViewToken
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const BACKGROUND_IMAGES = [
  { source: require('@/assets/images/bible-light.avif'), theme: 'dark' },
  { source: require('@/assets/images/bible2-dark.avif'), theme: 'dark' },
  { source: require('@/assets/images/church-dark.avif'), theme: 'dark' },
  { source: require('@/assets/images/church2-dark.avif'), theme: 'dark' },
  { source: require('@/assets/images/clouds-dark.avif'), theme: 'dark' },
  { source: require('@/assets/images/clouds2-dark.avif'), theme: 'dark' },
  { source: require('@/assets/images/ocean-dark.avif'), theme: 'dark' },
  { source: require('@/assets/images/praise2-dark.avif'), theme: 'dark' },
  { source: require('@/assets/images/sunrise-dark.avif'), theme: 'dark' },
  { source: require('@/assets/images/sunrise2-dark.avif'), theme: 'dark' },
  { source: require('@/assets/images/sunset-dark.avif'), theme: 'dark' },
  { source: require('@/assets/images/sunset2-dark.avif'), theme: 'dark' },
  { source: require('@/assets/images/worship-dark.avif'), theme: 'dark' },
  { source: require('@/assets/images/worship2-dark.avif'), theme: 'dark' },
];

interface PrayerReelItem {
  prayer: Prayer;
  backgroundImage: (typeof BACKGROUND_IMAGES)[number];
}

export default function PrayerReelScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { prayers, getContactsForPrayer, markPrayerAsViewed, updatePrayer } = useData();
  const flatListRef = useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const swipeAnim = useRef(new Animated.Value(1)).current;

  // Handling animate swipe hint fade out
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(swipeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: Platform.OS !== "web",
      }).start(() => setShowSwipeHint(false));
    }, 1000);

    return () => clearTimeout(t);
  }, []);

  // Prepare reel items: unanswered prayers with random backgrounds
  const reelItems = useMemo(() => {
    const unanswered = prayers.filter(p => !p.isAnswered);
    return unanswered.map(prayer => ({
      prayer,
      backgroundImage:
        BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)],
    }));
  }, [prayers]);

  // Handle viewable items change to track current index
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        const index = viewableItems[0].index;
        setCurrentIndex(index);
        
        // Mark the viewed prayer as viewed
        const viewedPrayer = reelItems[index];
        if (viewedPrayer) {
          markPrayerAsViewed(viewedPrayer.prayer.id);
        }
      }
    }
  ).current;

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  // Handle marking prayer as answered
  const handleMarkAsAnswered = async (prayerId: string) => {
    await updatePrayer(prayerId, {
      isAnswered: true,
      dateAnswered: new Date(),
    });
  };

  // Render each reel item
  const renderReelItem = ({ item }: { item: PrayerReelItem }) => {
    const { prayer, backgroundImage } = item;
    const contacts = getContactsForPrayer(prayer.id);

    const isLight = backgroundImage.theme === 'light';
    const textPrimary = "text-white";
    const textSecondary = "text-gray-200";

    return (
      <Box style={styles.reelItem}>
        {/* Background */}
        <ImageBackground
          source={backgroundImage.source}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Light blur — more subtle */}
          <Box style={styles.softeningOverlay} />

          {/* Slight vignette to focus center */}
          <Box style={styles.vignette} />

          {/* Content */}
          <VStack style={styles.content} space="xl">
            {/* Rounded container for prayer content */}
            {/* <Box style={styles.prayerCard}> */}
              <VStack space="lg" className="px-8 py-10">

                {/* Prayer title */}
                <Text
                  className={"text-white text-4xl font-bold text-center"}
                >
                  {prayer.title}
                </Text>

                {/* Description */}
                {prayer.description && (
                  <Text
                    className={"text-white text-md italic text-center"}
                  >
                    {prayer.description}
                  </Text>
                )}

                {/* Contacts (Chips UX) */}
                {contacts.length > 0 && (
                  <VStack space="sm" className="items-center">
                    <Text size="md" className={`font-semibold ${textPrimary}`}>
                      Praying for:
                    </Text>

                    <Box className="flex-row flex-wrap justify-center gap-2">
                      {contacts.map((c) => (
                        <Badge
                          key={c.id}
                          variant="solid"
                          action="muted"
                          className="rounded-full"
                        >
                          <BadgeText className="text-black font-semibold">
                            {c.name}
                          </BadgeText>
                        </Badge>
                      ))}
                    </Box>
                  </VStack>
                )}

                {/* Requested date */}
                <Text className={`text-white text-center text-md font-semibold`}>
                  Requested: {new Date(prayer.dateRequested).toLocaleDateString()}
                </Text>

                {/* Mark as Answered Button */}
                <Pressable 
                  onPress={() => handleMarkAsAnswered(prayer.id)}
                  className="bg-white px-4 py-1 rounded-full self-center mt-4"
                >
                  <Text className="text-black font-bold text-lg">
                    ✓ Mark as Answered
                  </Text>
                </Pressable>
              </VStack>
            {/* </Box> */}
          </VStack>
        </ImageBackground>
      </Box>
    );
  };

  /** Empty State */
  if (reelItems.length === 0) {
    return (
      <Box style={styles.container}>
        <Box style={{ ...styles.closeButton, top: insets.top + 10 }}>
          <Pressable
            onPress={() => router.back()}
            className="bg-black/50 p-3 rounded-full"
          >
            <X size={24} color="white" />
          </Pressable>
        </Box>

        <VStack className="flex-1 items-center justify-center px-6" space="md">
          <Text size="2xl" className="text-white font-bold text-center">
            No Unanswered Prayers
          </Text>
          <Text size="lg" className="text-gray-300 text-center">
            Add some prayers to view them here.
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box style={styles.container}>
      {/* Close */}
      <Box style={{ ...styles.closeButton, top: insets.top + 10 }}>
        <Pressable onPress={() => router.back()} className="bg-black/50 p-3 rounded-full">
          <X size={24} color="white" />
        </Pressable>
      </Box>

      {/* Counter */}
      <Box style={{ ...styles.counterBadge, top: insets.top + 10 }}>
        <Box className="bg-black/50 rounded-full px-4 py-2">
          <Text className="text-white font-semibold">
            {currentIndex + 1} / {reelItems.length}
          </Text>
        </Box>
      </Box>

      {/* Swipe Hint */}
      {showSwipeHint && (
        <Animated.View
          style={{
            ...styles.swipeHintContainer,
            opacity: swipeAnim,
          }}
          pointerEvents="none"
        >
          <Text className="text-white">Swipe up for the next prayer</Text>
        </Animated.View>
      )}

      <FlatList
        ref={flatListRef}
        data={reelItems}
        renderItem={renderReelItem}
        keyExtractor={item => item.prayer.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="start"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  reelItem: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },

  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  softeningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 1,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    zIndex: 5,
  },
  prayerCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 24,
    backdropFilter: 'blur(10px)',
    minHeight: 400,
  },
  titleShadow: {
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 50,
  },
  counterBadge: {
    position: 'absolute',
    left: 20,
    zIndex: 50,
  },
  swipeHintContainer: {
    position: 'absolute',
    bottom: 150,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  swipeGif: {
    width: 70,
    height: 70,
    opacity: 0.7,
  },
});
