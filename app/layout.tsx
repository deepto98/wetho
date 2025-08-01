import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wetho - Weather & Air Quality App",
  description: "Get real-time weather data, air quality information, and detailed weather conditions for any location worldwide. Built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: "weather, air quality, AQI, temperature, humidity, wind, precipitation, forecast",
  authors: [{ name: "Wetho Team" }],
  creator: "Wetho",
  publisher: "Wetho",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://weatho.vercel.app'),
  openGraph: {
    title: "Wetho - Weather & Air Quality App",
    description: "Get real-time weather data and air quality information for any location worldwide.",
    url: 'https://weatho.vercel.app',
    siteName: 'Wetho',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Wetho - Weather & Air Quality App",
    description: "Get real-time weather data and air quality information for any location worldwide.",
    creator: '@wetho',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wetho" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
