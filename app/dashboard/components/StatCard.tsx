'use client'

export function StatCard({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string
  value: number | string
  sub?: string
  color: 'red' | 'amber' | 'green' | 'blue' | 'gray'
  icon: string
}) {
  const ring: Record<string, string> = {
    red: 'border-red-200 bg-red-50',
    amber: 'border-amber-200 bg-amber-50',
    green: 'border-green-200 bg-green-50',
    blue: 'border-blue-200 bg-blue-50',
    gray: 'border-gray-200 bg-gray-50',
  }
  const text: Record<string, string> = {
    red: 'text-red-700',
    amber: 'text-amber-700',
    green: 'text-green-700',
    blue: 'text-blue-700',
    gray: 'text-gray-700',
  }

  return (
    <div className={`rounded-xl border p-4 ${ring[color]}`}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${text[color]}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}
