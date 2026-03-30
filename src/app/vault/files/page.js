'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const FILE_TAGS = [
  { key: 'ai-analysis', label: 'AI Analysis', icon: '🤖', color: '#3b82f6' },
  { key: 'exam',        label: 'Exam Notes',  icon: '📚', color: '#8b5cf6' },
  { key: 'work',        label: 'Work Docs',   icon: '💼', color: '#6b7280' },
  { key: 'general',     label: 'General',     icon: '📄', color: '#10b981' },
]

function getTagConfig(key) {
  return FILE_TAGS.find(t => t.key === key) || FILE_TAGS[FILE_TAGS.length - 1]
}

function formatSize(kb) {
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

function UploadForm({ onUpload, onClose }) {
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', tag: 'general' })
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [err, setErr] = useState('')
  const inputRef = useRef()

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleFileChange(e) {
    const f = e.target.files[0]
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
    if (res.ok) { const d = await res.json(); onUpload(d); onClose() }
    else { const d = await res.json(); setErr(d.error || 'Upload failed') }
    setUploading(false)
  }

  const tag = getTagConfig(form.tag)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">📁 Upload File</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-5 space-y-4">

          {/* Drop zone */}
          <div
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              file ? 'border-green-600 bg-green-600/5' : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg"
              onChange={handleFileChange} className="hidden" />
            {file ? (
              <div>
                <p className="text-4xl mb-2">📄</p>
                <p className="text-green-400 font-medium text-sm">{file.name}</p>
                <p className="text-gray-500 text-xs mt-1">{formatSize(Math.round(file.size / 1024))}</p>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-2">📂</p>
                <p className="text-gray-400 text-sm">Click to select file</p>
                <p className="text-gray-600 text-xs mt-1">PDF, DOCX, TXT, MD, Images</p>
              </div>
            )}
          </div>

          {/* Tag */}
          <div className="flex gap-2 flex-wrap">
            {FILE_TAGS.map(t => (
              <button key={t.key}
                onClick={() => set('tag', t.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  form.tag === t.key ? 'text-white border-transparent' : 'border-gray-700 text-gray-500'
                }`}
                style={form.tag === t.key ? { backgroundColor: t.color + '33', borderColor: t.color, color: t.color } : {}}
              >{t.icon} {t.label}</button>
            ))}
          </div>

          {/* Name */}
          <input type="text" placeholder="File display name"
            value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
          />

          {/* Description */}
          <input type="text" placeholder="Short description (optional)"
            value={form.description} onChange={e => set('description', e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
          />

          {err && <p className="text-red-400 text-sm">{err}</p>}

          <button onClick={submit} disabled={uploading || !file}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: tag.color }}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>
    </div>
  )
}

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

  async function openFile(file) {
    setOpeningId(file.id)
    const res = await fetch('/api/vault/files', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: file.storage_path })
    })
    if (res.ok) {
      const { url } = await res.json()
      window.open(url, '_blank')
    }
    setOpeningId(null)
  }

  async function deleteFile(file) {
    if (!confirm('Delete this file?')) return
    await fetch(`/api/vault/files?id=${file.id}&path=${encodeURIComponent(file.storage_path)}`, { method: 'DELETE' })
    setFiles(prev => prev.filter(f => f.id !== file.id))
  }

  const filtered = files.filter(f =>
    (activeTag === 'all' || f.tag === activeTag) &&
    (!search || f.name.toLowerCase().includes(search.toLowerCase()) || f.description?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/vault/dashboard" className="text-gray-600 hover:text-white text-sm transition-colors">← Back</Link>
            <h1 className="text-white font-bold text-xl">📁 Files</h1>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            + Upload
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* Search */}
        <input type="text" placeholder="🔍 Search files..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
        />

        {/* Tag filter */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveTag('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeTag === 'all' ? 'bg-gray-700 border-gray-700 text-white' : 'border-gray-800 text-gray-500'
            }`}>All</button>
          {FILE_TAGS.map(t => (
            <button key={t.key} onClick={() => setActiveTag(t.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                activeTag === t.key ? 'text-white border-transparent' : 'border-gray-800 text-gray-500 hover:border-gray-700'
              }`}
              style={activeTag === t.key ? { backgroundColor: t.color + '33', borderColor: t.color, color: t.color } : {}}
            >{t.icon} {t.label}</button>
          ))}
        </div>

        {/* Files grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-600">Loading...</div>
        ) : !filtered.length ? (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-3">📁</p>
            <p>{search ? 'No files match your search.' : 'No files uploaded yet.'}</p>
            {!search && <button onClick={() => setShowForm(true)} className="mt-3 text-emerald-400 text-sm hover:underline">Upload first file</button>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(f => {
              const tag = getTagConfig(f.tag)
              const ext = f.storage_path?.split('.').pop()?.toUpperCase() || 'FILE'
              return (
                <div key={f.id}
                  className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-4 group transition-all">
                  {/* File icon */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: tag.color + '22', color: tag.color }}>
                      {ext}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openFile(f)}
                        disabled={openingId === f.id}
                        className="text-gray-500 hover:text-blue-400 text-xs transition-colors disabled:opacity-50">
                        {openingId === f.id ? '...' : 'Open'}
                      </button>
                      <button onClick={() => deleteFile(f)}
                        className="text-gray-500 hover:text-red-400 text-xs transition-colors">Del</button>
                    </div>
                  </div>

                  <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">{f.name}</h3>

                  {f.description && (
                    <p className="text-gray-500 text-xs mb-2 line-clamp-2">{f.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: tag.color + '22', color: tag.color }}>
                      {tag.icon} {tag.label}
                    </span>
                    <span className="text-gray-600 text-xs">
                      {f.size_kb ? formatSize(f.size_kb) : ''}
                    </span>
                  </div>

                  <p className="text-gray-700 text-xs mt-2">
                    {new Date(f.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && (
        <UploadForm
          onUpload={f => setFiles(prev => [f, ...prev])}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}