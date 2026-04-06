'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: 'food',     label: 'Food & Eating',   icon: '🍱', color: '#f97316', subs: ['Restaurant', 'Home Delivery', 'Canteen', 'Mess'] },
  { key: 'travel',   label: 'Travel',           icon: '🚆', color: '#3b82f6', subs: ['Railway', 'Bus', 'Auto/Rickshaw', 'Metro', 'Cab'] },
  { key: 'snacks',   label: 'Snacks & Drinks',  icon: '☕', color: '#eab308', subs: ['Tea/Coffee', 'Street Snacks', 'Cold Drinks', 'Bakery'] },
  { key: 'shopping', label: 'Shopping',         icon: '🛍️', color: '#a855f7', subs: ['Clothing', 'Electronics', 'Stationery', 'Household'] },
  { key: 'medical',  label: 'Medical',          icon: '💊', color: '#ef4444', subs: ['Medicine', 'Doctor', 'Tests', 'Pharmacy'] },
  { key: 'transfer', label: 'Given / Received', icon: '💸', color: '#10b981', subs: ['Lent to someone', 'Borrowed from someone', 'Returned', 'Received back'] },
  { key: 'other',    label: 'Other',            icon: '📦', color: '#6b7280', subs: ['Miscellaneous'] },
]
const TYPE_OPTS = [
  { key: 'spent',    label: 'Spent',    color: '#ef4444' },
  { key: 'given',    label: 'Given',    color: '#f97316' },
  { key: 'received', label: 'Received', color: '#10b981' },
]
const TODAY = new Date().toISOString().split('T')[0]

function getMonthRange() {
  const now = new Date()
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
    to:   new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
  }
}
function getCat(key) { return CATEGORIES.find(c => c.key === key) || CATEGORIES[CATEGORIES.length - 1] }
function getType(key) { return TYPE_OPTS.find(t => t.key === key) || TYPE_OPTS[0] }

// ─── BAR CHART ────────────────────────────────────────────────────────────────
function BarChart({ data, total }) {
  if (!data.length) return <p className="text-slate-400 text-sm text-center py-6">No data yet</p>
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="space-y-3">
      {data.map(d => (
        <div key={d.key} className="flex items-center gap-3">
          <span className="text-base w-6 text-center shrink-0">{d.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600 font-medium truncate">{d.label}</span>
              <span className="text-slate-400 shrink-0 ml-2">₹{d.value.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color }} />
            </div>
          </div>
          <span className="text-xs text-slate-400 w-8 text-right shrink-0">
            {total ? Math.round((d.value / total) * 100) : 0}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── TIMELINE ────────────────────────────────────────────────────────────────
function TimelineChart({ expenses }) {
  const byDay = useMemo(() => {
    const map = {}
    expenses.filter(e => e.type === 'spent' || e.type === 'given').forEach(e => {
      map[e.date] = (map[e.date] || 0) + parseFloat(e.amount)
    })
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]))
  }, [expenses])

  if (!byDay.length) return <p className="text-slate-400 text-sm text-center py-10">No data for timeline</p>
  const max = Math.max(...byDay.map(d => d[1]), 1)
  const chartH = 90

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <div style={{ minWidth: Math.max(byDay.length * 34, 280) }}>
        <svg height={chartH + 36} width="100%">
          {[0.25, 0.5, 0.75, 1].map(t => (
            <line key={t} x1={0} y1={chartH - t * chartH} x2="100%" y2={chartH - t * chartH}
              stroke="#f1f5f9" strokeWidth="1" />
          ))}
          {byDay.map(([date, val], i) => {
            const barW = 20, gap = 34
            const x = i * gap + 7
            const barH = Math.max((val / max) * chartH, 3)
            const y = chartH - barH
            const day = new Date(date).getDate()
            return (
              <g key={date}>
                <rect x={x} y={y} width={barW} height={barH} rx="4"
                  fill="#3b82f6" opacity="0.75"
                  className="hover:opacity-100 cursor-pointer transition-opacity" />
                <text x={x + barW / 2} y={chartH + 16} textAnchor="middle" fill="#94a3b8" fontSize="9">{day}</text>
                <title>{date}: ₹{val.toLocaleString('en-IN')}</title>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// ─── ADD FORM ────────────────────────────────────────────────────────────────
function AddExpenseForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    date: TODAY, amount: '', category: 'food',
    subcategory: '', description: '', type: 'spent', person: ''
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const cat = getCat(form.category)
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
    if (res.ok) { onAdd(await res.json()); onClose() }
    else { const d = await res.json(); setErr(d.error || 'Failed to save') }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-slate-800 font-bold text-lg">Add Expense</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 text-sm transition-colors">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Type tabs */}
          <div className="flex gap-2">
            {TYPE_OPTS.map(t => (
              <button key={t.key} onClick={() => set('type', t.key)}
                className="flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all"
                style={form.type === t.key
                  ? { borderColor: t.color, backgroundColor: t.color + '12', color: t.color }
                  : { borderColor: '#f1f5f9', color: '#cbd5e1' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Date + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1 block">Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400" />
            </div>
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1 block">Amount (₹)</label>
              <input type="number" inputMode="decimal" placeholder="0" value={form.amount}
                onChange={e => set('amount', e.target.value)}
                className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400" />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-slate-400 text-xs font-medium mb-2 block">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(c => (
                <button key={c.key}
                  onClick={() => { set('category', c.key); set('subcategory', '') }}
                  className="flex flex-col items-center py-2.5 px-1 rounded-xl border-2 text-xs transition-all"
                  style={form.category === c.key
                    ? { borderColor: c.color, backgroundColor: c.color + '10' }
                    : { borderColor: '#f1f5f9', color: '#cbd5e1' }}>
                  <span className="text-lg mb-0.5">{c.icon}</span>
                  <span className="text-[10px] font-semibold leading-tight text-center"
                    style={{ color: form.category === c.key ? c.color : '#94a3b8' }}>
                    {c.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory */}
          <div>
            <label className="text-slate-400 text-xs font-medium mb-1.5 block">Subcategory</label>
            <div className="flex flex-wrap gap-1.5">
              {cat.subs.map(s => (
                <button key={s} onClick={() => set('subcategory', s)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border-2 transition-all"
                  style={form.subcategory === s
                    ? { borderColor: cat.color, backgroundColor: cat.color + '12', color: cat.color }
                    : { borderColor: '#f1f5f9', color: '#94a3b8' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Person */}
          {form.type !== 'spent' && (
            <div>
              <label className="text-slate-400 text-xs font-medium mb-1 block">Person name</label>
              <input type="text" placeholder="Who?" value={form.person}
                onChange={e => set('person', e.target.value)}
                className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400" />
            </div>
          )}

          {/* Note */}
          <div>
            <label className="text-slate-400 text-xs font-medium mb-1 block">Note (optional)</label>
            <input type="text" placeholder="What was it for?" value={form.description}
              onChange={e => set('description', e.target.value)}
              className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-slate-400" />
          </div>

          {err && <p className="text-red-500 text-sm">{err}</p>}

          <button onClick={submit} disabled={saving}
            className="w-full py-3.5 rounded-xl font-bold text-white transition-all active:scale-98 disabled:opacity-50 text-sm"
            style={{ backgroundColor: cat.color }}>
            {saving ? 'Saving...' : `Add ₹${form.amount || '0'} · ${cat.label}`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function ExpensesPage() {
  const { from: defaultFrom, to: defaultTo } = getMonthRange()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filters, setFilters] = useState({ from: defaultFrom, to: defaultTo, category: 'all' })
  const [activeTab, setActiveTab] = useState('list')

  async function fetchExpenses() {
    setLoading(true)
    const p = new URLSearchParams()
    if (filters.from) p.set('from', filters.from)
    if (filters.to) p.set('to', filters.to)
    if (filters.category !== 'all') p.set('category', filters.category)
    const res = await fetch(`/api/vault/expenses?${p}`)
    if (res.ok) setExpenses(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchExpenses() }, [filters])

  async function deleteExpense(id) {
    if (!confirm('Delete this entry?')) return
    await fetch(`/api/vault/expenses?id=${id}`, { method: 'DELETE' })
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const stats = useMemo(() => {
    const totalSpent = expenses.filter(e => e.type === 'spent' || e.type === 'given')
      .reduce((s, e) => s + parseFloat(e.amount), 0)
    const totalReceived = expenses.filter(e => e.type === 'received')
      .reduce((s, e) => s + parseFloat(e.amount), 0)
    const byCat = CATEGORIES.map(c => ({
      key: c.key, label: c.label, icon: c.icon, color: c.color,
      value: expenses.filter(e => e.category === c.key && (e.type === 'spent' || e.type === 'given'))
        .reduce((s, e) => s + parseFloat(e.amount), 0)
    })).filter(c => c.value > 0).sort((a, b) => b.value - a.value)
    return { totalSpent, totalReceived, net: totalSpent - totalReceived, byCat }
  }, [expenses])

  const grouped = useMemo(() => {
    const map = {}
    expenses.forEach(e => { if (!map[e.date]) map[e.date] = []; map[e.date].push(e) })
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
  }, [expenses])

  function formatDate(d) {
    const yest = new Date(TODAY); yest.setDate(yest.getDate() - 1)
    if (d === TODAY) return 'Today'
    if (d === yest.toISOString().split('T')[0]) return 'Yesterday'
    return new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen" style={{ background: '#f8fafc' }}>

        {/* Sticky header */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-100">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/vault/dashboard"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-sm transition-colors">
                ←
              </Link>
              <h1 className="text-slate-800 font-bold text-lg">💸 Expenses</h1>
            </div>
            <button onClick={() => setShowForm(true)}
              className="bg-orange-500 hover:bg-orange-400 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
              + Add
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">

          {/* Filters card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
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
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => setFilters(f => ({ ...f, category: 'all' }))}
                className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
                  filters.category === 'all'
                    ? 'bg-slate-800 border-slate-800 text-white'
                    : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}>
                All
              </button>
              {CATEGORIES.map(c => (
                <button key={c.key} onClick={() => setFilters(f => ({ ...f, category: c.key }))}
                  className="px-3 py-1 rounded-full text-xs font-bold border-2 transition-all"
                  style={filters.category === c.key
                    ? { borderColor: c.color, backgroundColor: c.color + '12', color: c.color }
                    : { borderColor: '#f1f5f9', color: '#94a3b8' }}>
                  {c.icon} {c.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: 'Spent',    value: stats.totalSpent,            color: '#ef4444', bg: '#fef2f2' },
              { label: 'Received', value: stats.totalReceived,         color: '#10b981', bg: '#ecfdf5' },
              { label: 'Net Out',  value: Math.abs(stats.net),         color: stats.net > 0 ? '#f97316' : '#10b981', bg: stats.net > 0 ? '#fff7ed' : '#ecfdf5' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border p-3 sm:p-4"
                style={{ background: s.bg, borderColor: s.color + '25' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: s.color + 'aa' }}>{s.label}</p>
                <p className="font-bold text-base sm:text-xl leading-none" style={{ color: s.color }}>
                  ₹{s.value >= 1000 ? `${(s.value / 1000).toFixed(1)}k` : s.value.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
            {[['list', '📋 List'], ['charts', '📊 Charts']].map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-600'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 h-16 animate-pulse" />
              ))}
            </div>

          ) : activeTab === 'charts' ? (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
                <p className="text-slate-700 font-bold text-sm mb-4">Spending by Category</p>
                <BarChart data={stats.byCat} total={stats.totalSpent} />
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
                <p className="text-slate-700 font-bold text-sm mb-4">Daily Timeline</p>
                <TimelineChart expenses={expenses} />
              </div>
            </div>

          ) : (
            <div className="space-y-5 pb-6">
              {!grouped.length ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-3">💸</p>
                  <p className="text-slate-400 text-sm">No expenses in this range.</p>
                  <button onClick={() => setShowForm(true)}
                    className="mt-3 text-orange-500 text-sm font-semibold hover:underline">
                    Add first expense
                  </button>
                </div>
              ) : grouped.map(([date, items]) => {
                const dayTotal = items.filter(e => e.type === 'spent' || e.type === 'given')
                  .reduce((s, e) => s + parseFloat(e.amount), 0)
                return (
                  <div key={date}>
                    {/* Date divider */}
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className="text-slate-600 text-sm font-bold shrink-0">{formatDate(date)}</span>
                      <div className="flex-1 h-px bg-slate-100" />
                      <span className="text-slate-400 text-xs font-semibold shrink-0">
                        ₹{dayTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {items.map(e => {
                        const cat = getCat(e.category)
                        const type = getType(e.type)
                        return (
                          <div key={e.id}
                            className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm rounded-2xl px-4 py-3 flex items-center gap-3 group transition-all">
                            {/* Icon bubble */}
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                              style={{ backgroundColor: cat.color + '12' }}>
                              {cat.icon}
                            </div>
                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-slate-700 text-sm font-semibold">
                                  {e.subcategory || cat.label}
                                </span>
                                {e.type !== 'spent' && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                                    style={{ backgroundColor: type.color + '12', color: type.color }}>
                                    {type.label}{e.person ? ` · ${e.person}` : ''}
                                  </span>
                                )}
                              </div>
                              {e.description && (
                                <p className="text-slate-400 text-xs mt-0.5 truncate">{e.description}</p>
                              )}
                            </div>
                            {/* Amount */}
                            <p className="font-bold text-sm shrink-0" style={{ color: type.color }}>
                              {e.type === 'received' ? '+' : '−'}₹{parseFloat(e.amount).toLocaleString('en-IN')}
                            </p>
                            {/* Delete - visible on hover */}
                            <button onClick={() => deleteExpense(e.id)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] text-slate-300 hover:bg-red-50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                              ✕
                            </button>
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
      </div>

      {showForm && (
        <AddExpenseForm
          onAdd={e => setExpenses(prev => [e, ...prev])}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  )
}