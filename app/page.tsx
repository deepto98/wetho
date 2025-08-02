'use client';

import { RefreshCw, MapPin, Cloud, Github } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import WeatherCard from '@/components/WeatherCard';
import LocationSearch from '@/components/LocationSearch';
import LoadingWeather from '@/components/LoadingWeather';
import ErrorMessage from '@/components/ErrorMessage';
import RecentSearchesSidebar from '@/components/RecentSearchesSidebar';

import { Location } from '@/lib/types';

export default function Home() {
  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches, isHydrated } = useRecentSearches();
  
  // Handle GPS location fetching and add to recent searches
  const handleLocationFetched = (location: Location, isGPSLocation: boolean) => {
    if (isGPSLocation) {
      console.log('🎯 GPS Location fetched:', location);
      console.log('📞 Adding GPS location to recent searches...');
      addRecentSearch(location);
      console.log('✅ GPS location added to search history');
    }
  };

  const { data, loading, error, fetchWeather, refresh } = useWeather(handleLocationFetched);

  const handleLocationSelect = (location: Location) => {
    console.log('🎯 Location selected:', location);
    console.log('📞 Calling fetchWeather...');
    fetchWeather(location);
    console.log('📞 Calling addRecentSearch...');
    addRecentSearch(location);
    console.log('✅ handleLocationSelect complete');
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Sidebar */}
        <RecentSearchesSidebar
          onLocationSelect={handleLocationSelect}
          currentLocation={undefined}
          recentSearches={recentSearches}
          removeRecentSearch={removeRecentSearch}
          clearRecentSearches={clearRecentSearches}
          isHydrated={isHydrated}
        />

        {/* Main Content - Centered regardless of sidebar */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto px-4 py-4 ml-16 lg:ml-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg mr-3">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-800">Wetho</h2>
              </div>
              <p className="text-gray-600">Get current weather conditions and air quality</p>
            </div>
            <LoadingWeather />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Sidebar */}
        <RecentSearchesSidebar
          onLocationSelect={handleLocationSelect}
          currentLocation={undefined}
          recentSearches={recentSearches}
          removeRecentSearch={removeRecentSearch}
          clearRecentSearches={clearRecentSearches}
          isHydrated={isHydrated}
        />

        {/* Main Content - Centered regardless of sidebar */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto px-4 py-4 ml-16 lg:ml-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg mr-3">
                  <Cloud className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-800">Wetho</h2>
              </div>
              <p className="text-gray-600">Get current weather conditions and air quality</p>
            </div>
            <ErrorMessage message={error} onRetry={refresh} />
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <RecentSearchesSidebar
        onLocationSelect={handleLocationSelect}
        currentLocation={data?.location}
        recentSearches={recentSearches}
        removeRecentSearch={removeRecentSearch}
        clearRecentSearches={clearRecentSearches}
        isHydrated={isHydrated}
      />

      {/* Main Content - Centered regardless of sidebar */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto px-4 py-4 ml-16 lg:ml-auto">
          {/* Header with Logo */}
          <div className="text-center mb-6 pt-4">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg mr-3">
                <Cloud className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Wetho</h1>
            </div>
            <p className="text-gray-600 text-sm">Get current weather conditions and air quality</p>
          </div>

          {/* Location Search and Refresh - Side by Side */}
          <div className="flex items-center justify-center gap-4 mb-6 max-w-2xl mx-auto">
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              currentLocation={data?.location}
            />
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-3 bg-white hover:bg-gray-50 disabled:bg-gray-100 border border-gray-300 rounded-xl shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed whitespace-nowrap"
              aria-label={loading ? "Getting current location..." : "Get current location"}
              title={loading ? "Getting current location..." : "Get current location"}
            >
              <MapPin className={`w-4 h-4 text-gray-700 ${loading ? 'animate-pulse' : ''}`} />
            </button>
          </div>

          {/* Weather Data */}
          {data && <WeatherCard data={data} />}

          {/* Footer */}
          <footer className="text-center mt-4 py-0 text-gray-500 text-xs">
            <p>Weather data provided by OpenWeatherMap</p>
            <p className="mt-1 flex items-center justify-center gap-1">
              Built with Next.js, TypeScript, and Tailwind CSS by Deepto
              <a 
                href="https://www.github.com/deepto98" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center hover:text-gray-700 transition-colors"
                title="Visit Deepto's GitHub"
              >
                <Github className="w-3 h-3 ml-1" />
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}