import axios from 'axios';
import { WeatherData, Location, ApiError } from './types';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export class WeatherApiError extends Error {
  constructor(message: string, public code: number) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

interface OpenWeatherGeoResponse {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  local_names?: Record<string, string>;
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  if (!API_KEY) {
    throw new WeatherApiError('Weather API key is not configured', 500);
  }

  try {
    // Fetch current weather and air quality in parallel
    const [weatherResponse, airQualityResponse] = await Promise.all([
      axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric'
        }
      }),
      axios.get(`${BASE_URL}/air_pollution`, {
        params: {
          lat,
          lon,
          appid: API_KEY
        }
      })
    ]);

    const weather = weatherResponse.data;
    const airQuality = airQualityResponse.data;

    // Transform API response to our WeatherData format
    const weatherData: WeatherData = {
      location: {
        lat: weather.coord.lat,
        lon: weather.coord.lon,
        name: weather.name,
        country: weather.sys.country
      },
      current: {
        temp: Math.round(weather.main.temp),
        feels_like: Math.round(weather.main.feels_like),
        humidity: weather.main.humidity,
        pressure: weather.main.pressure,
        visibility: weather.visibility / 1000, // Convert to km
        uv_index: 0, // OpenWeather free tier doesn't include UV
        wind_speed: weather.wind.speed,
        wind_direction: weather.wind.deg || 0,
        weather_code: weather.weather[0].id,
        weather_description: weather.weather[0].description,
        icon: weather.weather[0].icon
      },
      air_quality: {
        aqi: airQuality.list[0].main.aqi,
        co: airQuality.list[0].components.co,
        no2: airQuality.list[0].components.no2,
        o3: airQuality.list[0].components.o3,
        so2: airQuality.list[0].components.so2,
        pm2_5: airQuality.list[0].components.pm2_5,
        pm10: airQuality.list[0].components.pm10
      },
      forecast: {
        precipitation_probability: 0, // Would need forecast API
        precipitation_amount: 0
      },
      astronomy: {
        sunrise: new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        sunset: new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
    };

    return weatherData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Failed to fetch weather data';
      const code = error.response?.status || 500;
      throw new WeatherApiError(message, code);
    }
    throw new WeatherApiError('Unexpected error occurred', 500);
  }
}

export async function searchLocations(query: string): Promise<Location[]> {
  if (!API_KEY) {
    throw new WeatherApiError('Weather API key is not configured', 500);
  }

  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY
      }
    });

    return response.data.map((location: OpenWeatherGeoResponse) => ({
      lat: location.lat,
      lon: location.lon,
      name: location.name,
      country: location.country,
      state: location.state
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Failed to search locations';
      const code = error.response?.status || 500;
      throw new WeatherApiError(message, code);
    }
    throw new WeatherApiError('Unexpected error occurred', 500);
  }
}

export async function getLocationByCoords(lat: number, lon: number): Promise<Location> {
  if (!API_KEY) {
    throw new WeatherApiError('Weather API key is not configured', 500);
  }

  try {
    const response = await axios.get(`${GEO_URL}/reverse`, {
      params: {
        lat,
        lon,
        limit: 1,
        appid: API_KEY
      }
    });

    const location: OpenWeatherGeoResponse = response.data[0];
    return {
      lat: location.lat,
      lon: location.lon,
      name: location.name,
      country: location.country,
      state: location.state
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Failed to get location';
      const code = error.response?.status || 500;
      throw new WeatherApiError(message, code);
    }
    throw new WeatherApiError('Unexpected error occurred', 500);
  }
} 