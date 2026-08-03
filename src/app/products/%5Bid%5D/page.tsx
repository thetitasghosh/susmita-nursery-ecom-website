'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Star, Heart, ShoppingCart, ShieldCheck, HeartHandshake, Truck, BookOpen, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/lib/products'
import { useShop } from '@/lib/shop-context'
import Image from 'next/image'
import { WHATSAPP_NUMBER } from '@/constants'
import { PlantCareSuggestions } from '@/components/products/plant-care-suggestions'
import { getProductsAction } from '@/server/product'
import { useEffect } from 'react'

const cultivarAliases: Record<string, string> = {
  '00000000-0000-0000-0000-000000000006': 'Swiss Cheese Plant',
  '00000000-0000-0000-0000-000000000007': 'Madonna Lily',
  '00000000-0000-0000-0000-000000000018': 'Golden Cane Palm',
  '00000000-0000-0000-0000-000000000019': 'Fiddle Leaf Fig',
  '00000000-0000-0000-0000-000000000020': 'Siam Aurora',
  '00000000-0000-0000-0000-000000000021': "Mother-in-Law's Tongue",
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('Standard')
  const [activeCareStage, setActiveCareStage] = useState(0)
  const [isGeneratingGuide, setIsGeneratingGuide] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await getProductsAction();
        if (res.success && res.data && Array.isArray(res.data)) {
          const dbProducts = res.data as Product[];
          const found = dbProducts.find(p => p.id === params.id || p.slug === params.id);
          if (found) {
            setProduct(found);
            setSelectedSize(found.sizes[0] || 'Standard');
            setSelectedImage(found.image);
          } else {
            // Fallback or not found
            setProduct(null);
          }
        }
      } catch (err) {
        console.error('Failed to load product from database:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif font-bold text-red-800 mb-4">Product Not Found</h1>
        <Button onClick={() => window.location.href = '/products'} className="rounded-full px-6">
          Back to Catalog
        </Button>
      </div>
    )
  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://susmitanursery.com/products/${product.slug || product.id}`
  const scientific = product.scientificName ? ` (${product.scientificName})` : ''
  
  const whatsappMessage = `Hello Susmita Nursery! I want to discuss and buy this plant:

Plant Name: ${product.name}${scientific}
Price: ₹${product.price.toFixed(2)}
Selected Size: ${selectedSize}
Quantity: ${quantity}

Botanical Details:
- Category: ${product.category}
- Light Requirement: ${product.details?.light || 'Standard'}
- Watering Needs: ${product.details?.water || 'Standard'}
- Care Difficulty: ${product.difficulty || 'Easy'}
- Air Purifying: ${product.airPurifying || 'Yes'}

Product Link: ${pageUrl}`

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(whatsappMessage)}`

  const handleDownloadCareGuide = () => {
    setIsGeneratingGuide(true)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 1600
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setIsGeneratingGuide(false)
        return
      }

      // Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height)
      bgGrad.addColorStop(0, '#FAFAF9')
      bgGrad.addColorStop(1, '#F0FDF4')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Header Banner
      ctx.fillStyle = '#064E3B'
      ctx.fillRect(0, 0, canvas.width, 150)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 38px serif'
      ctx.fillText('SUSMITA NURSERY', 80, 90)

      ctx.font = '16px sans-serif'
      ctx.fillStyle = '#A7F3D0'
      ctx.fillText('Official Botanical Care Pass & Verification', canvas.width - 450, 90)

      // Plant Title & Scientific Name
      ctx.fillStyle = '#064E3B'
      ctx.font = 'bold 50px serif'
      ctx.fillText(product.name, 80, 240)

      if (product.scientificName) {
        ctx.font = 'italic 24px serif'
        ctx.fillStyle = '#047857'
        ctx.fillText(`(${product.scientificName})`, 80, 280)
      }

      // Product Specs Card Box
      ctx.fillStyle = '#FFFFFF'
      ctx.shadowColor = 'rgba(0,0,0,0.06)'
      ctx.shadowBlur = 15
      ctx.fillRect(80, 320, 1040, 220)
      ctx.shadowBlur = 0

      ctx.strokeStyle = '#D1E7DD'
      ctx.lineWidth = 1.5
      ctx.strokeRect(80, 320, 1040, 220)

      const specItems = [
        { label: 'LIGHT REQUIREMENT', val: product.details.light },
        { label: 'WATERING NEEDS', val: product.details.water },
        { label: 'HUMIDITY', val: product.details.humidity },
        { label: 'TEMPERATURE', val: product.details.temperature },
        { label: 'RECOMMENDED SOIL', val: product.details.soil },
        { label: 'CARE LEVEL', val: product.difficulty || 'Easy' },
      ]

      specItems.forEach((item, index) => {
        const col = index % 3
        const row = Math.floor(index / 3)
        const x = 120 + col * 340
        const y = 375 + row * 85

        ctx.fillStyle = '#059669'
        ctx.font = 'bold 14px sans-serif'
        ctx.fillText(item.label, x, y)

        ctx.fillStyle = '#1F2937'
        ctx.font = '19px sans-serif'
        ctx.fillText(item.val || 'Standard', x, y + 28)
      })

      // 5-Stage Routine Section
      ctx.fillStyle = '#064E3B'
      ctx.font = 'bold 30px serif'
      ctx.fillText('5-Stage Lifecycle Care System', 80, 610)

      careStages.forEach((stage, idx) => {
        const y = 675 + idx * 130

        // Step Circle
        ctx.beginPath()
        ctx.arc(110, y, 22, 0, 2 * Math.PI)
        ctx.fillStyle = '#064E3B'
        ctx.fill()

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 20px sans-serif'
        ctx.fillText(stage.stage, 104, y + 7)

        // Stage Title
        ctx.fillStyle = '#064E3B'
        ctx.font = 'bold 22px sans-serif'
        ctx.fillText(stage.title.toUpperCase(), 155, y - 4)

        // Stage Description
        ctx.fillStyle = '#4B5563'
        ctx.font = '17px sans-serif'
        const shortDesc = stage.desc.length > 90 ? stage.desc.substring(0, 90) + '...' : stage.desc
        ctx.fillText(shortDesc, 155, y + 25)
      })

      // Dynamic QR Code Generation
      const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://susmitanursery.com/products/${product.slug || product.id}`
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pageUrl)}`
      const qrImg = new window.Image()
      qrImg.crossOrigin = 'Anonymous'
      qrImg.src = qrUrl

      const triggerDownload = () => {
        const link = document.createElement('a')
        link.download = `${product.name.toLowerCase().replace(/\s+/g, '-')}-care-guide.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        setIsGeneratingGuide(false)
      }

      qrImg.onload = () => {
        // Draw Footer Box
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(80, 1340, 1040, 200)
        ctx.strokeStyle = '#059669'
        ctx.lineWidth = 2
        ctx.strokeRect(80, 1340, 1040, 200)

        // Draw QR Code
        ctx.drawImage(qrImg, 110, 1360, 160, 160)

        // QR Information
        ctx.fillStyle = '#064E3B'
        ctx.font = 'bold 24px serif'
        ctx.fillText('Scan QR Code for Live Support & Plant Guarantee', 300, 1420)

        ctx.fillStyle = '#4B5563'
        ctx.font = '16px sans-serif'
        ctx.fillText(`Specimen ID: #${product.id} • ${product.name} (${product.category})`, 300, 1460)
        ctx.fillText(`Susmita Nursery Online Care Hub: ${pageUrl}`, 300, 1490)

        triggerDownload()
      }

      qrImg.onerror = () => {
        triggerDownload()
      }
    } catch (err) {
      console.error(err)
      setIsGeneratingGuide(false)
    }
  }

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image]

  const wishlisted = isWishlisted(product.id)
  const alias = cultivarAliases[product.id]

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize)
  }

  const careStages = [
    {
      stage: '1',
      title: 'Check Soil',
      desc: 'Check if the top 2 inches of soil are dry. Insert your finger or a moisture meter to verify soil moisture before watering.',
    },
    {
      stage: '2',
      title: 'Water',
      desc: `Water thoroughly until water drains out from the base holes. (Recommended watering frequency: once every 7-10 days depending on season).`,
    },
    {
      stage: '3',
      title: 'Drain',
      desc: 'Ensure excess water drains completely out of the nursery pot. Do not let roots sit in standing water to prevent root rot.',
    },
    {
      stage: '4',
      title: 'Observe',
      desc: 'Place in the right light (bright, indirect light for Monstera/Areca) and observe leaf health and new stem growth.',
    },
    {
      stage: '5',
      title: 'Repeat',
      desc: 'Repeat this 5-stage lifecycle care cycle. Watch your botanical companion grow, adjust, and thrive over the months!',
    },
  ]

  // Default fallback matrix if missing on product
  const specs = [
    { label: 'Light Requirement', value: product.details.light || 'Bright, Indirect Light' },
    { label: 'Growth Height', value: product.height || '1.5 - 2.5 ft' },
    { label: 'Watering Needs', value: product.details.water || 'Moderate' },
    { label: 'Pet Friendly', value: product.petFriendly || 'Yes' },
    { label: 'Care Difficulty', value: product.difficulty || 'Easy' },
    { label: 'Air Purifying', value: product.airPurifying || 'High' },
  ]

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Product Image Gallery */}
            <div className="lg:col-span-6 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-square w-full bg-white border border-border rounded-[36px] overflow-hidden shadow-md group"
              >
                <Image
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  fill
                  sizes="(max-w-1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                  priority
                />
                
                {/* Category tag */}
                <span className="absolute top-6 left-6 inline-flex items-center gap-1 px-3 py-1 bg-primary/15 border border-primary/25 backdrop-blur-md text-primary font-bold text-xs rounded-full uppercase tracking-wider">
                  {product.category}
                </span>
              </motion.div>

              {/* Thumbnails Gallery - Amazon / Flipkart Style */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
                  {galleryImages.map((imgUrl, idx) => {
                    const isSelected = selectedImage === imgUrl
                    const labels = ['Cover', 'Dimension', 'Features', 'Lifestyle']
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group/thumb ${
                          isSelected
                            ? 'border-primary shadow-lg ring-2 ring-primary/40 scale-105'
                            : 'border-border opacity-70 hover:opacity-100 hover:border-primary/50'
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`${product.name} view ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-[2px] py-0.5 text-[9px] font-semibold text-white text-center capitalize">
                          {labels[idx] || `View ${idx + 1}`}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Details & Specs */}
            <div className="lg:col-span-6 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="space-y-6"
              >
                
                {/* Heading Details */}
                <div>
                  <div className="flex flex-wrap items-baseline gap-2.5 mb-2">
                    <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground leading-tight">
                      {product.name}
                    </h1>
                    {alias && (
                      <span className="text-sm font-serif font-light text-neutral-400 italic">
                        ({alias})
                      </span>
                    )}
                  </div>
                  
                  {/* Rating Validation */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className={
                            i < 4
                              ? "fill-accent text-accent"
                              : "text-neutral-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-light font-sans">
                      4.8 Stars (from 125 Customer Reviews)
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <p className="text-3xl sm:text-4xl font-sans font-bold text-primary tabular-nums">
                  ₹{product.price.toFixed(2)}
                </p>

                {/* Marketing description */}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light border-t border-border/40 pt-4 font-sans">
                  {product.id === '00000000-0000-0000-0000-000000000006' 
                    ? "A tropical beauty known for its iconic split leaves. Perfect for modern interiors and improves air quality."
                    : product.description}
                </p>

                {/* Botanical Specifications Matrix Grid */}
                <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
                  <h3 className="font-serif font-bold text-foreground text-sm uppercase tracking-wider mb-4 border-b border-border/40 pb-2">
                    Botanical Specifications Matrix
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {specs.map((spec, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="text-[9px] font-sans font-bold tracking-widest text-primary uppercase bg-primary/5 px-2.5 py-0.5 rounded-full block w-max">
                          {spec.label}
                        </span>
                        <p className="text-xs font-semibold text-foreground font-sans leading-tight pl-0.5">
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Funnel UI */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    
                    {/* Size Selector */}
                    {product.sizes.length > 0 && (
                      <div className="w-full sm:w-auto flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Size Option</span>
                        <div className="flex gap-1.5">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-4 py-2 text-xs rounded-full border cursor-pointer font-bold transition-all ${
                                selectedSize === size
                                  ? 'bg-primary/10 border-primary text-primary'
                                  : 'bg-white hover:bg-muted border-border text-neutral-500'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity Toggles */}
                    <div className="w-full sm:w-auto flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Qty</span>
                      <div className="flex items-center gap-1 bg-white border border-border rounded-full p-1 w-max">
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted font-bold cursor-pointer text-xs"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold font-sans">{quantity}</span>
                        <button
                          onClick={() => setQuantity(q => q + 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted font-bold cursor-pointer text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      size="lg"
                      onClick={handleAddToCart}
                      className="flex-1 bg-primary-emerald hover:bg-primary text-white font-bold rounded-full py-6 cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </Button>
                    
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        size="lg"
                        className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-full py-6 cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        <span>Discuss & Buy</span>
                      </Button>
                    </a>

                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => toggleWishlist(product.id)}
                      className={`w-full sm:w-14 rounded-full border border-border flex items-center justify-center cursor-pointer transition-all py-6 sm:py-0 ${
                        wishlisted ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20' : 'bg-white hover:bg-muted text-foreground'
                      }`}
                    >
                      <Heart className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
                    </Button>
                  </div>

                  {/* Purchase Funnel Trust Badges */}
                  <div className="grid grid-cols-3 gap-3 border-t border-border/40 pt-5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 font-sans tracking-wide">
                      <Truck size={14} className="text-primary" />
                      <span>Safe Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 font-sans tracking-wide">
                      <ShieldCheck size={14} className="text-primary" />
                      <span>Healthy Plants</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 font-sans tracking-wide">
                      <HeartHandshake size={14} className="text-primary" />
                      <span>Expert Support</span>
                    </div>
                  </div>

                </div>

              </motion.div>
            </div>
          </div>

          {/* Interactive Brand Care System Component */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 bg-white border border-border rounded-[36px] p-8 sm:p-10 shadow-sm space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-6 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <BookOpen size={14} className="text-secondary" />
                  <span>Interactive Care system</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  The Brand Care System Component
                </h2>
              </div>
              
              {/* Dynamic PDF / PNG Care Guide & QR Card Generator button */}
              <Button 
                onClick={handleDownloadCareGuide}
                disabled={isGeneratingGuide}
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/5 rounded-full px-6 flex items-center gap-2 cursor-pointer text-xs font-semibold"
              >
                <Download size={13} className={isGeneratingGuide ? "animate-bounce" : ""} />
                <span>{isGeneratingGuide ? "Generating Guide..." : "Download Care Guide"}</span>
              </Button>
            </div>

            {/* Lifecycle Stages Navigator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Side: 5 Stages Buttons */}
              <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2.5 overflow-x-auto pb-2 lg:pb-0">
                {careStages.map((stage, idx) => {
                  const isActive = activeCareStage === idx
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveCareStage(idx)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl border text-left cursor-pointer transition-all whitespace-nowrap lg:whitespace-normal w-full min-w-[160px] lg:min-w-0 ${
                        isActive 
                          ? 'border-primary bg-primary/10 font-bold text-primary shadow-sm'
                          : 'border-border bg-background hover:bg-muted text-neutral-500 font-light'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-sans text-xs font-semibold ${isActive ? 'bg-primary text-white' : 'bg-muted text-neutral-500'}`}>
                        {stage.stage}
                      </span>
                      <span className="text-xs uppercase tracking-wider">{stage.title}</span>
                    </button>
                  )
                })}
              </div>

              {/* Right Side: Selected Stage Description & Pro Tip */}
              <div className="lg:col-span-8 bg-background p-8 rounded-3xl border border-border/80 min-h-[220px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCareStage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <span className="text-[9px] font-sans font-bold tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase block w-max">
                      Stage {careStages[activeCareStage].stage} Routine
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-foreground">
                      {careStages[activeCareStage].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed font-sans max-w-xl">
                      {careStages[activeCareStage].desc}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Pro Tip Callout */}
                <div className="border-t border-border/60 pt-5 mt-6 flex items-start gap-3 text-xs">
                  <span className="text-[9px] font-sans font-bold text-accent bg-accent/15 border border-accent/25 px-2 py-0.5 rounded uppercase tracking-wider mt-0.5 whitespace-nowrap">
                    Pro Tip
                  </span>
                  <p className="text-neutral-500 font-light italic leading-normal font-sans pl-1">
                    &quot;Water in the morning or evening. Avoid overwatering. Every plant is unique—observe and adjust the care cycle.&quot;
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Dynamic Botanical Suggestions, Tools, Medicines & Pots */}
          <PlantCareSuggestions currentProduct={product} />
        </div>
      </div>

      <Footer />
    </main>
  )
}
