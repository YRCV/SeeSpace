import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';

import { Octicons, Fontisto } from '@expo/vector-icons';
import { Lucide } from '@react-native-vector-icons/lucide';

import { AppHeader } from '@/components/AppHeader';
import { FloatingSearchBar } from '@/components/FloatingSearchBar';
import { SearchProvider, useSearch } from '@/context/SearchContext';

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

function TabLayoutContent() {
  const { searchQuery, setSearchQuery } = useSearch();
  const pathname = usePathname();
  
  const isFavorites = pathname === '/favorites';
  const showSearch = !isFavorites;

  return (
    <View style={styles.container}>
      <AppHeader />
      <TopTabs
        initialRouteName="index"
        tabBarPosition="bottom"
        screenOptions={{
          swipeEnabled: true,
          tabBarActiveTintColor: '#d64045',
          tabBarInactiveTintColor: 'rgba(220,220,221,0.55)',
          tabBarStyle: {
            backgroundColor: '#0000',
            borderTopColor: 'rgba(255,255,255,0.08)',
            borderTopWidth: 1,
            elevation: 0,
            boxShadow: 'none',
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            textTransform: 'none',
          },
          tabBarIndicatorStyle: {
            height: 0, 
          },
          tabBarShowIcon: true,
        }}
      >
        <TopTabs.Screen
          name="buildings"
          options={{
            title: 'Buildings',
            tabBarIcon: ({ color }: { color: string }) => <Lucide size={24} name="building" color={color} />,
          }}
        />
        <TopTabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }: { color: string }) => <Octicons size={24} name="home-fill" color={color} />,
          }}
        />
        <TopTabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color }: { color: string }) => <Fontisto size={23} name="star" color={color} />,
          }}
        />
      </TopTabs>
      <FloatingSearchBar 
        value={searchQuery} 
        onChangeText={setSearchQuery} 
        placeholder="Search buildings/rooms"
        visible={showSearch}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <SearchProvider>
      <TabLayoutContent />
    </SearchProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2b2a',
  },
});
