/**
 * Mock Data: Inventory Items
 * 
 * In the MVP phase, we use mock data to avoid database setup.
 * This allows rapid prototyping and testing of Claude AI integration.
 * 
 * Transition to real database:
 * 1. Create Firebase/MongoDB schema
 * 2. Replace generateInventory() with database query
 * 3. Keep this file for testing and seeds
 */

import { InventoryItem, Alert, AIRecommendation } from '@/lib/types'

export function generateInventory(): InventoryItem[] {
  return [
    {
      id: 'inv-001',
      name: 'Epinephrine Auto-Injector',
      sku: 'EPI-001-A',
      category: 'Emergency Medication',
      department: 'emergency',
      quantity: 12,
      minStock: 20,
      maxStock: 50,
      unit: 'units',
      price: 89.99,
      expirationDate: '2026-08-15',
      supplier: 'MedSupply Direct',
      consumptionRate: 3.2,
      aiPredictedDemand: 22,
      status: 'critical',
    },
    {
      id: 'inv-002',
      name: 'Surgical Gloves (Sterile)',
      sku: 'SG-200-L',
      category: 'PPE',
      department: 'surgery',
      quantity: 450,
      minStock: 200,
      maxStock: 1000,
      unit: 'pairs',
      price: 2.45,
      expirationDate: '2027-01-30',
      supplier: 'SterileTech',
      consumptionRate: 85,
      aiPredictedDemand: 600,
      status: 'healthy',
    },
    {
      id: 'inv-003',
      name: 'Fentanyl Citrate 100mcg',
      sku: 'FEN-100-V',
      category: 'Controlled Substance',
      department: 'icu',
      quantity: 8,
      minStock: 15,
      maxStock: 40,
      unit: 'vials',
      price: 14.50,
      expirationDate: '2026-05-20',
      supplier: 'PharmaCorp',
      consumptionRate: 2.8,
      aiPredictedDemand: 20,
      status: 'critical',
    },
    {
      id: 'inv-004',
      name: 'Examination Gloves (Nitrile)',
      sku: 'EG-300-M',
      category: 'PPE',
      department: 'cardiology',
      quantity: 1200,
      minStock: 500,
      maxStock: 800,
      unit: 'pieces',
      price: 0.12,
      expirationDate: '2028-12-01',
      supplier: 'GloveWorld',
      consumptionRate: 200,
      aiPredictedDemand: 1400,
      status: 'overstocked',
    },
  ]
}

export function generateAlerts(): Alert[] {
  return [
    {
      id: 'alert-001',
      type: 'stock',
      severity: 'critical',
      title: 'Critical Stock Level: Epinephrine',
      description: 'Emergency department epinephrine stock is critically low',
      itemId: 'inv-001',
      department: 'emergency',
      timestamp: new Date().toISOString(),
      acknowledged: false,
      suggestedAction: 'Order 30 units immediately from MedSupply Direct',
    },
  ]
}

export function generateRecommendations(): AIRecommendation[] {
  return [
    {
      id: 'rec-001',
      title: 'Reorder Epinephrine Immediately',
      description: 'AI predicts stockout in 3.8 days at current consumption rate',
      impact: 'high',
      confidence: 0.92,
      type: 'reorder',
    },
  ]
}
