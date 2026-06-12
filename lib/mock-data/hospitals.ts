import { InventoryItem } from '@/lib/types'

export type Department = 'emergency' | 'icu' | 'surgery' | 'cardiology' | 'pediatrics' | 'oncology'
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

const BASE_ITEMS: Omit<InventoryItem, 'id' | 'department' | 'quantity' | 'status'>[] = [
  {
    name: 'Epinephrine Auto-Injector',
    sku: 'EPI-001',
    category: 'Emergency Medication',
    minStock: 20,
    maxStock: 60,
    unit: 'units',
    price: 89.99,
    expirationDate: '2026-08-15',
    supplier: 'MedSupply Direct',
    consumptionRate: 3.2,
    aiPredictedDemand: 22,
  },
  {
    name: 'Surgical Gloves (Sterile)',
    sku: 'SG-200-L',
    category: 'PPE',
    minStock: 200,
    maxStock: 1000,
    unit: 'pairs',
    price: 2.45,
    expirationDate: '2027-01-30',
    supplier: 'SterileTech',
    consumptionRate: 85,
    aiPredictedDemand: 600,
  },
  {
    name: 'Fentanyl Citrate 100mcg',
    sku: 'FEN-100-V',
    category: 'Controlled Substance',
    minStock: 15,
    maxStock: 40,
    unit: 'vials',
    price: 14.5,
    expirationDate: '2026-05-20',
    supplier: 'PharmaCorp',
    consumptionRate: 2.8,
    aiPredictedDemand: 20,
  },
  {
    name: 'Nitrile Exam Gloves',
    sku: 'EG-300-M',
    category: 'PPE',
    minStock: 500,
    maxStock: 2000,
    unit: 'pieces',
    price: 0.12,
    expirationDate: '2028-12-01',
    supplier: 'GloveWorld',
    consumptionRate: 200,
    aiPredictedDemand: 1400,
  },
  {
    name: 'IV Saline 0.9% 500ml',
    sku: 'IVS-500',
    category: 'IV Fluids',
    minStock: 100,
    maxStock: 400,
    unit: 'bags',
    price: 3.2,
    expirationDate: '2027-06-01',
    supplier: 'FluidMed',
    consumptionRate: 40,
    aiPredictedDemand: 280,
  },
  {
    name: 'Morphine Sulfate 10mg',
    sku: 'MOR-10-A',
    category: 'Controlled Substance',
    minStock: 30,
    maxStock: 80,
    unit: 'ampoules',
    price: 8.75,
    expirationDate: '2026-11-10',
    supplier: 'PharmaCorp',
    consumptionRate: 6,
    aiPredictedDemand: 45,
  },
  {
    name: 'Disposable Syringes 10ml',
    sku: 'SYR-10',
    category: 'Disposables',
    minStock: 300,
    maxStock: 1500,
    unit: 'units',
    price: 0.35,
    expirationDate: '2029-03-01',
    supplier: 'DisposaMed',
    consumptionRate: 120,
    aiPredictedDemand: 850,
  },
  {
    name: 'Blood Glucose Test Strips',
    sku: 'BGT-100',
    category: 'Diagnostics',
    minStock: 200,
    maxStock: 800,
    unit: 'strips',
    price: 0.65,
    expirationDate: '2026-09-15',
    supplier: 'DiagnosticsPro',
    consumptionRate: 75,
    aiPredictedDemand: 520,
  },
]

function deriveStatus(qty: number, min: number, max: number): StockStatus {
  if (qty <= min * 0.6) return 'critical'
  if (qty < min) return 'low'
  if (qty > max) return 'overstocked'
  return 'healthy'
}

function makeInventory(seed: number, depts: Department[]): InventoryItem[] {
  const rng = (base: number, variance: number) =>
    Math.max(0, Math.round(base * (0.4 + ((seed * 17 + base * 7) % 100) / 83) * variance))

  return BASE_ITEMS.flatMap((item, i) =>
    depts.slice(0, 2).map((dept, j) => {
      const qty = rng(item.minStock, 1.6 + ((seed + i + j) % 5) * 0.4)
      return {
        ...item,
        id: `${seed}-${i}-${j}`,
        department: dept,
        quantity: qty,
        status: deriveStatus(qty, item.minStock, item.maxStock),
      } as InventoryItem
    })
  )
}

export const MADRID_HOSPITALS: Hospital[] = [
  {
    id: 'h-la-paz',
    name: 'Hospital Universitario La Paz',
    city: 'Madrid',
    ccaa: 'Comunidad de Madrid',
    beds: 1300,
    departments: ['emergency', 'icu', 'surgery', 'cardiology', 'pediatrics', 'oncology'],
    inventory: makeInventory(1, ['emergency', 'icu', 'surgery', 'cardiology', 'pediatrics', 'oncology']),
  },
  {
    id: 'h-gregorio',
    name: 'Hospital General Universitario Gregorio Marañón',
    city: 'Madrid',
    ccaa: 'Comunidad de Madrid',
    beds: 1500,
    departments: ['emergency', 'icu', 'surgery', 'cardiology', 'oncology'],
    inventory: makeInventory(3, ['emergency', 'icu', 'surgery', 'cardiology', 'oncology']),
  },
  {
    id: 'h-ramon-cajal',
    name: 'Hospital Universitario Ramón y Cajal',
    city: 'Madrid',
    ccaa: 'Comunidad de Madrid',
    beds: 900,
    departments: ['emergency', 'icu', 'surgery', 'pediatrics'],
    inventory: makeInventory(5, ['emergency', 'icu', 'surgery', 'pediatrics']),
  },
  {
    id: 'h-12-octubre',
    name: 'Hospital Universitario 12 de Octubre',
    city: 'Madrid',
    ccaa: 'Comunidad de Madrid',
    beds: 1100,
    departments: ['emergency', 'icu', 'cardiology', 'oncology'],
    inventory: makeInventory(7, ['emergency', 'icu', 'cardiology', 'oncology']),
  },
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
      { id: 'h-vall-hebron', name: "Hospital Vall d'Hebron", city: 'Barcelona', ccaa: 'Cataluña', beds: 1100, departments: ['emergency', 'icu', 'surgery', 'oncology'], inventory: makeInventory(11, ['emergency', 'icu', 'surgery', 'oncology']) },
      { id: 'h-clinic-bcn', name: 'Hospital Clínic de Barcelona', city: 'Barcelona', ccaa: 'Cataluña', beds: 850, departments: ['emergency', 'cardiology', 'surgery'], inventory: makeInventory(13, ['emergency', 'cardiology', 'surgery']) },
      { id: 'h-sant-pau', name: 'Hospital de la Santa Creu i Sant Pau', city: 'Barcelona', ccaa: 'Cataluña', beds: 700, departments: ['emergency', 'icu', 'pediatrics'], inventory: makeInventory(15, ['emergency', 'icu', 'pediatrics']) },
    ],
  },
  {
    id: 'andalucia',
    name: 'Andalucía',
    hospitals: [
      { id: 'h-virgen-rocio', name: 'Hospital Universitario Virgen del Rocío', city: 'Sevilla', ccaa: 'Andalucía', beds: 1400, departments: ['emergency', 'icu', 'surgery', 'cardiology'], inventory: makeInventory(21, ['emergency', 'icu', 'surgery', 'cardiology']) },
      { id: 'h-reina-sofia', name: 'Hospital Universitario Reina Sofía', city: 'Córdoba', ccaa: 'Andalucía', beds: 950, departments: ['emergency', 'oncology', 'surgery'], inventory: makeInventory(23, ['emergency', 'oncology', 'surgery']) },
    ],
  },
  {
    id: 'cv',
    name: 'Comunitat Valenciana',
    hospitals: [
      { id: 'h-la-fe', name: 'Hospital Universitari i Politècnic La Fe', city: 'Valencia', ccaa: 'Comunitat Valenciana', beds: 1000, departments: ['emergency', 'icu', 'pediatrics', 'oncology'], inventory: makeInventory(31, ['emergency', 'icu', 'pediatrics', 'oncology']) },
      { id: 'h-general-valencia', name: 'Hospital General Universitario de Valencia', city: 'Valencia', ccaa: 'Comunitat Valenciana', beds: 750, departments: ['emergency', 'surgery', 'cardiology'], inventory: makeInventory(33, ['emergency', 'surgery', 'cardiology']) },
    ],
  },
  {
    id: 'galicia',
    name: 'Galicia',
    hospitals: [
      { id: 'h-chuac', name: 'Complexo Hospitalario Universitario A Coruña', city: 'A Coruña', ccaa: 'Galicia', beds: 850, departments: ['emergency', 'icu', 'surgery'], inventory: makeInventory(41, ['emergency', 'icu', 'surgery']) },
    ],
  },
  {
    id: 'pv',
    name: 'País Vasco',
    hospitals: [
      { id: 'h-basurto', name: 'Hospital Universitario Basurto', city: 'Bilbao', ccaa: 'País Vasco', beds: 650, departments: ['emergency', 'cardiology', 'oncology'], inventory: makeInventory(51, ['emergency', 'cardiology', 'oncology']) },
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
