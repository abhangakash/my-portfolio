'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ─── INACTIVITY LOGOUT (10 min) ────────────────────────────────────────────────
const INACTIVITY_MS = 10 * 60 * 1000

function useInactivityLogout() {
  const router = useRouter()
  const timerRef = useRef(null)
  const [countdown, setCountdown] = useState(null) // show warning at 1 min left
  const countdownRef = useRef(null)

  const logout = useCallback(async () => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    await fetch('/api/vault/logout', { method: 'POST' })
    router.push('/')
  }, [router])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    setCountdown(null)

    // Warning at 9 minutes (1 min before logout)
    timerRef.current = setTimeout(() => {
      let secs = 60
      setCountdown(secs)
      countdownRef.current = setInterval(() => {
        secs -= 1
        setCountdown(secs)
        if (secs <= 0) {
          clearInterval(countdownRef.current)
          logout()
        }
      }, 1000)
    }, INACTIVITY_MS - 60000)
  }, [logout])

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }))
    resetTimer()
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [resetTimer])

  return { countdown, stayLoggedIn: resetTimer, logout }
}

// ─── QUOTES ────────────────────────────────────────────────────────────────────
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
]

function getTodayQuote() {
  const day = new Date().getDate() + new Date().getMonth()
  return QUOTES[day % QUOTES.length]
}

// ─── CATEGORY CONFIG ──────────────────────────────────────────────────────────
const CAT_CONFIG = {
  food:     { icon: '🍱', label: 'Food',     color: '#f97316' },
  travel:   { icon: '🚆', label: 'Travel',   color: '#3b82f6' },
  snacks:   { icon: '☕', label: 'Snacks',   color: '#eab308' },
  shopping: { icon: '🛍️', label: 'Shopping', color: '#a855f7' },
  medical:  { icon: '💊', label: 'Medical',  color: '#ef4444' },
  transfer: { icon: '💸', label: 'Transfer', color: '#10b981' },
  other:    { icon: '📦', label: 'Other',    color: '#6b7280' },
}

const WORK_TYPE_CONFIG = {
  wfh:    { icon: '🏠', label: 'WFH',   color: '#3b82f6' },
  office: { icon: '🏢', label: 'Office', color: '#8b5cf6' },
  extra:  { icon: '⏰', label: 'Extra',  color: '#f97316' },
  leave:  { icon: '🏖️', label: 'Leave',  color: '#10b981' },
}

function calcHours(inTime, outTime) {
  if (!inTime || !outTime) return null
  const [ih, im] = inTime.split(':').map(Number)
  const [oh, om] = outTime.split(':').map(Number)
  const diff = (oh * 60 + om) - (ih * 60 + im)
  if (diff <= 0) return null
  const h = Math.floor(diff / 60); const m = diff % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// ─── MINI DONUT CHART ────────────────────────────────────────────────────────
function MiniDonut({ data, total }) {
  if (!total) return <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-gray-600 text-xs">No data</div>

  let cumulative = 0
  const r = 36, cx = 44, cy = 44
  const circumference = 2 * Math.PI * r

  const slices = data.map(d => {
    const pct = d.value / total
    const offset = circumference * (1 - pct)
    const rotation = cumulative * 360
    cumulative += pct
    return { ...d, offset, rotation, pct }
  })

  return (
    <div className="relative">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth="10" />
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={s.offset}
            strokeLinecap="butt"
            transform={`rotate(${s.rotation - 90} ${cx} ${cy})`}
            opacity="0.85"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white font-bold text-xs leading-none">₹{total >= 1000 ? `${(total/1000).toFixed(1)}k` : total}</span>
        <span className="text-gray-500 text-[10px]">month</span>
      </div>
    </div>
  )
}

// ─── WRITING SPACE ───────────────────────────────────────────────────────────
const WRITING_PROMPTS = [
  "What's your main goal for today?",
  "One thing you're grateful for today...",
  "Your intention for this week...",
  "Something you want to remember...",
  "A thought you want to hold onto...",
]

function WritingSpace() {
  const key = 'vault_daily_note'
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const saveTimer = useRef(null)
  const today = new Date().toISOString().split('T')[0]
  const storageKey = `${key}_${today}`

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) setText(stored)
  }, [storageKey])

  function handleChange(val) {
    setText(val)
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(storageKey, val)
      setSaved(true)
    }, 800)
  }

  const prompt = WRITING_PROMPTS[new Date().getDay() % WRITING_PROMPTS.length]

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">✍️</span>
          <span className="text-white font-semibold text-sm">Daily Space</span>
        </div>
        {saved && <span className="text-green-500 text-xs">Saved</span>}
      </div>
      <textarea
        placeholder={prompt}
        value={text}
        onChange={e => handleChange(e.target.value)}
        rows={4}
        className="w-full bg-gray-800/50 text-gray-200 border border-gray-700/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-600 resize-none leading-relaxed placeholder-gray-600 transition-colors"
      />
      <p className="text-gray-700 text-xs mt-2">Saved locally for today · won't sync across devices</p>
    </div>
  )
}

// ─── NAV MODULES ─────────────────────────────────────────────────────────────
const MODULES = [
  { href: '/vault/expenses', icon: '💸', label: 'Expenses',     color: '#f97316' },
  { href: '/vault/worklog',  icon: '💼', label: 'Work Log',      color: '#8b5cf6' },
  { href: '/vault/routine',  icon: '📅', label: 'Routine',       color: '#10b981' },
  { href: '/vault/notes',    icon: '📝', label: 'Notes',         color: '#f59e0b' },
  { href: '/vault/files',    icon: '📁', label: 'Files',         color: '#3b82f6' },
]

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { countdown, stayLoggedIn, logout } = useInactivityLogout()

  const quote = getTodayQuote()

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    fetch('/api/vault/dashboard')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Donut data
  const donutData = stats
    ? Object.entries(stats.categoryTotals || {})
        .map(([key, value]) => ({ key, value, color: CAT_CONFIG[key]?.color || '#6b7280' }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
    : []

  const worklog = stats?.todayWorklog
  const workType = worklog ? WORK_TYPE_CONFIG[worklog.work_type] : null

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Inactivity warning */}
      {countdown !== null && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-orange-500 text-black px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 text-sm font-semibold">
          <span>⚠️ Auto-logout in {countdown}s</span>
          <button onClick={stayLoggedIn}
            className="bg-black text-white px-3 py-1 rounded-lg text-xs hover:bg-gray-800 transition-colors">
            Stay logged in
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm">{dateStr}</p>
            <h1 className="text-white text-2xl font-bold mt-0.5">{greeting} 👋</h1>
          </div>
          <button onClick={logout}
            className="text-gray-600 hover:text-red-400 text-xs transition-colors mt-1">
            🚪 Logout
          </button>
        </div>

        {/* Quote card */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-900 border border-gray-800 rounded-2xl p-5 overflow-hidden">
          <div className="absolute top-0 right-0 text-[80px] leading-none opacity-5 select-none pointer-events-none">"</div>
          <p className="text-gray-200 text-base leading-relaxed italic font-light">"{quote.text}"</p>
          <p className="text-gray-500 text-xs mt-2">— {quote.author}</p>
        </div>

        {/* Writing space */}
        <WritingSpace />

        {/* Quick nav */}
        <div className="grid grid-cols-5 gap-2">
          {MODULES.map(m => (
            <Link key={m.href} href={m.href}
              className="flex flex-col items-center gap-1.5 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl py-4 px-2 transition-all group">
              <span className="text-2xl">{m.icon}</span>
              <span className="text-gray-400 group-hover:text-white text-xs transition-colors text-center leading-tight">{m.label}</span>
            </Link>
          ))}
        </div>

        {/* Stats row */}
        {!loading && stats && (
          <div className="grid grid-cols-2 gap-4">

            {/* Expense summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-500 text-xs">This Month</p>
                  <p className="text-white font-bold text-xl">₹{stats.monthTotal.toLocaleString('en-IN')}</p>
                  <p className="text-gray-600 text-xs mt-0.5">
                    Today: <span className="text-orange-400">₹{stats.todaySpent.toLocaleString('en-IN')}</span>
                  </p>
                </div>
                <MiniDonut data={donutData} total={stats.monthTotal} />
              </div>

              {/* Top 3 categories */}
              <div className="space-y-1.5">
                {donutData.slice(0, 3).map(d => {
                  const cat = CAT_CONFIG[d.key]
                  const pct = stats.monthTotal ? Math.round((d.value / stats.monthTotal) * 100) : 0
                  return (
                    <div key={d.key} className="flex items-center gap-2">
                      <span className="text-sm">{cat?.icon}</span>
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                      </div>
                      <span className="text-gray-400 text-xs w-14 text-right">₹{d.value >= 1000 ? `${(d.value/1000).toFixed(1)}k` : d.value}</span>
                    </div>
                  )
                })}
              </div>

              <Link href="/vault/expenses" className="block mt-3 text-center text-xs text-gray-600 hover:text-blue-400 transition-colors">
                View all expenses →
              </Link>
            </div>

            {/* Right column */}
            <div className="space-y-3">

              {/* Today's work */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-xs font-medium">TODAY'S WORK</p>
                  {!worklog && (
                    <Link href="/vault/worklog" className="text-xs text-gray-600 hover:text-purple-400 transition-colors">+ Log</Link>
                  )}
                </div>
                {worklog && workType ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{workType.icon}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: workType.color + '22', color: workType.color }}>
                        {workType.label}
                      </span>
                      {worklog.in_time && worklog.out_time && (
                        <span className="text-gray-600 text-xs">{calcHours(worklog.in_time, worklog.out_time)}</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{worklog.work_done}</p>
                  </div>
                ) : (
                  <p className="text-gray-700 text-xs">Nothing logged yet today.</p>
                )}
              </div>

              {/* Routine + Notes count */}
              <div className="grid grid-cols-2 gap-3">
                <Link href="/vault/routine"
                  className="bg-gray-900 border border-gray-800 hover:border-green-500/30 rounded-xl p-3 text-center transition-all group">
                  <p className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">{stats.routineCount}</p>
                  <p className="text-gray-500 text-xs mt-0.5">entries today</p>
                  <p className="text-gray-700 text-xs">Routine</p>
                </Link>
                <Link href="/vault/notes"
                  className="bg-gray-900 border border-gray-800 hover:border-amber-500/30 rounded-xl p-3 text-center transition-all group">
                  <p className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">{stats.notesCount}</p>
                  <p className="text-gray-500 text-xs mt-0.5">total notes</p>
                  <p className="text-gray-700 text-xs">Notes</p>
                </Link>
              </div>

            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl h-48 animate-pulse" />
            <div className="space-y-3">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl h-28 animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-900 border border-gray-800 rounded-xl h-20 animate-pulse" />
                <div className="bg-gray-900 border border-gray-800 rounded-xl h-20 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-800 text-xs pb-4">
          🔐 Auto-logout after 10 min of inactivity
        </p>
      </div>
    </div>
  )
}