'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { useShop } from '@/lib/shop-context'
import {
  User,
  MapPin,
  Edit3,
  CheckCircle2,
  Store,
  Copy,
  Plus,
  Trash2,
  Heart,
  X,
  Check,
  Phone,
  Mail,
  Home,
  Briefcase,
  ShieldCheck,
  QrCode,
  Info
} from 'lucide-react'

// Default User Profile
const DEFAULT_PROFILE = {
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.com',
  phone: '+91 98301 23456',
  joinedDate: 'October 2024',
  preferredCategory: 'Indoor & Air Purifying Plants',
  avatarUrl: ''
}

// Initial Saved Addresses / Locations
const INITIAL_ADDRESSES = [
  {
    id: 'addr-1',
    label: 'Home',
    isDefault: true,
    fullName: 'Ananya Sharma',
    street: '42 Palm Grove Avenue, Flat 4B, Salt Lake Sector V',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700091',
    phone: '+91 98301 23456'
  },
  {
    id: 'addr-2',
    label: 'Work',
    isDefault: false,
    fullName: 'Ananya Sharma (Green Studio)',
    street: '12B Eco Park Road, Tech Tower 3rd Floor, New Town',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700156',
    phone: '+91 98301 98765'
  }
]

interface ReservationItem {
  id: number
  name: string
  size: string
  qty: number
  price: number
  image: string
}

interface PlantReservation {
  id: string
  date: string
  status: 'Ready for Pickup' | 'Preparing Plants' | 'Fulfilled In-Store'
  storeLocation: string
  storeHours: string
  items: ReservationItem[]
  notes?: string
}

// Mock Reservations tailored to Susmita Nursery Offline Store Workflow
const MOCK_RESERVATIONS: PlantReservation[] = [
  {
    id: 'SN-RES-84920',
    date: 'July 19, 2026',
    status: 'Ready for Pickup',
    storeLocation: 'Susmita Nursery Store, Gangni, Badkulla, Nadia, 741121, W.B.',
    storeHours: '9:00 AM – 8:00 PM (Mon – Sun)',
    notes: 'Requested terracotta ceramic pots for both specimens.',
    items: [
      {
        id: 1,
        name: 'Monstera Deliciosa',
        size: 'Medium (10-12 inch)',
        qty: 1,
        price: 1250,
        image: '/images/plants/monstera-plant.jpg'
      },
      {
        id: 2,
        name: 'Peace Lily',
        size: 'Medium (8-10 inch)',
        qty: 1,
        price: 850,
        image: '/images/plants/peace-lily.jpg'
      }
    ]
  },
  {
    id: 'SN-RES-77123',
    date: 'June 28, 2026',
    status: 'Fulfilled In-Store',
    storeLocation: 'Susmita Nursery Store, Gangni, Badkulla, Nadia, 741121, W.B.',
    storeHours: '9:00 AM – 8:00 PM (Mon – Sun)',
    items: [
      {
        id: 3,
        name: 'Pothos Hanging',
        size: 'Small basket (6 inch)',
        qty: 1,
        price: 399,
        image: '/images/plants/pothos-hanging.jpg'
      },
      {
        id: 4,
        name: 'Succulent Collection',
        size: 'Set of 3 (2 inch pots)',
        qty: 1,
        price: 299,
        image: '/images/plants/succulent-collection.jpg'
      }
    ]
  }
]

export default function UserAccountPage() {
  const { addToast, wishlist } = useShop()
  const [activeTab, setActiveTab] = useState<'reservations' | 'addresses' | 'profile'>('reservations')
  
  // Profile State
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState(DEFAULT_PROFILE)

  // Address State
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [newAddr, setNewAddr] = useState({
    label: 'Home',
    fullName: '',
    street: '',
    city: '',
    state: 'West Bengal',
    pincode: '',
    phone: ''
  })

  // Selected Reservation Details Modal State
  const [activeReservationModal, setActiveReservationModal] = useState<PlantReservation | null>(null)

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('susmita_user_profile')
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        setProfile(parsed)
        setEditForm(parsed)
      }
      const savedAddrs = localStorage.getItem('susmita_user_addresses')
      if (savedAddrs) {
        setAddresses(JSON.parse(savedAddrs))
      }
    } catch (e) {
      console.error('Failed to load user state from localStorage', e)
    }
  }, [])

  // Save Profile Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setProfile(editForm)
    localStorage.setItem('susmita_user_profile', JSON.stringify(editForm))
    setIsEditingProfile(false)
    addToast('Profile information updated!', 'success')
  }

  // Add Address Handler
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddr.fullName || !newAddr.street || !newAddr.city || !newAddr.pincode) {
      addToast('Please complete all required fields.', 'error')
      return
    }

    const created = {
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0,
      ...newAddr
    }

    const updated = [...addresses, created]
    setAddresses(updated)
    localStorage.setItem('susmita_user_addresses', JSON.stringify(updated))
    setShowAddressModal(false)
    setNewAddr({ label: 'Home', fullName: '', street: '', city: '', state: 'West Bengal', pincode: '', phone: '' })
    addToast('New location saved!', 'success')
  }

  // Delete Address
  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id)
    setAddresses(updated)
    localStorage.setItem('susmita_user_addresses', JSON.stringify(updated))
    addToast('Address removed.', 'info')
  }

  // Set Default Address
  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }))
    setAddresses(updated)
    localStorage.setItem('susmita_user_addresses', JSON.stringify(updated))
    addToast('Default address updated.', 'success')
  }

  // Copy helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addToast(`Code ${text} copied to clipboard!`, 'info')
  }

  return (
    <main className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <div className="flex-1 bg-background pb-20">
        {/* Sleek Profile Banner */}
        <div className="bg-gradient-to-r from-primary-emerald via-emerald-900 to-primary text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 shadow-xl flex items-center justify-center text-accent text-3xl font-serif font-bold overflow-hidden">
                  {profile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{profile.name.charAt(0)}</span>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground p-1.5 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer"
                  title="Edit Profile"
                >
                  <Edit3 size={12} />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-white">
                    {profile.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-semibold">
                    <ShieldCheck size={13} className="text-accent" />
                    Verified Nursery Member
                  </span>
                </div>
                <p className="text-xs text-white/80 font-light flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1.5"><Mail size={13} className="text-emerald-300" /> {profile.email}</span>
                  <span className="hidden sm:inline text-white/40">•</span>
                  <span className="flex items-center gap-1.5"><Phone size={13} className="text-emerald-300" /> {profile.phone}</span>
                </p>
                <p className="text-[11px] text-white/50 font-light pt-0.5">
                  Store Client since {profile.joinedDate}
                </p>
              </div>
            </div>

            {/* Offline Store Notice */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xs space-y-1.5 max-w-sm">
              <div className="flex items-center gap-2 text-accent font-semibold">
                <Store size={16} />
                <span>Susmita Nursery Physical Store</span>
              </div>
              <p className="text-[11px] text-white/80 font-light leading-relaxed">
                Add plants to your cart online, then share your name or phone number with our store staff at the offline nursery for instant plant retrieval!
              </p>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-card border border-border/80 rounded-2xl p-2.5 shadow-sm space-y-1 sticky top-24">
                <button
                  onClick={() => setActiveTab('reservations')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'reservations'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Store size={16} />
                    In-Store Reservations
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'reservations' ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {MOCK_RESERVATIONS.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <MapPin size={16} />
                    Saved Addresses
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {addresses.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <User size={16} />
                    Profile & Settings
                  </span>
                </button>

                <div className="h-px bg-border my-2" />

                <Link
                  href="/wishlist"
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart size={16} className="text-red-500" />
                    Saved Wishlist
                  </span>
                  {wishlist.length > 0 && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </div>

              {/* Digital In-Store Pickup Pass Card */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 border border-emerald-200 rounded-2xl p-4 space-y-3 text-xs shadow-sm">
                <div className="flex items-center justify-between text-emerald-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <QrCode size={16} className="text-primary" />
                    In-Store Pickup Pass
                  </span>
                  <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-full font-mono">
                    ACTIVE
                  </span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-emerald-200/60 space-y-1 font-mono text-[11px]">
                  <p className="text-neutral-500 text-[10px] font-sans">Name:</p>
                  <p className="font-bold text-neutral-800 font-sans">{profile.name}</p>
                  <p className="text-neutral-500 text-[10px] font-sans pt-1">Phone:</p>
                  <p className="font-bold text-primary font-sans">{profile.phone}</p>
                </div>
                <p className="text-[10px] text-emerald-800 font-light leading-relaxed">
                  Mention your name or phone when visiting Susmita Nursery store for quick plant checkout.
                </p>
              </div>
            </div>

            {/* Main Content Right */}
            <div className="lg:col-span-3">
              
              {/* TAB 1: IN-STORE RESERVATIONS */}
              {activeTab === 'reservations' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-serif font-bold text-foreground">In-Store Plant Reservations</h2>
                      <p className="text-xs text-muted-foreground font-light">Show your reservation ID or phone number when visiting Susmita Nursery</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {MOCK_RESERVATIONS.map((res) => (
                      <div key={res.id} className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
                        
                        {/* Reservation Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                              <span className="font-serif font-bold text-base text-foreground">{res.id}</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                                res.status === 'Ready for Pickup'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                              }`}>
                                {res.status === 'Ready for Pickup' ? <CheckCircle2 size={12} /> : <Store size={12} />}
                                {res.status}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground font-light">
                              Reserved on {res.date} • {res.items.length} specimen(s)
                            </p>
                          </div>

                          <button
                            onClick={() => setActiveReservationModal(res)}
                            className="px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                          >
                            <Info size={14} />
                            View Store Pass
                          </button>
                        </div>

                        {/* Plant Items with Real Catalog Product Images */}
                        <div className="space-y-3.5">
                          {res.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5">
                                <div className="w-14 h-14 bg-muted border border-border/80 rounded-xl overflow-hidden shrink-0 relative">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-foreground">{item.name}</p>
                                  <p className="text-[11px] text-muted-foreground font-light">Size: {item.size} • Qty: {item.qty}</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-foreground">₹{item.price * item.qty}</span>
                            </div>
                          ))}
                        </div>

                        {/* Store Info Footer */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-border/60 text-xs">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Store size={13} className="text-primary shrink-0" />
                            <span className="truncate max-w-xs sm:max-w-md">{res.storeLocation}</span>
                          </div>

                          <div className="flex items-center gap-2 justify-between sm:justify-end">
                            <span className="text-muted-foreground font-light">Estimated Total:</span>
                            <span className="text-base font-sans font-bold text-primary tabular-nums">₹{res.items.reduce((acc, i) => acc + i.price * i.qty, 0)}</span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: SAVED ADDRESSES */}
              {activeTab === 'addresses' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-serif font-bold text-foreground">Saved Addresses</h2>
                      <p className="text-xs text-muted-foreground font-light">Manage your home and work delivery address records</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowAddressModal(true)}
                      className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      <Plus size={14} className="mr-1.5" />
                      Add New Address
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                              {addr.label === 'Home' ? <Home size={11} /> : <Briefcase size={11} />}
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                Default Address
                              </span>
                            )}
                          </div>

                          <p className="font-bold text-sm text-foreground">{addr.fullName}</p>
                          <p className="text-muted-foreground leading-relaxed">{addr.street}</p>
                          <p className="text-muted-foreground">{addr.city}, {addr.state} - <span className="font-semibold text-foreground">{addr.pincode}</span></p>
                          <p className="text-muted-foreground font-medium">Phone: {addr.phone}</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-primary hover:underline font-semibold cursor-pointer"
                            >
                              Set as Default
                            </button>
                          ) : (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 size={12} /> Active Default
                            </span>
                          )}

                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors cursor-pointer"
                            title="Delete address"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: PROFILE & SETTINGS */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-4">
                    <div>
                      <h2 className="text-xl font-serif font-bold text-foreground">Profile & Preferences</h2>
                      <p className="text-xs text-muted-foreground font-light">Manage your name and phone number for in-store pickup identification</p>
                    </div>
                    {!isEditingProfile && (
                      <Button
                        size="sm"
                        onClick={() => setIsEditingProfile(true)}
                        className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        <Edit3 size={14} className="mr-1.5" />
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-neutral-700">Full Name (Used in Store)</label>
                          <input
                            type="text"
                            required
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full bg-muted/40 border border-border px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-neutral-700">Email Address</label>
                          <input
                            type="email"
                            required
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full bg-muted/40 border border-border px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-neutral-700">Phone Number (Store Lookup)</label>
                          <input
                            type="tel"
                            required
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full bg-muted/40 border border-border px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-neutral-700">Preferred Specimen Category</label>
                          <select
                            value={editForm.preferredCategory}
                            onChange={(e) => setEditForm({ ...editForm, preferredCategory: e.target.value })}
                            className="w-full bg-muted/40 border border-border px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-primary"
                          >
                            <option value="Indoor & Air Purifying Plants">Indoor & Air Purifying Plants</option>
                            <option value="Outdoor & Fruit Trees">Outdoor & Fruit Trees</option>
                            <option value="Succulents & Bonsai">Succulents & Bonsai</option>
                            <option value="Flowering & Medicinal Plants">Flowering & Medicinal Plants</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold cursor-pointer">
                          <Check size={14} className="mr-1.5" /> Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditForm(profile)
                            setIsEditingProfile(false)
                          }}
                          className="rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                      <div className="p-4 bg-muted/30 rounded-xl space-y-1 border border-border/60">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Store Lookup Name</span>
                        <p className="text-sm font-semibold text-foreground">{profile.name}</p>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-xl space-y-1 border border-border/60">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Email Address</span>
                        <p className="text-sm font-semibold text-foreground">{profile.email}</p>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-xl space-y-1 border border-border/60">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Store Lookup Phone</span>
                        <p className="text-sm font-semibold text-foreground">{profile.phone}</p>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-xl space-y-1 border border-border/60">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Preferred Category</span>
                        <p className="text-sm font-semibold text-foreground">{profile.preferredCategory}</p>
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  <div className="pt-6 border-t border-border/60 space-y-3">
                    <h3 className="text-sm font-serif font-bold text-foreground">In-Store Reservation Alerts</h3>
                    <div className="space-y-2.5 text-xs">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary h-4 w-4" />
                        <span>Send SMS / WhatsApp alert when my reserved plants are ready for in-store pickup</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary h-4 w-4" />
                        <span>Notify me when wishlisted nursery specimens are back in stock at the offline store</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* RESERVATION STORE PASS MODAL */}
      <AnimatePresence>
        {activeReservationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveReservationModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 shadow-2xl relative space-y-6 font-sans"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-foreground">In-Store Pickup Pass</h3>
                  <p className="text-xs text-muted-foreground">Reservation ID: {activeReservationModal.id}</p>
                </div>
                <button
                  onClick={() => setActiveReservationModal(null)}
                  className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Pickup Voucher Details */}
              <div className="space-y-4 text-xs">
                <div className="bg-gradient-to-r from-emerald-900 to-primary text-white p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-accent tracking-wider">Pickup Pass</span>
                    <button
                      onClick={() => copyToClipboard(activeReservationModal.id)}
                      className="inline-flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded font-mono cursor-pointer"
                    >
                      {activeReservationModal.id} <Copy size={11} />
                    </button>
                  </div>
                  <p className="text-sm font-bold">{profile.name} ({profile.phone})</p>
                  <p className="text-[11px] text-white/80 font-light">
                    Present this code or your phone number to nursery staff at the offline store counter.
                  </p>
                </div>

                {/* Offline Store Info */}
                <div className="bg-muted/40 p-4 rounded-2xl border border-border/60 space-y-2">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <Store size={14} className="text-primary" /> Store Location & Hours
                  </p>
                  <p className="text-muted-foreground">{activeReservationModal.storeLocation}</p>
                  <p className="text-muted-foreground font-semibold">Hours: {activeReservationModal.storeHours}</p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => setActiveReservationModal(null)}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close Pass Details
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW ADDRESS MODAL */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddressModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 shadow-2xl relative space-y-5 font-sans text-xs"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-serif font-bold text-xl text-foreground">Add New Address Record</h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="p-1.5 hover:bg-muted rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddAddress} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Address Label</label>
                  <select
                    value={newAddr.label}
                    onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })}
                    className="w-full bg-muted/40 border border-border px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-primary"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work / Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full bg-muted/40 border border-border px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Street Address & Apartment *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Flat No, Building Name, Street"
                    value={newAddr.street}
                    onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                    className="w-full bg-muted/40 border border-border px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-700">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="w-full bg-muted/40 border border-border px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-neutral-700">Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="700091"
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                      className="w-full bg-muted/40 border border-border px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700">Contact Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98301 00000"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full bg-muted/40 border border-border px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-semibold cursor-pointer">
                    Save Address
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
