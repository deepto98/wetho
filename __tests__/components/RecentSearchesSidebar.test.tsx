import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecentSearchesSidebar from '@/components/RecentSearchesSidebar'
import * as useRecentSearches from '@/hooks/useRecentSearches'

// Mock the useRecentSearches hook
jest.mock('@/hooks/useRecentSearches')
const mockedUseRecentSearches = useRecentSearches as jest.Mocked<typeof useRecentSearches>

const mockRecentSearches = [
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

describe('RecentSearchesSidebar', () => {
  const mockOnLocationSelect = jest.fn()
  const mockAddRecentSearch = jest.fn()
  const mockRemoveRecentSearch = jest.fn()
  const mockClearRecentSearches = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockedUseRecentSearches.useRecentSearches = jest.fn().mockReturnValue({
      recentSearches: mockRecentSearches,
      addRecentSearch: mockAddRecentSearch,
      removeRecentSearch: mockRemoveRecentSearch,
      clearRecentSearches: mockClearRecentSearches
    })
  })

  it('renders sidebar in collapsed state by default on mobile', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    })
    
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Should show collapsed button with first letter of first city
    expect(screen.getByText('N')).toBeInTheDocument() // First letter of "New York"
    expect(screen.queryByText('Recent Searches')).not.toBeInTheDocument()
  })

  it('renders sidebar in expanded state on desktop', () => {
    // Mock desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    expect(screen.getByText('Recent Searches')).toBeInTheDocument()
    expect(screen.getByText('New York, NY, US')).toBeInTheDocument()
    expect(screen.getByText('London, GB')).toBeInTheDocument()
    expect(screen.getByText('Paris, FR')).toBeInTheDocument()
  })

  it('toggles sidebar when clicking the toggle button', async () => {
    const user = userEvent.setup()
    
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Initially collapsed on mobile
    expect(screen.queryByText('Recent Searches')).not.toBeInTheDocument()
    
    // Click to expand
    const toggleButton = screen.getByRole('button')
    await user.click(toggleButton)
    
    expect(screen.getByText('Recent Searches')).toBeInTheDocument()
    
    // Click to collapse
    const collapseButton = screen.getByLabelText('Collapse sidebar')
    await user.click(collapseButton)
    
    expect(screen.queryByText('Recent Searches')).not.toBeInTheDocument()
  })

  it('displays recent searches correctly', () => {
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Expand sidebar first
    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)
    
    expect(screen.getByText('New York, NY, US')).toBeInTheDocument()
    expect(screen.getByText('London, GB')).toBeInTheDocument()
    expect(screen.getByText('Paris, FR')).toBeInTheDocument()
  })

  it('calls onLocationSelect when a recent search is clicked', async () => {
    const user = userEvent.setup()
    
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Expand sidebar
    const toggleButton = screen.getByRole('button')
    await user.click(toggleButton)
    
    // Click on a recent search
    const locationItem = screen.getByText('New York, NY, US')
    await user.click(locationItem)
    
    expect(mockOnLocationSelect).toHaveBeenCalledWith(mockRecentSearches[0])
  })

  it('removes a recent search when remove button is clicked', async () => {
    const user = userEvent.setup()
    
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Expand sidebar
    const toggleButton = screen.getByRole('button')
    await user.click(toggleButton)
    
    // Click remove button for first item
    const removeButtons = screen.getAllByLabelText(/Remove .* from recent searches/)
    await user.click(removeButtons[0])
    
    expect(mockRemoveRecentSearch).toHaveBeenCalledWith(mockRecentSearches[0])
  })

  it('clears all recent searches when clear all button is clicked', async () => {
    const user = userEvent.setup()
    
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Expand sidebar
    const toggleButton = screen.getByRole('button')
    await user.click(toggleButton)
    
    // Click clear all button
    const clearAllButton = screen.getByText('Clear All')
    await user.click(clearAllButton)
    
    expect(mockClearRecentSearches).toHaveBeenCalled()
  })

  it('shows empty state when no recent searches', () => {
    mockedUseRecentSearches.useRecentSearches = jest.fn().mockReturnValue({
      recentSearches: [],
      addRecentSearch: mockAddRecentSearch,
      removeRecentSearch: mockRemoveRecentSearch,
      clearRecentSearches: mockClearRecentSearches
    })
    
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Expand sidebar
    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)
    
    expect(screen.getByText('No recent searches')).toBeInTheDocument()
    expect(screen.getByText('Your recent searches will appear here')).toBeInTheDocument()
  })

  it('shows History icon when collapsed with no searches', () => {
    mockedUseRecentSearches.useRecentSearches = jest.fn().mockReturnValue({
      recentSearches: [],
      addRecentSearch: mockAddRecentSearch,
      removeRecentSearch: mockRemoveRecentSearch,
      clearRecentSearches: mockClearRecentSearches
    })
    
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Should show History icon instead of first letter
    expect(screen.getByLabelText('Open recent searches')).toBeInTheDocument()
  })

  it('handles keyboard navigation', async () => {
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Expand sidebar
    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)
    
    // Test keyboard navigation on first item
    const firstItem = screen.getByText('New York, NY, US')
    fireEvent.keyDown(firstItem, { key: 'Enter' })
    
    expect(mockOnLocationSelect).toHaveBeenCalledWith(mockRecentSearches[0])
  })

  it('maintains focus when toggling sidebar', async () => {
    const user = userEvent.setup()
    
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    const toggleButton = screen.getByRole('button')
    await user.click(toggleButton)
    
    // After expanding, focus should be maintained
    expect(document.activeElement).toBe(screen.getByLabelText('Collapse sidebar'))
  })

  it('responds to window resize events', () => {
    render(<RecentSearchesSidebar onLocationSelect={mockOnLocationSelect} />)
    
    // Simulate window resize to desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    
    fireEvent(window, new Event('resize'))
    
    // Should be expanded on desktop
    expect(screen.getByText('Recent Searches')).toBeInTheDocument()
  })
}) 