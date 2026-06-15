'use client'

import { useState, useRef, useEffect } from 'react'
import { MADRID_HOSPITALS } from '@/lib/mock-data/hospitals'
import { useNotifications } from '../context/notifications'

const ITEMS = [
  'Epinephrine Auto-Injector',
  'Surgical Gloves (Sterile)',
  'Fentanyl Citrate 100mcg',
  'Nitrile Exam Gloves',
  'IV Saline 0.9% 500ml',
  'Morphine Sulfate 10mg',
  'Disposable Syringes 10ml',
  'Blood Glucose Test Strips',
  'Amoxicillin 500mg Capsules',
  'Ibuprofen 400mg Tablets',
  'Insulin Regular 100U/ml',
  'Sterile Gauze Pads 4x4',
]

const URGENCY_OPTIONS = [
  { value: 'critical', label: '🔴 Crítico', desc: 'Necesario en menos de 2 horas', color: 'border-red-300 bg-red-50 text-red-700' },
  { value: 'high',     label: '🟠 Alto',    desc: 'Necesario hoy',                color: 'border-amber-300 bg-amber-50 text-amber-700' },
  { value: 'medium',   label: '🟡 Medio',   desc: 'Necesario en 1-3 días',        color: 'border-yellow-300 bg-yellow-50 text-yellow-700' },
  { value: 'low',      label: '🟢 Bajo',    desc: 'Reposición planificada',       color: 'border-green-300 bg-green-50 text-green-700' },
]

type ScanState = 'idle' | 'scanning' | 'success'

function QRScanner({ onScan }: { onScan: (data: string) => void }) {
  const [state, setState] = useState<ScanState>('idle')
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startScan = () => {
    setState('scanning')
    setProgress(0)
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(intervalRef.current!)
          setState('success')
          onScan('EPI-001-A | Epinephrine Auto-Injector | Lot: L2024-889 | Exp: 2026-08-15')
          return 100
        }
        return p + 4
      })
    }, 80)
  }

  const reset = () => {
    clearInterval(intervalRef.current!)
    setState('idle')
    setProgress(0)
  }

  useEffect(() => () => clearInterval(intervalRef.current!), [])

  return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Escáner QR / Código de barras
      </p>

      {state === 'idle' && (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl border-2 border-gray-200 bg-white text-5xl shadow-inner">
            📷
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Escanear etiqueta del producto</p>
            <p className="text-xs text-gray-400 mt-1">Apunta la cámara al código QR o de barras del suministro</p>
          </div>
          <button
            onClick={startScan}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            <span>📷</span> Activar cámara
          </button>
        </div>
      )}

      {state === 'scanning' && (
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Simulated camera viewfinder */}
          <div className="relative h-40 w-64 overflow-hidden rounded-xl bg-gray-900">
            {/* Corner brackets */}
            <div className="absolute left-2 top-2 h-5 w-5 border-l-2 border-t-2 border-green-400" />
            <div className="absolute right-2 top-2 h-5 w-5 border-r-2 border-t-2 border-green-400" />
            <div className="absolute bottom-2 left-2 h-5 w-5 border-b-2 border-l-2 border-green-400" />
            <div className="absolute bottom-2 right-2 h-5 w-5 border-b-2 border-r-2 border-green-400" />
            {/* Scanning line */}
            <div
              className="absolute left-3 right-3 h-0.5 bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.6)] transition-none"
              style={{ top: `${progress}%` }}
            />
            {/* Fake camera noise */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded bg-white"
                  style={{
                    width: `${8 + (i * 13) % 20}px`,
                    height: `${4 + (i * 7) % 10}px`,
                    left: `${(i * 19) % 80}%`,
                    top: `${(i * 31) % 80}%`,
                    opacity: 0.3 + (i % 3) * 0.2,
                  }}
                />
              ))}
            </div>
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <span className="text-[10px] text-green-400 font-mono">ESCANEANDO...</span>
            </div>
          </div>

          <div className="w-64">
            <div className="mb-1 flex justify-between text-xs text-gray-500">
              <span>Procesando imagen</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Cancelar
          </button>
        </div>
      )}

      {state === 'success' && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✅
          </div>
          <p className="text-sm font-semibold text-green-700">Código leído correctamente</p>
          <div className="w-full rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-xs font-mono text-green-800 break-all">
              EPI-001-A | Epinephrine Auto-Injector<br />
              Lot: L2024-889 | Exp: 2026-08-15
            </p>
          </div>
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Escanear otro
          </button>
        </div>
      )}
    </div>
  )
}

export default function SupplyRequestPage() {
  const { addNotification } = useNotifications()

  const [form, setForm] = useState({
    fromHospital: MADRID_HOSPITALS[0].id,
    toHospital: MADRID_HOSPITALS[1].id,
    item: '',
    quantity: '',
    urgency: 'high' as 'critical' | 'high' | 'medium' | 'low',
    notes: '',
    scannedCode: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fromH = MADRID_HOSPITALS.find(h => h.id === form.fromHospital)!
  const toH = MADRID_HOSPITALS.find(h => h.id === form.toHospital)!

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.item) e.item = 'Selecciona un suministro'
    if (!form.quantity || Number(form.quantity) <= 0) e.quantity = 'Indica una cantidad válida'
    if (form.fromHospital === form.toHospital) e.toHospital = 'El hospital de destino debe ser diferente'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})

    addNotification({
      type: 'supply_request',
      title: `Solicitud de suministro — ${URGENCY_OPTIONS.find(u => u.value === form.urgency)?.label}`,
      message: `${fromH.name} solicita ${form.quantity} unidades de ${form.item}`,
      fromHospital: fromH.name,
      toHospital: toH.name,
      item: form.item,
      quantity: Number(form.quantity),
      urgency: form.urgency,
    })

    setSubmitted(true)
  }

  const reset = () => {
    setForm({ fromHospital: MADRID_HOSPITALS[0].id, toHospital: MADRID_HOSPITALS[1].id, item: '', quantity: '', urgency: 'high', notes: '', scannedCode: '' })
    setSubmitted(false)
  }

  if (submitted) {
    const urgencyOpt = URGENCY_OPTIONS.find(u => u.value === form.urgency)!
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-lg font-bold text-gray-900">Supply Request</h1>
          <p className="text-sm text-gray-500">Solicitud de suministro entre hospitales</p>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                ✅
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">Solicitud enviada</h2>
            <p className="mb-6 text-sm text-gray-500">
              La alarma ha sido enviada a <strong>{toH.name}</strong> y está pendiente de aprobación.
            </p>

            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">De</span>
                <span className="font-medium text-gray-900 text-right max-w-[60%]">{fromH.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Para</span>
                <span className="font-medium text-gray-900 text-right max-w-[60%]">{toH.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Suministro</span>
                <span className="font-medium text-gray-900">{form.item}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cantidad</span>
                <span className="font-medium text-gray-900">{form.quantity} unidades</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Urgencia</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${urgencyOpt.color}`}>
                  {urgencyOpt.label}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Nueva solicitud
              </button>
              <a
                href="/dashboard"
                className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Ir al dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-bold text-gray-900">Supply Request</h1>
        <p className="text-sm text-gray-500">Solicitar suministro urgente a otro hospital</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Hospitals */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
              <h2 className="mb-4 text-sm font-semibold text-gray-800">🏥 Hospitales</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Hospital solicitante (origen)</label>
                  <select
                    value={form.fromHospital}
                    onChange={e => setForm(f => ({ ...f, fromHospital: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  >
                    {MADRID_HOSPITALS.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Hospital receptor (destino)</label>
                  <select
                    value={form.toHospital}
                    onChange={e => setForm(f => ({ ...f, toHospital: e.target.value }))}
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 ${errors.toHospital ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-gray-400'}`}
                  >
                    {MADRID_HOSPITALS.map(h => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                  {errors.toHospital && <p className="mt-1 text-xs text-red-500">{errors.toHospital}</p>}
                </div>
              </div>

              {/* Route indicator */}
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3">
                <span className="max-w-[38%] truncate text-xs font-medium text-gray-700">{fromH.name}</span>
                <span className="flex-1 text-center text-gray-300">→→→→→→→→</span>
                <span className="max-w-[38%] truncate text-right text-xs font-medium text-gray-700">{toH.name}</span>
              </div>
            </div>

            {/* QR Scanner */}
            <QRScanner
              onScan={data => {
                const name = data.split('|')[1]?.trim()
                if (name) setForm(f => ({ ...f, item: name, scannedCode: data }))
              }}
            />

            {/* Item & Quantity */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
              <h2 className="mb-4 text-sm font-semibold text-gray-800">📦 Suministro solicitado</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Suministro</label>
                  <select
                    value={form.item}
                    onChange={e => setForm(f => ({ ...f, item: e.target.value }))}
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 ${errors.item ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-gray-400'}`}
                  >
                    <option value="">Seleccionar suministro...</option>
                    {ITEMS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  {errors.item && <p className="mt-1 text-xs text-red-500">{errors.item}</p>}
                  {form.scannedCode && (
                    <p className="mt-1.5 flex items-center gap-1 text-[10px] text-green-600">
                      <span>✅</span> Rellenado por QR scan
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Cantidad solicitada</label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    placeholder="Ej: 20"
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 ${errors.quantity ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 bg-gray-50 focus:border-gray-400 focus:ring-gray-400'}`}
                  />
                  {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600">Unidad</label>
                  <input
                    type="text"
                    value="unidades"
                    readOnly
                    className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Urgency */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
              <h2 className="mb-4 text-sm font-semibold text-gray-800">⚡ Nivel de urgencia</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {URGENCY_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-all ${
                      form.urgency === opt.value
                        ? opt.color + ' border-opacity-100'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={opt.value}
                      checked={form.urgency === opt.value}
                      onChange={() => setForm(f => ({ ...f, urgency: opt.value as typeof form.urgency }))}
                      className="sr-only"
                    />
                    <div>
                      <p className="text-sm font-semibold">{opt.label}</p>
                      <p className="text-xs opacity-75">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
              <h2 className="mb-3 text-sm font-semibold text-gray-800">📝 Notas adicionales</h2>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Razón clínica de la solicitud, instrucciones especiales de transporte, etc."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-gray-900 px-6 py-3.5 text-base font-semibold text-white hover:bg-gray-800 transition-colors shadow-soft"
            >
              🚨 Enviar alarma al hospital receptor
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
