'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Check, 
  Tag, 
  Star, 
  Link as LinkIcon,
  HelpCircle,
  X,
  UploadCloud,
  Image as ImageIcon
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
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

import { 
  getProductsAction, 
  createProductAction, 
  updateProductAction, 
  deleteProductAction 
} from '@/server/product'

type EnrichedProduct = Product & {
  slug?: string
  supportingImages?: string[]
  nestedItemIds?: string[]
  stock_quantity?: number
  reserved_quantity?: number
}

// Helper to generate slugs
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search')
  
  const [products, setProducts] = useState<EnrichedProduct[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  
  // Image Uploading State & Function
  const [uploading, setUploading] = useState(false)
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `uploads/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (err: unknown) {
      alert('Error uploading image: ' + (err instanceof Error ? err.message : String(err)))
      return null
    } finally {
      setUploading(false)
    }
  }

  // Recommendations search and dropdown state
  const [toolSearch, setToolSearch] = useState('')
  const [medSearch, setMedSearch] = useState('')
  const [toolDropdownOpen, setToolDropdownOpen] = useState(false)
  const [medDropdownOpen, setMedDropdownOpen] = useState(false)

  // Drag and drop states
  const [dragOverCover, setDragOverCover] = useState(false)
  const [dragOverGallery, setDragOverGallery] = useState(false)

  useEffect(() => {
    if (urlSearch !== null) {
      setSearchTerm(urlSearch)
    }
  }, [urlSearch])
  
  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<EnrichedProduct | null>(null)

  // Form state
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formCategory, setFormCategory] = useState('Indoor Plants')
  const [formPrice, setFormPrice] = useState(0)
  const [formScientificName, setFormScientificName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  
  // Cover Photo and Supporting Photos
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState('')
  
  interface GalleryItem {
    id: string
    file: File | null
    url: string
  }
  const [supportingFiles, setSupportingFiles] = useState<GalleryItem[]>([])

  // Care specs details
  const [formLight, setFormLight] = useState('Bright, indirect light')
  const [formWater, setFormWater] = useState('Moderate')
  const [formHumidity, setFormHumidity] = useState('Moderate to high')
  const [formTemperature, setFormTemperature] = useState('65-75°F')
  const [formSoil, setFormSoil] = useState('Well-draining potting soil')

  // Sizes & Care instructions
  const [formSizes, setFormSizes] = useState<string[]>(['Medium'])
  const [newSize, setNewSize] = useState('')
  const [formCareInstructions, setFormCareInstructions] = useState<string[]>([
    'Water only when soil is dry.',
    'Keep in indirect sunlight.'
  ])
  const [newCareInst, setNewCareInst] = useState('')

  // Nested Tools & Medicines Recommendation IDs
  const [nestedTools, setNestedTools] = useState<string[]>([])
  const [nestedMedicines, setNestedMedicines] = useState<string[]>([])

  // Marketplace links
  const [formAmazonLink, setFormAmazonLink] = useState('')
  const [formFlipkartLink, setFormFlipkartLink] = useState('')

  // Load products from Supabase database with fallback to local definitions
  const loadProducts = async () => {
    setLoading(true)
    try {
      const res = await getProductsAction()
      if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setProducts(res.data as EnrichedProduct[])
        setLoading(false)
        return
      }
    } catch {
      // Fallback
    }

    const stored = localStorage.getItem('nursery_products')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.length > 0) {
          setProducts(parsed)
          setLoading(false)
          return
        }
      } catch {
        // Fallback
      }
    }

    const enriched: EnrichedProduct[] = allProducts.map(p => ({
      ...p,
      supportingImages: [
        '/images/plants/succulent-collection.jpg',
        '/images/plants/aglaonema-red.jpg'
      ],
      nestedItemIds: p.category === 'Gardening Tools' || p.category === 'Plants Medicine' || p.category === 'Organic Fertilizer' ? [] : ['00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000019']
    }))
    setProducts(enriched)
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // Auto-slugify name
  useEffect(() => {
    if (!editingProduct) {
      setFormSlug(slugify(formName))
    }
  }, [formName, editingProduct])

  // Get lists of Tools and Medicines for nesting checkboxes
  const availableTools = products.filter(
    p => p.category === 'Gardening Tools' || p.category === 'No1. Fiber Pots' || p.category === 'Ceramic Pots' || p.category === 'No1. Clay Pots' || p.category === 'Plastic Pots'
  )
  const availableMedicines = products.filter(
    p => p.category === 'Plants Medicine' || p.category === 'Organic Fertilizer'
  )

  // Open sheet for add
  const handleOpenAdd = () => {
    setEditingProduct(null)
    setFormName('')
    setFormSlug('')
    setFormCategory('Indoor Plants')
    setFormPrice(299)
    setFormScientificName('')
    setFormDescription('')
    setCoverFile(null)
    setCoverPreview('')
    setSupportingFiles([])
    setFormLight('Bright, indirect light')
    setFormWater('Moderate')
    setFormHumidity('Moderate')
    setFormTemperature('60-80°F')
    setFormSoil('Well-draining mix')
    setFormSizes(['Medium'])
    setFormCareInstructions(['Keep in bright light.', 'Water weekly.'])
    setNestedTools([])
    setNestedMedicines([])
    setToolSearch('')
    setMedSearch('')
    setToolDropdownOpen(false)
    setMedDropdownOpen(false)
    setFormAmazonLink('')
    setFormFlipkartLink('')
    
    setIsSheetOpen(true)
  }

  // Open sheet for edit
  const handleOpenEdit = (product: EnrichedProduct) => {
    setEditingProduct(product)
    setFormName(product.name)
    setFormSlug(product.slug || slugify(product.name))
    setFormCategory(product.category)
    setFormPrice(product.price)
    setFormScientificName(product.scientificName || '')
    setFormDescription(product.description || '')
    setCoverFile(null)
    setCoverPreview(product.image)
    const gallery = product.supportingImages || product.images || []
    setSupportingFiles(gallery.map(img => ({ id: Math.random().toString(), file: null, url: img })))
    
    setFormLight(product.details?.light || 'Moderate')
    setFormWater(product.details?.water || 'Moderate')
    setFormHumidity(product.details?.humidity || 'Moderate')
    setFormTemperature(product.details?.temperature || '60-80°F')
    setFormSoil(product.details?.soil || 'Well-draining')

    setFormSizes(product.sizes || ['Medium'])
    setFormCareInstructions(product.careInstructions || [])

    const nested = product.nestedItemIds || []
    setNestedTools(nested.filter((id: string) => availableTools.some(t => t.id === id)))
    setNestedMedicines(nested.filter((id: string) => availableMedicines.some(m => m.id === id)))
    setToolSearch('')
    setMedSearch('')
    setToolDropdownOpen(false)
    setMedDropdownOpen(false)
    setFormAmazonLink(product.amazonLink || '')
    setFormFlipkartLink(product.flipkartLink || '')

    setIsSheetOpen(true)
  }

  const handleToggleFeatured = async (id: string) => {
    const targetProduct = products.find(p => p.id === id)
    if (!targetProduct) return

    const isFeatured = !targetProduct.featured
    if (isFeatured) {
      const currentlyFeaturedCount = products.filter(p => p.featured).length
      if (currentlyFeaturedCount >= 5) {
        alert('You can only have up to 5 featured products at a time. Please unfeature another product first.')
        return
      }
    }

    const updated = products.map(p => p.id === id ? { ...p, featured: isFeatured } : p)
    setProducts(updated)
    localStorage.setItem('nursery_products', JSON.stringify(updated))

    try {
      const res = await updateProductAction(id, { featured: isFeatured })
      if (!res.success) {
        setProducts(products)
        alert(res.error || 'Failed to update featured status.')
      }
    } catch {
      setProducts(products)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProductAction(id)
      const updated = products.filter(p => p.id !== id)
      setProducts(updated)
      localStorage.setItem('nursery_products', JSON.stringify(updated))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName) return

    setUploading(true)
    try {
      // 1. Upload Cover Image if a new file was chosen
      let finalCoverUrl = coverPreview
      if (coverFile) {
        const uploadedUrl = await uploadImage(coverFile)
        if (uploadedUrl) {
          finalCoverUrl = uploadedUrl
        } else {
          throw new Error('Cover photo upload failed.')
        }
      }

      // 2. Upload Supporting Images if new files were chosen
      const finalSupportingImages: string[] = []
      for (const item of supportingFiles) {
        if (item.file) {
          const uploadedUrl = await uploadImage(item.file)
          if (uploadedUrl) {
            finalSupportingImages.push(uploadedUrl)
          } else {
            throw new Error('One of the supporting images failed to upload.')
          }
        } else {
          finalSupportingImages.push(item.url)
        }
      }

      const productPayload: Partial<Product> & { nestedItemIds?: string[] } = {
        name: formName,
        slug: formSlug,
        category: formCategory,
        price: Number(formPrice),
        scientificName: formScientificName,
        description: formDescription,
        image: finalCoverUrl,
        images: finalSupportingImages,
        details: {
          light: formLight,
          water: formWater,
          humidity: formHumidity,
          temperature: formTemperature,
          soil: formSoil
        },
        sizes: formSizes,
        careInstructions: formCareInstructions,
        nestedItemIds: [...nestedTools, ...nestedMedicines],
        amazonLink: formAmazonLink.trim() || undefined,
        flipkartLink: formFlipkartLink.trim() || undefined
      }

      if (editingProduct) {
        await updateProductAction(editingProduct.id, productPayload)
      } else {
        await createProductAction(productPayload)
      }

      await loadProducts()
      setIsSheetOpen(false)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err))
    } finally {
      setUploading(false)
    }
  }

  // Supporting Photos CRUD
  const addSupportingFile = (file: File) => {
    const newItem = {
      id: Math.random().toString(),
      file,
      url: URL.createObjectURL(file)
    }
    setSupportingFiles([...supportingFiles, newItem])
  }

  const removeSupportingFile = (id: string) => {
    setSupportingFiles(supportingFiles.filter(item => item.id !== id))
  }

  // Sizes CRUD
  const addSize = () => {
    if (newSize.trim() && !formSizes.includes(newSize)) {
      setFormSizes([...formSizes, newSize.trim()])
      setNewSize('')
    }
  }

  const removeSize = (idx: number) => {
    setFormSizes(formSizes.filter((_, i) => i !== idx))
  }

  // Care instructions CRUD
  const addCareInst = () => {
    if (newCareInst.trim() && !formCareInstructions.includes(newCareInst)) {
      setFormCareInstructions([...formCareInstructions, newCareInst.trim()])
      setNewCareInst('')
    }
  }

  const removeCareInst = (idx: number) => {
    setFormCareInstructions(formCareInstructions.filter((_, i) => i !== idx))
  }



  const categories = [
    'All',
    'Indoor Plants',
    'Lucky Bamboo',
    'No1. Fiber Pots',
    'Ceramic Pots',
    'No1. Clay Pots',
    'Plastic Pots',
    'Organic Fertilizer',
    'Plants Medicine',
    'Gardening Tools',
    'Fruit Plants',
    'Flower Plants',
    'Outdoor Plants'
  ]

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.scientificName && p.scientificName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-neutral-dark">
            Product Catalog Manager
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-1">
            Display, add, and modify botanical specimens and garden accessories.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary-emerald text-white px-5 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by product name or scientific name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-neutral-400"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter size={12} className="text-primary" />
            <span>Category:</span>
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-border/80 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer font-semibold"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reusable Table Grid */}
      <div className="bg-card border border-border/80 rounded-[32px] overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="py-4 px-6 font-semibold w-40">Slug</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Specimen</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Category</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Price</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Rating / Reviews</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Specs (Light/Water)</TableHead>
              <TableHead className="py-4 px-4 font-semibold text-center w-24">Featured</TableHead>
              <TableHead className="py-4 px-6 text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="animate-pulse">
                  <TableCell className="py-6 px-6"><div className="h-4 bg-muted rounded-full w-8" /></TableCell>
                  <TableCell className="py-6 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted shrink-0" />
                      <div className="space-y-2 w-full">
                        <div className="h-4 bg-muted rounded-full w-32" />
                        <div className="h-3 bg-muted rounded-full w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-4"><div className="h-4 bg-muted rounded-full w-20" /></TableCell>
                  <TableCell className="py-6 px-4"><div className="h-4 bg-muted rounded-full w-12" /></TableCell>
                  <TableCell className="py-6 px-4">
                    <div className="space-y-1.5">
                      <div className="h-3.5 bg-muted rounded-full w-16" />
                      <div className="h-3 bg-muted rounded-full w-10" />
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-4">
                    <div className="space-y-1.5">
                      <div className="h-3.5 bg-muted rounded-full w-24" />
                      <div className="h-3 bg-muted rounded-full w-16" />
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-4">
                    <div className="h-4 bg-muted rounded-full w-8 mx-auto" />
                  </TableCell>
                  <TableCell className="py-6 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-8 h-8 rounded-lg bg-muted" />
                      <div className="w-8 h-8 rounded-lg bg-muted" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="py-4 px-6 text-neutral-400 font-mono text-[10px] break-all max-w-[140px]">{product.slug || product.id}</TableCell>
                  <TableCell className="py-4 px-4 font-medium text-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-border relative shrink-0 bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-neutral-800 block leading-tight">{product.name}</span>
                        {product.scientificName && (
                          <span className="text-[10px] text-muted-foreground italic font-serif block mt-0.5">{product.scientificName}</span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border/60">
                      <Tag size={10} className="text-primary" />
                      <span>{product.category}</span>
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-4 font-bold text-neutral-800 tabular-nums">
                    ₹{product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-0.5 text-accent">
                        <Star size={11} className="fill-current" />
                        <span className="font-semibold text-neutral-800 text-[11px]">{product.rating || 5.0}</span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-light">({product.reviews || 0} reviews)</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="text-[10px] space-y-0.5 text-neutral-500 font-light">
                      <p><span className="font-semibold">Light:</span> {product.details?.light || 'N/A'}</p>
                      <p><span className="font-semibold">Water:</span> {product.details?.water || 'N/A'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={!!product.featured}
                      onChange={() => handleToggleFeatured(product.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer mx-auto"
                    />
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-2 text-primary hover:text-white bg-primary/5 hover:bg-primary border border-primary/25 rounded-lg transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 rounded-lg transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground font-light">
                  No products found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Reusable Shadcn Sheet component */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="max-w-2xl flex flex-col h-full overflow-hidden">
          <SheetHeader>
            <SheetTitle>
              {editingProduct ? 'Edit Catalog Product' : 'Add Catalog Product'}
            </SheetTitle>
            <SheetDescription>
              {editingProduct ? `Product ID: ${editingProduct.id}` : 'Create New Specimen record'}
            </SheetDescription>
          </SheetHeader>
          
          <form id="product-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-8 text-xs">
            {/* Section 1: Basic info */}
            <div className="space-y-4">
              <h3 className="text-sm font-serif font-bold text-primary border-b border-border/40 pb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                <span>Basic Product Information</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Monstera Deliciosa"
                    className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700 flex items-center gap-1">
                    <span>Slug (URL identifier) *</span>
                    <span title="Auto-generated from name" className="cursor-help">
                      <HelpCircle size={11} className="text-neutral-400" />
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="monstera-deliciosa"
                    className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-white border border-border/80 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Price (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formPrice || ''}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Scientific Name</label>
                  <input
                    type="text"
                    value={formScientificName}
                    onChange={(e) => setFormScientificName(e.target.value)}
                    placeholder="e.g. Monstera deliciosa"
                    className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs italic"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-700">Marketing Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter a brief, premium product summary details..."
                  className="w-full bg-white border border-border/80 px-3.5 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs leading-normal"
                />
              </div>
            </div>

            {/* Section 2: Photos management */}
            <div className="space-y-4">
              <h3 className="text-sm font-serif font-bold text-primary border-b border-border/40 pb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                <span>Product Visuals & Showcase Photos</span>
              </h3>
                            <div className="space-y-2">
                <label className="font-semibold text-neutral-700 block">Main Cover Photo</label>
                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                  {/* Left: Preview thumbnail */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-border relative shrink-0 bg-muted flex items-center justify-center">
                    {coverPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={coverPreview} alt="Cover Preview" className="object-cover w-full h-full" />
                    ) : (
                      <ImageIcon className="text-neutral-400 w-8 h-8" />
                    )}
                  </div>
                  
                  {/* Right: Dropzone / Input wrapper */}
                  <div className="flex-1 flex flex-col justify-between gap-3">
                    <label
                      onDragOver={(e) => { e.preventDefault(); setDragOverCover(true); }}
                      onDragLeave={() => setDragOverCover(false)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setDragOverCover(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          const file = e.dataTransfer.files[0];
                          setCoverFile(file);
                          setCoverPreview(URL.createObjectURL(file));
                        }
                      }}
                      className={`flex-1 border border-dashed rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                        dragOverCover
                          ? 'border-primary bg-primary/5 text-primary scale-[0.99]'
                          : 'border-border hover:border-primary bg-muted/20 hover:bg-primary/5 text-neutral-500'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setCoverFile(file);
                            setCoverPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                      <UploadCloud className={`w-5 h-5 mb-1.5 transition-colors ${dragOverCover ? 'text-primary' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-semibold block text-center leading-none">
                        {coverFile ? `Selected: ${coverFile.name}` : 'Drag & Drop cover photo or click to browse'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="font-semibold text-neutral-700 block">Supporting Gallery Photos (4:3 Aspect Ratio)</label>
                <div className="w-full">
                  <label
                    onDragOver={(e) => { e.preventDefault(); setDragOverGallery(true); }}
                    onDragLeave={() => setDragOverGallery(false)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setDragOverGallery(false);
                      if (e.dataTransfer.files) {
                        Array.from(e.dataTransfer.files).forEach(file => {
                          addSupportingFile(file);
                        });
                      }
                    }}
                    className={`w-full min-h-[96px] border border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                      dragOverGallery
                        ? 'border-primary bg-primary/5 text-primary scale-[0.99]'
                        : 'border-border hover:border-primary bg-muted/20 hover:bg-primary/5 text-neutral-500'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files) {
                          Array.from(e.target.files).forEach(file => {
                            addSupportingFile(file);
                          });
                        }
                      }}
                      className="hidden"
                    />
                    <UploadCloud className={`w-6 h-6 mb-1.5 transition-colors ${dragOverGallery ? 'text-primary' : 'text-neutral-400'}`} />
                    <span className="text-[11px] font-semibold block text-center leading-none">
                      Drag & Drop supporting photo or click to browse
                    </span>
                  </label>
                </div>

                {supportingFiles.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4 pt-1">
                    {supportingFiles.map((img) => (
                      <div key={img.id} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-muted group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt="Gallery item" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => removeSupportingFile(img.id)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-neutral-400 italic font-light">No supporting gallery photos added yet.</p>
                )}
              </div>
            </div>

            {/* Section 3: Care Matrix details */}
            <div className="space-y-4">
              <h3 className="text-sm font-serif font-bold text-primary border-b border-border/40 pb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                <span>Botanical Care Specifications Matrix</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Light Requirement</label>
                  <input
                    type="text"
                    value={formLight}
                    onChange={(e) => setFormLight(e.target.value)}
                    placeholder="e.g. Bright, indirect light"
                    className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Watering Schedule</label>
                  <input
                    type="text"
                    value={formWater}
                    onChange={(e) => setFormWater(e.target.value)}
                    placeholder="e.g. Once in 7-10 days"
                    className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Humidity</label>
                  <input
                    type="text"
                    value={formHumidity}
                    onChange={(e) => setFormHumidity(e.target.value)}
                    placeholder="e.g. High"
                    className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Temperature range</label>
                  <input
                    type="text"
                    value={formTemperature}
                    onChange={(e) => setFormTemperature(e.target.value)}
                    placeholder="e.g. 65-80°F"
                    className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700">Soil mix</label>
                  <input
                    type="text"
                    value={formSoil}
                    onChange={(e) => setFormSoil(e.target.value)}
                    placeholder="e.g. Peat rich"
                    className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Size options & care instructions list */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-neutral-700 border-b border-border/40 pb-1">Available Sizes</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Small (6 inch)"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="flex-1 bg-white border border-border/80 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="bg-primary/10 hover:bg-primary border border-primary/20 hover:text-white text-primary px-3 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formSizes.map((size, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-muted border border-border/60 text-neutral-600 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                      <span>{size}</span>
                      <button type="button" onClick={() => removeSize(idx)} className="text-red-500 hover:text-red-700 font-bold ml-0.5 cursor-pointer">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-neutral-700 border-b border-border/40 pb-1">Care Guide Milestones</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add step/instruction..."
                    value={newCareInst}
                    onChange={(e) => setNewCareInst(e.target.value)}
                    className="flex-1 bg-white border border-border/80 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                  <button
                    type="button"
                    onClick={addCareInst}
                    className="bg-primary/10 hover:bg-primary border border-primary/20 hover:text-white text-primary px-3 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <ul className="space-y-1.5 pl-1 text-[10px] text-neutral-500 list-decimal list-inside leading-tight font-light">
                  {formCareInstructions.map((inst, idx) => (
                    <li key={idx} className="relative group">
                      <span>{inst}</span>
                      <button
                        type="button"
                        onClick={() => removeCareInst(idx)}
                        className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 font-bold ml-1.5 transition-opacity cursor-pointer text-[9px]"
                      >
                        delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 5: Nested Recommendations */}
            <div className="space-y-4">
              <h3 className="text-sm font-serif font-bold text-primary border-b border-border/40 pb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                <span>Nested Recommendations (Associated Accessories)</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {/* Recommended Tools */}
                <div className="space-y-3 relative">
                  <h4 className="font-semibold text-neutral-800 flex items-center gap-1.5">
                    <LinkIcon size={12} className="text-primary" />
                    <span>Recommended Tools & Pots</span>
                  </h4>
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          placeholder="Search tools & pots to add..."
                          value={toolSearch}
                          onChange={(e) => {
                            setToolSearch(e.target.value)
                            setToolDropdownOpen(true)
                          }}
                          onFocus={() => setToolDropdownOpen(true)}
                          className="w-full bg-white border border-border/80 pl-9 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                        />
                      </div>
                      {toolSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            setToolSearch('')
                            setToolDropdownOpen(false)
                          }}
                          className="px-2.5 text-xs text-neutral-500 hover:text-neutral-700 font-bold"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {toolDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1.5 bg-white border border-border/80 rounded-2xl shadow-xl max-h-48 overflow-y-auto p-1.5 space-y-0.5">
                        {availableTools
                          .filter(t => t.name.toLowerCase().includes(toolSearch.toLowerCase()) && !nestedTools.includes(t.id))
                          .map(tool => (
                            <button
                              type="button"
                              key={tool.id}
                              onClick={() => {
                                setNestedTools([...nestedTools, tool.id])
                                setToolSearch('')
                                setToolDropdownOpen(false)
                              }}
                              className="w-full text-left flex items-center gap-3 p-2 hover:bg-muted/60 rounded-xl transition-all"
                            >
                              <span className="w-8 h-8 border border-border rounded-lg overflow-hidden relative inline-block shrink-0 bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={tool.image} alt={tool.name} className="object-cover w-full h-full" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-neutral-800 text-xs block truncate">{tool.name}</span>
                                <span className="text-[10px] text-neutral-400 block">₹{tool.price} • {tool.category}</span>
                              </div>
                            </button>
                          ))}
                        {availableTools.filter(t => t.name.toLowerCase().includes(toolSearch.toLowerCase()) && !nestedTools.includes(t.id)).length === 0 && (
                          <p className="text-[10px] text-neutral-400 p-3 italic text-center">No available tools found</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Click outside to close helper overlay */}
                  {toolDropdownOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setToolDropdownOpen(false)} />
                  )}

                  {/* Selected Tools List */}
                  <div className="bg-muted/30 border border-border/60 p-4 rounded-2xl space-y-2 max-h-48 overflow-y-auto z-10 relative">
                    {nestedTools.length > 0 ? (
                      products
                        .filter(p => nestedTools.includes(p.id))
                        .map(tool => (
                          <div key={tool.id} className="flex items-center justify-between bg-white border border-border/40 p-2.5 rounded-xl">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-7 h-7 border border-border rounded-lg overflow-hidden relative inline-block shrink-0 bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={tool.image} alt={tool.name} className="object-cover w-full h-full" />
                              </span>
                              <div className="min-w-0">
                                <span className="font-semibold text-neutral-700 text-xs block truncate">{tool.name}</span>
                                <span className="text-[10px] text-neutral-400 block">₹{tool.price}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setNestedTools(nestedTools.filter(x => x !== tool.id))}
                              className="text-red-500 hover:text-red-700 p-1 font-bold text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                    ) : (
                      <p className="text-[10px] text-neutral-400 italic font-light">No tools recommended yet.</p>
                    )}
                  </div>
                </div>

                {/* Recommended Medicines */}
                <div className="space-y-3 relative">
                  <h4 className="font-semibold text-neutral-800 flex items-center gap-1.5">
                    <LinkIcon size={12} className="text-primary" />
                    <span>Recommended Medicines & Fertilizers</span>
                  </h4>
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          placeholder="Search medicines & fertilizers..."
                          value={medSearch}
                          onChange={(e) => {
                            setMedSearch(e.target.value)
                            setMedDropdownOpen(true)
                          }}
                          onFocus={() => setMedDropdownOpen(true)}
                          className="w-full bg-white border border-border/80 pl-9 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                        />
                      </div>
                      {medSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            setMedSearch('')
                            setMedDropdownOpen(false)
                          }}
                          className="px-2.5 text-xs text-neutral-500 hover:text-neutral-700 font-bold"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {medDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1.5 bg-white border border-border/80 rounded-2xl shadow-xl max-h-48 overflow-y-auto p-1.5 space-y-0.5">
                        {availableMedicines
                          .filter(m => m.name.toLowerCase().includes(medSearch.toLowerCase()) && !nestedMedicines.includes(m.id))
                          .map(med => (
                            <button
                              type="button"
                              key={med.id}
                              onClick={() => {
                                setNestedMedicines([...nestedMedicines, med.id])
                                setMedSearch('')
                                setMedDropdownOpen(false)
                              }}
                              className="w-full text-left flex items-center gap-3 p-2 hover:bg-muted/60 rounded-xl transition-all"
                            >
                              <span className="w-8 h-8 border border-border rounded-lg overflow-hidden relative inline-block shrink-0 bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={med.image} alt={med.name} className="object-cover w-full h-full" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-neutral-800 text-xs block truncate">{med.name}</span>
                                <span className="text-[10px] text-neutral-400 block">₹{med.price} • {med.category}</span>
                              </div>
                            </button>
                          ))}
                        {availableMedicines.filter(m => m.name.toLowerCase().includes(medSearch.toLowerCase()) && !nestedMedicines.includes(m.id)).length === 0 && (
                          <p className="text-[10px] text-neutral-400 p-3 italic text-center">No available medicines found</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Click outside to close helper overlay */}
                  {medDropdownOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setMedDropdownOpen(false)} />
                  )}

                  {/* Selected Medicines List */}
                  <div className="bg-muted/30 border border-border/60 p-4 rounded-2xl space-y-2 max-h-48 overflow-y-auto z-10 relative">
                    {nestedMedicines.length > 0 ? (
                      products
                        .filter(p => nestedMedicines.includes(p.id))
                        .map(med => (
                          <div key={med.id} className="flex items-center justify-between bg-white border border-border/40 p-2.5 rounded-xl">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-7 h-7 border border-border rounded-lg overflow-hidden relative inline-block shrink-0 bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={med.image} alt={med.name} className="object-cover w-full h-full" />
                              </span>
                              <div className="min-w-0">
                                <span className="font-semibold text-neutral-700 text-xs block truncate">{med.name}</span>
                                <span className="text-[10px] text-neutral-400 block">₹{med.price}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setNestedMedicines(nestedMedicines.filter(x => x !== med.id))}
                              className="text-red-500 hover:text-red-700 p-1 font-bold text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                    ) : (
                      <p className="text-[10px] text-neutral-400 italic font-light">No medicines recommended yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* External Marketplace Links */}
            <div className="space-y-4 border-t border-border/40 pt-6">
              <div className="flex items-center gap-2 mb-1">
                <LinkIcon size={15} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Marketplace Links</h3>
              </div>
              <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
                Optional: paste direct product listing URLs for Amazon and Flipkart. These will display as purchase buttons on the public product page.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-[#FF9900] text-[8px] font-black text-black">A</span>
                    Amazon Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.amazon.in/dp/..."
                    value={formAmazonLink}
                    onChange={e => setFormAmazonLink(e.target.value)}
                    className="w-full bg-background border border-border/80 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#FF9900]/50 text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-[#2874F0] text-[8px] font-black text-white">F</span>
                    Flipkart Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.flipkart.com/..."
                    value={formFlipkartLink}
                    onChange={e => setFormFlipkartLink(e.target.value)}
                    className="w-full bg-background border border-border/80 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#2874F0]/50 text-foreground"
                  />
                </div>
              </div>
            </div>

          </form>

          {/* Sheet Footer Actions */}
          <SheetFooter className="border-t border-border bg-card p-6 shrink-0 flex justify-end gap-3.5">
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
              form="product-form"
              disabled={uploading}
              className="bg-primary hover:bg-primary-emerald disabled:bg-primary/60 text-white px-7 py-3 rounded-full font-bold text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5"
            >
              {uploading ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check size={14} />
              )}
              <span>{uploading ? 'Uploading & Saving...' : 'Save Specimen Details'}</span>
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
