'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const TAGS = [
  { key: 'idea',       label: 'Ideas',       icon: '💡', color: '#f59e0b' },
  { key: 'goal',       label: 'Goals',       icon: '🎯', color: '#3b82f6' },
  { key: 'motivation', label: 'Motivation',  icon: '🔥', color: '#ef4444' },
  { key: 'study',      label: 'Study',       icon: '📚', color: '#8b5cf6' },
  { key: 'work',       label: 'Work',        icon: '💼', color: '#6b7280' },
  { key: 'random',     label: 'Random',      icon: '🌀', color: '#10b981' },
]

function getTagConfig(key) {
  return TAGS.find(t => t.key === key) || TAGS[TAGS.length - 1]
}

function NoteForm({ existing, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '', content: '', tag: 'idea', pinned: false,
    ...existing
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function submit() {
    if (!form.title.trim() || !form.content.trim()) { setErr('Title and content required'); return }
    setSaving(true); setErr('')
    const method = existing ? 'PATCH' : 'POST'
    const res = await fetch('/api/vault/notes', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(existing ? { id: existing.id, ...form } : form)
    })
    if (res.ok) { const d = await res.json(); onSave(d); onClose() }
    else { const d = await res.json(); setErr(d.error || 'Failed') }
    setSaving(false)
  }

  const tag = getTagConfig(form.tag)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">{existing ? 'Edit Note' : 'New Note'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-5 space-y-4">

          {/* Tag selector */}
          <div className="flex gap-2 flex-wrap">
            {TAGS.map(t => (
              <button key={t.key}
                onClick={() => set('tag', t.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  form.tag === t.key ? 'text-white border-transparent' : 'border-gray-700 text-gray-500 hover:border-gray-600'
                }`}
                style={form.tag === t.key ? { backgroundColor: t.color + '33', borderColor: t.color, color: t.color } : {}}
              >{t.icon} {t.label}</button>
            ))}
          </div>

          {/* Title */}
          <input type="text" placeholder="Title"
            value={form.title} onChange={e => set('title', e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none font-medium"
            style={{ '--tw-ring-color': tag.color }}
          />

          {/* Content */}
          <textarea placeholder="Write your note, idea, or thoughts here..."
            value={form.content} onChange={e => set('content', e.target.value)}
            rows={8}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none leading-relaxed"
          />

          {/* Pin */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.pinned} onChange={e => set('pinned', e.target.checked)}
              className="rounded" />
            <span className="text-gray-400 text-sm">📌 Pin this note</span>
          </label>

          {err && <p className="text-red-400 text-sm">{err}</p>}

          <button onClick={submit} disabled={saving}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: tag.color }}
          >
            {saving ? 'Saving...' : (existing ? 'Update Note' : 'Save Note')}
          </button>
        </div>
      </div>
    </div>
  )
}

function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  const tag = getTagConfig(note.tag)
  const [expanded, setExpanded] = useState(false)
  const isLong = note.content.length > 200

  return (
    <div className={`bg-gray-900 border rounded-2xl p-4 transition-all group ${
      note.pinned ? 'border-yellow-500/30' : 'border-gray-800 hover:border-gray-700'
    }`}>
      {/* Top */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: tag.color + '22', color: tag.color }}>
            {tag.icon} {tag.label}
          </span>
          {note.pinned && <span className="text-yellow-500 text-xs">📌</span>}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onTogglePin(note)} className="text-gray-600 hover:text-yellow-400 text-xs transition-colors">
            {note.pinned ? 'Unpin' : 'Pin'}
          </button>
          <button onClick={() => onEdit(note)} className="text-gray-600 hover:text-blue-400 text-xs transition-colors">Edit</button>
          <button onClick={() => onDelete(note.id)} className="text-gray-600 hover:text-red-400 text-xs transition-colors">Del</button>
        </div>
      </div>

      <h3 className="text-white font-semibold text-base mb-2">{note.title}</h3>

      <p className={`text-gray-400 text-sm leading-relaxed whitespace-pre-line ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
        {note.content}
      </p>

      {isLong && (
        <button onClick={() => setExpanded(!expanded)}
          className="text-xs mt-2 transition-colors"
          style={{ color: tag.color }}>
          {expanded ? 'Show less' : 'Read more...'}
        </button>
      )}

      <p className="text-gray-700 text-xs mt-3">
        {new Date(note.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>
    </div>
  )
}

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [activeTag, setActiveTag] = useState('all')
  const [search, setSearch] = useState('')

  async function fetchNotes() {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeTag !== 'all') params.set('tag', activeTag)
    const res = await fetch(`/api/vault/notes?${params}`)
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
    !search || n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  const pinned = filtered.filter(n => n.pinned)
  const unpinned = filtered.filter(n => !n.pinned)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/vault/dashboard" className="text-gray-600 hover:text-white text-sm transition-colors">← Back</Link>
            <h1 className="text-white font-bold text-xl">📝 Notes & Goals</h1>
          </div>
          <button onClick={() => { setEditing(null); setShowForm(true) }}
            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-sm font-bold transition-colors">
            + New Note
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* Search */}
        <input type="text" placeholder="🔍 Search notes..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
        />

        {/* Tag filter */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveTag('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeTag === 'all' ? 'bg-gray-700 border-gray-700 text-white' : 'border-gray-800 text-gray-500'
            }`}>All</button>
          {TAGS.map(t => (
            <button key={t.key} onClick={() => setActiveTag(t.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeTag === t.key ? 'text-white border-transparent' : 'border-gray-800 text-gray-500 hover:border-gray-700'
              }`}
              style={activeTag === t.key ? { backgroundColor: t.color + '33', borderColor: t.color, color: t.color } : {}}
            >{t.icon} {t.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-600">Loading...</div>
        ) : !filtered.length ? (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-3">📝</p>
            <p>{search ? 'No notes match your search.' : 'No notes yet.'}</p>
            {!search && <button onClick={() => setShowForm(true)} className="mt-3 text-amber-400 text-sm hover:underline">Write your first note</button>}
          </div>
        ) : (
          <>
            {/* Pinned */}
            {pinned.length > 0 && (
              <div>
                <p className="text-yellow-500/70 text-xs font-semibold uppercase tracking-wider mb-3">📌 Pinned</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pinned.map(n => (
                    <NoteCard key={n.id} note={n}
                      onEdit={n => { setEditing(n); setShowForm(true) }}
                      onDelete={deleteNote}
                      onTogglePin={togglePin}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Others */}
            {unpinned.length > 0 && (
              <div>
                {pinned.length > 0 && <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-3">Others</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {unpinned.map(n => (
                    <NoteCard key={n.id} note={n}
                      onEdit={n => { setEditing(n); setShowForm(true) }}
                      onDelete={deleteNote}
                      onTogglePin={togglePin}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showForm && (
        <NoteForm
          existing={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}