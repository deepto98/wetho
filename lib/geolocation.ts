import { Location } from './types';
import { getLocationByCoords } from './weather-api';

export interface GeolocationError {
  message: string;
  code: number;
}

export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        message: 'Geolocation is not supported by this browser',
        code: 0
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const location = await getLocationByCoords(latitude, longitude);
          resolve(location);
        } catch (error) {
          reject({
            message: 'Failed to get location details',
            code: 4
          });
        }
      },
      (error) => {
        let message = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        reject({
          message,
          code: error.code
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

export function getDefaultLocation(): Location {
  // Default to New York City
  return {
    lat: 40.7128,
    lon: -74.0060,
    name: 'New York',
    country: 'US'
  };
}

export async function getLocationWithFallback(): Promise<Location> {
  try {
    return await getCurrentLocation();
  } catch (error) {
    console.warn('Failed to get current location, using default:', error);
    return getDefaultLocation();
  }
} 