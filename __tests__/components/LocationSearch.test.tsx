import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LocationSearch from '@/components/LocationSearch'
import * as weatherApi from '@/lib/weather-api'

// Mock the weather API
jest.mock('@/lib/weather-api')
const mockedWeatherApi = weatherApi as jest.Mocked<typeof weatherApi>

const mockLocations = [
  {
    name: 'New York',
    state: 'NY',
    country: 'US',
    lat: 40.7128,
    lon: -74.0060
  },
  {
    name: 'London',
    country: 'GB',
    lat: 51.5074,
    lon: -0.1278
  },
  {
    name: 'Paris',
    country: 'FR',
    lat: 48.8566,
    lon: 2.3522
  }
]

describe('LocationSearch', () => {
  const mockOnLocationSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockedWeatherApi.searchLocations.mockResolvedValue(mockLocations)
  })

  it('renders search input correctly', () => {
    render(<LocationSearch onLocationSelect={mockOnLocationSelect} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a city...')
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('type', 'text')
  })

  it('displays search results when typing', async () => {
    const user = userEvent.setup()
    
    render(<LocationSearch onLocationSelect={mockOnLocationSelect} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a city...')
    await user.type(searchInput, 'New')
    
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument()
      expect(screen.getByText('NY, US')).toBeInTheDocument()
    })
    
    expect(mockedWeatherApi.searchLocations).toHaveBeenCalledWith('New')
  })

  it('calls onLocationSelect when a location is clicked', async () => {
    const user = userEvent.setup()
    
    render(<LocationSearch onLocationSelect={mockOnLocationSelect} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a city...')
    await user.type(searchInput, 'New')
    
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument()
    })
    
    const locationItem = screen.getByText('New York')
    await user.click(locationItem)
    
    expect(mockOnLocationSelect).toHaveBeenCalledWith(mockLocations[0])
  })

  it('clears search results when input is cleared', async () => {
    const user = userEvent.setup()
    
    render(<LocationSearch onLocationSelect={mockOnLocationSelect} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a city...')
    await user.type(searchInput, 'New')
    
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument()
    })
    
    await user.clear(searchInput)
    
    await waitFor(() => {
      expect(screen.queryByText('New York')).not.toBeInTheDocument()
    })
  })

  it('handles search errors gracefully', async () => {
    const user = userEvent.setup()
    
    mockedWeatherApi.searchLocations.mockRejectedValue(new Error('API Error'))
    
    render(<LocationSearch onLocationSelect={mockOnLocationSelect} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a city...')
    await user.type(searchInput, 'Invalid')
    
    await waitFor(() => {
      // Should not show any suggestions when API fails
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  it('handles empty search results', async () => {
    const user = userEvent.setup()
    
    mockedWeatherApi.searchLocations.mockResolvedValue([])
    
    render(<LocationSearch onLocationSelect={mockOnLocationSelect} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a city...')
    await user.type(searchInput, 'Nonexistent')
    
    await waitFor(() => {
      // Should not show suggestions dropdown when no results
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  it('handles basic keyboard interactions', async () => {
    const user = userEvent.setup()
    
    render(<LocationSearch onLocationSelect={mockOnLocationSelect} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a city...')
    
    // Test typing
    await user.type(searchInput, 'New')
    expect(searchInput).toHaveValue('New')
    
    // Test clearing
    await user.clear(searchInput)
    expect(searchInput).toHaveValue('')
  })

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    
    render(
      <div>
        <LocationSearch onLocationSelect={mockOnLocationSelect} />
        <div data-testid="outside">Outside element</div>
      </div>
    )
    
    const searchInput = screen.getByPlaceholderText('Search for a city...')
    await user.type(searchInput, 'New')
    
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument()
    })
    
    const outsideElement = screen.getByTestId('outside')
    await user.click(outsideElement)
    
    await waitFor(() => {
      expect(screen.queryByText('New York')).not.toBeInTheDocument()
    })
  })

  it('displays location without state correctly', async () => {
    const user = userEvent.setup()
    
    render(<LocationSearch onLocationSelect={mockOnLocationSelect} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a city...')
    await user.type(searchInput, 'London')
    
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument()
      expect(screen.getByText('GB')).toBeInTheDocument()
    })
  })

  it('debounces search requests', async () => {
    const user = userEvent.setup()
    
    render(<LocationSearch onLocationSelect={mockOnLocationSelect} />)
    
    const searchInput = screen.getByPlaceholderText('Search for a city...')
    
    // Type quickly character by character
    await user.type(searchInput, 'New York')
    
    // Should only make one API call after debounce
    await waitFor(() => {
      expect(mockedWeatherApi.searchLocations).toHaveBeenCalledTimes(1)
    })
  })
}) 