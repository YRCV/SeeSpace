import React from 'react';
import { StyleSheet, View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import { ClassroomCard } from '@/components/ClassroomCard';
import { useSearch } from '@/context/SearchContext';
import { useAvailableRooms } from '@/hooks/useAvailableRooms';

export default function HomeScreen() {
  const router = useRouter();
  const { searchQuery } = useSearch();
  const { rooms, loading } = useAvailableRooms();

  const q = searchQuery.toLowerCase();
  const filtered = rooms.filter(
    (r: any) => r.name.toLowerCase().includes(q) || r.building.toLowerCase().includes(q)
  );

  const nearbyFree = filtered.filter((r: any) => r.status === 'free');

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
        {/* {favorites.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <View style={styles.accent} />
              <Text style={styles.sectionTitle}>Favorites</Text>
            </View>
            {favorites.map(r => (
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
            ))}
          </View>
        )} */}

        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <View style={styles.accent} />
            <Text style={styles.sectionTitle}>{searchQuery ? 'Results' : 'Nearby Free Rooms'}</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#d64045" style={{ marginTop: 24 }} />
          ) : nearbyFree.length > 0 ? (
            nearbyFree.map((r: any) => (
              <ClassroomCard
                key={r.id}
                id={r.id}
                name={r.name}
                building={r.building}
                distance={r.distance}
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
            <Text style={styles.empty}>No free rooms found.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#dcdcdd' },
  scroll: { flex: 1 },
  list: { padding: 16, paddingBottom: 100 },
  section: { marginBottom: 24, gap: 10 },
  sectionRow: { flexDirection: 'row', alignItems: 'center' },
  accent: { width: 4, height: 20, backgroundColor: '#d64045', borderRadius: 2, marginRight: 10 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#2a2b2a' },
  empty: { textAlign: 'center', marginTop: 24, color: '#2a2b2a', opacity: 0.5 },
});
