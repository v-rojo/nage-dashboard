'use client'

import { useState } from 'react'
import { SPAIN_CCAA } from '@/lib/mock-data/hospitals'
import { CCAASummaryView } from '../components/CCAASummaryView'
import { SpainOverview } from '../components/SpainOverview'

type View = 'spain' | string

export default function GeneralDashboardPage() {
  const [view, setView] = useState<View>('spain')

  const activeCCAA = SPAIN_CCAA.find(c => c.id === view)

  return (
    <div className="flex h-full flex-col">
      {/* Page header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Dashboard General</h1>
            <p className="text-sm text-gray-500">Visión nacional del inventario hospitalario</p>
          </div>
          {/* Level selector */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setView('spain')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                view === 'spain' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              España completa
            </button>
            {SPAIN_CCAA.map(c => (
              <button
                key={c.id}
                onClick={() => setView(c.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === c.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {view === 'spain' || !activeCCAA ? (
          <SpainOverview />
        ) : (
          <CCAASummaryView ccaa={activeCCAA} />
        )}
      </div>
    </div>
  )
}
