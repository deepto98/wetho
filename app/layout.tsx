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
  title: "Wetho - Weather & Air Quality App",
  description: "Get real-time weather data, air quality information, and detailed weather conditions for any location worldwide. Built with Next.js, TypeScript, and Tailwind CSS.",
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
    title: "Wetho - Weather & Air Quality App",
    description: "Get real-time weather data and air quality information for any location worldwide.",
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
    title: "Wetho - Weather & Air Quality App",
    description: "Get real-time weather data and air quality information for any location worldwide.",
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
        
        {/* Icons with optimized loading */}
        <link rel="icon" href="/favicon.svg" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* PWA and mobile optimization */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wetho" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
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
