'use client'

import { useState } from 'react'
import { SPAIN_CCAA, getInventoryStats } from '@/lib/mock-data/hospitals'
import { StatusBadge } from './StatusBadge'
import { StatCard } from './StatCard'
import { StockBar } from './StockBar'
import { InventoryItem } from '@/lib/types'

const CCAA_FLAG: Record<string, string> = {
  madrid: '🏙️',
  cataluna: '🌊',
  andalucia: '☀️',
  cv: '🍊',
  galicia: '🌧️',
  pv: '⛰️',
}

export function SpainOverview() {
  const [expandedCCAA, setExpandedCCAA] = useState<string | null>(null)

  const allInventory: InventoryItem[] = SPAIN_CCAA.flatMap(c =>
    c.hospitals.flatMap(h => h.inventory)
  )
  const globalStats = getInventoryStats(allInventory)

  const totalHospitals = SPAIN_CCAA.reduce((s, c) => s + c.hospitals.length, 0)
  const totalBeds = SPAIN_CCAA.flatMap(c => c.hospitals).reduce((s, h) => s + h.beds, 0)

  const criticalItems = allInventory
    .filter(i => i.status === 'critical')
    .slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">🇪🇸 Resumen Nacional — España</h2>
        <p className="text-sm text-gray-500">
          {SPAIN_CCAA.length} comunidades autónomas · {totalHospitals} hospitales · {totalBeds.toLocaleString()} camas
        </p>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Alertas Críticas" value={globalStats.critical} color="red" icon="🚨" sub="en toda España" />
        <StatCard label="Stock Bajo" value={globalStats.low} color="amber" icon="⚠️" sub="por debajo mínimo" />
        <StatCard label="Suministros OK" value={globalStats.healthy} color="green" icon="✅" sub="en rango óptimo" />
        <StatCard label="Exceso Stock" value={globalStats.overstocked} color="blue" icon="📦" sub="sobre el máximo" />
      </div>

      {/* Critical items alert strip */}
      {criticalItems.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="mb-3 text-sm font-semibold text-red-700">🚨 Items en estado crítico (requieren acción inmediata)</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {criticalItems.map(item => {
              const hospital = SPAIN_CCAA.flatMap(c => c.hospitals).find(h =>
                h.inventory.some(i => i.id === item.id)
              )
              return (
                <div key={item.id} className="rounded-lg border border-red-200 bg-white p-3">
                  <p className="text-xs font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 mb-1.5 truncate">{hospital?.name}</p>
                  <StockBar
                    quantity={item.quantity}
                    minStock={item.minStock}
                    maxStock={item.maxStock}
                    status="critical"
                  />
                  <p className="mt-1 text-xs text-red-600">{item.quantity} / {item.maxStock} {item.unit}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* CCAA breakdown */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Por Comunidad Autónoma</h3>
        <div className="space-y-3">
          {SPAIN_CCAA.map(ccaa => {
            const ccaaInventory = ccaa.hospitals.flatMap(h => h.inventory)
            const s = getInventoryStats(ccaaInventory)
            const isExpanded = expandedCCAA === ccaa.id
            const totalPct = Math.round((s.healthy / s.total) * 100)
            const overallStatus =
              s.critical > 3 ? 'critical' : s.critical > 0 || s.low > 5 ? 'low' : 'healthy'

            return (
              <div key={ccaa.id} className="rounded-xl border border-gray-200 bg-white shadow-soft overflow-hidden">
                <button
                  onClick={() => setExpandedCCAA(isExpanded ? null : ccaa.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-2xl">{CCAA_FLAG[ccaa.id] ?? '🏥'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{ccaa.name}</span>
                      <StatusBadge status={overallStatus} size="xs" />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{ccaa.hospitals.length} hospitales</span>
                      <span>{ccaaInventory.length} items</span>
                      <span className="text-green-600 font-medium">{totalPct}% ok</span>
                    </div>
                  </div>
                  {/* mini breakdown */}
                  <div className="hidden sm:flex items-center gap-3 text-xs">
                    {s.critical > 0 && (
                      <span className="flex items-center gap-1 text-red-600 font-medium">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        {s.critical}
                      </span>
                    )}
                    {s.low > 0 && (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        {s.low}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      {s.healthy}
                    </span>
                  </div>
                  <span className="ml-2 text-gray-400 text-sm">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {ccaa.hospitals.map(h => {
                        const hs = getInventoryStats(h.inventory)
                        const hStatus =
                          hs.critical > 0 ? 'critical' : hs.low > 0 ? 'low' : 'healthy'
                        return (
                          <div key={h.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <p className="text-xs font-semibold text-gray-900 leading-tight">{h.name}</p>
                                <p className="text-xs text-gray-400">📍 {h.city}</p>
                              </div>
                              <StatusBadge status={hStatus} size="xs" />
                            </div>
                            <div className="flex gap-3 text-xs">
                              {hs.critical > 0 && <span className="text-red-600">🔴 {hs.critical}</span>}
                              {hs.low > 0 && <span className="text-amber-600">🟡 {hs.low}</span>}
                              <span className="text-green-600">🟢 {hs.healthy}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
