'use client'

import { useState } from 'react'
import { Hospital } from '@/lib/mock-data/hospitals'
import { InventoryItem } from '@/lib/types'
import { StatusBadge } from './StatusBadge'
import { StockBar } from './StockBar'
import { StatCard } from './StatCard'

const DEPT_LABELS: Record<string, string> = {
  emergency: '🚨 Emergency',
  icu: '🫀 ICU',
  surgery: '🔬 Surgery',
  cardiology: '❤️ Cardiology',
  pediatrics: '👶 Pediatrics',
  oncology: '🧬 Oncology',
}

function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-soft">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Item</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Stock</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Level</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">Expires</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.map(item => (
            <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">{item.sku}</p>
              </td>
              <td className="px-4 py-3 text-gray-500">{item.category}</td>
              <td className="px-4 py-3">
                <span className="font-semibold text-gray-800">{item.quantity}</span>
                <span className="text-gray-400"> / {item.maxStock} {item.unit}</span>
              </td>
              <td className="px-4 py-3 w-36">
                <StockBar
                  quantity={item.quantity}
                  minStock={item.minStock}
                  maxStock={item.maxStock}
                  status={item.status}
                />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3 text-right text-xs text-gray-400">
                {item.expirationDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function HospitalView({ hospital }: { hospital: Hospital }) {
  const [activeDept, setActiveDept] = useState<string>('all')

  const filtered =
    activeDept === 'all'
      ? hospital.inventory
      : hospital.inventory.filter(i => i.department === activeDept)

  const stats = {
    critical: hospital.inventory.filter(i => i.status === 'critical').length,
    low: hospital.inventory.filter(i => i.status === 'low').length,
    healthy: hospital.inventory.filter(i => i.status === 'healthy').length,
    overstocked: hospital.inventory.filter(i => i.status === 'overstocked').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{hospital.name}</h2>
          <p className="text-sm text-gray-500">
            📍 {hospital.city} · {hospital.beds} camas · {hospital.departments.length} departamentos
          </p>
        </div>
        <span className="text-xs text-gray-400">Última actualización: hace 2 min</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Crítico" value={stats.critical} color="red" icon="🔴" sub="requiere acción" />
        <StatCard label="Stock Bajo" value={stats.low} color="amber" icon="🟡" sub="por debajo del mínimo" />
        <StatCard label="Normal" value={stats.healthy} color="green" icon="🟢" sub="en rango óptimo" />
        <StatCard label="Exceso" value={stats.overstocked} color="blue" icon="🔵" sub="por encima del máximo" />
      </div>

      {/* Dept filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveDept('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            activeDept === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {hospital.departments.map(d => (
          <button
            key={d}
            onClick={() => setActiveDept(d)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeDept === d
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {DEPT_LABELS[d] ?? d}
          </button>
        ))}
      </div>

      {/* Table */}
      <InventoryTable items={filtered} />
    </div>
  )
}
