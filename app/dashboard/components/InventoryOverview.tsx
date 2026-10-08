'use client'

import { useMemo } from 'react'
import {
  Area,
  ComposedChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Info,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react'
import { InventoryItem } from '@/lib/types'
import { computeOverview, RiskLevel } from '@/lib/analytics'

const TEAL = '#0d9488'
const TEAL_LIGHT = '#5eead4'

const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const eurCompact = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-soft ${className}`}>{children}</div>
}

function Trend({ value, unit = '%', goodWhenUp }: { value: number; unit?: string; goodWhenUp: boolean }) {
  const up = value >= 0
  const good = up === goodWhenUp
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <p className="mt-1 flex items-center gap-1 text-xs">
      <span className={`flex items-center font-semibold ${good ? 'text-emerald-600' : 'text-red-600'}`}>
        <Icon className="h-3.5 w-3.5" />
        {up ? '+' : ''}
        {value.toFixed(0)}
        {unit}
      </span>
      <span className="text-gray-400">vs. mes anterior</span>
    </p>
  )
}

function KpiCard({
  label,
  value,
  icon: Icon,
  tone,
  trend,
}: {
  label: string
  value: string
  icon: LucideIcon
  tone: 'teal' | 'red' | 'amber'
  trend?: React.ReactNode
}) {
  const toneClass = {
    teal: 'bg-teal-50 text-teal-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
  }[tone]
  return (
    <Card className="flex items-start gap-4">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">{value}</p>
        {trend}
      </div>
    </Card>
  )
}

function StockChart({ data }: { data: ReturnType<typeof computeOverview>['chart'] }) {
  return (
    <Card className="lg:col-span-3">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Valor del stock</h3>
          <p className="text-xs text-gray-400">Euros &middot; ultimos 30 dias y prevision a 14 dias</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full" style={{ background: TEAL }} />
            Stock real
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0 w-4 border-t-2 border-dashed" style={{ borderColor: TEAL_LIGHT }} />
            Prevision IA
          </span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="stockFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TEAL} stopOpacity={0.18} />
                <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              interval={6}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              width={52}
              tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toLocaleString('es-ES')}M` : `${v}k`)}
            />
            <Tooltip
              cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 3' }}
              contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
              formatter={(v: number, name: string) => [
                eur.format(v * 1000),
                name === 'actual' ? 'Stock real' : 'Prevision IA',
              ]}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke={TEAL}
              strokeWidth={2}
              fill="url(#stockFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke={TEAL_LIGHT}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

const HORIZON_STYLE: Record<number, { box: string; icon: string; sub: string }> = {
  30: { box: 'bg-red-50', icon: 'bg-red-100 text-red-600', sub: 'Pueden agotarse en 30 dias' },
  60: { box: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', sub: 'Rotura prevista en 31-60 dias' },
  90: { box: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', sub: 'Rotura prevista en 61-90 dias' },
}

function PredictiveAlerts({ horizons }: { horizons: { days: number; count: number }[] }) {
  return (
    <Card className="lg:col-span-2">
      <h3 className="mb-4 text-base font-semibold text-gray-900">Alertas predictivas</h3>
      <div className="space-y-3">
        {horizons.map(h => {
          const s = HORIZON_STYLE[h.days]
          return (
            <div key={h.days} className={`flex items-center gap-4 rounded-xl px-4 py-3.5 ${s.box}`}>
              <div className={`hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg sm:flex ${s.icon}`}>
                <CalendarClock className="h-5 w-5" />
              </div>
              <p className="w-16 flex-shrink-0 text-sm font-bold text-gray-900">{h.days} dias</p>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  {h.count} {h.count === 1 ? 'producto' : 'productos'} en riesgo
                </p>
                <p className="text-xs text-gray-500">{s.sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function RiskGauge({ value, delta }: { value: number; delta: number }) {
  const v = Math.max(0, Math.min(100, value))
  const level = v < 15 ? 'Riesgo bajo' : v < 30 ? 'Riesgo medio' : 'Riesgo alto'
  const color = v < 15 ? TEAL : v < 30 ? '#d97706' : '#dc2626'
  // Semicircle of radius 80; arc length = PI * r
  const r = 80
  const len = Math.PI * r
  const improved = delta <= 0

  return (
    <Card className="lg:col-span-2">
      <div className="mb-2 flex items-center gap-1.5">
        <h3 className="text-base font-semibold text-gray-900">Riesgo de cancelacion quirurgica</h3>
        <span title="Proporcion de procedimientos programados que dependen de material con cobertura inferior al plazo de entrega">
          <Info className="h-4 w-4 text-gray-400" />
        </span>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col xl:flex-row">
        <div className="relative w-48 flex-shrink-0 pt-2">
          <svg viewBox="0 0 200 115" className="w-full" role="img" aria-label={`${v.toFixed(0)}% ${level}`}>
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e5e7eb" strokeWidth={16} strokeLinecap="round" />
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={color}
              strokeWidth={16}
              strokeLinecap="round"
              strokeDasharray={`${(v / 100) * len} ${len}`}
            />
          </svg>
          <div className="absolute inset-x-0 bottom-1 text-center">
            <p className="text-3xl font-bold text-gray-900">{v.toFixed(0)}%</p>
            <p className="text-xs font-medium text-gray-500">{level}</p>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Calculado a partir del inventario actual, los plazos de entrega de cada proveedor y el ritmo de
            procedimientos programados.
          </p>
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
              improved ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {improved ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <AlertTriangle className="h-4 w-4 flex-shrink-0" />}
            {improved ? 'Baja' : 'Sube'} {Math.abs(delta).toFixed(0)} puntos respecto al mes anterior
          </div>
        </div>
      </div>
    </Card>
  )
}

const RISK_PILL: Record<RiskLevel, { label: string; className: string }> = {
  high: { label: 'Alto', className: 'bg-red-50 text-red-700 ring-red-200' },
  medium: { label: 'Medio', className: 'bg-amber-50 text-amber-700 ring-amber-200' },
  low: { label: 'Bajo', className: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
}

function AtRiskTable({
  rows,
  showLocation,
}: {
  rows: ReturnType<typeof computeOverview>['atRisk']
  showLocation: boolean
}) {
  return (
    <Card className="lg:col-span-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Productos con mayor riesgo</h3>
        <span className="text-xs text-gray-400">{rows.length} en total</span>
      </div>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">Ningun producto en riesgo</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
                <th className="py-2 pr-3 font-medium">Producto</th>
                <th className="px-3 py-2 text-right font-medium">Stock</th>
                <th className="px-3 py-2 text-right font-medium">Dias restantes</th>
                <th className="px-3 py-2 text-right font-medium">Entrega</th>
                <th className="py-2 pl-3 text-right font-medium">Riesgo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.slice(0, 6).map(({ item, days, risk }) => (
                <tr key={item.id}>
                  <td className="py-2.5 pr-3">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.manufacturer}
                      {showLocation && item.location ? ` · ${item.location}` : ''}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-gray-700">{item.quantity}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-gray-700">{Math.floor(days)}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-gray-500">{item.leadTimeDays} d</td>
                  <td className="py-2.5 pl-3 text-right">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${RISK_PILL[risk].className}`}>
                      {RISK_PILL[risk].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

export function InventoryOverview({ items, showLocation = false }: { items: InventoryItem[]; showLocation?: boolean }) {
  const o = useMemo(() => computeOverview(items), [items])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Valor del inventario"
          value={eurCompact.format(o.kpis.value)}
          icon={Boxes}
          tone="teal"
          trend={<Trend value={o.kpis.valueTrend} goodWhenUp />}
        />
        <KpiCard
          label="Referencias en stock"
          value={`${o.kpis.inStock.toFixed(0)}%`}
          icon={ClipboardCheck}
          tone="teal"
          trend={<Trend value={o.kpis.inStockTrend} unit=" pts" goodWhenUp />}
        />
        <KpiCard
          label="Bajo minimo"
          value={String(o.kpis.low)}
          icon={AlertTriangle}
          tone="red"
          trend={<Trend value={o.kpis.lowTrend} goodWhenUp={false} />}
        />
        <KpiCard
          label="Pedidos recomendados"
          value={String(o.kpis.pendingOrders)}
          icon={ShoppingCart}
          tone="amber"
          trend={<p className="mt-1 text-xs text-gray-400">de {o.kpis.references} referencias</p>}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <StockChart data={o.chart} />
        <PredictiveAlerts horizons={o.horizons} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <RiskGauge value={o.cancellationRisk} delta={o.cancellationRiskDelta} />
        <AtRiskTable rows={o.atRisk} showLocation={showLocation} />
      </div>
    </div>
  )
}
