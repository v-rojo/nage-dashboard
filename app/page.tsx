'use client'

import { BarChart2, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            NAGE Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            AI-Powered Hospital Inventory Management & Analysis Engine
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Real-time inventory tracking with Claude AI predictions
          </p>
        </div>

        {/* Main CTA */}
        <div className="text-center mb-16">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            Enter Dashboard
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Real-time Tracking</h3>
            <p className="text-gray-600">
              Monitor inventory levels across all departments with live updates and color-coded status indicators.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">AI Predictions</h3>
            <p className="text-gray-600">
              Claude AI analyzes consumption patterns to forecast demand and prevent costly stockouts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Alerts</h3>
            <p className="text-gray-600">
              Automatic notifications for critical stock levels, expirations, and procurement opportunities.
            </p>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-slate-50 rounded-lg p-8 mb-16 border border-slate-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Why NAGE?</h2>
          <ul className="space-y-3">
            {[
              'Reduce stockouts by up to 40% with AI demand forecasting',
              'Lower inventory costs through optimized procurement recommendations',
              'Improve department satisfaction with real-time supply visibility',
              'Minimize waste with expiration date tracking and analytics',
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-gray-700">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Inventory?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get started in minutes with no database setup required for the MVP
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Launch Dashboard Now
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 mt-16 pt-8 border-t border-gray-100">
          <p>NAGE Dashboard &mdash; Powered by Claude AI &mdash; Built with Next.js</p>
        </div>
      </div>
    </main>
  )
}
