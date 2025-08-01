import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecentSearchesSidebar from '@/components/RecentSearchesSidebar'
import { Location } from '@/lib/types'
import { useRecentSearches } from '@/hooks/useRecentSearches'

// Mock the useRecentSearches hook
jest.mock('@/hooks/useRecentSearches')
const mockedUseRecentSearches = useRecentSearches as jest.MockedFunction<typeof useRecentSearches>

const mockRecentSearches = [
  {
    name: 'New York',
    state: 'NY',
    country: 'US',
    lat: 40.7128,
    lon: -74.0060,
    timestamp: Date.now(),
    searchCount: 1,
    displayName: 'New York, NY, US',
    timeAgo: 'just now'
  },
  {
    name: 'London',
    country: 'GB',
    lat: 51.5074,
    lon: -0.1278,
    timestamp: Date.now(),
    searchCount: 1,
    displayName: 'London, GB',
    timeAgo: 'just now'
  },
  {
    name: 'Paris',
    country: 'FR',
    lat: 48.8566,
    lon: 2.3522,
    timestamp: Date.now(),
    searchCount: 1,
    displayName: 'Paris, FR',
    timeAgo: 'just now'
  }
]

describe('RecentSearchesSidebar', () => {
  const mockOnLocationSelect = jest.fn()
  const mockRemoveRecentSearch = jest.fn()
  const mockClearRecentSearches = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock window.innerWidth for responsive behavior
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width
    })

    // Mock the hook to return our test data
    mockedUseRecentSearches.mockReturnValue({
      recentSearches: mockRecentSearches,
      addRecentSearch: jest.fn(),
      removeRecentSearch: mockRemoveRecentSearch,
      clearRecentSearches: mockClearRecentSearches,
      isHydrated: true
    })
  })

  it('renders sidebar correctly', () => {
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Should show the sidebar
    expect(screen.getByText('Recent Searches')).toBeInTheDocument()
  })

  it('displays recent searches when expanded', () => {
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Check if search items are displayed
    expect(screen.getByText('New York')).toBeInTheDocument()
    expect(screen.getByText('London')).toBeInTheDocument()
    expect(screen.getByText('Paris')).toBeInTheDocument()
  })

  it('calls onLocationSelect when a search is clicked', async () => {
    const user = userEvent.setup()
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    const locationButton = screen.getByText('New York')
    await user.click(locationButton)
    
    // The component calls onLocationSelect with just the location data, not the full RecentSearch object
    expect(mockOnLocationSelect).toHaveBeenCalledWith({
      name: 'New York',
      state: 'NY',
      country: 'US',
      lat: 40.7128,
      lon: -74.0060
    })
  })

  it('shows toggle button', () => {
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Should have a toggle button - look for the specific hide button
    const toggleButton = screen.getByLabelText('Hide Recent Searches')
    expect(toggleButton).toBeInTheDocument()
  })

  it('handles empty recent searches', () => {
    // Mock empty searches
    mockedUseRecentSearches.mockReturnValue({
      recentSearches: [],
      addRecentSearch: jest.fn(),
      removeRecentSearch: mockRemoveRecentSearch,
      clearRecentSearches: mockClearRecentSearches,
      isHydrated: true
    })

    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Should show empty state message
    expect(screen.getByText(/No recent searches/)).toBeInTheDocument()
  })

  it('shows loading state when not hydrated', () => {
    // Mock loading state
    mockedUseRecentSearches.mockReturnValue({
      recentSearches: [],
      addRecentSearch: jest.fn(),
      removeRecentSearch: mockRemoveRecentSearch,
      clearRecentSearches: mockClearRecentSearches,
      isHydrated: false
    })

    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Should show loading message
    expect(screen.getByText(/Loading recent searches/)).toBeInTheDocument()
  })

  it('handles mobile view correctly', () => {
    // Mock mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768, // Mobile width
    })

    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Should render without crashing on mobile - look for any button
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('responds to window resize events', () => {
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Trigger resize event
    fireEvent(window, new Event('resize'))
    
    // Should not crash
    expect(screen.getByText('Recent Searches')).toBeInTheDocument()
  })

  it('can be toggled', async () => {
    const user = userEvent.setup()
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    const toggleButton = screen.getByLabelText('Hide Recent Searches')
    await user.click(toggleButton)
    
    // Should not crash when toggled
    expect(toggleButton).toBeInTheDocument()
  })

  it('displays location names correctly', () => {
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Check individual city names are displayed
    expect(screen.getByText('New York')).toBeInTheDocument()
    expect(screen.getByText('London')).toBeInTheDocument()
    expect(screen.getByText('Paris')).toBeInTheDocument()
    
    // Check that locations are displayed (country codes might be in different format)
    expect(screen.getByText(/NY, US/)).toBeInTheDocument()
    expect(screen.getByText(/GB/)).toBeInTheDocument()
    expect(screen.getByText(/FR/)).toBeInTheDocument()
  })

  it('handles clear all functionality', async () => {
    const user = userEvent.setup()
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Look for clear all button by text
    const clearButton = screen.getByText('Clear All')
    await user.click(clearButton)
    expect(mockClearRecentSearches).toHaveBeenCalled()
  })

  it('renders without crashing with different props', () => {
    // Test with explicit props
    render(
      <RecentSearchesSidebar 
        onLocationSelect={mockOnLocationSelect}
        recentSearches={mockRecentSearches}
        removeRecentSearch={mockRemoveRecentSearch}
        clearRecentSearches={mockClearRecentSearches}
        isHydrated={true}
      />
    )
    
    expect(screen.getByText('Recent Searches')).toBeInTheDocument()
  })
}) 