'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'food',      label: 'Food & Eating',    icon: '🍱', color: '#f97316', subs: ['Restaurant', 'Home Delivery', 'Canteen', 'Mess'] },
  { key: 'travel',    label: 'Travel',            icon: '🚆', color: '#3b82f6', subs: ['Railway', 'Bus', 'Auto/Rickshaw', 'Metro', 'Cab'] },
  { key: 'snacks',    label: 'Snacks & Drinks',   icon: '☕', color: '#eab308', subs: ['Tea/Coffee', 'Street Snacks', 'Cold Drinks', 'Bakery'] },
  { key: 'shopping',  label: 'Shopping',          icon: '🛍️', color: '#a855f7', subs: ['Clothing', 'Electronics', 'Stationery', 'Household'] },
  { key: 'medical',   label: 'Medical',           icon: '💊', color: '#ef4444', subs: ['Medicine', 'Doctor', 'Tests', 'Pharmacy'] },
  { key: 'transfer',  label: 'Given / Received',  icon: '💸', color: '#10b981', subs: ['Lent to someone', 'Borrowed from someone', 'Returned', 'Received back'] },
  { key: 'other',     label: 'Other',             icon: '📦', color: '#6b7280', subs: ['Miscellaneous'] },
]

const TYPE_OPTS = [
  { key: 'spent',    label: 'Spent',    color: '#ef4444' },
  { key: 'given',    label: 'Given',    color: '#f97316' },
  { key: 'received', label: 'Received', color: '#10b981' },
]

const TODAY = new Date().toISOString().split('T')[0]

function getMonthRange() {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  return { from, to }
}

function getCatConfig(key) {
  return CATEGORIES.find(c => c.key === key) || CATEGORIES[CATEGORIES.length - 1]
}

// ─── MINI BAR CHART ────────────────────────────────────────────────────────────
function BarChart({ data, total }) {
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="space-y-2">
      {data.map(d => (
        <div key={d.key} className="flex items-center gap-3">
          <span className="text-lg w-7 text-center">{d.icon}</span>
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300 font-medium">{d.label}</span>
              <span className="text-gray-400">₹{d.value.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-500 w-10 text-right">
            {total ? Math.round((d.value / total) * 100) : 0}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── TIMELINE CHART ────────────────────────────────────────────────────────────
function TimelineChart({ expenses }) {
  const byDay = useMemo(() => {
    const map = {}
    expenses.filter(e => e.type === 'spent' || e.type === 'given').forEach(e => {
      map[e.date] = (map[e.date] || 0) + parseFloat(e.amount)
    })
    const sorted = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]))
    return sorted
  }, [expenses])

  if (!byDay.length) return (
    <div className="flex items-center justify-center h-32 text-gray-600 text-sm">No data for timeline</div>
  )

  const max = Math.max(...byDay.map(d => d[1]), 1)
  const chartH = 100

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max px-2">
        <svg height={chartH + 40} style={{ minWidth: Math.max(byDay.length * 32, 300) }} className="w-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(t => (
            <line key={t}
              x1={0} y1={chartH - t * chartH}
              x2="100%" y2={chartH - t * chartH}
              stroke="#1f2937" strokeWidth="1"
            />
          ))}
          {/* Bars */}
          {byDay.map(([date, val], i) => {
            const x = i * 32 + 8
            const barH = (val / max) * chartH
            const y = chartH - barH
            const day = new Date(date).getDate()
            return (
              <g key={date}>
                <rect x={x} y={y} width={20} height={barH}
                  rx="3" fill="#3b82f6" opacity="0.8"
                  className="hover:opacity-100 transition-opacity cursor-pointer"
                />
                <text x={x + 10} y={chartH + 14} textAnchor="middle"
                  fill="#6b7280" fontSize="10">{day}</text>
                <title>{date}: ₹{val.toLocaleString('en-IN')}</title>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// ─── ADD FORM ─────────────────────────────────────────────────────────────────
function AddExpenseForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    date: TODAY, amount: '', category: 'food',
    subcategory: '', description: '', type: 'spent', person: ''
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const cat = getCatConfig(form.category)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function submit() {
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      setErr('Enter a valid amount'); return
    }
    setSaving(true); setErr('')
    const res = await fetch('/api/vault/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      const data = await res.json()
      onAdd(data); onClose()
    } else {
      const d = await res.json()
      setErr(d.error || 'Failed to save')
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">Add Expense</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-5 space-y-4">

          {/* Type tabs */}
          <div className="flex gap-2">
            {TYPE_OPTS.map(t => (
              <button key={t.key}
                onClick={() => set('type', t.key)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                  form.type === t.key
                    ? 'text-white border-transparent'
                    : 'text-gray-500 border-gray-800 hover:border-gray-700'
                }`}
                style={form.type === t.key ? { backgroundColor: t.color + '33', borderColor: t.color, color: t.color } : {}}
              >{t.label}</button>
            ))}
          </div>

          {/* Date + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Date</label>
              <input type="date" value={form.date}
                onChange={e => set('date', e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Amount (₹)</label>
              <input type="number" placeholder="0.00" value={form.amount}
                onChange={e => set('amount', e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-gray-500 text-xs mb-1.5 block">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(c => (
                <button key={c.key}
                  onClick={() => { set('category', c.key); set('subcategory', '') }}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl border text-xs transition-all ${
                    form.category === c.key ? 'border-transparent' : 'border-gray-800 hover:border-gray-700 text-gray-500'
                  }`}
                  style={form.category === c.key ? { backgroundColor: c.color + '22', borderColor: c.color } : {}}
                >
                  <span className="text-lg mb-0.5">{c.icon}</span>
                  <span className={form.category === c.key ? 'text-white' : ''}
                    style={form.category === c.key ? { color: c.color } : {}}>
                    {c.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory */}
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Subcategory</label>
            <div className="flex flex-wrap gap-2">
              {cat.subs.map(s => (
                <button key={s}
                  onClick={() => set('subcategory', s)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all ${
                    form.subcategory === s
                      ? 'text-white border-transparent'
                      : 'border-gray-700 text-gray-500 hover:border-gray-600'
                  }`}
                  style={form.subcategory === s ? { backgroundColor: cat.color + '33', borderColor: cat.color, color: cat.color } : {}}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* Person (if transfer) */}
          {form.type !== 'spent' && (
            <div>
              <label className="text-gray-500 text-xs mb-1 block">Person name</label>
              <input type="text" placeholder="Who?" value={form.person}
                onChange={e => set('person', e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-gray-500 text-xs mb-1 block">Note (optional)</label>
            <input type="text" placeholder="What was it for?" value={form.description}
              onChange={e => set('description', e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {err && <p className="text-red-400 text-sm">{err}</p>}

          <button onClick={submit} disabled={saving}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: cat.color }}
          >
            {saving ? 'Saving...' : `Add ₹${form.amount || '0'} to ${cat.label}`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ExpensesPage() {
  const { from: defaultFrom, to: defaultTo } = getMonthRange()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({ from: defaultFrom, to: defaultTo, category: 'all' })
  const [activeTab, setActiveTab] = useState('list') // 'list' | 'charts'

  async function fetchExpenses() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.from) params.set('from', filters.from)
    if (filters.to) params.set('to', filters.to)
    if (filters.category !== 'all') params.set('category', filters.category)
    const res = await fetch(`/api/vault/expenses?${params}`)
    if (res.ok) setExpenses(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchExpenses() }, [filters])

  async function deleteExpense(id) {
    if (!confirm('Delete this entry?')) return
    await fetch(`/api/vault/expenses?id=${id}`, { method: 'DELETE' })
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalSpent = expenses
      .filter(e => e.type === 'spent' || e.type === 'given')
      .reduce((s, e) => s + parseFloat(e.amount), 0)
    const totalReceived = expenses
      .filter(e => e.type === 'received')
      .reduce((s, e) => s + parseFloat(e.amount), 0)

    const byCat = CATEGORIES.map(c => ({
      key: c.key, label: c.label, icon: c.icon, color: c.color,
      value: expenses
        .filter(e => e.category === c.key && (e.type === 'spent' || e.type === 'given'))
        .reduce((s, e) => s + parseFloat(e.amount), 0)
    })).filter(c => c.value > 0).sort((a, b) => b.value - a.value)

    return { totalSpent, totalReceived, net: totalSpent - totalReceived, byCat }
  }, [expenses])

  // ── Group by date ──────────────────────────────────────────────────────────
  const grouped = useMemo(() => {
    const map = {}
    expenses.forEach(e => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
  }, [expenses])

  function formatDate(d) {
    const date = new Date(d)
    const today = new Date(TODAY)
    const yesterday = new Date(TODAY); yesterday.setDate(yesterday.getDate() - 1)
    if (d === TODAY) return 'Today'
    if (d === yesterday.toISOString().split('T')[0]) return 'Yesterday'
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/vault/dashboard" className="text-gray-600 hover:text-white transition-colors text-sm">← Back</Link>
            <h1 className="text-white font-bold text-xl">💸 Expenses</h1>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            + Add
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs mb-1 block">From</label>
              <input type="date" value={filters.from}
                onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">To</label>
              <input type="date" value={filters.to}
                onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilters(f => ({ ...f, category: 'all' }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filters.category === 'all' ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-700 text-gray-500 hover:border-gray-600'
              }`}>All</button>
            {CATEGORIES.map(c => (
              <button key={c.key}
                onClick={() => setFilters(f => ({ ...f, category: c.key }))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  filters.category === c.key ? 'text-white border-transparent' : 'border-gray-700 text-gray-500 hover:border-gray-600'
                }`}
                style={filters.category === c.key ? { backgroundColor: c.color + '33', borderColor: c.color, color: c.color } : {}}
              >{c.icon} {c.label.split(' ')[0]}</button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-gray-500 text-xs mb-1">Total Spent</p>
            <p className="text-red-400 font-bold text-xl">₹{stats.totalSpent.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-gray-500 text-xs mb-1">Received</p>
            <p className="text-green-400 font-bold text-xl">₹{stats.totalReceived.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-gray-500 text-xs mb-1">Net Out</p>
            <p className={`font-bold text-xl ${stats.net > 0 ? 'text-orange-400' : 'text-green-400'}`}>
              ₹{Math.abs(stats.net).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
          {['list', 'charts'].map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-400'
              }`}
            >{tab === 'list' ? '📋 List' : '📊 Charts'}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-600">Loading...</div>
        ) : activeTab === 'charts' ? (
          /* ── CHARTS ─────────────────────────────────────────────────────── */
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Spending by Category</h3>
              {stats.byCat.length ? (
                <BarChart data={stats.byCat} total={stats.totalSpent} />
              ) : (
                <p className="text-gray-600 text-sm">No data</p>
              )}
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Daily Spending Timeline</h3>
              <TimelineChart expenses={expenses} />
            </div>
          </div>
        ) : (
          /* ── LIST ────────────────────────────────────────────────────────── */
          <div className="space-y-6">
            {!grouped.length ? (
              <div className="text-center py-16 text-gray-600">
                <p className="text-4xl mb-3">💸</p>
                <p>No expenses in this range.</p>
                <button onClick={() => setShowForm(true)} className="mt-3 text-blue-500 text-sm hover:underline">Add one</button>
              </div>
            ) : grouped.map(([date, items]) => {
              const dayTotal = items
                .filter(e => e.type === 'spent' || e.type === 'given')
                .reduce((s, e) => s + parseFloat(e.amount), 0)
              return (
                <div key={date}>
                  {/* Date header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-semibold">{formatDate(date)}</span>
                    <span className="text-gray-500 text-xs">₹{dayTotal.toLocaleString('en-IN')}</span>
                  </div>
                  {/* Items */}
                  <div className="space-y-2">
                    {items.map(e => {
                      const cat = getCatConfig(e.category)
                      const typeConfig = TYPE_OPTS.find(t => t.key === e.type) || TYPE_OPTS[0]
                      return (
                        <div key={e.id}
                          className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3 group hover:border-gray-700 transition-all">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                            style={{ backgroundColor: cat.color + '22' }}>
                            {cat.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white text-sm font-medium">
                                {e.subcategory || cat.label}
                              </span>
                              {e.type !== 'spent' && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full"
                                  style={{ backgroundColor: typeConfig.color + '22', color: typeConfig.color }}>
                                  {typeConfig.label}
                                  {e.person ? ` · ${e.person}` : ''}
                                </span>
                              )}
                            </div>
                            {e.description && (
                              <p className="text-gray-500 text-xs mt-0.5 truncate">{e.description}</p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-sm" style={{ color: typeConfig.color }}>
                              {e.type === 'received' ? '+' : '-'}₹{parseFloat(e.amount).toLocaleString('en-IN')}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteExpense(e.id)}
                            className="text-gray-800 group-hover:text-red-500 transition-colors text-sm ml-1 shrink-0"
                          >✕</button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && (
        <AddExpenseForm
          onAdd={e => setExpenses(prev => [e, ...prev])}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}