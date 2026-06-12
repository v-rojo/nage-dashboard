export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  department: string
  quantity: number
  minStock: number
  maxStock: number
  unit: string
  price: number
  expirationDate: string
  supplier: string
  consumptionRate: number
  aiPredictedDemand: number
  status: 'critical' | 'low' | 'healthy' | 'overstocked'
}

export interface Alert {
  id: string
  type: 'stock' | 'expiration' | 'overstock'
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  itemId: string
  department: string
  timestamp: string
  acknowledged: boolean
  suggestedAction: string
}

export interface AIRecommendation {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  type: 'reorder' | 'reduce' | 'redistribute' | 'dispose'
}
