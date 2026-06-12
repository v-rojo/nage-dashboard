'use client'

import { useState } from 'react'
import { CCAASummary, getInventoryStats } from '@/lib/mock-data/hospitals'
import { StatusBadge } from './StatusBadge'
import { StockBar } from './StockBar'
import { StatCard } from './StatCard'
import { HospitalView } from './HospitalView'

export function CCAASummaryView({ ccaa }: { ccaa: CCAASummary }) {
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null)

  const allInventory = ccaa.hospitals.flatMap(h => h.inventory)
  const stats = getInventoryStats(allInventory)

  const hospital = ccaa.hospitals.find(h => h.id === selectedHospital)

  if (hospital) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedHospital(null)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Volver a {ccaa.name}
        </button>
        <HospitalView hospital={hospital} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">{ccaa.name}</h2>
        <p className="text-sm text-gray-500">
          🏥 {ccaa.hospitals.length} hospitales · {allInventory.length} registros de inventario
        </p>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Crítico" value={stats.critical} color="red" icon="🔴" sub="items críticos" />
        <StatCard label="Stock Bajo" value={stats.low} color="amber" icon="🟡" sub="items bajos" />
        <StatCard label="Normal" value={stats.healthy} color="green" icon="🟢" sub="items ok" />
        <StatCard label="Exceso" value={stats.overstocked} color="blue" icon="🔵" sub="exceso" />
      </div>

      {/* Hospital cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {ccaa.hospitals.map(h => {
          const s = getInventoryStats(h.inventory)
          const worstItems = h.inventory
            .filter(i => i.status === 'critical' || i.status === 'low')
            .slice(0, 3)

          return (
            <button
              key={h.id}
              onClick={() => setSelectedHospital(h.id)}
              className="group text-left rounded-xl border border-gray-200 bg-white p-5 shadow-soft hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {h.name}
                  </p>
                  <p className="text-xs text-gray-400">📍 {h.city} · {h.beds} camas</p>
                </div>
                {s.critical > 0 ? (
                  <StatusBadge status="critical" size="xs" />
                ) : s.low > 0 ? (
                  <StatusBadge status="low" size="xs" />
                ) : (
                  <StatusBadge status="healthy" size="xs" />
                )}
              </div>

              {/* Mini bar stats */}
              <div className="mb-3 flex gap-3 text-xs">
                {s.critical > 0 && <span className="text-red-600 font-medium">🔴 {s.critical} crítico</span>}
                {s.low > 0 && <span className="text-amber-600 font-medium">🟡 {s.low} bajo</span>}
                <span className="text-green-600 font-medium">🟢 {s.healthy} ok</span>
              </div>

              {/* Worst items preview */}
              {worstItems.length > 0 && (
                <div className="space-y-2">
                  {worstItems.map(item => (
                    <div key={item.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="truncate text-gray-600 max-w-[60%]">{item.name}</span>
                        <span className="text-gray-400">{item.quantity}/{item.maxStock}</span>
                      </div>
                      <StockBar
                        quantity={item.quantity}
                        minStock={item.minStock}
                        maxStock={item.maxStock}
                        status={item.status}
                      />
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-3 text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                Ver detalle →
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
