'use client'

import React, { useState, useEffect } from 'react'
import { 
  Mail, 
  Search, 
  X, 
  Sparkles,
  Send,
  Eye,
  CheckCircle
} from 'lucide-react'
import { allProducts, Product } from '@/lib/products'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from '@/components/ui/sheet'

interface Subscriber {
  id: number
  email: string
  isActive: boolean
  subscribedAt: string
}

const initialSubscribers: Subscriber[] = [
  { id: 1, email: 'sourav.ganguly@bcci.org', isActive: true, subscribedAt: 'Jul 15, 2026' },
  { id: 2, email: 'mimi.chakraborty@parliament.in', isActive: true, subscribedAt: 'Jul 12, 2026' },
  { id: 3, email: 'dev.adhikari@tollywood.com', isActive: true, subscribedAt: 'Jul 10, 2026' },
  { id: 4, email: 'titas.ghosh@outlook.com', isActive: true, subscribedAt: 'Jun 28, 2026' },
  { id: 5, email: 'subhashree.ganguly@gmail.com', isActive: false, subscribedAt: 'May 04, 2026' }
]

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)

  // Campaign Form fields
  const [subject, setSubject] = useState('Nurture Your Sanctuary: Weekend Care Essentials')
  const [emailHeader, setEmailHeader] = useState('Your Weekend Green Guide')
  const [emailBody, setEmailBody] = useState('Summer brings unique watering and light parameters to your house plants. In this edition, we outline standard lifecycle stages for Monstera, Areca Palm, and Peace Lily. Plus, check out our recommended neem spray to safely repel common garden pests.')
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null)
  
  // List of all products to select from
  const [productList, setProductList] = useState<Product[]>([])

  // Load from localStorage
  useEffect(() => {
    const storedSub = localStorage.getItem('nursery_subs')
    if (storedSub) {
      try {
        setSubscribers(JSON.parse(storedSub))
      } catch {
        setSubscribers(initialSubscribers)
      }
    } else {
      setSubscribers(initialSubscribers)
      localStorage.setItem('nursery_subs', JSON.stringify(initialSubscribers))
    }

    // Load products list for dropdown
    const storedProd = localStorage.getItem('nursery_products')
    if (storedProd) {
      try {
        const parsed = JSON.parse(storedProd)
        setProductList(parsed)
        setFeaturedProduct(parsed[0] || null)
      } catch {
        setProductList(allProducts)
        setFeaturedProduct(allProducts[0] || null)
      }
    } else {
      setProductList(allProducts)
      setFeaturedProduct(allProducts[0] || null)
    }
  }, [])

  // Toggle active
  const toggleStatus = (id: number) => {
    const updated = subscribers.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)
    setSubscribers(updated)
    localStorage.setItem('nursery_subs', JSON.stringify(updated))
  }

  // Handle compose submit (Mock Send)
  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault()
    setSendSuccess(true)
    setTimeout(() => {
      setSendSuccess(false)
      setIsComposeOpen(false)
    }, 2800)
  }

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-neutral-dark">
            Newsletter Subscribers & Campaigns
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-1">
            Manage your marketing audience lists and compose rich-text email campaigns.
          </p>
        </div>
        <button
          onClick={() => setIsComposeOpen(true)}
          className="bg-primary hover:bg-primary-emerald text-white px-5 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all self-start sm:self-auto"
        >
          <Mail size={16} />
          <span>Compose Campaign</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search subscriber email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-neutral-400"
          />
        </div>

        <div className="text-xs text-muted-foreground font-light px-2">
          Displaying {filteredSubscribers.length} active email leads
        </div>
      </div>

      {/* Table list */}
      <div className="bg-card border border-border/80 rounded-[32px] overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="py-4 px-6 font-semibold">Lead ID</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Subscriber Email</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Subscription Date</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Marketing State</TableHead>
              <TableHead className="py-4 px-6 text-right font-semibold">Status Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscribers.length > 0 ? (
              filteredSubscribers.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="py-4 px-6 font-bold text-neutral-400">#{sub.id}</TableCell>
                  <TableCell className="py-4 px-4 font-semibold text-neutral-800">{sub.email}</TableCell>
                  <TableCell className="py-4 px-4 font-light text-neutral-400">{sub.subscribedAt}</TableCell>
                  <TableCell className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                      sub.isActive 
                        ? 'bg-secondary/15 text-primary border-secondary/35' 
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {sub.isActive ? 'Active' : 'Unsubscribed'}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <button
                      onClick={() => toggleStatus(sub.id)}
                      className={`text-[10px] px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors ${
                        sub.isActive
                          ? 'text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border-red-200'
                          : 'text-primary bg-primary/5 hover:bg-primary hover:text-white border-primary/25'
                      }`}
                    >
                      {sub.isActive ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground font-light">
                  No subscribers matching search query.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Compose Campaign Sheet Drawer */}
      <Sheet open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <SheetContent className="max-w-4xl flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Compose Email Campaign</SheetTitle>
            <SheetDescription>
              Send mock newsletter to all active subscribers
            </SheetDescription>
          </SheetHeader>

          {/* Grid content split: Form Left, Real Preview Right */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Left: Compose Form */}
            <form id="campaign-form" onSubmit={handleSendCampaign} className="w-1/2 flex flex-col h-full border-r border-border/60 bg-muted/5">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-700">Email Subject Line *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Nurture Your Companion: Weekend Guide"
                  className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-700">Newsletter Header Title *</label>
                <input
                  type="text"
                  required
                  value={emailHeader}
                  onChange={(e) => setEmailHeader(e.target.value)}
                  placeholder="e.g. Your Weekend Green Guide"
                  className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-700">Body Text paragraph *</label>
                <textarea
                  rows={6}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Enter the main body paragraph content..."
                  className="w-full bg-white border border-border/80 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs leading-normal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-700">Spotlight Featured Product</label>
                <select
                  value={featuredProduct ? featuredProduct.id : ''}
                  onChange={(e) => {
                    const match = productList.find(p => p.id === Number(e.target.value))
                    if (match) setFeaturedProduct(match)
                  }}
                  className="w-full bg-white border border-border/80 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
                >
                  {productList.map(prod => (
                    <option key={prod.id} value={prod.id}>{prod.name} (₹{prod.price})</option>
                  ))}
                </select>
              </div>

              </div>
              <div className="p-6 border-t border-border/40 bg-card shrink-0 flex gap-2.5">
                <SheetClose>
                  <button
                    type="button"
                    className="px-5 py-3 rounded-full border border-border text-neutral-600 hover:bg-muted font-bold text-xs cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                </SheetClose>
                <button
                  type="submit"
                  form="campaign-form"
                  disabled={sendSuccess}
                  className="flex-1 bg-primary hover:bg-primary-emerald text-white py-3 rounded-full font-bold text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send size={13} />
                  <span>Send Campaign to Subscribers</span>
                </button>
              </div>
            </form>

            {/* Right: Real Email Preview */}
            <div className="w-1/2 overflow-y-auto p-6 bg-neutral-100 flex flex-col gap-3 relative select-none">
              <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5 pb-1 select-none">
                <Eye size={12} className="text-primary" />
                <span>Real-Time HTML Email Preview</span>
              </div>

              {/* Mock Email Client Container */}
              <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
                {/* Mock Client Header */}
                <div className="bg-muted/40 p-4 border-b border-border text-[10px] text-neutral-500 space-y-1">
                  <p><span className="font-semibold text-neutral-800">From:</span> newsletter@susmitanursery.com</p>
                  <p><span className="font-semibold text-neutral-800">To:</span> subscribers-active@list.susmitanursery.com</p>
                  <p><span className="font-semibold text-neutral-800">Subject:</span> {subject}</p>
                </div>

                {/* Email Template content */}
                <div className="p-8 space-y-6">
                  <div className="text-center pb-4 border-b border-border/40 space-y-1">
                    <span className="font-serif font-bold text-base text-primary tracking-wide block">Susmita Nursery</span>
                    <span className="text-[8px] text-neutral-400 font-sans tracking-widest uppercase block">Botanical companion guidelines</span>
                  </div>

                  <h2 className="text-center font-serif font-bold text-xl text-neutral-dark leading-tight pt-2">
                    {emailHeader}
                  </h2>

                  <p className="text-neutral-600 font-light font-sans text-xs leading-relaxed text-center max-w-sm mx-auto">
                    {emailBody}
                  </p>

                  {featuredProduct && (
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center justify-between max-w-xs mx-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden border border-border/60 relative bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={featuredProduct.image} alt={featuredProduct.name} className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <span className="font-semibold text-neutral-800 text-[11px] block leading-tight">{featuredProduct.name}</span>
                          <span className="text-[9px] text-neutral-400 block mt-0.5">₹{featuredProduct.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-white bg-primary px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0 cursor-pointer">
                        Shop Now
                      </span>
                    </div>
                  )}

                  <div className="border-t border-border/40 pt-6 text-center text-[9px] text-neutral-400 font-sans space-y-1">
                    <p>© 2026 Susmita Nursery. Cultivating Green Companions.</p>
                    <p className="font-light">Gangni , Badkulla , Nadia , 741121 , W.B.</p>
                    <p className="pt-2"><span className="underline hover:text-neutral-600 cursor-pointer">Unsubscribe from this mailing list</span></p>
                  </div>
                </div>
              </div>

              {/* Send Campaign Success Overlay */}
              {sendSuccess && (
                <div className="absolute inset-0 bg-primary/95 text-white flex flex-col items-center justify-center gap-3.5 z-30 p-8 rounded-2xl transition-opacity duration-300">
                  <div className="scale-100 rotate-0">
                    <CheckCircle size={44} className="text-secondary" />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="font-serif font-bold text-lg">Campaign Dispatched!</h4>
                    <p className="text-[10px] text-white/80 font-light max-w-xs mx-auto">
                      Mock newsletter successfully sent to all active subscribers. Delivering email components...
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
