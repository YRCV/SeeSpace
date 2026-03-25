import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ALL_ROOMS } from '@/constants/data';

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (roomId: string) => void;
  isFavorite: (roomId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // Initialize with the data's default ones
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const initialFavorites = ALL_ROOMS.filter(r => r.isFavorite).map(r => r.id);
    return new Set(initialFavorites);
  });

  const toggleFavorite = (roomId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(roomId)) {
        next.delete(roomId);
      } else {
        next.add(roomId);
      }
      return next;
    });
  };

  const isFavorite = (roomId: string) => {
    return favorites.has(roomId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites: Array.from(favorites),
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
