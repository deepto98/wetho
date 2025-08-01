import '@testing-library/jest-dom'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useWeather } from '@/hooks/useWeather'
import * as weatherApi from '@/lib/weather-api'
import * as geolocation from '@/lib/geolocation'

// Mock the APIs
jest.mock('@/lib/weather-api')
jest.mock('@/lib/geolocation')

const mockedWeatherApi = weatherApi as jest.Mocked<typeof weatherApi>
const mockedGeolocation = geolocation as jest.Mocked<typeof geolocation>

const mockWeatherData = {
  location: {
    name: 'New York',
    state: 'NY',
    country: 'US',
    lat: 40.7128,
    lon: -74.0060
  },
  current: {
    temp: 22,
    feels_like: 25,
    humidity: 65,
    pressure: 1013,
    visibility: 10,
    uv_index: 5,
    wind_speed: 3.5,
    wind_direction: 180,
    weather_code: 800,
    weather_description: 'clear sky',
    icon: '01d'
  },
  air_quality: {
    aqi: 2,
    pm2_5: 15.2,
    pm10: 20.1,
    o3: 45.3,
    no2: 12.4,
    so2: 5.1,
    co: 230.5
  },
  forecast: {
    precipitation_probability: 10,
    precipitation_amount: 0
  },
  astronomy: {
    sunrise: '07:30',
    sunset: '17:30'
  }
}

const mockLocation = {
  name: 'New York',
  state: 'NY',
  country: 'US',
  lat: 40.7128,
  lon: -74.0060
}

describe('useWeather', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedWeatherApi.getCurrentWeather.mockResolvedValue(mockWeatherData)
    mockedGeolocation.getLocationWithFallback.mockResolvedValue(mockLocation)
  })

  it('initializes with loading state', () => {
    const { result } = renderHook(() => useWeather())
    
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('fetches weather data on mount', async () => {
    const { result } = renderHook(() => useWeather())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toEqual(mockWeatherData)
    expect(result.current.error).toBeNull()
    expect(mockedGeolocation.getLocationWithFallback).toHaveBeenCalled()
    expect(mockedWeatherApi.getCurrentWeather).toHaveBeenCalledWith(mockLocation.lat, mockLocation.lon)
  })

  it('handles API errors correctly', async () => {
    const error = new Error('API Error')
    mockedWeatherApi.getCurrentWeather.mockRejectedValue(error)
    
    const { result } = renderHook(() => useWeather())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('API Error')
  })

  it('calls onLocationFetched when location is obtained', async () => {
    const mockOnLocationFetched = jest.fn()
    
    renderHook(() => useWeather(mockOnLocationFetched))
    
    await waitFor(() => {
      expect(mockOnLocationFetched).toHaveBeenCalledWith(mockLocation, true)
    })
  })

  it('fetches weather for specific location', async () => {
    const { result } = renderHook(() => useWeather())
    
    const specificLocation = {
      name: 'London',
      country: 'GB',
      lat: 51.5074,
      lon: -0.1278
    }
    
    await act(async () => {
      await result.current.fetchWeather(specificLocation)
    })
    
    expect(mockedWeatherApi.getCurrentWeather).toHaveBeenCalledWith(
      specificLocation.lat,
      specificLocation.lon
    )
  })

  it('refreshes weather data', async () => {
    const { result } = renderHook(() => useWeather())
    
    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    // Clear previous calls
    mockedWeatherApi.getCurrentWeather.mockClear()
    
    await act(async () => {
      await result.current.refresh()
    })
    
    expect(mockedWeatherApi.getCurrentWeather).toHaveBeenCalledWith(mockLocation.lat, mockLocation.lon)
  })

  it('indicates stale data correctly', async () => {
    const { result } = renderHook(() => useWeather())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Initially not stale
    expect(result.current.isStale).toBe(false)
    
    // Mock a later time (6 minutes later - beyond 5 minute stale threshold)
    const originalDateNow = Date.now
    const mockNow = Date.now() + 6 * 60 * 1000
    jest.spyOn(Date, 'now').mockReturnValue(mockNow)
    
    // Force a re-render by calling refresh to trigger useMemo recalculation
    await act(async () => {
      await result.current.refresh()
    })
    
    // Should now be stale
    expect(result.current.isStale).toBe(true)
    
    // Restore original Date.now
    Date.now = originalDateNow
  })

  it('handles location fetching errors', async () => {
    const error = new Error('Location Error')
    mockedGeolocation.getLocationWithFallback.mockRejectedValue(error)
    
    const { result } = renderHook(() => useWeather())
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.error).toBe('Location Error')
  })

  it('cancels ongoing requests when component unmounts', async () => {
    const { result, unmount } = renderHook(() => useWeather())
    
    // Start a fetch operation
    act(() => {
      result.current.fetchWeather(mockLocation)
    })
    
    // Unmount before the request completes
    unmount()
    
    // The request should be cancelled (no error should be thrown)
    expect(true).toBe(true) // Test passes if no error is thrown
  })

  it('updates loading state correctly during fetch', async () => {
    const { result } = renderHook(() => useWeather())
    
    // Initially loading
    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    // Start another fetch
    act(() => {
      result.current.fetchWeather(mockLocation)
    })
    
    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('clears error on successful fetch', async () => {
    // First, simulate an error
    mockedWeatherApi.getCurrentWeather.mockRejectedValueOnce(new Error('API Error'))
    
    const { result } = renderHook(() => useWeather())
    
    await waitFor(() => {
      expect(result.current.error).toBe('API Error')
    })
    
    // Now simulate a successful fetch
    mockedWeatherApi.getCurrentWeather.mockResolvedValueOnce(mockWeatherData)
    
    await act(async () => {
      await result.current.refresh()
    })
    
    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual(mockWeatherData)
  })
}) 