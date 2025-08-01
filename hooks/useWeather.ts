import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { WeatherData, Location } from '@/lib/types';
import { getCurrentWeather, WeatherApiError } from '@/lib/weather-api';
import { getLocationWithFallback } from '@/lib/geolocation';

interface UseWeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface UseWeatherReturn extends UseWeatherState {
  fetchWeather: (location?: Location) => Promise<void>;
  refresh: () => Promise<void>;
  isStale: boolean;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const STALE_DURATION = 5 * 60 * 1000; // 5 minutes (show stale indicator)

export function useWeather(): UseWeatherReturn {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null
  });

  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const initialLoadDone = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoize stale status calculation
  const isStale = useMemo(() => {
    if (!state.lastUpdated) return false;
    return Date.now() - state.lastUpdated.getTime() > STALE_DURATION;
  }, [state.lastUpdated]);

  const fetchWeather = useCallback(async (location?: Location) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const targetLocation = location || currentLocation || await getLocationWithFallback();
      
      if (!currentLocation) {
        setCurrentLocation(targetLocation);
      }

      const weatherData = await getCurrentWeather(targetLocation.lat, targetLocation.lon);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      setState({
        data: weatherData,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });
    } catch (error) {
      // Don't update state if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      let errorMessage = 'Failed to fetch weather data';
      
      if (error instanceof WeatherApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        data: null,
        loading: false,
        error: errorMessage,
        lastUpdated: null
      });
    }
  }, [currentLocation]);

  const refresh = useCallback(() => {
    return fetchWeather(currentLocation || undefined);
  }, [fetchWeather, currentLocation]);

  // Auto-refresh weather data with intelligent timing
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.lastUpdated && Date.now() - state.lastUpdated.getTime() > CACHE_DURATION) {
        // Only auto-refresh if page is visible to save API calls
        if (!document.hidden) {
          refresh();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [refresh, state.lastUpdated]);

  // Handle page visibility changes for smart refreshing
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && state.lastUpdated) {
        const timeSinceUpdate = Date.now() - state.lastUpdated.getTime();
        // Refresh if data is stale and page becomes visible
        if (timeSinceUpdate > CACHE_DURATION) {
          refresh();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refresh, state.lastUpdated]);

  // Initial load - only run once
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchWeather();
    }
  }, []); // Empty dependency array is intentional here

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    fetchWeather,
    refresh,
    isStale
  };
} 