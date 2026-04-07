'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ─── INACTIVITY LOGOUT ────────────────────────────────────────────────────────
const INACTIVITY_MS = 10 * 60 * 1000

function useInactivityLogout() {
  const router = useRouter()
  const timerRef = useRef(null)
  const [countdown, setCountdown] = useState(null)
  const countdownRef = useRef(null)

  // ✅ Fixed: fetch clears the cookie (JSON response), then router.push navigates
  const logout = useCallback(async () => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    try {
      await fetch('/api/vault/logout', { method: 'POST' })
    } catch (_) {}
    router.push('/')
  }, [router])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    setCountdown(null)
    timerRef.current = setTimeout(() => {
      let secs = 60
      setCountdown(secs)
      countdownRef.current = setInterval(() => {
        secs -= 1
        setCountdown(secs)
        if (secs <= 0) { clearInterval(countdownRef.current); logout() }
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

// ─── QUOTES ───────────────────────────────────────────────────────────────────
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
]
function getTodayQuote() {
  const d = new Date()
  return QUOTES[(d.getDate() + d.getMonth()) % QUOTES.length]
}

// ─── CONFIG ───────────────────────────────────────────────────────────────────
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
  wfh:    { icon: '🏠', label: 'WFH',    color: '#3b82f6' },
  office: { icon: '🏢', label: 'Office', color: '#8b5cf6' },
  extra:  { icon: '⏰', label: 'Extra',  color: '#f97316' },
  leave:  { icon: '🏖️', label: 'Leave',  color: '#10b981' },
}
const MODULES = [
  { href: '/vault/expenses', icon: '💸', label: 'Expenses', accent: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
  { href: '/vault/worklog',  icon: '💼', label: 'Work Log', accent: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  { href: '/vault/routine',  icon: '📅', label: 'Routine',  accent: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  { href: '/vault/notes',    icon: '📝', label: 'Notes',    accent: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  { href: '/vault/files',    icon: '📁', label: 'Files',    accent: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
]
const WRITING_PROMPTS = [
  "What's your main goal for today?",
  "One thing you're grateful for today...",
  "Your intention for this week...",
  "Something you want to remember...",
  "A thought worth holding onto...",
  "What would make today great?",
  "One thing you'll focus on...",
]

function calcHours(inTime, outTime) {
  if (!inTime || !outTime) return null
  const [ih, im] = inTime.split(':').map(Number)
  const [oh, om] = outTime.split(':').map(Number)
  const diff = (oh * 60 + om) - (ih * 60 + im)
  if (diff <= 0) return null
  const h = Math.floor(diff / 60), m = diff % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// ─── DONUT CHART ──────────────────────────────────────────────────────────────
function MiniDonut({ data, total }) {
  if (!total) return (
    <div className="w-20 h-20 rounded-full border-[6px] border-slate-100 flex items-center justify-center shrink-0">
      <span className="text-slate-300 text-xs">—</span>
    </div>
  )
  let cumulative = 0
  const r = 30, cx = 38, cy = 38, circ = 2 * Math.PI * r
  const slices = data.map(d => {
    const pct = d.value / total
    const offset = circ * (1 - pct)
    const rotation = cumulative * 360
    cumulative += pct
    return { ...d, offset, rotation }
  })
  return (
    <div className="relative shrink-0">
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={s.offset}
            transform={`rotate(${s.rotation - 90} ${cx} ${cy})`}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-slate-800 font-bold text-[10px] leading-none">
          ₹{total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}
        </span>
        <span className="text-slate-400 text-[8px] mt-0.5">month</span>
      </div>
    </div>
  )
}

// ─── WRITING SPACE ────────────────────────────────────────────────────────────
function WritingSpace() {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const saveTimer = useRef(null)
  const today = new Date().toISOString().split('T')[0]
  const storageKey = `vault_note_${today}`

  useEffect(() => {
    try { const s = localStorage.getItem(storageKey); if (s) setText(s) } catch {}
  }, [storageKey])

  function handleChange(val) {
    setText(val); setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(storageKey, val); setSaved(true) } catch {}
    }, 700)
  }

  const prompt = WRITING_PROMPTS[new Date().getDay() % WRITING_PROMPTS.length]

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">✍️</span>
          <span className="text-slate-700 font-semibold text-sm">Daily Space</span>
        </div>
        <span className={`text-xs text-emerald-500 transition-opacity duration-500 ${saved ? 'opacity-100' : 'opacity-0'}`}>
          ✓ Saved
        </span>
      </div>
      <textarea
        placeholder={prompt}
        value={text}
        onChange={e => handleChange(e.target.value)}
        rows={3}
        className="w-full bg-slate-50 text-slate-700 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-300 resize-none leading-relaxed placeholder-slate-300 transition-colors"
      />
      <p className="text-slate-300 text-xs mt-1.5">Saves locally · resets each day</p>
    </div>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { countdown, stayLoggedIn, logout } = useInactivityLogout()

  const quote = getTodayQuote()
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 5 ? 'Late night 🌙' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    fetch('/api/vault/dashboard')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const donutData = stats
    ? Object.entries(stats.categoryTotals || {})
        .map(([key, value]) => ({ key, value, color: CAT_CONFIG[key]?.color || '#94a3b8' }))
        .sort((a, b) => b.value - a.value).slice(0, 5)
    : []

  const worklog = stats?.todayWorklog
  const workType = worklog ? WORK_TYPE_CONFIG[worklog.work_type] : null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        body { font-family: 'DM Sans', sans-serif; background: #f8fafc; }
        .font-display { font-family: 'Lora', Georgia, serif; }
      `}</style>

      <div className="min-h-screen" style={{ background: '#f8fafc' }}>

        {/* Inactivity warning */}
        {countdown !== null && (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-lg text-sm font-medium"
            style={{ background: '#f97316', color: '#fff', width: 'calc(100% - 2rem)', maxWidth: '380px' }}>
            <span className="flex-1">⚠️ Auto-logout in {countdown}s</span>
            <button onClick={stayLoggedIn}
              className="shrink-0 bg-white text-orange-500 font-semibold text-xs px-3 py-1 rounded-lg">
              Stay in
            </button>
          </div>
        )}

       {/* Nav bar */}
<div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }} className="sticky top-0 z-40">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
        style={{ background: '#0f172a' }}>
        🔐
      </div>
      <span className="font-semibold text-slate-800 text-sm">A's Vault</span>
    </div>

    {/* Updated Logout Button: Better tap target & cleaner look */}
    <button
      onClick={logout}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 
                 text-[11px] font-bold uppercase tracking-tight text-slate-400 
                 transition-all hover:bg-slate-50 hover:text-red-500 hover:border-red-100
                 active:scale-95"
    >
      <span>Logout</span>
      <span className="text-xs">↗</span>
    </button>
  </div>
</div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-4 sm:space-y-5">

          {/* Greeting */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-slate-400 text-xs sm:text-sm">{dateStr}</p>
              <h1 className="font-display text-2xl sm:text-3xl text-slate-800 mt-1">
                {greeting} 👋
              </h1>
            </div>
            <span className="text-slate-300 text-xs hidden sm:block">10 min session</span>
          </div>

          {/* Quote */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 sm:px-6 sm:py-5 relative overflow-hidden">
            <div className="absolute -top-3 -left-1 font-display text-[90px] sm:text-[120px] text-slate-50 leading-none select-none pointer-events-none">"</div>
            <div className="relative pl-1">
              <p className="font-display text-slate-600 text-sm sm:text-base leading-relaxed italic">
                {quote.text}
              </p>
              <p className="text-slate-400 text-xs mt-2">— {quote.author}</p>
            </div>
          </div>

          {/* Writing space */}
          <WritingSpace />

          {/* Module nav */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {MODULES.map(m => (
              <Link key={m.href} href={m.href}
                className="flex flex-col items-center gap-1.5 sm:gap-2 rounded-2xl py-3 sm:py-4 px-1 border transition-all hover:shadow-sm active:scale-95"
                style={{ background: m.bg, borderColor: m.border }}>
                <span className="text-xl sm:text-2xl">{m.icon}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-center leading-tight"
                  style={{ color: m.accent }}>
                  {m.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Stats */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 h-44 animate-pulse" />
              ))}
            </div>
          ) : stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Expenses */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest">This Month</p>
                    <p className="text-slate-800 font-bold text-2xl sm:text-3xl mt-1">
                      ₹{stats.monthTotal.toLocaleString('en-IN')}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Today{' '}
                      <span className="font-semibold" style={{ color: '#f97316' }}>
                        ₹{stats.todaySpent.toLocaleString('en-IN')}
                      </span>
                    </p>
                  </div>
                  <MiniDonut data={donutData} total={stats.monthTotal} />
                </div>

                <div className="space-y-2 border-t border-slate-50 pt-3">
                  {donutData.slice(0, 3).map(d => {
                    const cat = CAT_CONFIG[d.key]
                    const pct = stats.monthTotal ? Math.round((d.value / stats.monthTotal) * 100) : 0
                    return (
                      <div key={d.key} className="flex items-center gap-2">
                        <span className="text-sm w-5 text-center shrink-0">{cat?.icon}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: d.color }} />
                        </div>
                        <span className="text-slate-500 text-xs w-12 text-right shrink-0">
                          ₹{d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <Link href="/vault/expenses"
                  className="block mt-3 text-center text-xs text-slate-300 hover:text-orange-400 transition-colors">
                  All expenses →
                </Link>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-3">

                {/* Work log */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest">Today's Work</p>
                    {!worklog && (
                      <Link href="/vault/worklog" className="text-xs text-slate-300 hover:text-purple-500 transition-colors">
                        + Log
                      </Link>
                    )}
                  </div>
                  {worklog && workType ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span>{workType.icon}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: workType.color + '15', color: workType.color }}>
                          {workType.label}
                        </span>
                        {worklog.in_time && worklog.out_time && (
                          <span className="text-slate-400 text-xs">
                            {worklog.in_time.slice(0, 5)}–{worklog.out_time.slice(0, 5)}
                            {calcHours(worklog.in_time, worklog.out_time) &&
                              <span className="text-emerald-500 ml-1">
                                ({calcHours(worklog.in_time, worklog.out_time)})
                              </span>
                            }
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{worklog.work_done}</p>
                    </div>
                  ) : (
                    <p className="text-slate-300 text-sm">Nothing logged today.</p>
                  )}
                </div>

                {/* Counts */}
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/vault/routine"
                    className="rounded-xl p-3 text-center border transition-all hover:shadow-sm active:scale-95"
                    style={{ background: '#ecfdf5', borderColor: '#d1fae5' }}>
                    <p className="font-bold text-xl sm:text-2xl" style={{ color: '#059669' }}>{stats.routineCount}</p>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: '#10b981' }}>entries</p>
                    <p className="text-xs" style={{ color: '#6ee7b7' }}>Routine</p>
                  </Link>
                  <Link href="/vault/notes"
                    className="rounded-xl p-3 text-center border transition-all hover:shadow-sm active:scale-95"
                    style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                    <p className="font-bold text-xl sm:text-2xl" style={{ color: '#d97706' }}>{stats.notesCount}</p>
                    <p className="text-xs mt-0.5 font-medium" style={{ color: '#f59e0b' }}>total</p>
                    <p className="text-xs" style={{ color: '#fcd34d' }}>Notes</p>
                  </Link>
                </div>

              </div>
            </div>
          )}

          <p className="text-center text-slate-300 text-xs pb-4">
            Auto-logout after 10 min · your data stays private
          </p>
        </div>
      </div>
    </>
  )
}