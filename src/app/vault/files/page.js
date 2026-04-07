'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const FILE_TAGS = [
  { key: 'ai-analysis', label: 'AI Analysis', icon: '🤖', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  { key: 'exam',        label: 'Exam Notes',  icon: '📚', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  { key: 'work',        label: 'Work Docs',   icon: '💼', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
  { key: 'general',     label: 'General',     icon: '📄', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
]

function getTag(key) { return FILE_TAGS.find(t => t.key === key) || FILE_TAGS[FILE_TAGS.length - 1] }

function formatSize(kb) {
  if (!kb) return ''
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

const EXT_ICONS = {
  pdf: '📕', doc: '📘', docx: '📘', txt: '📄',
  md: '📋', png: '🖼️', jpg: '🖼️', jpeg: '🖼️',
}

// ─── UPLOAD FORM ─────────────────────────────────────────────────────────────
function UploadForm({ onUpload, onClose }) {
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', tag: 'general' })
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleFile(f) {
    if (!f) return
    setFile(f)
    if (!form.name) set('name', f.name.replace(/\.[^/.]+$/, ''))
  }

  async function submit() {
    if (!file) { setErr('Select a file first'); return }
    setUploading(true); setErr('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('name', form.name || file.name)
    fd.append('description', form.description)
    fd.append('tag', form.tag)
    const res = await fetch('/api/vault/files', { method: 'POST', body: fd })
    if (res.ok) { onUpload(await res.json()); onClose() }
    else { const d = await res.json(); setErr(d.error || 'Upload failed') }
    setUploading(false)
  }

  const tag = getTag(form.tag)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto">

        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-slate-800 font-bold text-lg">📁 Upload File</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 text-sm transition-colors">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
            className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
            style={file
              ? { borderColor: '#10b981', backgroundColor: '#f0fdf4' }
              : dragging
                ? { borderColor: '#3b82f6', backgroundColor: '#eff6ff' }
                : { borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }}>
            <input ref={inputRef} type="file"
              accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg"
              onChange={e => handleFile(e.target.files[0])} className="hidden" />
            {file ? (
              <div>
                <p className="text-3xl mb-2">
                  {EXT_ICONS[file.name.split('.').pop()?.toLowerCase()] || '📄'}
                </p>
                <p className="text-emerald-700 font-semibold text-sm">{file.name}</p>
                <p className="text-emerald-500 text-xs mt-1">{formatSize(Math.round(file.size / 1024))}</p>
                <button onClick={e => { e.stopPropagation(); setFile(null) }}
                  className="mt-2 text-xs text-slate-400 hover:text-red-400 transition-colors">
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p className="text-3xl mb-2">📂</p>
                <p className="text-slate-500 text-sm font-medium">Click or drag to upload</p>
                <p className="text-slate-300 text-xs mt-1">PDF, DOCX, TXT, MD, PNG, JPG</p>
              </div>
            )}
          </div>

          {/* Tag */}
          <div className="flex gap-1.5 flex-wrap">
            {FILE_TAGS.map(t => (
              <button key={t.key} onClick={() => set('tag', t.key)}
                className="px-3 py-1 rounded-full text-xs font-bold border-2 transition-all"
                style={form.tag === t.key
                  ? { borderColor: t.color, backgroundColor: t.bg, color: t.color }
                  : { borderColor: '#f1f5f9', color: '#94a3b8' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Name */}
          <input type="text" placeholder="File display name"
            value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-400" />

          {/* Description */}
          <input type="text" placeholder="Short description (optional)"
            value={form.description} onChange={e => set('description', e.target.value)}
            className="w-full bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-slate-400" />

          {err && <p className="text-red-500 text-sm">{err}</p>}

          <button onClick={submit} disabled={uploading || !file}
            className="w-full py-3.5 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-50 text-sm"
            style={{ backgroundColor: tag.color }}>
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function FilesPage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeTag, setActiveTag] = useState('all')
  const [search, setSearch] = useState('')
  const [openingId, setOpeningId] = useState(null)

  async function fetchFiles() {
    setLoading(true)
    const res = await fetch('/api/vault/files')
    if (res.ok) setFiles(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchFiles() }, [])

  async function openFile(f) {
    setOpeningId(f.id)
    const res = await fetch('/api/vault/files', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: f.storage_path })
    })
    if (res.ok) { const { url } = await res.json(); window.open(url, '_blank') }
    setOpeningId(null)
  }

  async function deleteFile(f) {
    if (!confirm('Delete this file?')) return
    await fetch(`/api/vault/files?id=${f.id}&path=${encodeURIComponent(f.storage_path)}`, { method: 'DELETE' })
    setFiles(prev => prev.filter(x => x.id !== f.id))
  }

  const filtered = files.filter(f =>
    (activeTag === 'all' || f.tag === activeTag) &&
    (!search || f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.description?.toLowerCase().includes(search.toLowerCase()))
  )

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
              <h1 className="text-slate-800 font-bold text-lg">📁 Files</h1>
            </div>
            <button onClick={() => setShowForm(true)}
              className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
              + Upload
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">

          {/* Search */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm">🔍</span>
            <input type="text" placeholder="Search files..."
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
            {FILE_TAGS.map(t => (
              <button key={t.key} onClick={() => setActiveTag(t.key)}
                className="px-3 py-1 rounded-full text-xs font-bold border-2 transition-all"
                style={activeTag === t.key
                  ? { borderColor: t.color, backgroundColor: t.bg, color: t.color }
                  : { borderColor: '#f1f5f9', color: '#94a3b8' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 h-36 animate-pulse" />
              ))}
            </div>
          ) : !filtered.length ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">📁</p>
              <p className="text-slate-400 text-sm">
                {search ? 'No files match your search.' : 'No files uploaded yet.'}
              </p>
              {!search && (
                <button onClick={() => setShowForm(true)}
                  className="mt-3 text-emerald-500 text-sm font-semibold hover:underline">
                  Upload first file
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-6">
              {filtered.map(f => {
                const tag = getTag(f.tag)
                const ext = f.storage_path?.split('.').pop()?.toLowerCase() || ''
                const extIcon = EXT_ICONS[ext] || '📄'
                const extLabel = ext.toUpperCase()

                return (
                  <div key={f.id}
                    className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm rounded-2xl p-4 group transition-all">

                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5"
                        style={{ backgroundColor: tag.bg }}>
                        <span className="text-xl leading-none">{extIcon}</span>
                        <span className="text-[9px] font-bold leading-none" style={{ color: tag.color }}>{extLabel}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openFile(f)} disabled={openingId === f.id}
                          className="text-xs text-slate-400 hover:text-blue-500 font-medium transition-colors disabled:opacity-50">
                          {openingId === f.id ? '...' : 'Open'}
                        </button>
                        <button onClick={() => deleteFile(f)}
                          className="text-xs text-slate-400 hover:text-red-400 font-medium transition-colors">
                          Del
                        </button>
                      </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-slate-700 font-semibold text-sm mb-1 line-clamp-2 leading-snug">{f.name}</h3>

                    {f.description && (
                      <p className="text-slate-400 text-xs mb-2 line-clamp-1">{f.description}</p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{ backgroundColor: tag.bg, color: tag.color, border: `1px solid ${tag.border}` }}>
                        {tag.icon} {tag.label}
                      </span>
                      <span className="text-slate-300 text-xs">{formatSize(f.size_kb)}</span>
                    </div>

                    <p className="text-slate-300 text-xs mt-2">
                      {new Date(f.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <UploadForm
          onUpload={f => setFiles(prev => [f, ...prev])}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  )
}