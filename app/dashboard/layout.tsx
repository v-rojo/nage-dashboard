'use client'

import { useState } from 'react'
import { NotificationsProvider } from './context/notifications'
import { Sidebar } from './components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <NotificationsProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </NotificationsProvider>
  )
}
