'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

const TODAY = new Date().toISOString().split('T')[0]

const WORK_TYPES = [
  { key: 'wfh',    label: 'Work From Home', icon: '🏠', color: '#3b82f6' },
  { key: 'office', label: 'Office',         icon: '🏢', color: '#8b5cf6' },
  { key: 'extra',  label: 'Extra / OT',     icon: '⏰', color: '#f97316' },
  { key: 'leave',  label: 'Leave',          icon: '🏖️', color: '#10b981' },
]

function getTypeConfig(key) {
  return WORK_TYPES.find(t => t.key === key) || WORK_TYPES[0]
}

function getMonthRange() {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  return { from, to }
}

function calcHours(inTime, outTime) {
  if (!inTime || !outTime) return null
  const [ih, im] = inTime.split(':').map(Number)
  const [oh, om] = outTime.split(':').map(Number)
  const diff = (oh * 60 + om) - (ih * 60 + im)
  if (diff <= 0) return null
  const h = Math.floor(diff / 60)
  const m = diff % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function AddWorkLogForm({ onSave, onClose, existing }) {
  const [form, setForm] = useState({
    date: TODAY, work_type: 'office', in_time: '', out_time: '', work_done: '', remarks: '',
    ...existing
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function submit() {
    if (!form.work_done.trim()) { setErr('Describe what you did today'); return }
    setSaving(true); setErr('')
    const res = await fetch('/api/vault/worklog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) { const d = await res.json(); onSave(d); onClose() }
    else { const d = await res.json(); setErr(d.error || 'Failed') }
    setSaving(false)
  }

  const hours = calcHours(form.in_time, form.out_time)
  const type = getTypeConfig(form.work_type)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">💼 Log Work Day</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-5 space-y-4">

          {/* Date */}
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Date</label>
            <input type="date" value={form.date}
              onChange={e => set('date', e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Work type */}
          <div>
            <label className="text-gray-500 text-xs mb-1.5 block">Type</label>
            <div className="grid grid-cols-4 gap-2">
              {WORK_TYPES.map(t => (
                <button key={t.key}
                  onClick={() => set('work_type', t.key)}
                  className={`py-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                    form.work_type === t.key ? 'border-transparent' : 'border-gray-800 text-gray-500 hover:border-gray-700'
                  }`}
                  style={form.work_type === t.key ? { backgroundColor: t.color + '22', borderColor: t.color } : {}}
                >
                  <span className="text-base">{t.icon}</span>
                  <span style={form.work_type === t.key ? { color: t.color } : {}}>{t.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* In / Out time */}
          {form.work_type !== 'leave' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-500 text-xs mb-1 block">In Time</label>
                <input type="time" value={form.in_time}
                  onChange={e => set('in_time', e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs mb-1 block">Out Time</label>
                <input type="time" value={form.out_time}
                  onChange={e => set('out_time', e.target.value)}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
          {hours && (
            <p className="text-xs text-green-400 -mt-2">⏱ {hours} logged</p>
          )}

          {/* Work done */}
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Work Done</label>
            <textarea
              placeholder="What did you accomplish today? Tasks completed, meetings attended, PRs merged..."
              value={form.work_done}
              onChange={e => set('work_done', e.target.value)}
              rows={4}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Remarks (optional)</label>
            <input type="text"
              placeholder="Any blockers, feedback, notes..."
              value={form.remarks}
              onChange={e => set('remarks', e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {err && <p className="text-red-400 text-sm">{err}</p>}

          <button onClick={submit} disabled={saving}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: type.color }}
          >
            {saving ? 'Saving...' : `Save ${type.label} Log`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WorkLogPage() {
  const { from: defaultFrom, to: defaultTo } = getMonthRange()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filters, setFilters] = useState({ from: defaultFrom, to: defaultTo })

  async function fetchLogs() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.from) params.set('from', filters.from)
    if (filters.to) params.set('to', filters.to)
    const res = await fetch(`/api/vault/worklog?${params}`)
    if (res.ok) setLogs(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchLogs() }, [filters])

  async function deleteLog(id) {
    if (!confirm('Delete this log?')) return
    await fetch(`/api/vault/worklog?id=${id}`, { method: 'DELETE' })
    setLogs(prev => prev.filter(l => l.id !== id))
  }

  function handleSave(entry) {
    setLogs(prev => {
      const idx = prev.findIndex(l => l.id === entry.id)
      if (idx >= 0) { const n = [...prev]; n[idx] = entry; return n }
      return [entry, ...prev]
    })
  }

  const stats = useMemo(() => {
    const wfh    = logs.filter(l => l.work_type === 'wfh').length
    const office = logs.filter(l => l.work_type === 'office').length
    const extra  = logs.filter(l => l.work_type === 'extra').length
    const leave  = logs.filter(l => l.work_type === 'leave').length
    return { wfh, office, extra, leave, total: logs.length }
  }, [logs])

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/vault/dashboard" className="text-gray-600 hover:text-white text-sm transition-colors">← Back</Link>
            <h1 className="text-white font-bold text-xl">💼 Work Log</h1>
          </div>
          <button onClick={() => { setEditing(null); setShowForm(true) }}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            + Log Day
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs mb-1 block">From</label>
              <input type="date" value={filters.from}
                onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">To</label>
              <input type="date" value={filters.to}
                onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {WORK_TYPES.map(t => {
            const count = logs.filter(l => l.work_type === t.key).length
            return (
              <div key={t.key} className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center">
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-white font-bold text-lg">{count}</div>
                <div className="text-gray-500 text-xs">{t.label.split(' ')[0]}</div>
              </div>
            )
          })}
        </div>

        {/* Logs */}
        {loading ? (
          <div className="text-center py-16 text-gray-600">Loading...</div>
        ) : !logs.length ? (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-3">💼</p>
            <p>No work logs yet.</p>
            <button onClick={() => setShowForm(true)} className="mt-3 text-purple-400 text-sm hover:underline">Log today's work</button>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map(log => {
              const type = getTypeConfig(log.work_type)
              const hours = calcHours(log.in_time, log.out_time)
              return (
                <div key={log.id}
                  className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-4 group transition-all">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ backgroundColor: type.color + '22' }}>
                        {type.icon}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{formatDate(log.date)}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: type.color + '22', color: type.color }}>
                            {type.label}
                          </span>
                          {log.in_time && log.out_time && (
                            <span className="text-gray-500 text-xs">
                              {log.in_time.slice(0,5)} → {log.out_time.slice(0,5)}
                              {hours && <span className="text-green-500 ml-1">({hours})</span>}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditing(log); setShowForm(true) }}
                        className="text-gray-500 hover:text-blue-400 text-xs transition-colors">Edit</button>
                      <button onClick={() => deleteLog(log.id)}
                        className="text-gray-500 hover:text-red-400 text-xs transition-colors">Delete</button>
                    </div>
                  </div>

                  {/* Work done */}
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{log.work_done}</p>

                  {/* Remarks */}
                  {log.remarks && (
                    <p className="text-gray-500 text-xs mt-2 border-t border-gray-800 pt-2">
                      📝 {log.remarks}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && (
        <AddWorkLogForm
          existing={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}