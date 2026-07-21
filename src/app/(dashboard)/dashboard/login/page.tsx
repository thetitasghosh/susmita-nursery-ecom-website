'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, CheckCircle, AlertCircle, Sprout } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@susmitanursery.com')
  const [password, setPassword] = useState('admin')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('nursery_admin_auth') === 'true'
      if (isAuth) {
        router.push('/dashboard')
      }
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Simulate database auth check after 800ms
    setTimeout(() => {
      if (email === 'admin@susmitanursery.com' && password === 'admin') {
        setSuccess(true)
        sessionStorage.setItem('nursery_admin_auth', 'true')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setError('Invalid administrative credentials. Please check spelling.')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="w-full max-w-md font-sans">
      <div className="bg-card border border-border/80 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Top visual brand banner */}
        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center border border-border bg-white shadow-sm mb-6 select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/logo-sn.jpeg" alt="Susmita Nursery" className="object-cover w-full h-full" />
        </div>

        <div className="text-center space-y-1 mb-8">
          <h1 className="text-2xl font-sans font-bold text-neutral-dark tracking-tight">
            Dashboard Sign In
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Enter nursery supervisor authorization credentials.
          </p>
        </div>

        {/* Credentials hints alert */}
        <div className="w-full bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6 text-xs space-y-1">
          <span className="font-bold text-primary block leading-none flex items-center gap-1.5 mb-1.5">
            <Sprout size={13} className="text-secondary" />
            <span>Demo Auth Credentials</span>
          </span>
          <p className="text-neutral-600 font-light"><span className="font-semibold text-neutral-700">Email:</span> admin@susmitanursery.com</p>
          <p className="text-neutral-600 font-light"><span className="font-semibold text-neutral-700">Password:</span> admin</p>
        </div>

        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs flex items-center gap-2 mb-6 animate-pulse">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-neutral-700">Administrator Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@susmitanursery.com"
                className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-neutral-700">Access Key Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-primary hover:bg-primary-emerald disabled:bg-primary/60 text-white py-3.5 rounded-full font-bold text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle size={15} className="text-secondary" />
                  <span>Access Granted...</span>
                </>
              ) : (
                <span>Sign In to Console</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
