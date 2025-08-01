import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  compiler: {
    // Remove console logs only in production
    removeConsole: process.env.NODE_ENV === "production"
  },

  // Basic Performance Optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image Optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize production builds
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },

  // Headers for caching and security
  async headers() {
    return [
      // Security headers for all routes
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval and unsafe-inline
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com", // Allow inline styles and Google Fonts
              "img-src 'self' data: blob: https:", // Allow images from self, data URIs, and HTTPS
              "font-src 'self' fonts.gstatic.com data:", // Allow fonts from self and Google Fonts
              "connect-src 'self' api.openweathermap.org", // Allow API calls to OpenWeatherMap
              "frame-src 'none'", // Prevent framing
              "object-src 'none'", // Prevent object/embed/applet
              "base-uri 'self'", // Restrict base URI
              "form-action 'self'", // Restrict form submissions
              "frame-ancestors 'none'", // Prevent framing by other sites
              "upgrade-insecure-requests", // Upgrade HTTP to HTTPS
            ].join('; ')
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Control browser features and APIs
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=(self)', // Allow geolocation for weather app
              'interest-cohort=()',
              'payment=()',
              'usb=()',
              'bluetooth=()',
              'accelerometer=()',
              'gyroscope=()',
              'magnetometer=()',
              'display-capture=()',
              'fullscreen=(self)',
              'web-share=(self)'
            ].join(', ')
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Enable XSS protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Strict Transport Security (HTTPS enforcement)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // Cross-Origin policies
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          }
        ],
      },
      // Favicon caching
      {
        source: '/favicon.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Static asset caching
      {
        source: '/:path*\\.(css|js|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
