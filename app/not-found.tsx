import Link from 'next/link'
import { Cloud, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Weather-themed 404 icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <Cloud className="w-24 h-24 text-blue-400 mx-auto" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
              404
            </div>
          </div>
        </div>
        
        {/* Error message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Weather Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Looks like this page drifted away like a cloud. Let&apos;s get you back to sunny skies!
        </p>
        
        {/* Action buttons */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Weather Home
          </Link>
          
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            <Search className="w-5 h-5 mr-2" />
            Search for Weather
          </Link>
        </div>
        
        {/* Fun weather fact */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-blue-100">
          <p className="text-sm text-gray-500">
            💡 <strong>Did you know?</strong> Clouds can weigh over a million pounds, but they&apos;re less dense than the surrounding air!
          </p>
        </div>
      </div>
    </div>
  )
} 