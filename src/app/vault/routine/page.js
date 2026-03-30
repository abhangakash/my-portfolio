'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

const TODAY = new Date().toISOString().split('T')[0]

function formatDateHeader(d) {
  const date = new Date(d)
  const yesterday = new Date(TODAY); yesterday.setDate(yesterday.getDate() - 1)
  if (d === TODAY) return { label: 'Today', sub: date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) }
  if (d === yesterday.toISOString().split('T')[0]) return { label: 'Yesterday', sub: date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) }
  return {
    label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    sub: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric' })
  }
}

export default function RoutinePage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const [date, setDate] = useState(TODAY)
  const [saving, setSaving] = useState(false)
  const [viewMode, setViewMode] = useState('today') // 'today' | 'all'

  async function fetchEntries() {
    setLoading(true)
    const params = new URLSearchParams()
    if (viewMode === 'today') {
      params.set('from', TODAY)
      params.set('to', TODAY)
    }
    const res = await fetch(`/api/vault/routine?${params}`)
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
      body: JSON.stringify({ date, entry: input.trim() })
    })
    if (res.ok) {
      const data = await res.json()
      setEntries(prev => [data, ...prev])
      setInput('')
    }
    setSaving(false)
  }

  async function deleteEntry(id) {
    await fetch(`/api/vault/routine?id=${id}`, { method: 'DELETE' })
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  // Group by date
  const grouped = useMemo(() => {
    const map = {}
    entries.forEach(e => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
  }, [entries])

  const todayEntries = entries.filter(e => e.date === TODAY)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/vault/dashboard" className="text-gray-600 hover:text-white text-sm transition-colors">← Back</Link>
            <h1 className="text-white font-bold text-xl">📅 Daily Routine</h1>
          </div>
          <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
            {['today', 'all'].map(m => (
              <button key={m} onClick={() => setViewMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === m ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-400'
                }`}>{m === 'today' ? 'Today' : 'All Days'}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Add entry box */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📝</div>
            <div>
              <p className="text-white font-semibold text-sm">What did you do?</p>
              <p className="text-gray-500 text-xs">Add things you've done — one at a time or all at once</p>
            </div>
          </div>

          {/* Date picker (only show in all mode) */}
          {viewMode === 'all' && (
            <div>
              <label className="text-gray-500 text-xs mb-1 block">For date</label>
              <input type="date" value={date}
                onChange={e => setDate(e.target.value)}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          )}

          <textarea
            placeholder={`Write anything — tasks done, places visited, people met, things learned...\n\nE.g. Went to office. Had standup at 10am. Completed the login module. Attended Rahul's birthday dinner.`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.ctrlKey) addEntry()
            }}
            rows={4}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 resize-none placeholder-gray-600"
          />
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-xs">Ctrl+Enter to save</span>
            <button onClick={addEntry} disabled={saving || !input.trim()}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">
              {saving ? 'Saving...' : '+ Add Entry'}
            </button>
          </div>
        </div>

        {/* Today's count */}
        {viewMode === 'today' && todayEntries.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-800" />
            <span className="text-gray-500 text-xs">{todayEntries.length} entries today</span>
            <div className="h-px flex-1 bg-gray-800" />
          </div>
        )}

        {/* Entries */}
        {loading ? (
          <div className="text-center py-16 text-gray-600">Loading...</div>
        ) : !grouped.length ? (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-3">📅</p>
            <p>Nothing logged yet. Start writing above!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([date, items]) => {
              const { label, sub } = formatDateHeader(date)
              return (
                <div key={date}>
                  {/* Date header */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <h2 className="text-white font-bold text-lg">{label}</h2>
                    <span className="text-gray-600 text-xs">{sub}</span>
                  </div>

                  {/* Timeline */}
                  <div className="relative pl-5 border-l border-gray-800 space-y-3">
                    {items.map((entry, i) => (
                      <div key={entry.id} className="group relative">
                        {/* Dot */}
                        <div className="absolute -left-[21px] top-2 w-2.5 h-2.5 rounded-full bg-green-500/50 border-2 border-green-500" />

                        <div className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl px-4 py-3 transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line flex-1">
                              {entry.entry}
                            </p>
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="text-gray-800 group-hover:text-red-500 transition-colors text-sm shrink-0 mt-0.5"
                            >✕</button>
                          </div>
                          <p className="text-gray-600 text-xs mt-1.5">
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
  )
}