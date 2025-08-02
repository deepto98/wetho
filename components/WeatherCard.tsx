import React, { useMemo } from 'react';
import { WeatherData } from '@/lib/types';
import { Cloud, Sun, CloudRain, Wind, Eye, Droplets, Gauge, Clock } from 'lucide-react';

interface WeatherCardProps {
  data: WeatherData;
}

// Memoize weather icon calculation
const WeatherIcon = React.memo(({ weatherCode, iconCode }: { weatherCode: number; iconCode: string }) => {
  const iconElement = useMemo(() => {
    // Map weather codes to appropriate icons
    if (weatherCode >= 200 && weatherCode < 300) return <CloudRain className="w-12 h-12" />;
    if (weatherCode >= 300 && weatherCode < 400) return <CloudRain className="w-12 h-12" />;
    if (weatherCode >= 500 && weatherCode < 600) return <CloudRain className="w-12 h-12" />;
    if (weatherCode >= 600 && weatherCode < 700) return <CloudRain className="w-12 h-12" />;
    if (weatherCode >= 700 && weatherCode < 800) return <Cloud className="w-12 h-12" />;
    if (weatherCode === 800) return <Sun className="w-12 h-12" />;
    if (weatherCode > 800) return <Cloud className="w-12 h-12" />;
    
    return <Sun className="w-12 h-12" />;
  }, [weatherCode]);

  return iconElement;
});

WeatherIcon.displayName = 'WeatherIcon';

function getAQIStatus(aqi: number) {
  // European AQI ranges (1-5 scale)
  switch (aqi) {
    case 1: return { label: 'Good', color: 'text-green-500', bgColor: 'bg-green-100' };
    case 2: return { label: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
    case 3: return { label: 'Moderate', color: 'text-purple-500', bgColor: 'bg-purple-100' };
    case 4: return { label: 'Poor', color: 'text-orange-500', bgColor: 'bg-orange-100' };
    case 5: return { label: 'Very Poor', color: 'text-red-500', bgColor: 'bg-red-100' };
    default: return { label: 'Unknown', color: 'text-gray-500', bgColor: 'bg-gray-100' };
  }
}

const AQIChart = React.memo(function AQIChart({ currentAQI }: { currentAQI: number }) {
  const aqiLevels = useMemo(() => [
    { value: 1, label: 'Good', color: 'bg-green-500', textColor: 'text-green-700' },
    { value: 2, label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
    { value: 3, label: 'Moderate', color: 'bg-purple-500', textColor: 'text-purple-700' },
    { value: 4, label: 'Poor', color: 'bg-orange-500', textColor: 'text-orange-700' },
    { value: 5, label: 'Very Poor', color: 'bg-red-500', textColor: 'text-red-700' }
  ], []);

  const aqiStatus = useMemo(() => getAQIStatus(currentAQI), [currentAQI]);

  return (
    <div className="mt-3">
      <h3 className="text-xs font-medium text-gray-700 mb-2 text-center">AQI Scale (European Standard)</h3>
      
      {/* Horizontal Bar Chart */}
      <div className="relative">
        <div className="flex rounded-lg overflow-hidden h-6 mb-2">
          {aqiLevels.map((level) => (
            <div
              key={level.value}
              className={`flex-1 ${level.color} relative flex items-center justify-center`}
            >
              <span className="text-xs font-medium text-white">
                {level.value}
              </span>
              
              {/* Current AQI Indicator */}
              {currentAQI === level.value && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <div className="w-3 h-3 bg-gray-800 transform rotate-45 border-2 border-white shadow-lg"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Labels */}
        <div className="flex justify-between text-xs">
          {aqiLevels.map((level) => (
            <div key={level.value} className={`flex-1 text-center ${level.textColor}`}>
              <div className="font-medium text-xs">{level.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Value Display */}
      <div className="mt-2 p-2 bg-gray-50 rounded-lg">
        <div className="text-center">
          <span className="text-xs text-gray-600">Current AQI: </span>
          <span className={`text-sm font-bold ${aqiStatus.color}`}>
            {currentAQI} - {aqiStatus.label}
          </span>
        </div>
      </div>
    </div>
  );
});

// Memoize location formatting
const FormatLocationName = React.memo(({ location }: { location: { name: string; state?: string; country: string } }) => {
  const displayName = useMemo(() => {
    const parts = [location.name];
    if (location.state) {
      parts.push(location.state);
    }
    parts.push(location.country);
    return parts.join(', ');
  }, [location.name, location.state, location.country]);

  return <span>{displayName}</span>;
});

FormatLocationName.displayName = 'LocationName';

// Memoize current time (updates every second but prevents unnecessary renders)
const CurrentTime = React.memo(function CurrentTime() {
  const [currentTime, setCurrentTime] = React.useState(() => 
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <span>{currentTime}</span>;
});

export default React.memo(function WeatherCard({ data }: WeatherCardProps) {
  // Memoize expensive calculations
  const aqiStatus = useMemo(() => getAQIStatus(data.air_quality.aqi), [data.air_quality.aqi]);
  
  const currentDate = useMemo(() => 
    new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  , []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Main Weather Card - WHITE TEXT */}
      <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-2xl">
        {/* Mobile Layout */}
        <div className="block md:hidden">
          {/* Top: Location and Temperature on same line */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-white">{data.location.name}</h1>
              <p className="text-blue-100 text-sm">
                <FormatLocationName location={data.location} />
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-white">
                <WeatherIcon weatherCode={data.current.weather_code} iconCode={data.current.icon} />
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white">{data.current.temp}°</div>
                <p className="text-blue-200 text-xs">Feels like {data.current.feels_like}°</p>
              </div>
            </div>
          </div>
          
          {/* Weather Condition */}
          <div className="text-center mb-4">
            <p className="text-lg capitalize text-blue-100">
              {data.current.weather_description}
            </p>
          </div>
          
          {/* Bottom: Date, Sunrise, Sunset in a row */}
          <div className="flex items-center justify-between text-center">
            <div className="flex-1">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Clock className="w-3 h-3 text-blue-100" />
                <span className="text-xs text-blue-100 font-medium">
                  <CurrentTime />
                </span>
              </div>
              <p className="text-xs text-blue-100">{currentDate}</p>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-center space-x-1">
                <Sun className="w-3 h-3 text-blue-100" />
                <span className="text-xs text-blue-100">Sunrise</span>
              </div>
              <p className="text-xs text-blue-100">{data.astronomy.sunrise}</p>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-center space-x-1">
                <Sun className="w-3 h-3 text-blue-100" />
                <span className="text-xs text-blue-100">Sunset</span>
              </div>
              <p className="text-xs text-blue-100">{data.astronomy.sunset}</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:items-center md:justify-between">
          {/* Weather Icon and Temperature */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <div className="text-white">
                <WeatherIcon weatherCode={data.current.weather_code} iconCode={data.current.icon} />
              </div>
              <div>
                <div className="text-5xl font-bold text-white">{data.current.temp}°</div>
              </div>
            </div>
            <p className="text-lg capitalize text-blue-100">
              {data.current.weather_description}
            </p>
            <p className="text-blue-200 text-sm">
              Feels like {data.current.feels_like}°
            </p>
          </div>
          
          {/* Location Info - Always centered */}
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-white">{data.location.name}</h1>
            <p className="text-blue-100 text-lg">
              <FormatLocationName location={data.location} />
            </p>
          </div>
          
          {/* Date and Sunrise/Sunset */}
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end space-x-2 mb-1">
              <Clock className="w-3 h-3 text-blue-100" />
              <span className="text-xs text-blue-100 font-medium">
                <CurrentTime />
              </span>
            </div>
            <p className="text-xs text-blue-100 mb-3">
              {currentDate}
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-end space-x-2">
                <Sun className="w-3 h-3 text-blue-100" />
                <span className="text-xs text-blue-100">Sunrise: {data.astronomy.sunrise}</span>
              </div>
              <div className="flex items-center justify-end space-x-2">
                <Sun className="w-3 h-3 text-blue-100" />
                <span className="text-xs text-blue-100">Sunset: {data.astronomy.sunset}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details Grid - BLACK TEXT */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-gray-800 font-medium text-sm">Humidity</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{data.current.humidity}%</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Wind className="w-4 h-4 text-gray-500" />
            <span className="text-gray-800 font-medium text-sm">Wind</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{data.current.wind_speed} m/s</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Eye className="w-4 h-4 text-indigo-500" />
            <span className="text-gray-800 font-medium text-sm">Visibility</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{data.current.visibility} km</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Gauge className="w-4 h-4 text-green-500" />
            <span className="text-gray-800 font-medium text-sm">Pressure</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{data.current.pressure} hPa</p>
        </div>
      </div>

      {/* Air Quality Card with Chart - BLACK TEXT */}
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Air Quality</h2>
        
        {/* AQI Visual Chart */}
        <AQIChart currentAQI={data.air_quality.aqi} />

        {/* Additional Air Quality Details */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">CO</p>
            <p className="font-semibold text-gray-900 text-sm">{data.air_quality.co.toFixed(1)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">NO₂</p>
            <p className="font-semibold text-gray-900 text-sm">{data.air_quality.no2.toFixed(1)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">O₃</p>
            <p className="font-semibold text-gray-900 text-sm">{data.air_quality.o3.toFixed(1)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">SO₂</p>
            <p className="font-semibold text-gray-900 text-sm">{data.air_quality.so2.toFixed(1)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">PM2.5</p>
            <p className="font-semibold text-gray-900 text-sm">{data.air_quality.pm2_5.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}); 