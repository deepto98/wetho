import { useState, useEffect, useCallback, useRef } from 'react';
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
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export function useWeather(): UseWeatherReturn {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null
  });

  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const initialLoadDone = useRef(false);

  const fetchWeather = useCallback(async (location?: Location) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const targetLocation = location || currentLocation || await getLocationWithFallback();
      
      if (!currentLocation) {
        setCurrentLocation(targetLocation);
      }

      const weatherData = await getCurrentWeather(targetLocation.lat, targetLocation.lon);
      
      setState({
        data: weatherData,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });
    } catch (error) {
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

  // Auto-refresh weather data
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.lastUpdated && Date.now() - state.lastUpdated.getTime() > CACHE_DURATION) {
        refresh();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [refresh, state.lastUpdated]);

  // Initial load - only run once
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      fetchWeather();
    }
  }, []); // Empty dependency array is intentional here

  return {
    ...state,
    fetchWeather,
    refresh
  };
} 