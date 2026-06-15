'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Home,
  Globe,
  Building2,
  Package,
  Bell,
  User,
  Settings,
  Network,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useNotifications } from '../context/notifications'

const NAV_TOP = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/dashboard/general', icon: Globe, label: 'Dashboard General', sub: 'Todos los hospitales' },
  { href: '/dashboard', icon: Building2, label: 'Main Dashboard', sub: 'Mi hospital' },
  { href: '/dashboard/supply-request', icon: Package, label: 'Supply Request', sub: 'Solicitar suministro', badge: true },
]

const NAV_BOTTOM = [
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

const URGENCY_DOT: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-amber-500',
  medium: 'bg-yellow-400',
  low: 'bg-green-500',
}

function timeAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.round(diff / 60)}m`
  return `${Math.round(diff / 3600)}h`
}

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname()
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const [showNotif, setShowNotif] = useState(false)
  const [ip, setIp] = useState('192.168.1.42')

  useEffect(() => {
    const octets = [10, 0, Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
    setIp(octets.join('.'))
  }, [])

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  return (
    <>
      {showNotif && (
        <div className="fixed inset-0 z-30" onClick={() => setShowNotif(false)} />
      )}

      <aside
        className={`relative flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-gray-100 px-3">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">NAGE</span>
              <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                v2
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <ChevronRight className="h-4 w-4" />
              : <ChevronLeft className="h-4 w-4" />
            }
          </button>
        </div>

        {/* Top nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {NAV_TOP.map(item => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm transition-all ${
                  active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-tight">{item.label}</p>
                    {'sub' in item && item.sub && (
                      <p className={`text-[10px] leading-tight mt-0.5 ${active ? 'text-gray-300' : 'text-gray-400'}`}>
                        {item.sub}
                      </p>
                    )}
                  </div>
                )}
                {'badge' in item && item.badge && unreadCount > 0 && (
                  <span className={`flex-shrink-0 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none px-1.5 py-0.5 ${collapsed ? 'absolute -top-1 -right-1' : ''}`}>
                    {unreadCount}
                  </span>
                )}
                {collapsed && active && (
                  <span className="absolute right-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-l-full bg-gray-900" />
                )}
              </Link>
            )
          })}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(v => !v)}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm transition-all ${
                showNotif ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={collapsed ? 'Notificaciones' : undefined}
            >
              <Bell className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-medium leading-tight">Notificaciones</p>
                  {unreadCount > 0 && (
                    <p className="text-[10px] leading-tight mt-0.5 text-amber-600">{unreadCount} sin leer</p>
                  )}
                </div>
              )}
              {unreadCount > 0 && (
                <span className={`flex-shrink-0 rounded-full bg-amber-500 text-white text-[10px] font-bold leading-none px-1.5 py-0.5 ${collapsed ? 'absolute -top-1 -right-1' : ''}`}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div
                className="absolute left-full top-0 z-40 ml-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">Notificaciones</p>
                  <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700">
                    Marcar todo como leido
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 && (
                    <p className="px-4 py-6 text-center text-xs text-gray-400">Sin notificaciones</p>
                  )}
                  {notifications.map(n => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-amber-50/50' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${URGENCY_DOT[n.urgency]}`} />
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{n.message}</p>
                          <p className="mt-1 text-[10px] text-gray-400">
                            {n.fromHospital} &middot; {timeAgo(n.timestamp)} atras
                          </p>
                        </div>
                        {!n.read && (
                          <span className="flex-shrink-0 rounded-full bg-amber-400 h-1.5 w-1.5 mt-1.5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Divider */}
        <div className="mx-3 border-t border-gray-100" />

        {/* Bottom nav */}
        <nav className="space-y-0.5 px-2 py-3">
          {NAV_BOTTOM.map(item => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm transition-all ${
                  active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            )
          })}

          {/* IP Address */}
          <div
            className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 ${collapsed ? 'justify-center' : ''}`}
            title="IP de red local"
          >
            <Network className="h-4 w-4 flex-shrink-0 text-gray-400" />
            {!collapsed && (
              <div>
                <p className="text-[10px] text-gray-400 leading-none">IP Local</p>
                <p className="text-xs font-mono font-semibold text-gray-700 mt-0.5">{ip}</p>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  )
}
