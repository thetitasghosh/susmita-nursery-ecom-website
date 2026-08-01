'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { loginAction, getAccountAction } from '@/server/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Redirect to dashboard if already authenticated as admin
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await getAccountAction()
        if (res.success && res.profile?.role === 'admin') {
          router.push('/dashboard')
        }
      } catch {
        // Not authenticated
      }
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    try {
      const res = await loginAction(formData)

      if (res.success) {
        const acc = await getAccountAction()
        if (acc.success && acc.profile?.role === 'admin') {
          setSuccess(true)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('nursery_admin_auth', 'true')
          }
          setTimeout(() => {
            router.push('/dashboard')
          }, 800)
        } else {
          setError('Access Denied: Customer accounts are not authorized to view the supervisor dashboard.')
          setLoading(false)
        }
      } else {
        setError(res.error || 'Invalid administrative credentials. Please check spelling.')
        setLoading(false)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection error. Please try again.'
      setError(msg)
      setLoading(false)
    }
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

