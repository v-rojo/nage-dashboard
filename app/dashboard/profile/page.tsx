'use client'

import { useState } from 'react'

type Role = 'doctor' | 'admin' | 'engineer'

const ROLE_CONFIG: Record<Role, { label: string; icon: string; color: string; perms: string[] }> = {
  doctor: {
    label: 'Doctor / Médico',
    icon: '👨‍⚕️',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    perms: ['Ver inventario de su departamento', 'Crear solicitudes de suministro', 'Ver alertas críticas', 'Ver histórico de consumo'],
  },
  admin: {
    label: 'Administrador',
    icon: '🏥',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    perms: ['Acceso completo al inventario', 'Gestionar solicitudes de suministro', 'Configurar alertas y umbrales', 'Ver reportes financieros', 'Gestionar usuarios', 'Dashboard general CCAA'],
  },
  engineer: {
    label: 'Ingeniero Biomédico',
    icon: '⚙️',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    perms: ['Ver equipamiento médico', 'Gestionar mantenimiento', 'Ver inventario técnico', 'Crear órdenes de reparación'],
  },
}

export default function ProfilePage() {
  const [role, setRole] = useState<Role>('admin')
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Dr. Elena García',
    email: 'e.garcia@lapaz.es',
    hospital: 'Hospital Universitario La Paz',
    department: 'Urgencias',
    employeeId: 'EMP-2024-0089',
    phone: '+34 91 207 1000',
  })
  const [draft, setDraft] = useState(profile)

  const cfg = ROLE_CONFIG[role]

  const save = () => { setProfile(draft); setEditing(false) }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500">Información y permisos de cuenta</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* Avatar & Role */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-soft">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl flex-shrink-0">
                {cfg.icon}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-500">{profile.email}</p>
                <span className={`mt-2 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${cfg.color}`}>
                  {cfg.icon} {cfg.label}
                </span>
              </div>
              <button
                onClick={() => { setDraft(profile); setEditing(true) }}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ✏️ Editar
              </button>
            </div>
          </div>

          {/* Role switcher */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Rol de acceso</h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {(Object.entries(ROLE_CONFIG) as [Role, typeof cfg][]).map(([key, c]) => (
                <button
                  key={key}
                  onClick={() => setRole(key)}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${role === key ? `${c.color} border-current` : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <p className="text-xs font-semibold">{c.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Permisos activos</h3>
            <ul className="space-y-2">
              {cfg.perms.map(p => (
                <li key={p} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500 font-bold">✓</span> {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Details */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Información profesional</h3>
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ['Hospital', profile.hospital],
                ['Departamento', profile.department],
                ['ID Empleado', profile.employeeId],
                ['Teléfono', profile.phone],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-gray-50 px-4 py-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{k}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-gray-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Edit drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(false)} />
          <div className="relative z-10 w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-base font-bold text-gray-900">Editar perfil</h3>
            <div className="space-y-3">
              {([['name', 'Nombre completo'], ['email', 'Email'], ['department', 'Departamento'], ['phone', 'Teléfono']] as const).map(([field, label]) => (
                <div key={field}>
                  <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
                  <input
                    value={draft[field]}
                    onChange={e => setDraft(d => ({ ...d, [field]: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setEditing(false)} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={save} className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
