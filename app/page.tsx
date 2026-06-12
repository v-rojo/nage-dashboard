'use client'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏥 NAGE Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-Powered Hospital Inventory Management & Analysis Engine
          </p>
          <p className="text-lg text-gray-600 mb-12">
            Real-time inventory tracking with Claude AI predictions
          </p>
        </div>

        {/* Main CTA */}
        <div className="text-center mb-16">
          <a
            href="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Enter Dashboard →
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Real-time Tracking</h3>
            <p className="text-gray-600">
              Monitor inventory levels across all departments with live updates and color-coded status indicators.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">AI Predictions</h3>
            <p className="text-gray-600">
              Claude AI analyzes consumption patterns to forecast demand and prevent costly stockouts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Alerts</h3>
            <p className="text-gray-600">
              Automatic notifications for critical stock levels, expirations, and procurement opportunities.
            </p>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-blue-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Why NAGE?</h2>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-700">
              <span className="text-green-500 font-bold mr-3">✓</span>
              Reduce stockouts by up to 40% with AI demand forecasting
            </li>
            <li className="flex items-center text-gray-700">
              <span className="text-green-500 font-bold mr-3">✓</span>
              Lower inventory costs through optimized procurement recommendations
            </li>
            <li className="flex items-center text-gray-700">
              <span className="text-green-500 font-bold mr-3">✓</span>
              Improve department satisfaction with real-time supply visibility
            </li>
            <li className="flex items-center text-gray-700">
              <span className="text-green-500 font-bold mr-3">✓</span>
              Minimize waste with expiration date tracking and analytics
            </li>
          </ul>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Inventory?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get started in minutes with no database setup required for the MVP
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Launch Dashboard Now
          </a>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 mt-16 pt-8 border-t">
          <p>NAGE Dashboard • Powered by Claude AI • Built with Next.js</p>
        </div>
      </div>
    </main>
  )
}
