'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { Search, Filter, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { allProducts } from '@/lib/products'

function ProductCatalog() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const searchParam = searchParams.get('search')

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    } else {
      setSelectedCategory(null)
    }
  }, [categoryParam])

  useEffect(() => {
    if (searchParam) {
      setSearchTerm(searchParam)
    } else {
      setSearchTerm('')
    }
  }, [searchParam])

  const categories = [
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

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      (product.scientificName && product.scientificName.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
          Botanical Catalog
        </h1>
        <div className="h-1 w-12 bg-accent mx-auto rounded-full mb-3" />
        <p className="text-sm text-muted-foreground font-light max-w-sm mx-auto">
          Browse our complete collection of premium, healthy specimens raised by botanists.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Sidebar Filters */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-card border border-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 text-foreground transition-all placeholder:text-neutral-400 text-sm"
              />
            </div>

            {/* Categories */}
            <div className="bg-card p-5 rounded-2xl border border-border/80 shadow-sm">
              <h3 className="font-serif font-bold text-foreground text-base mb-4 flex items-center gap-2">
                <Filter size={16} className="text-primary" />
                Filter Categories
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                    !selectedCategory
                      ? 'bg-primary/15 text-primary font-semibold border border-primary/30'
                      : 'text-neutral-500 hover:bg-muted hover:text-foreground font-light'
                  }`}
                >
                  All Items
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                      selectedCategory === category
                        ? 'bg-primary/15 text-primary font-semibold border border-primary/30'
                        : 'text-neutral-500 hover:bg-muted hover:text-foreground font-light'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3"
        >
          {/* Sort Bar */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-xs text-muted-foreground font-light">
              Showing {sortedProducts.length} specimens
            </p>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-card border border-border/80 px-4 py-2 text-xs rounded-xl pr-10 cursor-pointer text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="featured">Featured Specimens</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-16 bg-card border border-border/80 rounded-3xl">
              <p className="text-muted-foreground font-light mb-4 text-sm">No items match your filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory(null)
                }}
                className="border-neutral-200 rounded-full px-6 cursor-pointer"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 py-16 text-center text-muted-foreground">
            Loading Catalog...
          </div>
        }>
          <ProductCatalog />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
