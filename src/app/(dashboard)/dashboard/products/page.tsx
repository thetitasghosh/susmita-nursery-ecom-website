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
  X
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

type EnrichedProduct = Product & {
  slug?: string
  supportingImages?: string[]
  nestedItemIds?: number[]
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
  const [formCoverImage, setFormCoverImage] = useState('/images/plants/monstera-plant.jpg')
  const [formSupportingImages, setFormSupportingImages] = useState<string[]>([])
  const [newSupportingImage, setNewSupportingImage] = useState('')

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
  const [nestedTools, setNestedTools] = useState<number[]>([])
  const [nestedMedicines, setNestedMedicines] = useState<number[]>([])

  // Load products from localStorage or standard list
  useEffect(() => {
    const stored = localStorage.getItem('nursery_products')
    if (stored) {
      try {
        setProducts(JSON.parse(stored))
      } catch {
        setProducts(allProducts)
      }
    } else {
      const enriched: EnrichedProduct[] = allProducts.map(p => ({
        ...p,
        supportingImages: [
          '/images/plants/succulent-collection.jpg',
          '/images/plants/aglaonema-red.jpg'
        ],
        nestedItemIds: p.category === 'Tools' || p.category === 'Plant Medicine' ? [] : [17, 19]
      }))
      setProducts(enriched)
      localStorage.setItem('nursery_products', JSON.stringify(enriched))
    }
  }, [])

  // Auto-slugify name
  useEffect(() => {
    if (!editingProduct) {
      setFormSlug(slugify(formName))
    }
  }, [formName, editingProduct])

  // Get lists of Tools and Medicines for nesting checkboxes
  const availableTools = products.filter(p => p.category === 'Tools')
  const availableMedicines = products.filter(p => p.category === 'Plant Medicine')

  // Open sheet for add
  const handleOpenAdd = () => {
    setEditingProduct(null)
    setFormName('')
    setFormSlug('')
    setFormCategory('Indoor Plants')
    setFormPrice(299)
    setFormScientificName('')
    setFormDescription('')
    setFormCoverImage('/images/plants/monstera-plant.jpg')
    setFormSupportingImages(['/images/plants/succulent-collection.jpg', '/images/plants/aglaonema-red.jpg'])
    setFormLight('Bright, indirect light')
    setFormWater('Moderate')
    setFormHumidity('Moderate')
    setFormTemperature('60-80°F')
    setFormSoil('Well-draining mix')
    setFormSizes(['Medium'])
    setFormCareInstructions(['Keep in bright light.', 'Water weekly.'])
    setNestedTools([17])
    setNestedMedicines([19])
    
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
    setFormCoverImage(product.image)
    setFormSupportingImages(product.supportingImages || [])
    
    setFormLight(product.details?.light || 'Moderate')
    setFormWater(product.details?.water || 'Moderate')
    setFormHumidity(product.details?.humidity || 'Moderate')
    setFormTemperature(product.details?.temperature || '60-80°F')
    setFormSoil(product.details?.soil || 'Well-draining')

    setFormSizes(product.sizes || ['Standard'])
    setFormCareInstructions(product.careInstructions || [])

    const nested = product.nestedItemIds || []
    setNestedTools(nested.filter((id: number) => availableTools.some(t => t.id === id)))
    setNestedMedicines(nested.filter((id: number) => availableMedicines.some(m => m.id === id)))

    setIsSheetOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter(p => p.id !== id)
      setProducts(updated)
      localStorage.setItem('nursery_products', JSON.stringify(updated))
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName) return

    let updatedProducts: EnrichedProduct[] = []
    const nestedItemIds = [...nestedTools, ...nestedMedicines]

    if (editingProduct) {
      updatedProducts = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formName,
            slug: formSlug,
            category: formCategory,
            price: Number(formPrice),
            scientificName: formScientificName,
            description: formDescription,
            image: formCoverImage,
            supportingImages: formSupportingImages,
            details: {
              light: formLight,
              water: formWater,
              humidity: formHumidity,
              temperature: formTemperature,
              soil: formSoil
            },
            sizes: formSizes,
            careInstructions: formCareInstructions,
            nestedItemIds
          } as EnrichedProduct
        }
        return p
      })
    } else {
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
      const newProduct: EnrichedProduct = {
        id: newId,
        name: formName,
        slug: formSlug,
        category: formCategory,
        price: Number(formPrice),
        rating: 5.0,
        reviews: 1,
        scientificName: formScientificName,
        description: formDescription,
        image: formCoverImage,
        supportingImages: formSupportingImages,
        details: {
          light: formLight,
          water: formWater,
          humidity: formHumidity,
          temperature: formTemperature,
          soil: formSoil
        },
        sizes: formSizes,
        careInstructions: formCareInstructions,
        nestedItemIds
      }
      updatedProducts = [newProduct, ...products]
    }

    setProducts(updatedProducts)
    localStorage.setItem('nursery_products', JSON.stringify(updatedProducts))
    setIsSheetOpen(false)
  }

  // Supporting Photos CRUD
  const addSupportingImage = () => {
    if (newSupportingImage.trim() && !formSupportingImages.includes(newSupportingImage)) {
      setFormSupportingImages([...formSupportingImages, newSupportingImage.trim()])
      setNewSupportingImage('')
    }
  }

  const removeSupportingImage = (idx: number) => {
    setFormSupportingImages(formSupportingImages.filter((_, i) => i !== idx))
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

  // Toggle recommendation checkboxes
  const toggleToolRecommendation = (id: number) => {
    if (nestedTools.includes(id)) {
      setNestedTools(nestedTools.filter(x => x !== id))
    } else {
      setNestedTools([...nestedTools, id])
    }
  }

  const toggleMedicineRecommendation = (id: number) => {
    if (nestedMedicines.includes(id)) {
      setNestedMedicines(nestedMedicines.filter(x => x !== id))
    } else {
      setNestedMedicines([...nestedMedicines, id])
    }
  }

  const categories = [
    'All',
    'Indoor Plants',
    'Outdoor Plants',
    'Flowering Plants',
    'Fruit Plants',
    'Palms',
    'Succulents',
    'Bonsai',
    'Tools',
    'Plant Medicine'
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

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1 shrink-0 mr-1.5">
            <Filter size={12} className="text-primary" />
            <span>Category:</span>
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-primary text-white border-primary font-semibold'
                  : 'bg-white hover:bg-muted text-neutral-500 border-border hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reusable Table Grid */}
      <div className="bg-card border border-border/80 rounded-[32px] overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="py-4 px-6 font-semibold w-16">ID</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Specimen</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Category</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Price</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Rating / Reviews</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Specs (Light/Water)</TableHead>
              <TableHead className="py-4 px-6 text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="py-4 px-6 font-bold text-neutral-400">{product.id}</TableCell>
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
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground font-light">
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
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-border relative shrink-0 bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formCoverImage} alt="Cover Preview" className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[10px] text-neutral-400 font-light block">Select/input an image URL path</span>
                    <input
                      type="text"
                      value={formCoverImage}
                      onChange={(e) => setFormCoverImage(e.target.value)}
                      className="w-full bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-mono"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormCoverImage('/images/plants/monstera-plant.jpg')}
                        className="px-2 py-1 text-[9px] bg-muted border border-border hover:bg-neutral-200 rounded font-semibold cursor-pointer"
                      >
                        Use Monstera
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormCoverImage('/images/plants/succulent-collection.jpg')}
                        className="px-2 py-1 text-[9px] bg-muted border border-border hover:bg-neutral-200 rounded font-semibold cursor-pointer"
                      >
                        Use Succulent
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="font-semibold text-neutral-700 block">Supporting Gallery Photos (4:3 Aspect Ratio)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add another image URL path..."
                    value={newSupportingImage}
                    onChange={(e) => setNewSupportingImage(e.target.value)}
                    className="flex-1 bg-white border border-border/80 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={addSupportingImage}
                    className="bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white text-primary px-4 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>

                {formSupportingImages.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4 pt-1">
                    {formSupportingImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-muted group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Gallery ${idx}`} className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => removeSupportingImage(idx)}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-neutral-800 flex items-center gap-1.5">
                    <LinkIcon size={12} className="text-primary" />
                    <span>Recommended Tools</span>
                  </h4>
                  <div className="bg-muted/30 border border-border/60 p-4 rounded-2xl space-y-2 max-h-48 overflow-y-auto">
                    {availableTools.map(tool => (
                      <label key={tool.id} className="flex items-center gap-2.5 py-1 text-xs cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={nestedTools.includes(tool.id)}
                          onChange={() => toggleToolRecommendation(tool.id)}
                          className="accent-primary w-4 h-4 rounded border-border cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 border border-border rounded overflow-hidden relative inline-block shrink-0 bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={tool.image} alt={tool.name} className="object-cover w-full h-full" />
                          </span>
                          <div>
                            <span className="font-medium text-neutral-700 block">{tool.name}</span>
                            <span className="text-[10px] text-neutral-400 block font-light">₹{tool.price}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-neutral-800 flex items-center gap-1.5">
                    <LinkIcon size={12} className="text-primary" />
                    <span>Recommended Medicines</span>
                  </h4>
                  <div className="bg-muted/30 border border-border/60 p-4 rounded-2xl space-y-2 max-h-48 overflow-y-auto">
                    {availableMedicines.map(med => (
                      <label key={med.id} className="flex items-center gap-2.5 py-1 text-xs cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={nestedMedicines.includes(med.id)}
                          onChange={() => toggleMedicineRecommendation(med.id)}
                          className="accent-primary w-4 h-4 rounded border-border cursor-pointer"
                        />
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 border border-border rounded overflow-hidden relative inline-block shrink-0 bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={med.image} alt={med.name} className="object-cover w-full h-full" />
                          </span>
                          <div>
                            <span className="font-medium text-neutral-700 block">{med.name}</span>
                            <span className="text-[10px] text-neutral-400 block font-light">₹{med.price}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
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
              className="bg-primary hover:bg-primary-emerald text-white px-7 py-3 rounded-full font-bold text-xs cursor-pointer shadow-md transition-all flex items-center gap-1"
            >
              <Check size={14} />
              <span>Save Specimen Details</span>
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
