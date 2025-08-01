import { useCallback, useMemo, useState } from 'react';
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
  const [rawSearches, setRawSearches, isHydrated] = useLocalStorage<Omit<RecentSearch, 'displayName' | 'timeAgo'>[]>('weatho-recent-searches', []);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Format searches with useMemo to ensure reactivity
  const recentSearches = useMemo(() => {
    if (!isHydrated) {
      return [];
    }
    
    const formatted = rawSearches.map((search) => ({
      ...search,
      displayName: [search.name, search.state, search.country].filter(Boolean).join(', '),
      timeAgo: getTimeAgo(search.timestamp)
    }));
    
    return formatted;
  }, [rawSearches, isHydrated, refreshCounter]);

  const addRecentSearch = useCallback((location: Location) => {
    console.log('🔍 Adding recent search:', location.name);
    
    setRawSearches((prev) => {
      // Check if location already exists
      const existingIndex = prev.findIndex(
        (search) => search.lat === location.lat && search.lon === location.lon
      );

      let updatedSearches: Omit<RecentSearch, 'displayName' | 'timeAgo'>[];

      if (existingIndex >= 0) {
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
        // Add new search
        const newSearch: Omit<RecentSearch, 'displayName' | 'timeAgo'> = {
          ...location,
          timestamp: Date.now(),
          searchCount: 1
        };
        updatedSearches = [newSearch, ...prev];
      }

      // Keep only the most recent searches
      const finalSearches = updatedSearches.slice(0, MAX_RECENT_SEARCHES);
      return finalSearches;
    });

    // Force refresh after state update
    setTimeout(() => {
      setRefreshCounter(prev => prev + 1);
    }, 0);
  }, [setRawSearches]);

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