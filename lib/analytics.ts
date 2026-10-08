import { InventoryItem } from '@/lib/types'
import { seededRandom } from '@/lib/mock-data/hospitals'

export type RiskLevel = 'high' | 'medium' | 'low'

export const HISTORY_DAYS = 30
export const FORECAST_DAYS = 14

export function daysRemaining(item: Pick<InventoryItem, 'quantity' | 'consumptionRate'>) {
  return item.consumptionRate > 0 ? item.quantity / item.consumptionRate : Infinity
}

// High: runs out before a new order can arrive. Medium: within two lead times.
export function riskLevel(item: InventoryItem, quantity = item.quantity): RiskLevel {
  const days = daysRemaining({ quantity, consumptionRate: item.consumptionRate })
  if (days < item.leadTimeDays) return 'high'
  if (days < item.leadTimeDays * 2) return 'medium'
  return 'low'
}

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

/**
 * Synthetic daily stock series for one item: HISTORY_DAYS of past values ending at
 * today's real quantity, followed by FORECAST_DAYS projected with predicted demand.
 * Weekly deliveries produce the usual saw-tooth pattern.
 */
export function itemSeries(item: InventoryItem): number[] {
  const rand = seededRandom(hash(item.id))
  const daily = item.consumptionRate
  const deliveryEvery = 7
  const deliveryOffset = Math.floor(rand() * deliveryEvery)

  const past: number[] = [item.quantity]
  let stock = item.quantity
  for (let d = 0; d < HISTORY_DAYS; d++) {
    // Walking backwards: undo today's consumption and delivery
    stock += daily * (0.7 + rand() * 0.6)
    if ((d + deliveryOffset) % deliveryEvery === 0) {
      stock -= daily * deliveryEvery * (0.85 + rand() * 0.3)
    }
    past.unshift(Math.max(0, stock))
  }

  const predictedDaily = item.aiPredictedDemand / 30
  const future: number[] = []
  stock = item.quantity
  for (let d = 1; d <= FORECAST_DAYS; d++) {
    stock -= predictedDaily
    // Regular weekly replenishment; items already under minimum are only partially covered
    if ((d + deliveryOffset) % deliveryEvery === 0) {
      stock += predictedDaily * deliveryEvery * (item.quantity < item.minStock ? 0.6 : 1)
    }
    future.push(Math.max(0, stock))
  }
  return [...past, ...future]
}

export interface StockPoint {
  label: string
  actual: number | null
  forecast: number | null
}

export function computeOverview(items: InventoryItem[]) {
  const series = items.map(itemSeries)
  const todayIdx = HISTORY_DAYS
  const monthAgoIdx = 0

  const valueAt = (idx: number) =>
    items.reduce((s, item, i) => s + series[i][idx] * item.price, 0)
  const inStockPctAt = (idx: number) =>
    items.length === 0
      ? 0
      : (items.filter((item, i) => series[i][idx] >= item.minStock).length / items.length) * 100
  const lowCountAt = (idx: number) =>
    items.filter((item, i) => series[i][idx] < item.minStock).length
  const cancellationRiskAt = (idx: number) => {
    const weight = items.reduce((s, i) => s + i.consumptionRate, 0)
    if (weight === 0) return 0
    const score = items.reduce((s, item, i) => {
      const r = riskLevel(item, series[i][idx])
      return s + item.consumptionRate * (r === 'high' ? 1 : r === 'medium' ? 0.35 : 0)
    }, 0)
    return (score / weight) * 100
  }

  const withDays = items.map(item => ({ item, days: daysRemaining(item), risk: riskLevel(item) }))

  const pct = (now: number, before: number) => (before === 0 ? 0 : ((now - before) / before) * 100)

  const value = valueAt(todayIdx)
  const inStock = inStockPctAt(todayIdx)
  const low = lowCountAt(todayIdx)
  const risk = cancellationRiskAt(todayIdx)
  const riskBefore = cancellationRiskAt(monthAgoIdx)

  const chart: StockPoint[] = series[0]
    ? series[0].map((_, idx) => {
        const v = Math.round(valueAt(idx) / 1000)
        const offset = idx - todayIdx
        return {
          label: offset === 0 ? 'Hoy' : `${offset > 0 ? '+' : ''}${offset}d`,
          actual: idx <= todayIdx ? v : null,
          forecast: idx >= todayIdx ? v : null,
        }
      })
    : []

  return {
    kpis: {
      references: items.length,
      value,
      valueTrend: pct(value, valueAt(monthAgoIdx)),
      inStock,
      inStockTrend: inStock - inStockPctAt(monthAgoIdx),
      low,
      lowTrend: pct(low, lowCountAt(monthAgoIdx)),
      pendingOrders: withDays.filter(d => d.risk !== 'low').length,
    },
    chart,
    horizons: [
      { days: 30, count: withDays.filter(d => d.days <= 30).length },
      { days: 60, count: withDays.filter(d => d.days > 30 && d.days <= 60).length },
      { days: 90, count: withDays.filter(d => d.days > 60 && d.days <= 90).length },
    ],
    cancellationRisk: risk,
    cancellationRiskDelta: risk - riskBefore,
    atRisk: withDays
      .filter(d => d.risk !== 'low')
      .sort((a, b) => a.days / a.item.leadTimeDays - b.days / b.item.leadTimeDays),
  }
}
