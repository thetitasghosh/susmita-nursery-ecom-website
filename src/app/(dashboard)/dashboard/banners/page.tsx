'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Eye, 
  EyeOff, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react'

interface Banner {
  id: number
  title: string
  subtitle: string
  image: string
  link: string
  buttonText: string
  isActive: boolean
  priority: number
}

const initialBanners: Banner[] = [
  {
    id: 1,
    title: 'Monsoon Planting Festival',
    subtitle: 'Get up to 35% off on outdoor shrubs & hybrid roses. Free home delivery above ₹999.',
    image: '/images/hero-garden.jpg',
    link: '/products?category=Flowering%20Plants',
    buttonText: 'Shop Flowering Plants',
    isActive: true,
    priority: 1
  },
  {
    id: 2,
    title: 'Botanical Workspace Sanctuary',
    subtitle: 'Breathe pure air at your desk. Curated set of 4 premium hardy oxygen-releasing house specimens.',
    image: '/images/plants/monstera-plant.jpg',
    link: '/products?category=Air%20Purifying',
    buttonText: 'View Air Purifiers',
    isActive: true,
    priority: 2
  },
  {
    id: 3,
    title: 'Organic Soil Health Boosters',
    subtitle: 'Restore your planter microbiology with 100% natural cold-pressed neem oils and liquid bio-fertilizers.',
    image: '/images/plants/neem-oil.jpg',
    link: '/products?category=Plant%20Medicine',
    buttonText: 'Buy Plant Medicines',
    isActive: false,
    priority: 3
  }
]

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  // Form fields
  const [formTitle, setFormTitle] = useState('')
  const [formSubtitle, setFormSubtitle] = useState('')
  const [formImage, setFormImage] = useState('/images/hero-garden.jpg')
  const [formLink, setFormLink] = useState('/products')
  const [formButtonText, setFormButtonText] = useState('Shop Now')
  const [formIsActive, setFormIsActive] = useState(true)
  const [formPriority, setFormPriority] = useState(1)

  // Load banners
  useEffect(() => {
    const stored = localStorage.getItem('nursery_banners')
    if (stored) {
      try {
        setBanners(JSON.parse(stored))
      } catch {
        setBanners(initialBanners)
      }
    } else {
      setBanners(initialBanners)
      localStorage.setItem('nursery_banners', JSON.stringify(initialBanners))
    }
  }, [])

  // Toggle active status
  const toggleActive = (id: number) => {
    const updated = banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b)
    setBanners(updated)
    localStorage.setItem('nursery_banners', JSON.stringify(updated))
  }

  // Open add sheet
  const handleOpenAdd = () => {
    setEditingBanner(null)
    setFormTitle('')
    setFormSubtitle('')
    setFormImage('/images/hero-garden.jpg')
    setFormLink('/products')
    setFormButtonText('Shop Now')
    setFormIsActive(true)
    setFormPriority(banners.length + 1)
    setIsSheetOpen(true)
  }

  // Open edit sheet
  const handleOpenEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormTitle(banner.title)
    setFormSubtitle(banner.subtitle)
    setFormImage(banner.image)
    setFormLink(banner.link)
    setFormButtonText(banner.buttonText)
    setFormIsActive(banner.isActive)
    setFormPriority(banner.priority)
    setIsSheetOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this promotional banner?')) {
      const updated = banners.filter(b => b.id !== id)
      setBanners(updated)
      localStorage.setItem('nursery_banners', JSON.stringify(updated))
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle) return

    let updatedBanners: Banner[] = []
    if (editingBanner) {
      updatedBanners = banners.map(b => b.id === editingBanner.id ? {
        ...b,
        title: formTitle,
        subtitle: formSubtitle,
        image: formImage,
        link: formLink,
        buttonText: formButtonText,
        isActive: formIsActive,
        priority: Number(formPriority)
      } : b)
    } else {
      const newId = banners.length > 0 ? Math.max(...banners.map(b => b.id)) + 1 : 1
      const newBanner: Banner = {
        id: newId,
        title: formTitle,
        subtitle: formSubtitle,
        image: formImage,
        link: formLink,
        buttonText: formButtonText,
        isActive: formIsActive,
        priority: Number(formPriority)
      }
      updatedBanners = [...banners, newBanner]
    }

    // Sort by priority before saving
    updatedBanners.sort((a, b) => a.priority - b.priority)

    setBanners(updatedBanners)
    localStorage.setItem('nursery_banners', JSON.stringify(updatedBanners))
    setIsSheetOpen(false)
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-neutral-dark">
            Homepage Banner Manager
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-1">
            Configure dynamic slideshow campaigns and promotional widgets visible to storefront customers.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary-emerald text-white px-5 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Promo Banner</span>
        </button>
      </div>

      {/* Grid of Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {banners.map((banner, idx) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-card border border-border/80 rounded-[32px] overflow-hidden shadow-sm flex flex-col justify-between group"
          >
            {/* Top Aspect Ratio Banner Preview */}
            <div className="relative h-44 bg-muted overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
              
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Priority {banner.priority}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    banner.isActive 
                      ? 'bg-secondary/25 border-secondary/40 text-secondary' 
                      : 'bg-white/10 border-white/20 text-neutral-300'
                  }`}>
                    {banner.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg leading-tight">{banner.title}</h3>
              </div>
            </div>

            {/* Bottom Actions and Description */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                {banner.subtitle}
              </p>

              <div className="flex items-center justify-between text-xs border-t border-border/40 pt-4">
                <div className="flex items-center gap-1.5 text-neutral-500 font-medium">
                  <LinkIcon size={12} className="text-primary" />
                  <span>Button: </span>
                  <span className="font-bold text-neutral-700 bg-muted px-2.5 py-0.5 rounded-md border border-border/40">{banner.buttonText}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(banner.id)}
                    className={`p-2 border rounded-lg transition-colors cursor-pointer ${
                      banner.isActive 
                        ? 'text-neutral-500 hover:text-white hover:bg-neutral-600 bg-neutral-50 border-neutral-200' 
                        : 'text-primary hover:text-white hover:bg-primary bg-primary/5 border-primary/20'
                    }`}
                    title={banner.isActive ? 'Draft Banner' : 'Activate Banner'}
                  >
                    {banner.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(banner)}
                    className="p-2 text-primary hover:text-white bg-primary/5 hover:bg-primary border border-primary/25 rounded-lg transition-colors cursor-pointer"
                    title="Edit Banner"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 rounded-lg transition-colors cursor-pointer"
                    title="Delete Banner"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {banners.length === 0 && (
          <div className="col-span-2 text-center py-16 bg-card border border-border/80 rounded-[32px] text-muted-foreground font-light text-sm">
            No banners defined. Click &quot;Add Promo Banner&quot; above to create one.
          </div>
        )}
      </div>

      {/* Sheet Modal Drawer */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSheetOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 w-full max-w-lg bg-card shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-border/80 flex items-center justify-between bg-neutral-dark text-white rounded-tl-[36px]">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/40">
                    <Sparkles className="text-secondary w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="font-serif font-bold text-lg leading-tight">
                      {editingBanner ? 'Edit Promo Banner' : 'Create Promo Banner'}
                    </h2>
                    <span className="text-[9px] text-neutral-400 font-sans tracking-widest uppercase block mt-0.5">
                      {editingBanner ? `Banner ID: ${editingBanner.id}` : 'Configure marketing spotlight slide'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSheetOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Campaign Header Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Monsoon Planting Festival"
                    className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Campaign Subtitle Description</label>
                  <textarea
                    rows={3}
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="Describe the promotion or event details..."
                    className="w-full bg-white border border-border/80 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs leading-normal"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Banner Background Image URL *</label>
                  <input
                    type="text"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-mono"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setFormImage('/images/hero-garden.jpg')}
                      className="px-2 py-1 text-[9px] bg-muted border border-border hover:bg-neutral-200 rounded font-semibold"
                    >
                      Use Greenhouse Farm
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormImage('/images/plants/monstera-plant.jpg')}
                      className="px-2 py-1 text-[9px] bg-muted border border-border hover:bg-neutral-200 rounded font-semibold"
                    >
                      Use Monstera
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-700">Button Call-To-Action Text *</label>
                    <input
                      type="text"
                      required
                      value={formButtonText}
                      onChange={(e) => setFormButtonText(e.target.value)}
                      placeholder="e.g. Shop Now"
                      className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-700">Button Redirect Path *</label>
                    <input
                      type="text"
                      required
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                      placeholder="/products"
                      className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-700">Display Priority (Order)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formPriority}
                      onChange={(e) => setFormPriority(Number(e.target.value))}
                      className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-700 block">Initial Visibility State</label>
                    <label className="flex items-center gap-2.5 py-3 text-xs cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formIsActive}
                        onChange={() => setFormIsActive(!formIsActive)}
                        className="accent-primary w-4 h-4 rounded border-border"
                      />
                      <span className="font-medium text-neutral-700">Set as Active Campaign</span>
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <div className="border-t border-border/40 pt-6 mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSheetOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-border text-neutral-600 hover:bg-muted font-semibold text-xs cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-emerald text-white px-6 py-2.5 rounded-full font-bold text-xs cursor-pointer shadow-md transition-all flex items-center gap-1"
                  >
                    <Check size={14} />
                    <span>Save Promo Campaign</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
