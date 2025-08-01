import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import WeatherCard from '@/components/WeatherCard'
import { WeatherData } from '@/lib/types'

// Mock the date to ensure consistent testing
const mockDate = new Date('2024-01-15T14:30:00Z')
jest.spyOn(global, 'Date').mockImplementation(() => mockDate)
Date.now = jest.fn(() => mockDate.getTime())

const mockWeatherData: WeatherData = {
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

describe('WeatherCard', () => {
  it('renders weather information correctly', () => {
    render(<WeatherCard data={mockWeatherData} />)
    
    // Check location display
    expect(screen.getByText('New York, NY, US')).toBeInTheDocument()
    
    // Check temperature (displayed as number and degree symbol in same container)
    expect(screen.getByText(/22/)).toBeInTheDocument()
    expect(screen.getByText('clear sky')).toBeInTheDocument()
    
    // Check feels like temperature
    expect(screen.getByText(/Feels like 25/)).toBeInTheDocument()
  })

  it('displays weather details correctly', () => {
    render(<WeatherCard data={mockWeatherData} />)
    
    // Check humidity
    expect(screen.getByText('65%')).toBeInTheDocument()
    
    // Check pressure
    expect(screen.getByText('1013 hPa')).toBeInTheDocument()
    
    // Check visibility
    expect(screen.getByText('10 km')).toBeInTheDocument()
    
    // Check wind (without direction in this component)
    expect(screen.getByText('3.5 m/s')).toBeInTheDocument()
  })

  it('displays air quality information', () => {
    render(<WeatherCard data={mockWeatherData} />)
    
    // Check AQI value and description
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Fair')).toBeInTheDocument()
    
    // Check pollutant components (formatted with toFixed(1))
    expect(screen.getByText('15.2')).toBeInTheDocument() // PM2.5
    expect(screen.getByText('45.3')).toBeInTheDocument() // O3
    expect(screen.getByText('230.5')).toBeInTheDocument() // CO
  })

  it('displays astronomy information', () => {
    render(<WeatherCard data={mockWeatherData} />)
    
    // Check sunrise and sunset times
    expect(screen.getByText(/Sunrise: 07:30/)).toBeInTheDocument()
    expect(screen.getByText(/Sunset: 17:30/)).toBeInTheDocument()
  })

  it('displays current time', () => {
    render(<WeatherCard data={mockWeatherData} />)
    
    // The component shows real current time, not mocked time
    // Just check that some time format is displayed
    expect(screen.getByText(/\d{1,2}:\d{2}:\d{2}/)).toBeInTheDocument()
  })

  it('handles different AQI levels correctly', () => {
    const pollutedWeatherData = {
      ...mockWeatherData,
      air_quality: {
        aqi: 4,
        pm2_5: 55.2,
        pm10: 80.1,
        o3: 145.3,
        no2: 42.4,
        so2: 15.1,
        co: 530.5
      }
    }
    
    render(<WeatherCard data={pollutedWeatherData} />)
    
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('Poor')).toBeInTheDocument()
  })

  it('handles different weather conditions', () => {
    const rainyWeatherData = {
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        temp: 18, // Changed from 15 to avoid conflict with date and air quality
        weather_code: 500,
        weather_description: 'light rain',
        icon: '10d'
      }
    }
    
    render(<WeatherCard data={rainyWeatherData} />)
    
    // Look for temperature specifically in the large temperature display
    const temperatureElement = screen.getByText(/18/)
    expect(temperatureElement).toBeInTheDocument()
    expect(temperatureElement).toHaveClass('text-5xl')
    
    expect(screen.getByText('light rain')).toBeInTheDocument()
  })

  it('handles location without state', () => {
    const locationWithoutState = {
      ...mockWeatherData,
      location: {
        name: 'London',
        country: 'GB',
        lat: 51.5074,
        lon: -0.1278
      }
    }
    
    render(<WeatherCard data={locationWithoutState} />)
    
    expect(screen.getByText('London, GB')).toBeInTheDocument()
  })

  it('displays air quality scale correctly', () => {
    render(<WeatherCard data={mockWeatherData} />)
    
    // Check that the AQI scale labels are present
    expect(screen.getByText('Good')).toBeInTheDocument()
    expect(screen.getByText('Fair')).toBeInTheDocument()
    expect(screen.getByText('Moderate')).toBeInTheDocument()
    expect(screen.getByText('Poor')).toBeInTheDocument()
    expect(screen.getByText('Very Poor')).toBeInTheDocument()
  })
}) 