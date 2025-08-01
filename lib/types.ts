export interface Location {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
}

export interface WeatherData {
  location: Location;
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    visibility: number;
    uv_index: number;
    wind_speed: number;
    wind_direction: number;
    weather_code: number;
    weather_description: string;
    icon: string;
  };
  air_quality: {
    aqi: number;
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
  };
  forecast: {
    precipitation_probability: number;
    precipitation_amount: number;
  };
  astronomy: {
    sunrise: string;
    sunset: string;
  };
}

export interface ApiError {
  message: string;
  code: number;
} 