'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Hospital } from '@/lib/mock-data/hospitals'
import { InventoryItem } from '@/lib/types'
import { StatusBadge } from './StatusBadge'
import { StockBar } from './StockBar'
import { InventoryOverview } from './InventoryOverview'
import { daysRemaining } from '@/lib/analytics'

const DEPT_LABELS: Record<string, string> = {
  emergency: 'Urgencias',
  icu: 'UCI',
  surgery: 'Cirugia general y robotica',
  cardiology: 'Cardiologia intervencionista',
  neurosurgery: 'Neurocirugia',
  traumatology: 'Traumatologia y columna',
  pediatrics: 'Pediatria',
  oncology: 'Oncologia',
}

function InventoryTable({ items }: { items: InventoryItem[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-soft">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Producto</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Fabricante</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Stock</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Nivel</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">Cobertura</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Estado</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">Precio unidad</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.map(item => (
            <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-400">{item.sku} &middot; {item.category}</p>
              </td>
              <td className="px-4 py-3 text-gray-500">{item.manufacturer}</td>
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
              <td className="px-4 py-3 text-right tabular-nums text-gray-600">
                {Math.floor(daysRemaining(item))} dias
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-gray-600">
                {item.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
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


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{hospital.name}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {hospital.city} &middot; {hospital.beds} camas &middot; {hospital.departments.length} departamentos
          </p>
        </div>
        <span className="text-xs text-gray-400">Ultima actualizacion: hace 2 min</span>
      </div>

      <InventoryOverview items={hospital.inventory} />

      <h3 className="pt-2 text-base font-semibold text-gray-900">Inventario por servicio</h3>

      {/* Dept filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveDept('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            activeDept === 'all'
              ? 'bg-teal-600 text-white'
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
                ? 'bg-teal-600 text-white'
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
