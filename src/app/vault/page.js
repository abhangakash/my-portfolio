'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react'

export default function VaultLogin() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (!password) return
    setLoading(true)
    setError(false)
    
    try {
      const res = await fetch('/api/vault/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      
      if (res.ok) {
        router.push('/vault/dashboard')
      } else {
        setError(true)
        // Shake animation effect trigger
        setTimeout(() => setError(false), 500)
      }
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-indigo-500/30">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full" />

      <div className={`w-full max-w-md transition-transform duration-500 ${error ? 'animate-shake' : ''}`}>
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Scanning Line Effect */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent animate-scan" />

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 mb-4 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-white text-3xl font-black tracking-tight ">A's VAULT</h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium tracking-wide">ENCRYPTION ACTIVE • ENTER ACCESS KEY</p>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Access Token"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className={`w-full bg-black/40 text-white border ${error ? 'border-red-500' : 'border-zinc-800 group-focus-within:border-indigo-500/50'} rounded-xl px-5 py-4 outline-none transition-all font-mono tracking-widest placeholder:tracking-normal placeholder:font-sans placeholder:text-zinc-600`}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest text-center animate-pulse">
                Access Denied - Invalid Credentials
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !password}
              className="group relative w-full bg-white text-black font-bold py-4 rounded-xl transition-all hover:bg-indigo-500 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>AUTHORIZE ACCESS</span>
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
              FOR AKASH Only
            </p>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="text-center mt-6 text-zinc-700 text-[11px] uppercase tracking-widest">
          End-to-End Encrypted Node: <span className="text-zinc-500">v2.0.4-SEC</span>
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  )
}