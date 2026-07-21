'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  RefreshCw,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react'
import { allProducts, Product } from '@/lib/products'

interface InventoryItem {
  id: number
  name: string
  scientificName?: string
  category: string
  image: string
  stock_quantity: number
  reserved_quantity: number
}

type EnrichedProduct = Product & { stock_quantity?: number; reserved_quantity?: number }

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Save changes back to nursery_products so Products tab matches
  const saveToProducts = useCallback((updatedItems: InventoryItem[]) => {
    const stored = localStorage.getItem('nursery_products')
    let fullProducts: EnrichedProduct[] = []
    
    if (stored) {
      try {
        fullProducts = JSON.parse(stored)
      } catch {
        fullProducts = [...allProducts]
      }
    } else {
      fullProducts = [...allProducts]
    }

    const updatedProducts = fullProducts.map(p => {
      const match = updatedItems.find(i => i.id === p.id)
      if (match) {
        return {
          ...p,
          stock_quantity: match.stock_quantity,
          reserved_quantity: match.reserved_quantity
        }
      }
      return p
    })

    localStorage.setItem('nursery_products', JSON.stringify(updatedProducts))
  }, [])

  const fallbackInventory = useCallback(() => {
    const defaultInv = allProducts.map(p => ({
      id: p.id,
      name: p.name,
      scientificName: p.scientificName,
      category: p.category,
      image: p.image,
      stock_quantity: p.id === 1 ? 2 : p.id === 2 ? 4 : p.id === 6 ? 3 : p.id === 19 ? 0 : 15,
      reserved_quantity: p.id === 1 ? 1 : p.id === 2 ? 2 : 0
    }))
    setItems(defaultInv)
    saveToProducts(defaultInv)
  }, [saveToProducts])

  const loadInventory = useCallback(() => {
    const stored = localStorage.getItem('nursery_products')
    if (stored) {
      try {
        const decoded = JSON.parse(stored)
        setItems(decoded.map((p: EnrichedProduct) => ({
          id: p.id,
          name: p.name,
          scientificName: p.scientificName,
          category: p.category,
          image: p.image,
          stock_quantity: p.stock_quantity !== undefined ? p.stock_quantity : (p.id === 1 ? 2 : p.id === 2 ? 4 : p.id === 6 ? 3 : p.id === 19 ? 0 : 15),
          reserved_quantity: p.reserved_quantity !== undefined ? p.reserved_quantity : (p.id === 1 ? 1 : p.id === 2 ? 2 : 0)
        })))
      } catch {
        fallbackInventory()
      }
    } else {
      fallbackInventory()
    }
  }, [fallbackInventory])

  // Load from localStorage (shared with products)
  useEffect(() => {
    loadInventory()
  }, [loadInventory])

  // Update stock fields
  const handleUpdateStock = (id: number, field: 'stock_quantity' | 'reserved_quantity', delta: number) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const val = Math.max(0, item[field] + delta)
        return { ...item, [field]: val }
      }
      return item
    })
    setItems(updated)
    saveToProducts(updated)
  }

  const handleManualInput = (id: number, field: 'stock_quantity' | 'reserved_quantity', value: string) => {
    const parsed = Math.max(0, parseInt(value) || 0)
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: parsed }
      }
      return item
    })
    setItems(updated)
    saveToProducts(updated)
  }

  // Filters
  const categories = ['All', 'Indoor Plants', 'Outdoor Plants', 'Flowering Plants', 'Palms', 'Succulents', 'Bonsai', 'Tools', 'Plant Medicine']

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.scientificName && item.scientificName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCat
  })

  // Stock status calculations
  const getStatus = (stock: number, reserved: number) => {
    const avail = stock - reserved
    if (avail <= 0) return { label: 'Out of Stock', color: 'text-red-700 bg-red-50 border-red-200', icon: XCircle }
    if (avail < 5) return { label: 'Low Stock', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertTriangle }
    return { label: 'In Stock', color: 'text-secondary bg-secondary/15 border-secondary/30', icon: CheckCircle }
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-neutral-dark">
            Real-Time Stock & Inventory
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-1">
            Track and update available counts, reserved quantities, and specimen statuses.
          </p>
        </div>
        <button
          onClick={loadInventory}
          className="px-4 py-3 rounded-full border border-border text-neutral-600 hover:text-foreground hover:bg-muted bg-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search inventory items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-neutral-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1 shrink-0 mr-1.5">
            <Filter size={12} className="text-primary" />
            <span>Filter Category:</span>
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

      {/* Inventory Table Grid */}
      <div className="bg-card border border-border/80 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-muted/30 text-[10px] uppercase font-bold tracking-wider text-muted-foreground border-b border-border/80">
                <th className="py-4 px-6 font-semibold">ID</th>
                <th className="py-4 px-4 font-semibold">Specimen</th>
                <th className="py-4 px-4 font-semibold">Category</th>
                <th className="py-4 px-4 text-center font-semibold">Base Stock</th>
                <th className="py-4 px-4 text-center font-semibold">Reserved Checkouts</th>
                <th className="py-4 px-4 text-center font-semibold">Available Units</th>
                <th className="py-4 px-6 text-right font-semibold">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const available = item.stock_quantity - item.reserved_quantity
                  const status = getStatus(item.stock_quantity, item.reserved_quantity)
                  return (
                    <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-4 px-6 font-bold text-neutral-400">{item.id}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-border relative shrink-0 bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-neutral-800 block leading-tight">{item.name}</span>
                            {item.scientificName && (
                              <span className="text-[10px] text-muted-foreground italic font-serif block mt-0.5">{item.scientificName}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-neutral-500">{item.category}</td>
                      
                      {/* Base Stock controls */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdateStock(item.id, 'stock_quantity', -1)}
                            className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-neutral-200 cursor-pointer text-neutral-600 transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <input
                            type="text"
                            value={item.stock_quantity}
                            onChange={(e) => handleManualInput(item.id, 'stock_quantity', e.target.value)}
                            className="w-11 text-center font-bold text-neutral-800 bg-white border border-border/80 py-1 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdateStock(item.id, 'stock_quantity', 1)}
                            className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-neutral-200 cursor-pointer text-neutral-600 transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </td>

                      {/* Reserved Checkouts controls */}
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleUpdateStock(item.id, 'reserved_quantity', -1)}
                            className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-neutral-200 cursor-pointer text-neutral-600 transition-colors"
                          >
                            <Minus size={11} />
                          </button>
                          <input
                            type="text"
                            value={item.reserved_quantity}
                            onChange={(e) => handleManualInput(item.id, 'reserved_quantity', e.target.value)}
                            className="w-11 text-center font-bold text-neutral-800 bg-white border border-border/80 py-1 rounded-lg text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdateStock(item.id, 'reserved_quantity', 1)}
                            className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-neutral-200 cursor-pointer text-neutral-600 transition-colors"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </td>

                      {/* Available units */}
                      <td className="py-4 px-4 text-center">
                        <span className={`text-sm font-bold font-sans ${available <= 0 ? 'text-red-600' : 'text-neutral-800'}`}>
                          {available}
                        </span>
                      </td>

                      {/* Stock status badge */}
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                          <status.icon size={11} />
                          <span>{status.label}</span>
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground font-light">
                    No items in inventory match your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
