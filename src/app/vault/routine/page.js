'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

const TODAY = new Date().toISOString().split('T')[0]

function formatDateHeader(d) {
  const date = new Date(d)
  const yest = new Date(TODAY); yest.setDate(yest.getDate() - 1)
  if (d === TODAY) return { label: 'Today', sub: date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) }
  if (d === yest.toISOString().split('T')[0]) return { label: 'Yesterday', sub: date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) }
  return {
    label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    sub: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric' }),
  }
}

export default function RoutinePage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [date, setDate] = useState(TODAY)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState('today')

  async function fetchEntries() {
    setLoading(true)
    const p = new URLSearchParams()
    if (viewMode === 'today') { p.set('from', TODAY); p.set('to', TODAY) }
    const res = await fetch(`/api/vault/routine?${p}`)
    if (res.ok) setEntries(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchEntries() }, [viewMode])

  async function addEntry() {
    if (!input.trim()) return
    setSaving(true)
    const res = await fetch('/api/vault/routine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: viewMode === 'today' ? TODAY : date, entry: input.trim() })
    })
    if (res.ok) {
      const data = await res.json()
      setEntries(prev => {
        // insert in correct position by date
        const updated = [data, ...prev]
        return updated.sort((a, b) => b.date.localeCompare(a.date) || new Date(b.created_at) - new Date(a.created_at))
      })
      setInput('')
    }
    setSaving(false)
  }

  async function deleteEntry(id) {
    await fetch(`/api/vault/routine?id=${id}`, { method: 'DELETE' })
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const grouped = useMemo(() => {
    const map = {}
    entries.forEach(e => { if (!map[e.date]) map[e.date] = []; map[e.date].push(e) })
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
  }, [entries])

  const todayCount = entries.filter(e => e.date === TODAY).length

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
              <h1 className="text-slate-800 font-bold text-lg">📅 Daily Routine</h1>
            </div>
            {/* Toggle */}
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
              {[['today', 'Today'], ['all', 'All Days']].map(([m, label]) => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === m ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">

          {/* Input card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-lg shrink-0">📝</div>
              <div>
                <p className="text-slate-700 font-semibold text-sm">What did you do?</p>
                <p className="text-slate-400 text-xs mt-0.5">Add anything — tasks, places, people, learnings</p>
              </div>
            </div>

            {/* Date picker only in All Days mode */}
            {viewMode === 'all' && (
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1 block">For date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-400" />
              </div>
            )}

            <textarea
              placeholder={`e.g. Went to office. Had standup at 10am. Finished the login module. Met Rahul for dinner.`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) addEntry() }}
              rows={3}
              className="w-full bg-slate-50 text-slate-700 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-300 resize-none leading-relaxed placeholder-slate-300 transition-colors"
            />

            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-xs">Ctrl+Enter to save</span>
              <button onClick={addEntry} disabled={saving || !input.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all">
                {saving ? 'Saving...' : '+ Add'}
              </button>
            </div>
          </div>

          {/* Today count pill */}
          {viewMode === 'today' && todayCount > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-slate-400 text-xs font-medium px-3 py-1 bg-white rounded-full border border-slate-100">
                {todayCount} {todayCount === 1 ? 'entry' : 'entries'} today
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
          )}

          {/* Entries */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 h-20 animate-pulse" />
              ))}
            </div>
          ) : !grouped.length ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">📅</p>
              <p className="text-slate-400 text-sm">Nothing logged yet. Start writing above!</p>
            </div>
          ) : (
            <div className="space-y-7 pb-6">
              {grouped.map(([d, items]) => {
                const { label, sub } = formatDateHeader(d)
                return (
                  <div key={d}>
                    {/* Date header */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-slate-800 font-bold text-base">{label}</span>
                      <span className="text-slate-400 text-xs">{sub}</span>
                    </div>

                    {/* Timeline */}
                    <div className="relative pl-5 space-y-2.5"
                      style={{ borderLeft: '2px solid #f1f5f9' }}>
                      {items.map(entry => (
                        <div key={entry.id} className="group relative">
                          {/* Dot */}
                          <div className="absolute -left-[22px] top-3 w-2.5 h-2.5 rounded-full bg-white border-2 border-emerald-400" />

                          <div className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm rounded-xl px-4 py-3 transition-all">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line flex-1">
                                {entry.entry}
                              </p>
                              <button onClick={() => deleteEntry(entry.id)}
                                className="text-slate-200 hover:text-red-400 hover:bg-red-50 w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5">
                                ✕
                              </button>
                            </div>
                            <p className="text-slate-300 text-xs mt-1.5">
                              {new Date(entry.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}