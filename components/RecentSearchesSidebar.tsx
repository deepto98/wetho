import { useState } from 'react';
import { MapPin, Clock, X, Trash2, ChevronLeft, ChevronRight, History, Loader2 } from 'lucide-react';
import { Location } from '@/lib/types';
import { useRecentSearches, RecentSearch } from '@/hooks/useRecentSearches';

interface RecentSearchesSidebarProps {
  onLocationSelect: (location: Location) => void;
  currentLocation?: Location;
  recentSearches?: RecentSearch[];
  removeRecentSearch?: (location: Location) => void;
  clearRecentSearches?: () => void;
  isHydrated?: boolean;
}

export default function RecentSearchesSidebar({ 
  onLocationSelect, 
  currentLocation, 
  recentSearches: propRecentSearches,
  removeRecentSearch: propRemoveRecentSearch,
  clearRecentSearches: propClearRecentSearches,
  isHydrated: propIsHydrated
}: RecentSearchesSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { 
    recentSearches: hookRecentSearches, 
    removeRecentSearch: hookRemoveRecentSearch, 
    clearRecentSearches: hookClearRecentSearches, 
    isHydrated: hookIsHydrated 
  } = useRecentSearches();

  // Use prop values if provided, otherwise use hook values
  const recentSearches = propRecentSearches || hookRecentSearches;
  const removeRecentSearch = propRemoveRecentSearch || hookRemoveRecentSearch;
  const clearRecentSearches = propClearRecentSearches || hookClearRecentSearches;
  const isHydrated = propIsHydrated !== undefined ? propIsHydrated : hookIsHydrated;

  const handleLocationClick = (search: RecentSearch) => {
    const location: Location = {
      lat: search.lat,
      lon: search.lon,
      name: search.name,
      country: search.country,
      state: search.state
    };
    onLocationSelect(location);
  };

  const isCurrentLocation = (search: RecentSearch) => {
    return currentLocation && 
           currentLocation.lat === search.lat && 
           currentLocation.lon === search.lon;
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-2xl transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Header */}
        <div className={`${isCollapsed ? 'flex items-center justify-center' : 'flex items-center justify-center relative'} p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Recent Searches</h2>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`${isCollapsed ? 'p-3' : 'absolute right-4 p-2'} rounded-lg hover:bg-blue-100 transition-colors text-blue-600`}
            title={isCollapsed ? "Show Recent Searches" : "Hide Recent Searches"}
          >
            {isCollapsed ? <History className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!isCollapsed && (
            <>
              {!isHydrated ? (
                // Loading state during hydration
                <div className="p-6 text-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Loading recent searches...</p>
                </div>
              ) : recentSearches.length === 0 ? (
                // Empty state after hydration
                <div className="p-6 text-center">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No recent searches</p>
                  <p className="text-gray-400 text-xs mt-1">Search for a location to see it here</p>
                </div>
              ) : (
                // Searches loaded
                <>
                  {/* Clear All Button */}
                  <div className="p-4 border-b border-gray-100 flex justify-center">
                    <button
                      onClick={clearRecentSearches}
                      className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear All</span>
                    </button>
                  </div>

                  {/* Recent Searches List */}
                  <div className="p-2">
                    {recentSearches.map((search, index) => (
                      <div
                        key={`${search.lat}-${search.lon}-${index}`}
                        className={`group relative p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                          isCurrentLocation(search)
                            ? 'bg-blue-100 border-2 border-blue-300 shadow-md'
                            : 'hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm'
                        }`}
                        onClick={() => handleLocationClick(search)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <MapPin className={`w-4 h-4 flex-shrink-0 ${
                                isCurrentLocation(search) ? 'text-blue-600' : 'text-gray-400'
                              }`} />
                              <h3 className={`font-medium text-sm truncate ${
                                isCurrentLocation(search) ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {search.name}
                              </h3>
                            </div>
                            
                            <p className={`text-xs truncate ${
                              isCurrentLocation(search) ? 'text-blue-700' : 'text-gray-500'
                            }`}>
                              {search.displayName}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-400">{search.timeAgo}</span>
                              </div>
                              
                              {search.searchCount > 1 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  {search.searchCount}x
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRecentSearch(search);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-100 text-red-500 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Current Location Indicator */}
                        {isCurrentLocation(search) && (
                          <div className="absolute -right-1 -top-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Collapsed State */}
          {isCollapsed && isHydrated && recentSearches.length > 0 && (
            <div className="p-2">
              {recentSearches.slice(0, 5).map((search, index) => (
                <button
                  key={`${search.lat}-${search.lon}-${index}`}
                  onClick={() => handleLocationClick(search)}
                  className={`w-full p-3 mb-2 rounded-lg transition-colors ${
                    isCurrentLocation(search)
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title={search.displayName}
                >
                  <MapPin className="w-5 h-5 mx-auto" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Searches are saved locally in your browser
            </p>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
} 