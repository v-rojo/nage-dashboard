import { InventoryItem } from '@/lib/types'
import { SURGICAL_CATALOG } from './catalog'

export type Department =
  | 'emergency'
  | 'icu'
  | 'surgery'
  | 'cardiology'
  | 'neurosurgery'
  | 'traumatology'
  | 'pediatrics'
  | 'oncology'
export type StockStatus = 'critical' | 'low' | 'healthy' | 'overstocked'

export interface Hospital {
  id: string
  name: string
  city: string
  ccaa: string
  beds: number
  departments: Department[]
  inventory: InventoryItem[]
}

export interface CCAASummary {
  id: string
  name: string
  hospitals: Hospital[]
}

function deriveStatus(qty: number, min: number, max: number): StockStatus {
  if (qty <= min * 0.6) return 'critical'
  if (qty < min) return 'low'
  if (qty > max) return 'overstocked'
  return 'healthy'
}

// Deterministic pseudo-random generator so server and client render the same data
export function seededRandom(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeInventory(seed: number, depts: Department[]): InventoryItem[] {
  const rand = seededRandom(seed * 7919)
  return SURGICAL_CATALOG.filter(item => depts.includes(item.department as Department)).map((item, i) => {
    // Between ~35% of min stock and ~115% of max stock
    const qty = Math.round(item.minStock * 0.35 + rand() * (item.maxStock * 1.15 - item.minStock * 0.35))
    return {
      ...item,
      id: `${seed}-${i}`,
      quantity: qty,
      aiPredictedDemand: Math.round(item.consumptionRate * 30 * (0.9 + rand() * 0.3)),
      status: deriveStatus(qty, item.minStock, item.maxStock),
    }
  })
}

function hospital(h: Omit<Hospital, 'inventory'>, seed: number): Hospital {
  return {
    ...h,
    inventory: makeInventory(seed, h.departments).map(i => ({ ...i, location: h.name })),
  }
}

export const MADRID_HOSPITALS: Hospital[] = [
  hospital({ id: 'h-la-paz', name: 'Hospital Universitario La Paz', city: 'Madrid', ccaa: 'Comunidad de Madrid', beds: 1300, departments: ['surgery', 'neurosurgery', 'cardiology', 'traumatology'] }, 1),
  hospital({ id: 'h-gregorio', name: 'Hospital General Universitario Gregorio Marañón', city: 'Madrid', ccaa: 'Comunidad de Madrid', beds: 1500, departments: ['surgery', 'neurosurgery', 'cardiology', 'traumatology'] }, 3),
  hospital({ id: 'h-ramon-cajal', name: 'Hospital Universitario Ramón y Cajal', city: 'Madrid', ccaa: 'Comunidad de Madrid', beds: 900, departments: ['surgery', 'neurosurgery', 'traumatology'] }, 5),
  hospital({ id: 'h-12-octubre', name: 'Hospital Universitario 12 de Octubre', city: 'Madrid', ccaa: 'Comunidad de Madrid', beds: 1100, departments: ['surgery', 'cardiology', 'traumatology'] }, 7),
]

export const SPAIN_CCAA: CCAASummary[] = [
  {
    id: 'madrid',
    name: 'Comunidad de Madrid',
    hospitals: MADRID_HOSPITALS,
  },
  {
    id: 'cataluna',
    name: 'Cataluña',
    hospitals: [
      hospital({ id: 'h-vall-hebron', name: "Hospital Vall d'Hebron", city: 'Barcelona', ccaa: 'Cataluña', beds: 1100, departments: ['surgery', 'neurosurgery', 'cardiology', 'traumatology'] }, 11),
      hospital({ id: 'h-clinic-bcn', name: 'Hospital Clínic de Barcelona', city: 'Barcelona', ccaa: 'Cataluña', beds: 850, departments: ['surgery', 'cardiology'] }, 13),
      hospital({ id: 'h-sant-pau', name: 'Hospital de la Santa Creu i Sant Pau', city: 'Barcelona', ccaa: 'Cataluña', beds: 700, departments: ['neurosurgery', 'traumatology'] }, 15),
    ],
  },
  {
    id: 'andalucia',
    name: 'Andalucía',
    hospitals: [
      hospital({ id: 'h-virgen-rocio', name: 'Hospital Universitario Virgen del Rocío', city: 'Sevilla', ccaa: 'Andalucía', beds: 1400, departments: ['surgery', 'neurosurgery', 'cardiology', 'traumatology'] }, 21),
      hospital({ id: 'h-reina-sofia', name: 'Hospital Universitario Reina Sofía', city: 'Córdoba', ccaa: 'Andalucía', beds: 950, departments: ['surgery', 'cardiology'] }, 23),
    ],
  },
  {
    id: 'cv',
    name: 'Comunitat Valenciana',
    hospitals: [
      hospital({ id: 'h-la-fe', name: 'Hospital Universitari i Politècnic La Fe', city: 'Valencia', ccaa: 'Comunitat Valenciana', beds: 1000, departments: ['surgery', 'neurosurgery', 'cardiology'] }, 31),
      hospital({ id: 'h-general-valencia', name: 'Hospital General Universitario de Valencia', city: 'Valencia', ccaa: 'Comunitat Valenciana', beds: 750, departments: ['cardiology', 'traumatology'] }, 33),
    ],
  },
  {
    id: 'galicia',
    name: 'Galicia',
    hospitals: [
      hospital({ id: 'h-chuac', name: 'Complexo Hospitalario Universitario A Coruña', city: 'A Coruña', ccaa: 'Galicia', beds: 850, departments: ['surgery', 'neurosurgery', 'traumatology'] }, 41),
    ],
  },
  {
    id: 'pv',
    name: 'País Vasco',
    hospitals: [
      hospital({ id: 'h-basurto', name: 'Hospital Universitario Basurto', city: 'Bilbao', ccaa: 'País Vasco', beds: 650, departments: ['cardiology', 'traumatology'] }, 51),
    ],
  },
]

export function getInventoryStats(items: InventoryItem[]) {
  const total = items.length
  const critical = items.filter(i => i.status === 'critical').length
  const low = items.filter(i => i.status === 'low').length
  const healthy = items.filter(i => i.status === 'healthy').length
  const overstocked = items.filter(i => i.status === 'overstocked').length
  return { total, critical, low, healthy, overstocked }
}
