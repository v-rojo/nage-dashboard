'use client'

import { useState } from 'react'
import { MADRID_HOSPITALS } from '@/lib/mock-data/hospitals'
import { HospitalView } from './components/HospitalView'

export default function MainDashboardPage() {
  const [selectedId, setSelectedId] = useState(MADRID_HOSPITALS[0].id)
  const hospital = MADRID_HOSPITALS.find(h => h.id === selectedId)!

  return (
    <div className="flex h-full flex-col">
      {/* Page header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Main Dashboard</h1>
            <p className="text-sm text-gray-500">Inventario de tu hospital</p>
          </div>
          {/* Hospital selector */}
          <div className="flex flex-wrap gap-2">
            {MADRID_HOSPITALS.map(h => (
              <button
                key={h.id}
                onClick={() => setSelectedId(h.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedId === h.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {h.name.replace('Hospital Universitario ', 'H.U. ').replace('Hospital General Universitario ', 'H.G.U. ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <HospitalView hospital={hospital} />
      </div>
    </div>
  )
}
