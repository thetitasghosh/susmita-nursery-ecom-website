'use client'

import React, { useState, useEffect } from 'react'
import { 
  Sparkles, 
  UploadCloud, 
  Search, 
  Database, 
  CheckCircle, 
  ArrowRight, 
  Settings, 
  HelpCircle, 
  FileText, 
  Image as ImageIcon,
  Check,
  Eye,
  Info
} from 'lucide-react'
import { getProductsAction } from '@/server/product'
import { allProducts, Product } from '@/lib/products'

type NewsletterTemplateType = 'care_guide' | 'seasonal_promo' | 'new_arrivals' | 'wishlist_restock'

interface GeneratedAssets {
  cover: string
  dimension: string
  feature: string
  lifestyle: string
}

interface PlantPreset {
  name: string
  folder: string
  prefix: string
  rawImage: string
  description: string
}

const plantPresets: PlantPreset[] = [
  {
    name: 'Money Plant Yellow Slabs',
    folder: 'money-plant',
    prefix: 'money-plant-yellow',
    rawImage: '/images/plants/pothos-hanging.jpg',
    description: 'Beautiful golden-green trailing vine supported by rustic wood frames.'
  },
  {
    name: 'Birkin Philodendron',
    folder: 'birkin-plant',
    prefix: 'birkin-philodendron',
    rawImage: '/images/plants/monstera-plant.jpg',
    description: 'Stunning glossy dark green leaves marked with creamy white pinstripe variegation.'
  },
  {
    name: 'Lipstick Plant',
    folder: 'lipstick-plant',
    prefix: 'lipstick-plant',
    rawImage: '/images/plants/peace-lily.jpg',
    description: 'Cascading stems boasting bright tubular red blooms rising out of dark purple cups.'
  }
]

export default function AIGeneratorPage() {
  const [selectedPreset, setSelectedPreset] = useState<PlantPreset>(plantPresets[0])
  const [customName, setCustomName] = useState(plantPresets[0].name)
  const [targetSize, setTargetSize] = useState('Medium')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string>(plantPresets[0].rawImage)
  
  // API settings
  const [useSimulation, setUseSimulation] = useState(true)
  const [openaiKey, setOpenaiKey] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  // Status & logs
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [generationLogs, setGenerationLogs] = useState<string[]>([])
  
  // Output assets
  const [assets, setAssets] = useState<GeneratedAssets | null>(null)
  
  // Database linkage states
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const stepsList = [
    'Analyzing raw plant features (leaf margins, color nodes)...',
    'Isolating background parameters & rendering clean studio Cover cutout...',
    'Calibrating height metrics & overlaying size Dimension markers...',
    'Enhancing macro textures for Leaf Feature close-up zoom...',
    'Synthesizing modern indoor layout & rendering premium Lifestyle setting...'
  ]

  // Sync customName & preview when changing presets
  useEffect(() => {
    setCustomName(selectedPreset.name)
    setUploadPreview(selectedPreset.rawImage)
    setUploadedFile(null)
  }, [selectedPreset])

  // Load database products
  useEffect(() => {
    async function loadDbProducts() {
      try {
        const res = await getProductsAction()
        if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setCatalogProducts(res.data as Product[])
        } else {
          const stored = localStorage.getItem('nursery_products')
          if (stored) {
            setCatalogProducts(JSON.parse(stored))
          } else {
            setCatalogProducts(allProducts)
          }
        }
      } catch {
        setCatalogProducts(allProducts)
      }
    }
    loadDbProducts()
    
    // Check local API key
    const savedKey = localStorage.getItem('demo_openai_key')
    if (savedKey) {
      setOpenaiKey(savedKey)
      setUseSimulation(false)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)
      setUploadPreview(URL.createObjectURL(file))
    }
  }

  const triggerGeneration = () => {
    if (!customName.trim()) {
      showToast('Please enter a plant product name', 'error')
      return
    }

    setIsGenerating(true)
    setAssets(null)
    setGenerationLogs([])
    setCurrentStep(0)

    // Simulate progressive generation log sequence
    let step = 0
    const interval = setInterval(() => {
      setGenerationLogs(prev => [...prev, `✓ ${stepsList[step]}`])
      step++
      setCurrentStep(step)
      
      if (step >= stepsList.length) {
        clearInterval(interval)
        setTimeout(() => {
          setAssets({
            cover: `/images/plants/${selectedPreset.folder}/${selectedPreset.prefix}-cover.png`,
            dimension: `/images/plants/${selectedPreset.folder}/${selectedPreset.prefix}-dimension.png`,
            feature: `/images/plants/${selectedPreset.folder}/${selectedPreset.prefix}-feature.png`,
            lifestyle: `/images/plants/${selectedPreset.folder}/${selectedPreset.prefix}-lifestyle.png`
          })
          setIsGenerating(false)
          showToast('Product Asset Set generated successfully!', 'success')
        }, 600)
      }
    }, 900)
  }

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const saveApiKey = (key: string) => {
    setOpenaiKey(key)
    if (key.trim()) {
      localStorage.setItem('demo_openai_key', key)
      setUseSimulation(false)
      showToast('Demo API Key configured successfully', 'success')
    } else {
      localStorage.removeItem('demo_openai_key')
      setUseSimulation(true)
      showToast('Switched to Local Simulator Mode', 'success')
    }
  }

  // Link generated assets to an existing product card
  const linkToProduct = (prod: Product) => {
    if (!assets) return

    try {
      const stored = localStorage.getItem('nursery_products')
      let list: any[] = []
      if (stored) {
        list = JSON.parse(stored)
      } else {
        list = [...allProducts]
      }

      // Update product item fields
      const updated = list.map((p: any) => {
        if (p.id === prod.id) {
          return {
            ...p,
            image: assets.cover,
            supportingImages: [assets.dimension, assets.feature, assets.lifestyle]
          }
        }
        return p
      })

      localStorage.setItem('nursery_products', JSON.stringify(updated))
      showToast(`Linked assets successfully to "${prod.name}" catalog sheet!`, 'success')
      setProductDropdownOpen(false)
    } catch (err) {
      console.error(err)
      showToast('Failed to link product details', 'error')
    }
  }

  // Create a completely new product listing in local catalog
  const createNewProduct = () => {
    if (!assets) return

    try {
      const stored = localStorage.getItem('nursery_products')
      let list: any[] = []
      if (stored) {
        list = JSON.parse(stored)
      } else {
        list = [...allProducts]
      }

      const newId = `ai_${Date.now()}`
      const newProductItem = {
        id: newId,
        name: customName,
        category: 'Indoor Plants',
        price: 349,
        image: assets.cover,
        description: selectedPreset.description,
        difficulty: 'Easy',
        light: 'Bright indirect light',
        water: 'Water weekly when soil is dry',
        supportingImages: [assets.dimension, assets.feature, assets.lifestyle],
        sizes: [targetSize]
      }

      const updated = [newProductItem, ...list]
      localStorage.setItem('nursery_products', JSON.stringify(updated))
      setCatalogProducts(updated)
      showToast(`Registered "${customName}" as a new specimen product!`, 'success')
    } catch (err) {
      console.error(err)
      showToast('Failed to register new product card', 'error')
    }
  }

  return (
    <div className="flex-1 bg-background overflow-y-auto p-6 sm:p-8 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-2.5 transition-all transform animate-bounce ${
          toastMessage.type === 'success' 
            ? 'bg-secondary/10 border-secondary/30 text-primary font-semibold' 
            : 'bg-red-50 border-red-200 text-red-600 font-semibold'
        }`}>
          <span>{toastMessage.type === 'success' ? '✓' : '⚠'}</span>
          <span className="text-xs">{toastMessage.text}</span>
        </div>
      )}

      {/* Header Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary flex items-center gap-2.5 flex-wrap">
            <Sparkles className="text-secondary" />
            <span>AI Plant Product Builder</span>
            <span className="bg-secondary/15 text-primary text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-secondary/35">
              Coming Soon
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Simulate advanced neural rendering models (Gemini Nano / DALL-E) to build consistent e-commerce asset sheets.
          </p>
        </div>

        {/* Simulator Settings Trigger Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
            showSettings 
              ? 'bg-primary text-white border-primary' 
              : 'bg-card border-border hover:bg-muted text-neutral-600'
          }`}
        >
          <Settings size={14} className={showSettings ? 'animate-spin' : ''} />
          <span>Config AI Engine</span>
        </button>
      </div>

      {/* Toggle settings drawer card */}
      {showSettings && (
        <div className="bg-card border border-border/80 rounded-3xl p-6 mb-8 shadow-sm hover:border-primary/25 transition-all">
          <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
            <Info size={14} className="text-primary" />
            <span>Simulator Engine Config</span>
          </h3>
          <p className="text-xs text-neutral-400 mb-4 font-light leading-relaxed">
            Toggle between the offline local layout simulator or add an API key for live Cloud parameters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <label className="font-semibold text-neutral-700 block">AI Dispatch Model</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUseSimulation(true)}
                  className={`flex-1 py-2.5 rounded-xl border font-bold transition-all ${
                    useSimulation
                      ? 'bg-secondary/15 text-primary border-secondary/35'
                      : 'bg-background border-border text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  Local Nano Simulation
                </button>
                <button
                  type="button"
                  onClick={() => setUseSimulation(false)}
                  className={`flex-1 py-2.5 rounded-xl border font-bold transition-all ${
                    !useSimulation
                      ? 'bg-secondary/15 text-primary border-secondary/35'
                      : 'bg-background border-border text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  OpenAI DALL-E (Demo Key)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-neutral-700 block">Demo OpenAI Key Override</label>
              <input
                type="password"
                placeholder={useSimulation ? "Simulated Mode - No Key Required" : "sk-proj-...................."}
                disabled={useSimulation}
                value={openaiKey}
                onChange={(e) => saveApiKey(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-xs placeholder:text-neutral-400 disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace split panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Preset select & inputs */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[104px] z-10">
          
          {/* Preset Selector Card */}
          <div className="bg-white border border-neutral-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
            <h3 className="text-sm font-bold text-neutral-800 mb-3">1. Select Preset Specimen</h3>
            <div className="space-y-2">
              {plantPresets.map((preset) => {
                const isSelected = selectedPreset.name === preset.name
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-primary/5 border-primary/30 text-primary shadow-sm'
                        : 'bg-neutral-50/50 border-neutral-100 hover:bg-neutral-100/50 text-neutral-600'
                    }`}
                  >
                    <span className="w-10 h-10 border border-border/85 rounded-xl overflow-hidden relative shrink-0 block bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preset.rawImage} alt={preset.name} className="object-cover w-full h-full" />
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">{preset.name}</span>
                      <span className="text-[10px] text-neutral-400 block mt-0.5 font-light truncate">{preset.description}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form parameters card */}
          <div className="bg-white border border-neutral-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-4">
            <h3 className="text-sm font-bold text-neutral-800">2. Specimen Settings</h3>
            
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-neutral-700">Custom Plant Name *</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Money Plant Yellow Slabs"
                className="w-full bg-neutral-50/60 border border-neutral-200 focus:bg-white focus:border-primary rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-xs text-foreground font-semibold transition-all"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-neutral-700">Target Size Specimen</label>
              <select
                value={targetSize}
                onChange={(e) => setTargetSize(e.target.value)}
                className="w-full bg-neutral-50/60 border border-neutral-200 focus:bg-white focus:border-primary rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary text-xs transition-all"
              >
                <option value="Small">Small (4-6 inches)</option>
                <option value="Medium">Medium (6-8 inches)</option>
                <option value="Large">Large (8-10 inches)</option>
              </select>
            </div>

            {/* Mock Image Upload Area */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-neutral-700 block">Raw Reference Image *</label>
              <div className="border-2 border-dashed border-neutral-200 hover:border-primary/40 rounded-2xl p-6 text-center cursor-pointer transition-all bg-neutral-50/30 relative overflow-hidden group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                
                {uploadPreview ? (
                  <div className="space-y-2">
                    <span className="w-20 h-20 border border-border/80 rounded-xl overflow-hidden relative block mx-auto bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={uploadPreview} alt="Preview" className="object-cover w-full h-full" />
                    </span>
                    <span className="text-[10px] text-primary font-semibold block underline">Replace reference image</span>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto text-neutral-400 group-hover:text-primary transition-colors" size={24} />
                    <span className="text-[11px] font-bold block text-neutral-700">Click to upload raw plant image</span>
                    <span className="text-[9px] text-neutral-400 block font-light">Supports JPEG, PNG up to 5MB</span>
                  </div>
                )}
              </div>
            </div>

            {/* Generation CTA Button */}
            <button
              onClick={triggerGeneration}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/95 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Sparkles size={14} className="text-secondary" />
              <span>{isGenerating ? 'Analyzing Specimen...' : 'Generate Product Assets Set'}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Generation progress / results assets grid */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Simulation status screen */}
          {isGenerating && (
            <div className="bg-card border border-border/80 rounded-[32px] p-8 shadow-sm text-xs space-y-6 animate-pulse">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                <h3 className="text-sm font-bold text-neutral-800">Processing Specimen Neural Rendering Pipeline</h3>
              </div>
              <div className="space-y-3 font-mono text-[10px] text-neutral-500">
                {generationLogs.map((log, idx) => (
                  <p key={idx} className="text-primary font-semibold">{log}</p>
                ))}
                <p className="text-neutral-400 animate-bounce">
                  ⚡ Rendering: {stepsList[currentStep] || 'Finalizing assets output...'}
                </p>
              </div>
            </div>
          )}

          {/* Output generated grid card results */}
          {assets && !isGenerating && (
            <div className="space-y-6">
              
              {/* Database Link Actions Card */}
              <div className="bg-gradient-to-br from-white to-neutral-50/50 border border-neutral-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="text-primary" size={18} />
                  <h3 className="text-sm font-bold text-neutral-800">Add to Product Sheet</h3>
                </div>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Directly bind this generated asset set (cover photo + supporting details) into your main catalogue sheets.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  
                  {/* Select product from catalog searchable tool */}
                  <div className="flex-1 relative">
                    <div className="relative">
                      <Search size={13} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search catalog products to link..."
                        value={productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value)
                          setProductDropdownOpen(true)
                        }}
                        onFocus={() => setProductDropdownOpen(true)}
                        className="w-full bg-background border border-border/80 pl-9 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
                      />
                    </div>

                    {productDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1.5 bg-white border border-border/80 rounded-2xl shadow-xl max-h-48 overflow-y-auto p-1.5 space-y-0.5">
                        {catalogProducts
                          .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
                          .map(prod => (
                            <button
                              type="button"
                              key={prod.id}
                              onClick={() => {
                                setProductSearch(prod.name)
                                linkToProduct(prod)
                              }}
                              className="w-full text-left flex items-center gap-3 p-2 hover:bg-muted/60 rounded-xl transition-all"
                            >
                              <span className="w-7 h-7 border border-border rounded-lg overflow-hidden relative inline-block shrink-0 bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={prod.image} alt={prod.name} className="object-cover w-full h-full" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-neutral-800 text-xs block truncate">{prod.name}</span>
                                <span className="text-[10px] text-neutral-400 block font-light">₹{prod.price} • {prod.category}</span>
                              </div>
                            </button>
                          ))}
                        {catalogProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                          <p className="text-[10px] text-neutral-400 p-3 italic text-center">No products found</p>
                        )}
                      </div>
                    )}
                    
                    {/* Backdrop */}
                    {productDropdownOpen && (
                      <div className="fixed inset-0 z-40" onClick={() => setProductDropdownOpen(false)} />
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-neutral-300 hidden sm:inline">|</span>
                    <button
                      type="button"
                      onClick={createNewProduct}
                      className="bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 px-5 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-bold"
                    >
                      Register as New Product
                    </button>
                  </div>
                </div>
              </div>

              {/* 4-Bento Assets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Cover Card */}
                <div className="bg-white border border-neutral-100 rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.025)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ease-out border-b-4 border-b-primary/10 group">
                  <div className="aspect-[4/3] bg-neutral-50 relative overflow-hidden flex items-center justify-center p-6 border-b border-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={assets.cover} alt="Cover" className="object-contain max-h-full max-w-full drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-4 left-4 bg-primary text-white text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      1. Studio Cover Cutout
                    </span>
                  </div>
                  <div className="p-5 space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wide font-bold">Catalog Profile</span>
                    <h4 className="text-xs font-bold text-neutral-700">Clean Isolated Specimen</h4>
                    <p className="text-[10px] text-neutral-400 font-light leading-normal">Stripped background optimized for catalog searching feeds and shelf slots.</p>
                  </div>
                </div>

                {/* 2. Dimension Card */}
                <div className="bg-white border border-neutral-100 rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.025)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ease-out border-b-4 border-b-primary/10 group">
                  <div className="aspect-[4/3] bg-neutral-50 relative overflow-hidden flex items-center justify-center p-6 border-b border-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={assets.dimension} alt="Dimension" className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-4 left-4 bg-primary text-white text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      2. Measurement Specs
                    </span>
                  </div>
                  <div className="p-5 space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wide font-bold">Structural Sizing</span>
                    <h4 className="text-xs font-bold text-neutral-700">Dimension Overlays</h4>
                    <p className="text-[10px] text-neutral-400 font-light leading-normal">Displays height and width indicators with pot sizes to guarantee proper fit.</p>
                  </div>
                </div>

                {/* 3. Feature Card */}
                <div className="bg-white border border-neutral-100 rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.025)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ease-out border-b-4 border-b-primary/10 group">
                  <div className="aspect-[4/3] bg-neutral-50 relative overflow-hidden flex items-center justify-center p-6 border-b border-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={assets.feature} alt="Feature" className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-4 left-4 bg-primary text-white text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      3. Macro Close-up
                    </span>
                  </div>
                  <div className="p-5 space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wide font-bold">Botanical Quality</span>
                    <h4 className="text-xs font-bold text-neutral-700">Foliage Details</h4>
                    <p className="text-[10px] text-neutral-400 font-light leading-normal">High resolution textures focusing on vein nodes, colorations, and health indices.</p>
                  </div>
                </div>

                {/* 4. Lifestyle Card */}
                <div className="bg-white border border-neutral-100 rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.025)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 ease-out border-b-4 border-b-primary/10 group">
                  <div className="aspect-[4/3] bg-neutral-50 relative overflow-hidden flex items-center justify-center p-6 border-b border-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={assets.lifestyle} alt="Lifestyle" className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-4 left-4 bg-primary text-white text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      4. Interior Scene
                    </span>
                  </div>
                  <div className="p-5 space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wide font-bold">Contextual Living</span>
                    <h4 className="text-xs font-bold text-neutral-700">Lifestyle Rendering</h4>
                    <p className="text-[10px] text-neutral-400 font-light leading-normal">Simulates contextual interior placement to help buyers visualize the plant in their space.</p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Empty initial state */}
          {!assets && !isGenerating && (
            <div className="bg-white border border-neutral-100 rounded-[32px] p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-4 flex flex-col items-center justify-center">
              <span className="w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center text-primary text-xl">
                🌿
              </span>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-serif font-bold text-primary">No Assets Generated Yet</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Select a plant preset or upload a custom raw reference image, then click the builder trigger to generate the visual marketing set.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
