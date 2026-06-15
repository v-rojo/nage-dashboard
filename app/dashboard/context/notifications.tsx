'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Notification {
  id: string
  type: 'supply_request' | 'critical_alert' | 'info'
  title: string
  message: string
  fromHospital: string
  toHospital: string
  item: string
  quantity: number
  urgency: 'critical' | 'high' | 'medium' | 'low'
  timestamp: string
  read: boolean
}

interface NotificationsContextValue {
  notifications: Notification[]
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  unreadCount: number
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n-001',
      type: 'supply_request',
      title: 'Solicitud de suministro urgente',
      message: 'H. La Paz solicita Epinephrine Auto-Injector',
      fromHospital: 'Hospital Universitario La Paz',
      toHospital: 'Hospital General Universitario Gregorio Marañón',
      item: 'Epinephrine Auto-Injector',
      quantity: 20,
      urgency: 'critical',
      timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
      read: false,
    },
  ])

  const addNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [
      {
        ...n,
        id: `n-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ])
  }

  const markRead = (id: string) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, markRead, markAllRead, unreadCount }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used inside NotificationsProvider')
  return ctx
}
