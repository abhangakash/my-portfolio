'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const TAGS = [
  { key: 'idea',       label: 'Ideas',      icon: '💡', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { key: 'goal',       label: 'Goals',      icon: '🎯', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  { key: 'motivation', label: 'Motivation', icon: '🔥', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  { key: 'study',      label: 'Study',      icon: '📚', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  { key: 'work',       label: 'Work',       icon: '💼', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
  { key: 'random',     label: 'Random',     icon: '🌀', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
]

function getTag(key) { return TAGS.find(t => t.key === key) || TAGS[TAGS.length - 1] }

// ─── NOTE FORM ───────────────────────────────────────────────────────────────
function NoteForm({ existing, onSave, onClose }) {
  const [form, setForm] = useState({ title: '', content: '', tag: 'idea', pinned: false, ...existing })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function submit() {
    if (!form.title.trim() || !form.content.trim()) { setErr('Title and content are required'); return }
    setSaving(true); setErr('')
    const method = existing ? 'PATCH' : 'POST'
    const res = await fetch('/api/vault/notes', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(existing ? { id: existing.id, ...form } : form)
    })
    if (res.ok) { onSave(await res.json()); onClose() }
    else { const d = await res.json(); setErr(d.error || 'Failed') }
    setSaving(false)
  }

  const tag = getTag(form.tag)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-slate-800 font-bold text-lg">{existing ? 'Edit Note' : 'New Note'}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 text-sm transition-colors">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Tag chips */}
          <div className="flex gap-1.5 flex-wrap">
            {TAGS.map(t => (
              <button key={t.key} onClick={() => set('tag', t.key)}
                className="px-3 py-1 rounded-full text-xs font-bold border-2 transition-all"
                style={form.tag === t.key
                  ? { borderColor: t.color, backgroundColor: t.bg, color: t.color }
                  : { borderColor: '#f1f5f9', color: '#94a3b8' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Title */}
          <input type="text" placeholder="Title"
            value={form.title} onChange={e => set('title', e.target.value)}
            className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-slate-400 placeholder-slate-300" />

          {/* Content */}
          <textarea placeholder="Write your note, idea, goal or thoughts here..."
            value={form.content} onChange={e => set('content', e.target.value)}
            rows={7}
            className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-slate-400 resize-none leading-relaxed placeholder-slate-300" />

          {/* Pin */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.pinned} onChange={e => set('pinned', e.target.checked)}
              className="w-4 h-4 rounded accent-amber-500" />
            <span className="text-slate-500 text-sm">📌 Pin this note</span>
          </label>

          {err && <p className="text-red-500 text-sm">{err}</p>}

          <button onClick={submit} disabled={saving}
            className="w-full py-3.5 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-50 text-sm"
            style={{ backgroundColor: tag.color }}>
            {saving ? 'Saving...' : (existing ? 'Update Note' : 'Save Note')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── NOTE CARD ───────────────────────────────────────────────────────────────
function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  const tag = getTag(note.tag)
  const [expanded, setExpanded] = useState(false)
  const isLong = note.content.length > 180

  return (
    <div className={`bg-white rounded-2xl border transition-all group hover:shadow-sm ${
      note.pinned ? '' : 'border-slate-100 hover:border-slate-200'
    }`}
      style={note.pinned ? { borderColor: '#fde68a', backgroundColor: '#fffdf5' } : {}}>

      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: tag.bg, color: tag.color, border: `1px solid ${tag.border}` }}>
              {tag.icon} {tag.label}
            </span>
            {note.pinned && <span className="text-amber-400 text-xs">📌</span>}
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
            <button onClick={() => onTogglePin(note)}
              className="text-xs text-slate-300 hover:text-amber-400 font-medium transition-colors">
              {note.pinned ? 'Unpin' : 'Pin'}
            </button>
            <button onClick={() => onEdit(note)}
              className="text-xs text-slate-300 hover:text-blue-500 font-medium transition-colors">Edit</button>
            <button onClick={() => onDelete(note.id)}
              className="text-xs text-slate-300 hover:text-red-400 font-medium transition-colors">Del</button>
          </div>
        </div>

        <h3 className="text-slate-800 font-bold text-sm mb-2">{note.title}</h3>

        <p className={`text-slate-500 text-sm leading-relaxed whitespace-pre-line ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
          {note.content}
        </p>

        {isLong && (
          <button onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold mt-1.5 transition-colors"
            style={{ color: tag.color }}>
            {expanded ? 'Show less ↑' : 'Read more ↓'}
          </button>
        )}

        <p className="text-slate-300 text-xs mt-3">
          {new Date(note.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [activeTag, setActiveTag] = useState('all')
  const [search, setSearch] = useState('')

  async function fetchNotes() {
    setLoading(true)
    const p = new URLSearchParams()
    if (activeTag !== 'all') p.set('tag', activeTag)
    const res = await fetch(`/api/vault/notes?${p}`)
    if (res.ok) setNotes(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchNotes() }, [activeTag])

  async function deleteNote(id) {
    if (!confirm('Delete this note?')) return
    await fetch(`/api/vault/notes?id=${id}`, { method: 'DELETE' })
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  async function togglePin(note) {
    const res = await fetch('/api/vault/notes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: note.id, pinned: !note.pinned })
    })
    if (res.ok) {
      const updated = await res.json()
      setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
    }
  }

  function handleSave(note) {
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === note.id)
      if (idx >= 0) { const arr = [...prev]; arr[idx] = note; return arr }
      return [note, ...prev]
    })
  }

  const filtered = notes.filter(n =>
    !search ||
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  )
  const pinned = filtered.filter(n => n.pinned)
  const unpinned = filtered.filter(n => !n.pinned)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="min-h-screen" style={{ background: '#f8fafc' }}>

        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/vault/dashboard"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-sm transition-colors">
                ←
              </Link>
              <h1 className="text-slate-800 font-bold text-lg">📝 Notes & Goals</h1>
            </div>
            <button onClick={() => { setEditing(null); setShowForm(true) }}
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-900 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
              + New Note
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">

          {/* Search */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm">🔍</span>
            <input type="text" placeholder="Search notes..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-100 shadow-sm text-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-slate-300 transition-colors" />
          </div>

          {/* Tag filter */}
          <div className="flex gap-1.5 flex-wrap">
            <button onClick={() => setActiveTag('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
                activeTag === 'all'
                  ? 'bg-slate-800 border-slate-800 text-white'
                  : 'border-slate-100 text-slate-400 hover:border-slate-300'}`}>
              All
            </button>
            {TAGS.map(t => (
              <button key={t.key} onClick={() => setActiveTag(t.key)}
                className="px-3 py-1 rounded-full text-xs font-bold border-2 transition-all"
                style={activeTag === t.key
                  ? { borderColor: t.color, backgroundColor: t.bg, color: t.color }
                  : { borderColor: '#f1f5f9', color: '#94a3b8' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 h-36 animate-pulse" />
              ))}
            </div>
          ) : !filtered.length ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">📝</p>
              <p className="text-slate-400 text-sm">{search ? 'No notes match your search.' : 'No notes yet.'}</p>
              {!search && (
                <button onClick={() => setShowForm(true)}
                  className="mt-3 text-amber-500 text-sm font-semibold hover:underline">
                  Write your first note
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5 pb-6">
              {/* Pinned */}
              {pinned.length > 0 && (
                <div>
                  <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">📌 Pinned</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pinned.map(n => (
                      <NoteCard key={n.id} note={n}
                        onEdit={n => { setEditing(n); setShowForm(true) }}
                        onDelete={deleteNote} onTogglePin={togglePin} />
                    ))}
                  </div>
                </div>
              )}
              {/* Unpinned */}
              {unpinned.length > 0 && (
                <div>
                  {pinned.length > 0 && (
                    <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-3">Others</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {unpinned.map(n => (
                      <NoteCard key={n.id} note={n}
                        onEdit={n => { setEditing(n); setShowForm(true) }}
                        onDelete={deleteNote} onTogglePin={togglePin} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <NoteForm existing={editing} onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }} />
      )}
    </>
  )
}