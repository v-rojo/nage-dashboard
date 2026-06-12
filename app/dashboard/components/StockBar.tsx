'use client'

import { StockStatus } from '@/lib/mock-data/hospitals'

const BAR_COLOR: Record<StockStatus, string> = {
  critical: 'bg-red-500',
  low: 'bg-amber-400',
  healthy: 'bg-green-500',
  overstocked: 'bg-blue-500',
}

export function StockBar({
  quantity,
  minStock,
  maxStock,
  status,
}: {
  quantity: number
  minStock: number
  maxStock: number
  status: StockStatus
}) {
  const pct = Math.min(100, Math.round((quantity / maxStock) * 100))
  const minPct = Math.round((minStock / maxStock) * 100)

  return (
    <div className="relative h-2 w-full rounded-full bg-gray-100">
      {/* min threshold marker */}
      <div
        className="absolute top-0 h-full w-px bg-gray-400 opacity-60"
        style={{ left: `${minPct}%` }}
      />
      <div
        className={`h-full rounded-full transition-all ${BAR_COLOR[status]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
