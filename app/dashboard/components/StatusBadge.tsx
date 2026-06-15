'use client'

import { StockStatus } from '@/lib/mock-data/hospitals'

const CONFIG: Record<StockStatus, { label: string; className: string; dot: string }> = {
  critical: {
    label: 'Critical',
    className: 'bg-red-100 text-red-700 border border-red-200',
    dot: 'bg-red-500 animate-pulse',
  },
  low: {
    label: 'Low',
    className: 'bg-amber-100 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
  },
  healthy: {
    label: 'Healthy',
    className: 'bg-green-100 text-green-700 border border-green-200',
    dot: 'bg-green-500',
  },
  overstocked: {
    label: 'Overstocked',
    className: 'bg-blue-100 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
  },
}

export function StatusBadge({ status, size = 'sm' }: { status: StockStatus; size?: 'xs' | 'sm' }) {
  const c = CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.className} ${size === 'xs' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
      <span className={`rounded-full ${c.dot} ${size === 'xs' ? 'h-1.5 w-1.5' : 'h-2 w-2'}`} />
      {c.label}
    </span>
  )
}

export function statusColor(status: StockStatus) {
  return CONFIG[status]
}
