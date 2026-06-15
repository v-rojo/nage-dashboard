'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [s, setS] = useState({
    language: 'es',
    theme: 'light',
    criticalAlerts: true,
    lowStockAlerts: true,
    expirationAlerts: true,
    emailNotifications: false,
    smsNotifications: true,
    refreshInterval: '5',
    defaultHospital: 'h-la-paz',
    dataRetention: '90',
  })

  const toggle = (k: keyof typeof s) => setS(prev => ({ ...prev, [k]: !prev[k] }))

  function Toggle({ field }: { field: keyof typeof s }) {
    const on = Boolean(s[field])
    return (
      <button
        onClick={() => toggle(field)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${on ? 'bg-gray-900' : 'bg-gray-200'}`}
      >
        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${on ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Configuración del sistema y preferencias</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* General */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <h2 className="mb-4 text-sm font-semibold text-gray-800">🌍 General</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Idioma</p>
                  <p className="text-xs text-gray-400">Idioma de la interfaz</p>
                </div>
                <select value={s.language} onChange={e => setS(p => ({ ...p, language: e.target.value }))} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-900 focus:outline-none">
                  <option value="es">🇪🇸 Español</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="ca">🟡 Català</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Intervalo de actualización</p>
                  <p className="text-xs text-gray-400">Con qué frecuencia se actualizan los datos</p>
                </div>
                <select value={s.refreshInterval} onChange={e => setS(p => ({ ...p, refreshInterval: e.target.value }))} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-900 focus:outline-none">
                  <option value="1">1 minuto</option>
                  <option value="5">5 minutos</option>
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <h2 className="mb-4 text-sm font-semibold text-gray-800">🔔 Alertas de inventario</h2>
            <div className="space-y-4">
              {[
                { field: 'criticalAlerts' as const, label: 'Alertas críticas', desc: 'Stock por debajo del 60% del mínimo', badge: 'Recomendado' },
                { field: 'lowStockAlerts' as const, label: 'Stock bajo', desc: 'Stock por debajo del mínimo configurado', badge: null },
                { field: 'expirationAlerts' as const, label: 'Alertas de caducidad', desc: 'Suministros a menos de 30 días de caducidad', badge: null },
              ].map(({ field, label, desc, badge }) => (
                <div key={field} className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      {badge && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">{badge}</span>}
                    </div>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <Toggle field={field} />
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <h2 className="mb-4 text-sm font-semibold text-gray-800">📱 Notificaciones externas</h2>
            <div className="space-y-4">
              {[
                { field: 'emailNotifications' as const, label: 'Notificaciones por email', desc: 'Recibir alertas en el correo electrónico' },
                { field: 'smsNotifications' as const, label: 'Notificaciones por SMS', desc: 'Recibir alertas críticas por SMS' },
              ].map(({ field, label, desc }) => (
                <div key={field} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <Toggle field={field} />
                </div>
              ))}
            </div>
          </div>

          {/* Data */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <h2 className="mb-4 text-sm font-semibold text-gray-800">🗄️ Datos</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Retención de históricos</p>
                <p className="text-xs text-gray-400">Período de conservación de registros de inventario</p>
              </div>
              <select value={s.dataRetention} onChange={e => setS(p => ({ ...p, dataRetention: e.target.value }))} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-900 focus:outline-none">
                <option value="30">30 días</option>
                <option value="90">90 días</option>
                <option value="180">6 meses</option>
                <option value="365">1 año</option>
              </select>
            </div>
          </div>

          {/* Save */}
          <button className="w-full rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-soft">
            Guardar configuración
          </button>
        </div>
      </div>
    </div>
  )
}
