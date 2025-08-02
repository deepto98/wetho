import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Performance optimization
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Only preload primary font
});

export const metadata: Metadata = {
  title: "Wetho - Real-time Weather & Air Quality Monitoring App",
  description: "Get accurate real-time weather data and air quality information for any location worldwide. Features GPS location, search history, and detailed forecasts.",
  keywords: "weather, air quality, AQI, temperature, humidity, wind, precipitation, forecast, real-time weather, weather app, climate data",
  authors: [{ name: "Wetho Team" }],
  creator: "Wetho",
  publisher: "Wetho",
  category: "Weather",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://weatho.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Wetho - Real-time Weather & Air Quality Monitoring App",
    description: "Get accurate real-time weather data and air quality information for any location worldwide.",
    url: 'https://weatho.vercel.app',
    siteName: 'Wetho',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Wetho Weather App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Wetho - Real-time Weather & Air Quality Monitoring App",
    description: "Get accurate real-time weather data and air quality information for any location worldwide.",
    creator: '@wetho',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-verification-code',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Wetho',
    'application-name': 'Wetho',
    'msapplication-TileColor': '#3b82f6',
    'theme-color': '#3b82f6',
  },
};

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Wetho",
  "description": "Real-time weather and air quality information for any location worldwide",
  "url": "https://weatho.vercel.app",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "Wetho Team"
  },
  "features": [
    "Real-time weather data",
    "Air quality monitoring",
    "Location-based forecasts",
    "Responsive design"
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://api.openweathermap.org" />
        <link rel="dns-prefetch" href="https://api.openweathermap.org" />
        
        {/* Primary favicon - ICO loads first for browser compatibility */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        
        {/* Modern browsers - SVG favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        
        {/* Standard favicon sizes */}
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
        
        {/* Android Chrome icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/android-icon-192x192.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Windows Tiles */}
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* PWA and mobile optimization */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wetho" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Performance hints */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
