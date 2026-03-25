import React from 'react';
import { StyleSheet, View, ScrollView, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ClassroomDetailHero } from '@/components/ClassroomDetailHero';
import { ClassroomCalendar } from '@/components/ClassroomCalendar';
import { ThemedText } from '@/components/themed-text';
import { ALL_ROOMS } from '@/constants/data';
import { useClassroomOpenTransition } from '@/context/ClassroomOpenTransitionContext';
import { useFavorites } from '@/context/FavoritesContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClassroomDetailScreen() {
  const { id, transitionId } = useLocalSearchParams<{
    id?: string | string[];
    transitionId?: string | string[];
  }>();
  const router = useRouter();
  const { completeOpenTransition, startCloseTransition } = useClassroomOpenTransition();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const roomId = Array.isArray(id) ? id[0] : id;
  const room = ALL_ROOMS.find(r => r.id === roomId);
  const hasReportedReadyRef = React.useRef(false);

  const handleLayout = React.useCallback(() => {
    if (hasReportedReadyRef.current) return;
    hasReportedReadyRef.current = true;

    // Report ready instantly so that the overlay stops blocking touches
    // (pointerEvents="none" is set). The visual overlay will persist for 50ms
    // strictly via Reanimated (withDelay) to prevent the white-flash.
    completeOpenTransition();
  }, [completeOpenTransition]);

  if (!room) {
    return (
      <View style={styles.notFoundContainer}>
        <ThemedText>Room not found</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.screen} onLayout={handleLayout}>
      <StatusBar barStyle="dark-content" backgroundColor="#2a2b2a" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ClassroomDetailHero
          name={room.name}
          building={room.building}
          status={room.status}
          isFavorite={isFavorite(room.id)}
          onToggleFavorite={() => toggleFavorite(room.id)}
          backButtonMode="interactive"
          onBackPress={() => {
            if (room) {
              startCloseTransition(room.id, () => router.back());
            } else {
              router.back();
            }
          }}
        />

        <ClassroomCalendar 
          building={room.building} 
          roomName={room.name} 
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
     color: "#2a2b2a",
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: '#0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#0000',
  },
  scrollContent: {
    paddingBottom: 0,
  },
});
