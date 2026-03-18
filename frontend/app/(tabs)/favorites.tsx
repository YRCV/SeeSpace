import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { ClassroomCard } from '@/components/ClassroomCard';
import { ALL_ROOMS } from '@/constants/data';

export default function FavoritesScreen() {
  const router = useRouter();
  const favorites = ALL_ROOMS.filter(r => r.isFavorite);

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <View style={styles.accent} />
            <Text style={styles.sectionTitle}>Your Starred Rooms</Text>
          </View>
          {favorites.length > 0 ? (
            favorites.map(r => (
              <ClassroomCard
                key={r.id}
                id={r.id}
                name={r.name}
                building={r.building}
                status={r.status}
                onPress={(transitionId) =>
                  router.push({
                    pathname: '/classroom/[id]',
                    params: {
                      id: r.id,
                      ...(transitionId ? { transitionId } : {}),
                    },
                  })
                }
              />
            ))
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No favorites yet.</Text>
              <Text style={styles.emptyHint}>Star a classroom to see it here.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#dcdcdd' },
  scroll: { flex: 1 },
  list: { padding: 16, paddingBottom: 32 },
  section: { marginBottom: 24 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  accent: { width: 4, height: 20, backgroundColor: '#d64045', borderRadius: 2, marginRight: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#2a2b2a' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#2a2b2a', opacity: 0.5 },
  emptyHint: { fontSize: 14, color: '#2a2b2a', opacity: 0.35, marginTop: 6 },
});
