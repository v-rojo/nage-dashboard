'use client'

import { useState } from 'react'
import { MADRID_HOSPITALS, SPAIN_CCAA } from '@/lib/mock-data/hospitals'
import { HospitalView } from './components/HospitalView'
import { CCAASummaryView } from './components/CCAASummaryView'
import { SpainOverview } from './components/SpainOverview'

type Tab = 'hospital' | 'ccaa' | 'spain'

const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
  { id: 'hospital', label: 'Hospital', icon: '🏥', desc: 'Vista individual por hospital' },
  { id: 'ccaa', label: 'Comunidad', icon: '🗺️', desc: 'Vista por comunidad autónoma' },
  { id: 'spain', label: 'España', icon: '🇪🇸', desc: 'Visión nacional completa' },
]

const MADRID_CCAA = SPAIN_CCAA.find(c => c.id === 'madrid')!

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('hospital')
  const [selectedHospitalId, setSelectedHospitalId] = useState(MADRID_HOSPITALS[0].id)

  const selectedHospital = MADRID_HOSPITALS.find(h => h.id === selectedHospitalId)!

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">NAGE</span>
              <span className="hidden rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 sm:inline">
                Dashboard
              </span>
            </a>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                En vivo
              </span>
              <span>Actualizado: ahora</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="sticky top-14 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex gap-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-gray-900" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hospital sub-tabs (only on hospital tab) */}
      {activeTab === 'hospital' && (
        <div className="border-b border-gray-100 bg-white">
          <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6">
            <div className="flex gap-2 py-2">
              {MADRID_HOSPITALS.map(h => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHospitalId(h.id)}
                  className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedHospitalId === h.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {h.name.replace('Hospital ', 'H. ').replace('Universitario ', 'U. ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="animate-fade-in">
          {activeTab === 'hospital' && <HospitalView hospital={selectedHospital} />}
          {activeTab === 'ccaa' && <CCAASummaryView ccaa={MADRID_CCAA} />}
          {activeTab === 'spain' && <SpainOverview />}
        </div>
      </main>
    </div>
  )
}
