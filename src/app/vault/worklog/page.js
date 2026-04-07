'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

const TODAY = new Date().toISOString().split('T')[0]

const WORK_TYPES = [
  { key: 'wfh',    label: 'Work From Home', short: 'WFH',    icon: '🏠', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  { key: 'office', label: 'Office',         short: 'Office', icon: '🏢', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  { key: 'extra',  label: 'Extra / OT',     short: 'Extra',  icon: '⏰', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
  { key: 'leave',  label: 'Leave',          short: 'Leave',  icon: '🏖️', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
]

function getType(key) { return WORK_TYPES.find(t => t.key === key) || WORK_TYPES[0] }

function getMonthRange() {
  const now = new Date()
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
    to:   new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
  }
}

function calcHours(inTime, outTime) {
  if (!inTime || !outTime) return null
  const [ih, im] = inTime.split(':').map(Number)
  const [oh, om] = outTime.split(':').map(Number)
  const diff = (oh * 60 + om) - (ih * 60 + im)
  if (diff <= 0) return null
  const h = Math.floor(diff / 60), m = diff % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function formatDate(d) {
  const yest = new Date(TODAY); yest.setDate(yest.getDate() - 1)
  const date = new Date(d)
  if (d === TODAY) return { primary: 'Today', secondary: date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }) }
  if (d === yest.toISOString().split('T')[0]) return { primary: 'Yesterday', secondary: date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }) }
  return {
    primary: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    secondary: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric' }),
  }
}

// ─── FORM ────────────────────────────────────────────────────────────────────
function WorkLogForm({ onSave, onClose, existing }) {
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
    if (res.ok) { onSave(await res.json()); onClose() }
    else { const d = await res.json(); setErr(d.error || 'Failed') }
    setSaving(false)
  }

  const hours = calcHours(form.in_time, form.out_time)
  const type = getType(form.work_type)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

        {/* Mobile handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-slate-800 font-bold text-lg">💼 {existing ? 'Edit' : 'Log'} Work Day</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 text-sm transition-colors">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Date */}
          <div>
            <label className="text-slate-400 text-xs font-medium mb-1 block">Date</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
              className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400" />
          </div>

          {/* Work type */}
          <div>
            <label className="text-slate-400 text-xs font-medium mb-2 block">Type</label>
            <div className="grid grid-cols-4 gap-2">
              {WORK_TYPES.map(t => (
                <button key={t.key} onClick={() => set('work_type', t.key)}
                  className="flex flex-col items-center py-3 px-1 rounded-xl border-2 text-xs font-semibold transition-all"
                  style={form.work_type === t.key
                    ? { borderColor: t.color, backgroundColor: t.bg }
                    : { borderColor: '#f1f5f9', color: '#cbd5e1' }}>
                  <span className="text-xl mb-1">{t.icon}</span>
                  <span style={{ color: form.work_type === t.key ? t.color : '#94a3b8' }}>{t.short}</span>
                </button>
              ))}
            </div>
          </div>

          {/* In / Out */}
          {form.work_type !== 'leave' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1 block">In Time</label>
                <input type="time" value={form.in_time} onChange={e => set('in_time', e.target.value)}
                  className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400" />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1 block">Out Time</label>
                <input type="time" value={form.out_time} onChange={e => set('out_time', e.target.value)}
                  className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400" />
              </div>
            </div>
          )}

          {hours && (
            <div className="flex items-center gap-2 -mt-2 px-1">
              <span className="text-emerald-500 text-xs">⏱</span>
              <span className="text-emerald-600 text-xs font-semibold">{hours} logged</span>
            </div>
          )}

          {/* Work done */}
          <div>
            <label className="text-slate-400 text-xs font-medium mb-1 block">Work Done</label>
            <textarea
              placeholder="Tasks completed, meetings attended, PRs merged, things learned..."
              value={form.work_done}
              onChange={e => set('work_done', e.target.value)}
              rows={4}
              className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400 resize-none leading-relaxed placeholder-slate-300"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="text-slate-400 text-xs font-medium mb-1 block">Remarks (optional)</label>
            <input type="text" placeholder="Blockers, feedback, anything notable..."
              value={form.remarks} onChange={e => set('remarks', e.target.value)}
              className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400" />
          </div>

          {err && <p className="text-red-500 text-sm">{err}</p>}

          <button onClick={submit} disabled={saving}
            className="w-full py-3.5 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-50 text-sm"
            style={{ backgroundColor: type.color }}>
            {saving ? 'Saving...' : `Save ${type.label} Log`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function WorkLogPage() {
  const { from: defaultFrom, to: defaultTo } = getMonthRange()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filters, setFilters] = useState({ from: defaultFrom, to: defaultTo })

  async function fetchLogs() {
    setLoading(true)
    const p = new URLSearchParams()
    if (filters.from) p.set('from', filters.from)
    if (filters.to) p.set('to', filters.to)
    const res = await fetch(`/api/vault/worklog?${p}`)
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

  const stats = useMemo(() => ({
    wfh:    logs.filter(l => l.work_type === 'wfh').length,
    office: logs.filter(l => l.work_type === 'office').length,
    extra:  logs.filter(l => l.work_type === 'extra').length,
    leave:  logs.filter(l => l.work_type === 'leave').length,
  }), [logs])

  // total hours this period
  const totalHours = useMemo(() => {
    let mins = 0
    logs.forEach(l => {
      if (!l.in_time || !l.out_time) return
      const [ih, im] = l.in_time.split(':').map(Number)
      const [oh, om] = l.out_time.split(':').map(Number)
      const diff = (oh * 60 + om) - (ih * 60 + im)
      if (diff > 0) mins += diff
    })
    if (!mins) return null
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
  }, [logs])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen" style={{ background: '#f8fafc' }}>

        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-100">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/vault/dashboard"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-sm transition-colors">
                ←
              </Link>
              <h1 className="text-slate-800 font-bold text-lg">💼 Work Log</h1>
            </div>
            <button onClick={() => { setEditing(null); setShowForm(true) }}
              className="bg-violet-500 hover:bg-violet-400 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
              + Log Day
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

          {/* Date filter */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1 block">From</label>
                <input type="date" value={filters.from}
                  onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
                  className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-400" />
              </div>
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1 block">To</label>
                <input type="date" value={filters.to}
                  onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
                  className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-400" />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {WORK_TYPES.map(t => (
              <div key={t.key} className="rounded-2xl border p-3 text-center"
                style={{ background: t.bg, borderColor: t.border }}>
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="font-bold text-lg leading-none" style={{ color: t.color }}>
                  {stats[t.key]}
                </div>
                <div className="text-xs font-medium mt-0.5" style={{ color: t.color + 'aa' }}>
                  {t.short}
                </div>
              </div>
            ))}
          </div>

          {/* Total hours badge */}
          {totalHours && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 flex items-center justify-between">
              <span className="text-emerald-700 text-sm font-medium">⏱ Total tracked hours</span>
              <span className="text-emerald-700 font-bold text-sm">{totalHours}</span>
            </div>
          )}

          {/* Log list */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 h-24 animate-pulse" />
              ))}
            </div>
          ) : !logs.length ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">💼</p>
              <p className="text-slate-400 text-sm">No work logs yet.</p>
              <button onClick={() => setShowForm(true)}
                className="mt-3 text-violet-500 text-sm font-semibold hover:underline">
                Log today's work
              </button>
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {logs.map(log => {
                const type = getType(log.work_type)
                const hours = calcHours(log.in_time, log.out_time)
                const { primary, secondary } = formatDate(log.date)
                return (
                  <div key={log.id}
                    className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm rounded-2xl p-4 group transition-all">

                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ backgroundColor: type.bg }}>
                          {type.icon}
                        </div>
                        {/* Date + meta */}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-slate-800 font-bold text-sm">{primary}</span>
                            <span className="text-slate-400 text-xs">{secondary}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{ backgroundColor: type.bg, color: type.color, border: `1px solid ${type.border}` }}>
                              {type.label}
                            </span>
                            {log.in_time && log.out_time && (
                              <span className="text-slate-400 text-xs">
                                {log.in_time.slice(0, 5)} → {log.out_time.slice(0, 5)}
                                {hours && (
                                  <span className="text-emerald-500 font-semibold ml-1">({hours})</span>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Edit / Delete — appear on hover */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                        <button
                          onClick={() => { setEditing(log); setShowForm(true) }}
                          className="text-xs text-slate-400 hover:text-blue-500 font-medium transition-colors">
                          Edit
                        </button>
                        <button
                          onClick={() => deleteLog(log.id)}
                          className="text-xs text-slate-400 hover:text-red-400 font-medium transition-colors">
                          Del
                        </button>
                      </div>
                    </div>

                    {/* Work done */}
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                      {log.work_done}
                    </p>

                    {/* Remarks */}
                    {log.remarks && (
                      <div className="mt-3 pt-3 border-t border-slate-50 flex items-start gap-2">
                        <span className="text-slate-300 text-xs mt-0.5">📝</span>
                        <p className="text-slate-400 text-xs leading-relaxed">{log.remarks}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <WorkLogForm
          existing={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </>
  )
}