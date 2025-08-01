import { useCallback, useMemo, useState, useEffect } from 'react';
import { Location } from '@/lib/types';
import { useLocalStorage } from './useLocalStorage';

const MAX_RECENT_SEARCHES = 10;

export interface RecentSearch extends Location {
  timestamp: number;
  searchCount: number;
  displayName: string;
  timeAgo: string;
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
}

export function useRecentSearches() {
  const [rawSearches, setRawSearches, isHydrated] = useLocalStorage<Omit<RecentSearch, 'displayName' | 'timeAgo'>[]>('wetho-recent-searches', []);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [pendingSearches, setPendingSearches] = useState<Location[]>([]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Recent searches hook initialized');
    console.log('📦 Raw searches from localStorage:', rawSearches);
    console.log('💧 Is hydrated:', isHydrated);
  }, [rawSearches, isHydrated]);

  // Internal function for actually adding the search (after hydration)
  const addRecentSearchInternal = useCallback((location: Location) => {
    console.log('🔍 Adding recent search internally:', location.name);
    
    setRawSearches((prev) => {
      console.log('📝 Previous searches in setter:', prev.length, 'items');
      
      // Check if location already exists
      const existingIndex = prev.findIndex(
        (search) => search.lat === location.lat && search.lon === location.lon
      );

      let updatedSearches: Omit<RecentSearch, 'displayName' | 'timeAgo'>[];

      if (existingIndex >= 0) {
        console.log('🔄 Updating existing search at index:', existingIndex);
        // Update existing search - move to top and increment count
        const existingSearch = prev[existingIndex];
        updatedSearches = [
          {
            ...existingSearch,
            timestamp: Date.now(),
            searchCount: existingSearch.searchCount + 1,
            // Update location details in case they changed
            name: location.name,
            country: location.country,
            state: location.state
          },
          ...prev.filter((_, index) => index !== existingIndex)
        ];
      } else {
        console.log('➕ Adding new search');
        // Add new search
        const newSearch: Omit<RecentSearch, 'displayName' | 'timeAgo'> = {
          ...location,
          timestamp: Date.now(),
          searchCount: 1
        };
        updatedSearches = [newSearch, ...prev].slice(0, 10); // Keep only latest 10
      }

      console.log('✅ Updated searches:', updatedSearches.length, 'items');
      return updatedSearches;
    });

    // Force re-render with a small delay to ensure the state update has been processed
    setTimeout(() => {
      console.log('🔄 Forcing refresh counter update');
      setRefreshCounter(prev => prev + 1);
    }, 0);
  }, [setRawSearches]);

  // Process pending searches when localStorage hydrates
  useEffect(() => {
    if (isHydrated && pendingSearches.length > 0) {
      console.log('⚡ Processing', pendingSearches.length, 'pending searches after hydration');
      pendingSearches.forEach((location, index) => {
        setTimeout(() => {
          console.log('📝 Processing pending search:', location.name);
          addRecentSearchInternal(location);
        }, index * 10); // Small delay between each to avoid race conditions
      });
      setPendingSearches([]);
    }
  }, [isHydrated, pendingSearches, addRecentSearchInternal]);

  // Format searches with useMemo to ensure reactivity
  const recentSearches = useMemo(() => {
    if (!isHydrated) {
      console.log('⏳ Not hydrated yet, returning empty array');
      return [];
    }
    
    const formatted = rawSearches.map((search) => ({
      ...search,
      displayName: [search.name, search.state, search.country].filter(Boolean).join(', '),
      timeAgo: getTimeAgo(search.timestamp)
    }));
    
    console.log('✨ Formatted recent searches:', formatted.length, 'items');
    return formatted.slice(0, 10); // Keep only latest 10
  }, [rawSearches, isHydrated, refreshCounter]);

  const addRecentSearch = useCallback((location: Location) => {
    console.log('🔍 Adding recent search:', location.name);
    console.log('💧 Is hydrated when adding:', isHydrated);
    console.log('📦 Current raw searches before adding:', rawSearches.length, 'items');
    
    // Don't add searches before localStorage is hydrated to prevent data loss
    if (!isHydrated) {
      console.log('⚠️ Cannot add search before localStorage is hydrated, queuing for later');
      // Queue the search to be added after hydration
      setPendingSearches((prev) => [...prev, location]);
      return;
    }
    
    // If hydrated, add immediately
    addRecentSearchInternal(location);
  }, [isHydrated, rawSearches.length, addRecentSearchInternal]);

  const removeRecentSearch = useCallback((location: Location) => {
    console.log('🗑️ Removing recent search:', location.name);
    setRawSearches((prev) =>
      prev.filter(
        (search) => !(search.lat === location.lat && search.lon === location.lon)
      )
    );
    setRefreshCounter(prev => prev + 1);
  }, [setRawSearches]);

  const clearRecentSearches = useCallback(() => {
    console.log('🧹 Clearing all recent searches');
    setRawSearches([]);
    setRefreshCounter(prev => prev + 1);
  }, [setRawSearches]);

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    isHydrated
  };
} 