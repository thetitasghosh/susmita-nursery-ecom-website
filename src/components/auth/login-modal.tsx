'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Phone, CheckCircle, AlertCircle } from 'lucide-react'
import { useShop } from '@/lib/shop-context'
import { customerLoginAction, customerSignupAction } from '@/server/auth'

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, refreshSession, addToast } = useShop()
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  
  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isLoginModalOpen) return null

  const handleClose = () => {
    setError(null)
    setSuccess(false)
    setLoading(false)
    closeLoginModal()
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await customerLoginAction({ email, password })
      if (res.success) {
        setSuccess(true)
        addToast('Sign in successful! Welcome back.', 'success')
        await refreshSession()
        setTimeout(() => {
          handleClose()
        }, 1000)
      } else {
        setError(res.error || 'Invalid email or password.')
        setLoading(false)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await customerSignupAction({ email, password, fullName, phone })
      if (res.success) {
        setSuccess(true)
        addToast('Account created successfully! Please sign in.', 'success')
        // Automatically switch to sign in
        setTimeout(() => {
          setActiveTab('signin')
          setSuccess(false)
          setLoading(false)
          setPassword('')
        }, 1500)
      } else {
        setError(res.error || 'Failed to create account. Please try again.')
        setLoading(false)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-card/90 border border-border/80 rounded-[32px] p-6 md:p-8 shadow-2xl backdrop-blur-md overflow-hidden z-10 flex flex-col font-sans"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Logo container */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center border border-border bg-white shadow-sm mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/logo-sn.jpeg" alt="Susmita Nursery Logo" className="object-cover w-full h-full" />
            </div>
            <h2 className="text-xl font-bold text-neutral-dark tracking-tight">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTab === 'signin' 
                ? 'Sign in to access your green sanctuary.' 
                : 'Join us and start cultivating your garden.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-muted/60 p-1 rounded-xl mb-6 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('signin'); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'signin' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs flex items-center gap-2 mb-4 animate-in fade-in">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-2xl text-xs flex items-center gap-2 mb-4 animate-in fade-in">
              <CheckCircle size={15} className="shrink-0" />
              <span>
                {activeTab === 'signin' ? 'Access granted, loading profile...' : 'Success! Switching to Sign In...'}
              </span>
            </div>
          )}

          {/* Auth Forms */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-primary hover:bg-primary-emerald disabled:bg-primary/60 text-white py-3 rounded-full font-bold text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-primary hover:bg-primary-emerald disabled:bg-primary/60 text-white py-3 rounded-full font-bold text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Register Account</span>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
