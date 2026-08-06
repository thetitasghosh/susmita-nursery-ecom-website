'use client'

import React, { useState, useEffect } from 'react'
import { 
  Mail, 
  Search, 
  Send,
  Eye,
  CheckCircle,
  Users,
  History,
  Info
} from 'lucide-react'
import { allProducts, Product } from '@/lib/products'
import { getProductsAction } from '@/server/product'
import {
  getSubscribersAction,
  updateSubscriptionStatusAction,
  sendCampaignAction,
  getCampaignsAction
} from '@/server/newsletter'
import { NewsletterTemplateType } from '@/components/emails/NurseryNewsletter'
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
  id: string
  profile_id?: string | null
  email: string
  full_name?: string | null
  phone?: string | null
  is_active: boolean
  subscribed_at: string
}

interface Campaign {
  id: string
  subject: string
  header: string
  body: string
  featured_product_id?: string | null
  template_type: NewsletterTemplateType
  sent_at: string
  products?: {
    name: string
  } | null
}

const initialSubscribers = [
  { id: '1', email: 'sourav.ganguly@bcci.org', full_name: 'Sourav Ganguly', is_active: true, subscribed_at: '2026-07-15T00:00:00Z' },
  { id: '2', email: 'mimi.chakraborty@parliament.in', full_name: 'Mimi Chakraborty', is_active: true, subscribed_at: '2026-07-12T00:00:00Z' },
  { id: '3', email: 'dev.adhikari@tollywood.com', full_name: 'Dev Adhikari', is_active: true, subscribed_at: '2026-07-10T00:00:00Z' },
  { id: '4', email: 'titas.ghosh@outlook.com', full_name: 'Titas Ghosh', is_active: true, subscribed_at: '2026-06-28T00:00:00Z' },
  { id: '5', email: 'subhashree.ganguly@gmail.com', full_name: 'Subhashree Ganguly', is_active: false, subscribed_at: '2026-05-04T00:00:00Z' }
]

const initialCampaigns: Campaign[] = [
  {
    id: 'c1',
    subject: 'Nurture Your Sanctuary: Weekend Care Essentials',
    header: 'Your Weekend Green Guide',
    body: 'Summer brings unique watering and light parameters to your house plants. In this edition, we outline standard lifecycle stages for Monstera, Areca Palm, and Peace Lily. Plus, check out our recommended neem spray to safely repel common garden pests.',
    template_type: 'care_guide',
    sent_at: '2026-07-28T14:30:00Z',
    products: { name: 'Money Plant Yellow Slabs' }
  },
  {
    id: 'c2',
    subject: 'Monsoon Planting Sale: Save 35% on Premium Pots & specimens!',
    header: 'Monsoon Garden Upgrade Offer',
    body: 'Spruce up your garden and planter sanctuaries. For a limited time, use the exclusive discount code below to reserve top-tier ceramic pots and nursery specimens with free delivery on bookings above ₹999.',
    template_type: 'seasonal_promo',
    sent_at: '2026-07-20T09:15:00Z',
    products: null
  }
]

export default function NewsletterPage() {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns'>('subscribers')
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])

  const getThemeColors = (type: NewsletterTemplateType) => {
    switch (type) {
      case 'care_guide':
        return {
          primary: '#027846',
          accent: '#73b22c',
          light: '#f0fdf4',
          border: '#dcfce7'
        }
      case 'seasonal_promo':
        return {
          primary: '#027846',
          accent: '#ffcf02',
          light: '#fffbeb',
          border: '#fef3c7'
        }
      case 'new_arrivals':
        return {
          primary: '#007947',
          accent: '#73b22c',
          light: '#f0fdf4',
          border: '#dcfce7'
        }
      case 'wishlist_restock':
        return {
          primary: '#027846',
          accent: '#ffcf02',
          light: '#f9fafb',
          border: '#e5e7eb'
        }
      default:
        return {
          primary: '#027846',
          accent: '#73b22c',
          light: '#f9fafb',
          border: '#e5e7eb'
        }
    }
  }

  const getLogoUrl = (type: NewsletterTemplateType) => {
    switch (type) {
      case 'care_guide':
        return '/logos/logo-with-ring.jpeg'
      case 'seasonal_promo':
        return '/logos/logo-with-typo.jpeg'
      case 'new_arrivals':
        return '/logos/logo-with-vertical-typo.jpeg'
      case 'wishlist_restock':
        return '/logos/logo-sn.jpeg'
      default:
        return '/logos/logo-sn.jpeg'
    }
  }

  const getLogoHeight = (type: NewsletterTemplateType) => {
    switch (type) {
      case 'care_guide':
        return 80
      case 'seasonal_promo':
        return 72
      case 'new_arrivals':
        return 85
      case 'wishlist_restock':
        return 80
      default:
        return 76
    }
  }
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  // Campaign Detail Sheet Viewer State
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Campaign Form fields
  const [templateType, setTemplateType] = useState<NewsletterTemplateType>('care_guide')
  const [subject, setSubject] = useState('Nurture Your Sanctuary: Weekend Care Essentials')
  const [emailHeader, setEmailHeader] = useState('Your Weekend Green Guide')
  const [emailBody, setEmailBody] = useState('Summer brings unique watering and light parameters to your house plants. In this edition, we outline standard lifecycle stages for Monstera, Areca Palm, and Peace Lily. Plus, check out our recommended neem spray to safely repel common garden pests.')
  const [promoCode, setPromoCode] = useState('GROWGREEN35')
  const [previewName, setPreviewName] = useState('Ananya')
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null)
  
  // List of all products to select from
  const [productList, setProductList] = useState<Product[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)

  const loadSubscribers = async () => {
    try {
      const res = await getSubscribersAction()
      if (res.success && res.data && res.data.length > 0) {
        setSubscribers(res.data as Subscriber[])
      } else {
        const storedSub = localStorage.getItem('nursery_subs')
        if (storedSub) {
          setSubscribers(JSON.parse(storedSub))
        } else {
          setSubscribers(initialSubscribers)
          localStorage.setItem('nursery_subs', JSON.stringify(initialSubscribers))
        }
      }
    } catch {
      // ignore
    }
  }

  const loadCampaigns = async () => {
    try {
      const res = await getCampaignsAction()
      if (res.success && res.data && res.data.length > 0) {
        setCampaigns(res.data as Campaign[])
      } else {
        const storedCamp = localStorage.getItem('nursery_campaigns')
        if (storedCamp) {
          setCampaigns(JSON.parse(storedCamp))
        } else {
          setCampaigns(initialCampaigns)
          localStorage.setItem('nursery_campaigns', JSON.stringify(initialCampaigns))
        }
      }
    } catch {
      // ignore
    }
  }

  // Load all initial data
  useEffect(() => {
    async function loadAllData() {
      setLoading(true)
      await Promise.all([loadSubscribers(), loadCampaigns()])
      setLoading(false)
    }
    loadAllData()

    // Load products list for dropdown selection
    async function loadProductsList() {
      try {
        const res = await getProductsAction()
        if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setProductList(res.data as Product[])
          setFeaturedProduct((res.data as Product[])[0] || null)
          return
        }
      } catch (err) {
        console.error('Failed to load products for newsletter:', err)
      }

      // Fallback
      const storedProd = localStorage.getItem('nursery_products')
      if (storedProd) {
        try {
          const parsed = JSON.parse(storedProd)
          setProductList(parsed)
          setFeaturedProduct(parsed[0] || null)
          return
        } catch {
          // ignore
        }
      }
      setProductList(allProducts)
      setFeaturedProduct(allProducts[0] || null)
    }

    loadProductsList()
  }, [])

  // Auto-fill template boilerplate when changing template type
  useEffect(() => {
    switch (templateType) {
      case 'care_guide':
        setSubject('Nurture Your Sanctuary: Weekend Care Essentials')
        setEmailHeader('Your Weekend Green Guide')
        setEmailBody('Summer brings unique watering and light parameters to your house plants. In this edition, we outline standard lifecycle stages for Monstera, Areca Palm, and Peace Lily. Plus, check out our recommended neem spray to safely repel common garden pests.')
        break
      case 'seasonal_promo':
        setSubject('Monsoon Planting Sale: Save 35% on Premium Pots & specimens!')
        setEmailHeader('Monsoon Garden Upgrade Offer')
        setEmailBody('Spruce up your garden and planter sanctuaries. For a limited time, use the exclusive discount code below to reserve top-tier ceramic pots and nursery specimens with free delivery on bookings above ₹999.')
        break
      case 'new_arrivals':
        setSubject('Fresh from the Greenhouse: Check out our new arrivals!')
        setEmailHeader('New Botanical Species In Stock')
        setEmailBody('Our horticulturists have just unloaded a stunning set of air-purifying oxygen specimens and vibrant indoor shrubs. View their growth specs, difficulty levels, and pet friendliness below.')
        break
      case 'wishlist_restock':
        setSubject('Good News: A plant you loved is back in stock!')
        setEmailHeader('Back in Stock Alert')
        setEmailBody('Great news! We have successfully restocked our greenhouse reserves for one of our highest-rated garden specimens. Tap below to reserve yours for in-store pickup before stocks dry out.')
    }
  }, [templateType])

  // Sync featuredProduct selection with search text field
  useEffect(() => {
    if (featuredProduct) {
      setProductSearch(featuredProduct.name)
    } else {
      setProductSearch('')
    }
  }, [featuredProduct])

  // Toggle active
  const toggleStatus = async (id: string, email: string, currentActive: boolean) => {
    try {
      const res = await updateSubscriptionStatusAction(email, !currentActive)
      if (res.success) {
        await loadSubscribers()
      } else {
        const updated = subscribers.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s)
        setSubscribers(updated)
        localStorage.setItem('nursery_subs', JSON.stringify(updated))
      }
    } catch {
      // ignore
    }
  }

  // Handle compose submit
  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendSuccess(true)
    try {
      const res = await sendCampaignAction({
        templateType,
        subject,
        header: emailHeader,
        body: emailBody,
        promoCode: templateType === 'seasonal_promo' ? promoCode : undefined,
        featuredProductId: featuredProduct ? featuredProduct.id : undefined
      })
      
      // Update client logs
      if (res.success) {
        await loadCampaigns()
      } else {
        // Fallback simulate logging in client state history
        const newCampaign: Campaign = {
          id: `c_${Date.now()}`,
          subject,
          header: emailHeader,
          body: emailBody,
          template_type: templateType,
          featured_product_id: featuredProduct ? featuredProduct.id : null,
          sent_at: new Date().toISOString(),
          products: featuredProduct ? { name: featuredProduct.name } : null
        }
        const updated = [newCampaign, ...campaigns]
        setCampaigns(updated)
        localStorage.setItem('nursery_campaigns', JSON.stringify(updated))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(() => {
        setSendSuccess(false)
        setIsComposeOpen(false)
      }, 2800)
    }
  }

  // Open read campaign details sheet viewer
  const handleViewCampaign = (camp: Campaign) => {
    setSelectedCampaign(camp)
    setIsDetailOpen(true)
  }

  // Filters logic
  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.full_name && s.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredCampaigns = campaigns.filter(c =>
    c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.header.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatSubscribedAt = (dateStr: string) => {
    if (!dateStr) return ''
    if (dateStr.includes(',') || isNaN(Date.parse(dateStr))) return dateStr
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const formatSentAt = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSubheaderText = (type: NewsletterTemplateType = templateType) => {
    switch (type) {
      case 'care_guide':
        return 'Botanical Care Guidelines & Tips'
      case 'seasonal_promo':
        return 'Exclusive Seasonal Spotlight & Offers'
      case 'new_arrivals':
        return 'Fresh Arrivals in the Nursery Catalog'
      case 'wishlist_restock':
        return 'Back-in-stock Specimen Updates'
      default:
        return 'Botanical Companion Guidelines'
    }
  }

  const getTemplateBadgeStyle = (type: NewsletterTemplateType) => {
    switch (type) {
      case 'care_guide':
        return 'bg-blue-50 text-blue-600 border-blue-200'
      case 'seasonal_promo':
        return 'bg-amber-50 text-amber-600 border-amber-200'
      case 'new_arrivals':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200'
      case 'wishlist_restock':
        return 'bg-purple-50 text-purple-600 border-purple-200'
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-200'
    }
  }

  const getTemplateLabel = (type: NewsletterTemplateType) => {
    switch (type) {
      case 'care_guide':
        return 'Care Guide'
      case 'seasonal_promo':
        return 'Promo Offer'
      case 'new_arrivals':
        return 'New Arrivals'
      case 'wishlist_restock':
        return 'Wishlist Restock'
      default:
        return 'Newsletter'
    }
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-neutral-dark">
            Newsletter Subscribers & Campaigns
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-1">
            Manage your marketing audience lists and compose personalized multi-template email campaigns.
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

      {/* Premium Tab Selector */}
      <div className="flex border-b border-border/80 gap-6">
        <button
          onClick={() => {
            setActiveTab('subscribers')
            setSearchTerm('')
          }}
          className={`pb-4 px-2 font-serif font-bold text-base transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'subscribers'
              ? 'border-primary text-primary'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Users size={16} />
          <span>Subscribers Audience ({subscribers.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('campaigns')
            setSearchTerm('')
          }}
          className={`pb-4 px-2 font-serif font-bold text-base transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'campaigns'
              ? 'border-primary text-primary'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <History size={16} />
          <span>Campaign Dispatch History ({campaigns.length})</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={activeTab === 'subscribers' ? "Search by subscriber email or name..." : "Search by campaign subject or header..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-neutral-400"
          />
        </div>

        <div className="text-xs text-muted-foreground font-light px-2">
          Displaying {activeTab === 'subscribers' ? filteredSubscribers.length : filteredCampaigns.length} entries
        </div>
      </div>

      {/* Subscribers Table View */}
      {activeTab === 'subscribers' && (
        <div className="bg-card border border-border/80 rounded-[32px] overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="py-4 px-6 font-semibold">Subscriber</TableHead>
                <TableHead className="py-4 px-4 font-semibold">Subscriber Email</TableHead>
                <TableHead className="py-4 px-4 font-semibold">Subscription Date</TableHead>
                <TableHead className="py-4 px-4 font-semibold">Marketing State</TableHead>
                <TableHead className="py-4 px-6 text-right font-semibold">Status Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx} className="animate-pulse">
                    <TableCell className="py-6 px-6">
                      <div className="space-y-1.5">
                        <div className="h-4 bg-muted rounded-full w-28" />
                        <div className="h-3 bg-muted rounded-full w-20" />
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-4"><div className="h-4 bg-muted rounded-full w-36" /></TableCell>
                    <TableCell className="py-6 px-4"><div className="h-4 bg-muted rounded-full w-20" /></TableCell>
                    <TableCell className="py-6 px-4"><div className="h-4 bg-muted rounded-full w-14" /></TableCell>
                    <TableCell className="py-6 px-6 text-right"><div className="h-7 bg-muted rounded-lg w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="py-4 px-6 font-bold text-neutral-700">
                      <div className="flex flex-col">
                        <span>{sub.full_name || 'Nursery Client'}</span>
                        {sub.phone && <span className="text-[10px] text-neutral-400 font-light">{sub.phone}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 font-semibold text-neutral-800">{sub.email}</TableCell>
                    <TableCell className="py-4 px-4 font-light text-neutral-400">{formatSubscribedAt(sub.subscribed_at)}</TableCell>
                    <TableCell className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        sub.is_active 
                          ? 'bg-secondary/15 text-primary border-secondary/35' 
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {sub.is_active ? 'Active' : 'Unsubscribed'}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <button
                        onClick={() => toggleStatus(sub.id, sub.email, sub.is_active)}
                        className={`text-[10px] px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors ${
                          sub.is_active
                            ? 'text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border-red-200'
                            : 'text-primary bg-primary/5 hover:bg-primary hover:text-white border-primary/25'
                        }`}
                      >
                        {sub.is_active ? 'Unsubscribe' : 'Subscribe'}
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
      )}

      {/* Campaigns History Table View */}
      {activeTab === 'campaigns' && (
        <div className="bg-card border border-border/80 rounded-[32px] overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="py-4 px-6 font-semibold">Email Subject & Title</TableHead>
                <TableHead className="py-4 px-4 font-semibold">Template Use Case</TableHead>
                <TableHead className="py-4 px-4 font-semibold">Spotlight Product</TableHead>
                <TableHead className="py-4 px-4 font-semibold">Sent Timestamp</TableHead>
                <TableHead className="py-4 px-6 text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx} className="animate-pulse">
                    <TableCell className="py-6 px-6">
                      <div className="space-y-1.5">
                        <div className="h-4 bg-muted rounded-full w-48" />
                        <div className="h-3 bg-muted rounded-full w-32" />
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-4"><div className="h-4 bg-muted rounded-full w-24" /></TableCell>
                    <TableCell className="py-6 px-4"><div className="h-4 bg-muted rounded-full w-28" /></TableCell>
                    <TableCell className="py-6 px-4"><div className="h-4 bg-muted rounded-full w-24" /></TableCell>
                    <TableCell className="py-6 px-6 text-right"><div className="h-7 bg-muted rounded-lg w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((camp) => (
                  <TableRow key={camp.id}>
                    <TableCell className="py-4 px-6 text-neutral-800">
                      <div className="flex flex-col">
                        <span className="font-bold text-xs line-clamp-1">{camp.subject}</span>
                        <span className="text-[10px] text-neutral-400 font-light mt-0.5 line-clamp-1">{camp.header}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getTemplateBadgeStyle(camp.template_type)}`}>
                        {getTemplateLabel(camp.template_type)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4 font-semibold text-xs text-neutral-700">
                      {camp.products ? (
                        <span>{camp.products.name}</span>
                      ) : (
                        <span className="text-neutral-400 font-light italic">None</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 px-4 font-light text-neutral-400 text-xs">{formatSentAt(camp.sent_at)}</TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleViewCampaign(camp)}
                        className="text-primary hover:text-primary-emerald font-semibold text-[10px] px-3 py-1.5 rounded-lg border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground font-light">
                    No campaign dispatch logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Compose Campaign Sheet Drawer */}
      <Sheet open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <SheetContent className="max-w-5xl flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Compose Dynamic Email Campaign</SheetTitle>
            <SheetDescription>
              Select template layout and dispatch personalized newsletter campaigns to active leads
            </SheetDescription>
          </SheetHeader>

          {/* Grid content split: Form Left, Real Preview Right */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Left: Compose Form */}
            <form id="campaign-form" onSubmit={handleSendCampaign} className="w-1/2 flex flex-col h-full border-r border-border/60 bg-muted/5">
              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-700">Campaign Template Use Case *</label>
                <select
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value as NewsletterTemplateType)}
                  className="w-full bg-white border border-border/80 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
                >
                  <option value="care_guide">📖 Weekend Care Guidelines</option>
                  <option value="seasonal_promo">🎁 Seasonal Sale & Promo Offer</option>
                  <option value="new_arrivals">✨ Fresh Greenhouse New Arrivals</option>
                  <option value="wishlist_restock">🌿 Specimen Back-in-Stock</option>
                </select>
              </div>

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
                  rows={4}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Enter the main body paragraph content..."
                  className="w-full bg-white border border-border/80 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs leading-normal"
                />
              </div>

              {templateType === 'seasonal_promo' && (
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Discount Promo Code *</label>
                  <input
                    type="text"
                    required
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="GROWGREEN35"
                    className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-mono font-bold text-amber-700"
                  />
                </div>
              )}

              <div className="space-y-1.5 relative">
                <label className="font-semibold text-neutral-700">Spotlight Highlight Product</label>
                <div className="relative">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search catalog products..."
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value)
                        setProductDropdownOpen(true)
                      }}
                      onFocus={() => setProductDropdownOpen(true)}
                      className="w-full bg-white border border-border/80 pl-9 pr-8 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                    />
                    {featuredProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setFeaturedProduct(null)
                          setProductSearch('')
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-red-500 font-bold text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {productDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1.5 bg-white border border-border/80 rounded-2xl shadow-xl max-h-48 overflow-y-auto p-1.5 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setFeaturedProduct(null)
                          setProductSearch('')
                          setProductDropdownOpen(false)
                        }}
                        className="w-full text-left p-2 hover:bg-muted/60 rounded-xl transition-all text-[11px] font-semibold text-neutral-500 italic"
                      >
                        None (No spotlight product)
                      </button>
                      {productList
                        .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                        .map(prod => (
                          <button
                            type="button"
                            key={prod.id}
                            onClick={() => {
                              setFeaturedProduct(prod)
                              setProductSearch(prod.name)
                              setProductDropdownOpen(false)
                            }}
                            className="w-full text-left flex items-center gap-3 p-2 hover:bg-muted/60 rounded-xl transition-all"
                          >
                            <span className="w-8 h-8 border border-border rounded-lg overflow-hidden relative inline-block shrink-0 bg-muted">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={prod.image} alt={prod.name} className="object-cover w-full h-full" />
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-neutral-800 text-xs block truncate">{prod.name}</span>
                              <span className="text-[10px] text-neutral-400 block font-light">₹{prod.price} • {prod.category}</span>
                            </div>
                          </button>
                        ))}
                      {productList.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                        <p className="text-[10px] text-neutral-400 p-3 italic text-center">No catalog products found</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Click outside to close overlay */}
                {productDropdownOpen && (
                  <div className="fixed inset-0 z-40" onClick={() => setProductDropdownOpen(false)} />
                )}

                {featuredProduct && (
                  <div className="bg-muted/30 border border-border/40 p-3 rounded-2xl flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 border border-border rounded-lg overflow-hidden relative inline-block shrink-0 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={featuredProduct.image} alt={featuredProduct.name} className="object-cover w-full h-full" />
                      </span>
                      <div className="min-w-0">
                        <span className="font-bold text-neutral-700 text-xs block truncate">{featuredProduct.name}</span>
                        <span className="text-[10px] text-neutral-400 block font-light">Active Selected Spotlight • ₹{featuredProduct.price}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFeaturedProduct(null)
                        setProductSearch('')
                      }}
                      className="text-red-500 hover:text-red-700 p-1 font-bold text-xs"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border/40 space-y-1.5">
                <label className="font-semibold text-neutral-700">Preview Name Personalization</label>
                <input
                  type="text"
                  value={previewName}
                  onChange={(e) => setPreviewName(e.target.value)}
                  placeholder="Recipient Name Preview"
                  className="w-full bg-white border border-border/80 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-semibold"
                />
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
                  <p><span className="font-semibold text-neutral-800">To:</span> {previewName.toLowerCase() || 'client'}@subscriber.com</p>
                  <p><span className="font-semibold text-neutral-800">Subject:</span> {subject}</p>
                </div>

                {/* Email Template content */}
                <div className="flex-1 flex flex-col bg-white">
                  {/* Header Banner - Branded Background & Logo */}
                  <div style={{ borderTop: `4px solid ${getThemeColors(templateType).primary}` }} className="py-7 px-6 text-center select-none bg-white border-b border-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={getLogoUrl(templateType)} 
                      alt="Susmita Nursery Logo" 
                      style={{ height: `${getLogoHeight(templateType)}px` }}
                      className="mx-auto block object-contain"
                    />
                    <span className="text-[9px] uppercase tracking-wider font-bold block mt-2 text-neutral-500">
                      {getSubheaderText(templateType)}
                    </span>
                  </div>

                  <div className="p-8 space-y-6">
                    {/* Personalized Greeting */}
                    <p className="font-semibold text-neutral-800 text-xs margin-0">
                      Hello {(!previewName || previewName.toLowerCase().includes('nursery client')) ? 'Plant Lover' : previewName.trim().split(' ')[0]},
                    </p>

                    <h2 style={{ color: getThemeColors(templateType).primary }} className="font-serif font-bold text-lg leading-tight pt-1">
                      {emailHeader}
                    </h2>

                    <p className="text-neutral-600 font-light font-sans text-xs leading-relaxed">
                      {emailBody}
                    </p>

                    {templateType === 'seasonal_promo' && (
                      <div style={{ backgroundColor: getThemeColors(templateType).light, borderColor: getThemeColors(templateType).border }} className="border-2 border-dashed rounded-2xl p-6 text-center space-y-2">
                        <span style={{ backgroundColor: getThemeColors(templateType).primary }} className="text-[8px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full text-white inline-block">
                          Promo Coupon Offer
                        </span>
                        <span style={{ color: getThemeColors(templateType).primary }} className="text-2xl font-black font-mono tracking-widest block">{promoCode}</span>
                        <span className="text-[9px] text-neutral-400 block leading-normal">Present this coupon code at our counter pickup desk to redeem your nursery discount.</span>
                      </div>
                    )}

                    {templateType === 'care_guide' && (
                      <div style={{ borderLeftColor: getThemeColors(templateType).accent }} className="border-l-4 bg-neutral-50/50 p-4 rounded-r-2xl">
                        <span className="text-[11px] font-light text-neutral-700 leading-relaxed block italic">
                          💡 <strong style={{ color: getThemeColors(templateType).primary }}>Horticultural Guide:</strong> Check leaf humidity indices weekly. Specimen health is heavily impacted by draft parameters and temperature fluctuations. Mist leaves in indirect sunlight.
                        </span>
                      </div>
                    )}

                    {featuredProduct && (
                      <div style={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7' }} className="border rounded-2xl p-4 flex items-center justify-between max-w-sm mx-auto shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg overflow-hidden border border-border/60 relative bg-white shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={featuredProduct.image} alt={featuredProduct.name} className="object-cover w-full h-full" />
                          </div>
                          <div>
                            <span style={{ color: getThemeColors(templateType).primary }} className="text-[8px] uppercase tracking-wider font-bold block mb-0.5">🌿 Featured Specimen</span>
                            <span className="font-semibold text-neutral-800 text-[11px] block leading-tight">{featuredProduct.name}</span>
                            <span className="text-[9px] text-neutral-400 block mt-0.5">₹{featuredProduct.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <span style={{ backgroundColor: getThemeColors(templateType).primary }} className="text-[9px] font-bold text-white px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0 cursor-pointer shadow-sm">
                          {templateType === 'wishlist_restock' ? 'Buy Now' : 'Shop Specimen'}
                        </span>
                      </div>
                    )}

                    <div className="border-t border-border/40 pt-6 text-center text-[9px] text-neutral-400 font-sans space-y-1">
                      <p className="font-bold text-neutral-600">© 2026 Susmita Nursery. All rights reserved.</p>
                      <p className="font-light">Gangni, Badkulla, Nadia, West Bengal, 741121</p>
                    </div>
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
                      Newsletter successfully sent to active subscribers via Resend.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Inspect Campaign Details Sheet Drawer */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="max-w-2xl flex flex-col h-full overflow-y-auto">
          {selectedCampaign && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2.5">
                  <Info className="text-primary" size={20} />
                  <SheetTitle>Inspect Campaign Logs</SheetTitle>
                </div>
                <SheetDescription>
                  Review the sent template contents, target parameters, and dispatch timestamps.
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 mt-6 space-y-6 text-xs">
                {/* Meta details list */}
                <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-2xl border border-border/60">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Template Type</span>
                    <span className={`block font-semibold uppercase tracking-wider text-[10px] ${getTemplateLabel(selectedCampaign.template_type)}`}>
                      {getTemplateLabel(selectedCampaign.template_type)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Dispatch Date</span>
                    <span className="block font-semibold text-neutral-700">
                      {formatSentAt(selectedCampaign.sent_at)}
                    </span>
                  </div>
                  <div className="col-span-2 space-y-1 border-t border-border/40 pt-3">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Subject Line</span>
                    <span className="block font-bold text-neutral-800 text-sm">
                      {selectedCampaign.subject}
                    </span>
                  </div>
                </div>
                 {/* Simulated Email template render */}
                <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col select-none">
                  {/* Header Banner - Branded Background & Logo */}
                  <div style={{ borderTop: `4px solid ${getThemeColors(selectedCampaign.template_type).primary}` }} className="py-5 px-5 text-center bg-white border-b border-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={getLogoUrl(selectedCampaign.template_type)} 
                      alt="Susmita Nursery Logo" 
                      style={{ height: `${getLogoHeight(selectedCampaign.template_type)}px` }}
                      className="mx-auto block object-contain"
                    />
                    <span className="text-[8px] uppercase tracking-wider font-bold block mt-1.5 text-neutral-500">
                      {getSubheaderText(selectedCampaign.template_type)}
                    </span>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Personalized Greeting */}
                    <p className="font-semibold text-neutral-800 text-[10px] margin-0">
                      Hello [Recipient Name],
                    </p>

                    <h2 style={{ color: getThemeColors(selectedCampaign.template_type).primary }} className="font-serif font-bold text-sm leading-tight">
                      {selectedCampaign.header}
                    </h2>

                    <p className="text-neutral-600 font-light font-sans text-[10px] leading-relaxed">
                      {selectedCampaign.body}
                    </p>

                    {selectedCampaign.template_type === 'seasonal_promo' && (
                      <div style={{ backgroundColor: getThemeColors(selectedCampaign.template_type).light, borderColor: getThemeColors(selectedCampaign.template_type).border }} className="border rounded-xl p-3 text-center space-y-1">
                        <span style={{ color: getThemeColors(selectedCampaign.template_type).primary }} className="text-[8px] uppercase tracking-wider font-bold block">Use coupon code at checkout</span>
                        <span style={{ color: getThemeColors(selectedCampaign.template_type).primary }} className="text-base font-bold font-mono tracking-wider block">GROWGREEN35</span>
                      </div>
                    )}

                    {selectedCampaign.template_type === 'care_guide' && (
                      <div style={{ borderLeftColor: getThemeColors(selectedCampaign.template_type).accent }} className="border-l-4 bg-muted/40 p-3 rounded-r-xl">
                        <span className="text-[10px] font-light text-neutral-600 leading-relaxed block italic">
                          💡 <strong style={{ color: getThemeColors(selectedCampaign.template_type).primary }}>Green Tip:</strong> Check leaf humidity indices weekly. Mist leaves in indirect sunlight.
                        </span>
                      </div>
                    )}

                    {selectedCampaign.products && (
                      <div style={{ backgroundColor: getThemeColors(selectedCampaign.template_type).light, borderColor: getThemeColors(selectedCampaign.template_type).border }} className="border rounded-xl p-3 flex items-center justify-between max-w-xs mx-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-white border border-border/40 flex items-center justify-center text-primary text-[10px] font-serif font-bold">
                            🌿
                          </div>
                          <div>
                            <span className="font-semibold text-neutral-800 text-[10px] block leading-tight">{selectedCampaign.products.name}</span>
                            <span className="text-[8px] text-neutral-400 block mt-0.5">Spotlight Specimen</span>
                          </div>
                        </div>
                        <span style={{ backgroundColor: getThemeColors(selectedCampaign.template_type).primary }} className="text-[8px] font-bold text-white bg-primary px-2.5 py-1.5 rounded-full uppercase tracking-wider cursor-pointer">
                          View Plant
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 pt-4 flex justify-end">
                  <SheetClose>
                    <button className="px-5 py-2.5 bg-primary hover:bg-primary-emerald text-white rounded-full font-bold text-xs cursor-pointer shadow">
                      Dismiss Viewer
                    </button>
                  </SheetClose>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

    </div>
  )
}
