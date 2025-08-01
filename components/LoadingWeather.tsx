import { Loader2 } from 'lucide-react';

export default function LoadingWeather() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Weather Card Skeleton */}
      <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-2xl p-8 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="text-right">
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div>
              <div className="h-16 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>

      {/* Weather Details Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="h-8 bg-gray-300 rounded w-12"></div>
          </div>
        ))}
      </div>

      {/* Air Quality Card Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-24 mb-4"></div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="h-6 bg-gray-300 rounded w-12"></div>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-4 bg-gray-300 rounded w-8 mx-auto mb-1"></div>
              <div className="h-5 bg-gray-300 rounded w-10 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading weather data...</span>
      </div>
    </div>
  );
} 