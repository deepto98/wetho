# Weather App
From the pov of a senior engineer, Write a comprehensive doc  in  the readme. expecially mention the next architecture, api's, ui components 
A modern, responsive weather application built with Next.js, TypeScript, and Tailwind CSS. Get real-time weather data, air quality information, and detailed weather conditions for any location worldwide.

## ✨ Features

- **Real-time Weather Data**: Current temperature, humidity, wind speed, visibility, and pressure
- **Air Quality Index**: Comprehensive AQI data with pollutant levels (PM2.5, PM10, CO, NO₂, O₃, SO₂)
- **Location-based**: Automatic geolocation detection with manual city search
- **Beautiful UI**: Modern, responsive design with weather-themed gradients
- **Auto-refresh**: Automatic data updates every 10 minutes
- **Error Handling**: Graceful error handling with retry functionality
- **Loading States**: Smooth loading animations and skeleton screens

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenWeatherMap API key (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Get your free API key from [OpenWeatherMap](https://openweathermap.org/api) and add it to `.env.local`:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **API**: OpenWeatherMap API

### Project Structure
```
├── app/                    # Next.js app directory
│   └── page.tsx           # Main page component
├── components/            # Reusable UI components
│   ├── WeatherCard.tsx    # Main weather display
│   ├── LocationSearch.tsx # City search functionality
│   ├── LoadingWeather.tsx # Loading skeleton
│   └── ErrorMessage.tsx   # Error handling UI
├── hooks/                 # Custom React hooks
│   └── useWeather.ts      # Weather data management
├── lib/                   # Utility functions
│   ├── types.ts           # TypeScript definitions
│   ├── weather-api.ts     # API integration
│   └── geolocation.ts     # Location services
└── public/                # Static assets
```

## 🌤️ API Integration

The app uses the OpenWeatherMap API for:
- Current weather conditions
- Air quality data
- Location geocoding
- Reverse geocoding

### Key Features:
- Parallel API calls for optimal performance
- Comprehensive error handling
- Request caching (10-minute intervals)
- Fallback location (New York City)

## 🎨 UI Components

### WeatherCard
- Main temperature display with weather icons
- Detailed metrics grid (humidity, wind, visibility, pressure)
- Air quality index with color-coded status
- Sunrise/sunset times

### LocationSearch
- Debounced city search with autocomplete
- Geolocation integration
- Elegant dropdown suggestions

### Loading & Error States
- Skeleton loading animations
- Comprehensive error messages
- Retry functionality

## 🔧 Customization

### Adding New Weather Metrics
1. Update the `WeatherData` interface in `lib/types.ts`
2. Modify the API integration in `lib/weather-api.ts`
3. Add UI components in `components/WeatherCard.tsx`

### Styling
- Tailwind CSS classes for easy customization
- Responsive design (mobile-first)
- Weather-themed color gradients
- Smooth animations and transitions

## 📱 Responsive Design

- **Mobile**: Optimized layout for small screens
- **Tablet**: Adaptive grid layouts
- **Desktop**: Full-featured experience with larger displays

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `NEXT_PUBLIC_OPENWEATHER_API_KEY` environment variable
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Custom server

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | OpenWeatherMap API key | Yes |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

If you encounter any issues, please create an issue on GitHub with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
