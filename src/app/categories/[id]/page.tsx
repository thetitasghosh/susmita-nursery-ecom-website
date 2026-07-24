'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductCard } from '@/components/products/product-card'
import { ChevronDown, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { allProducts } from '@/lib/products'

const categoryIdToName: Record<number, { name: string; description: string }> = {
  1: { name: 'Indoor Plants', description: 'Breathe life into your rooms and office spaces' },
  2: { name: 'Lucky Bamboo', description: 'Elegant bamboo arrangements that bring positive energy' },
  3: { name: 'No1. Fiber Pots', description: 'Ultra-durable and modern fiberglass containers' },
  4: { name: 'Ceramic Pots', description: 'Exquisite handcrafted glazed ceramic planters' },
  5: { name: 'No1. Clay Pots', description: 'Breathable traditional terracotta clay flower pots' },
  6: { name: 'Plastic Pots', description: 'Intelligent self-watering plastic containers' },
  7: { name: 'Organic Fertilizer', description: 'Rich bio-organic compost and soil nutrients' },
  8: { name: 'Plants Medicine', description: 'Organic neem oil sprays and plant wellness solutions' },
  9: { name: 'Gardening Tools', description: 'High-quality bypass pruning shears and sprayers' },
  10: { name: 'Fruit Plants', description: 'High-yielding grafted local fruit trees' },
  11: { name: 'Flower Plants', description: 'Fragrant roses, dahlias, and ornamental flowers' },
  12: { name: 'Outdoor Plants', description: 'Beautiful landscaping sun-loving garden plants' },
}

export default function CategoryDetailPage({ params }: { params: { id: string } }) {
  const categoryId = parseInt(params.id)
  const catInfo = categoryIdToName[categoryId] || categoryIdToName[1]
  const [sortBy, setSortBy] = useState('featured')

  const categoryProducts = allProducts.filter((product) => product.category === catInfo.name)

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Back button */}
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-[#0d592f] hover:underline mb-8 cursor-pointer">
            <ArrowLeft size={14} className="mr-1.5" />
            Back to Home
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <span className="text-[10px] font-bold tracking-wider text-accent uppercase mb-2 bg-accent/20 backdrop-blur-md px-2.5 py-0.5 rounded-full w-max mx-auto block">
              Category
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0d592f] mb-3">
              {catInfo.name}
            </h1>
            <div className="h-1 w-12 bg-accent mx-auto rounded-full mb-3" />
            <p className="text-sm text-muted-foreground font-light max-w-sm mx-auto">
              {catInfo.description}
            </p>
            <p className="text-xs text-neutral-400 font-light mt-2">
              Showing {categoryProducts.length} specimens
            </p>
          </motion.div>

          {/* Sort Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-between items-center mb-8 border-b border-border/50 pb-4"
          >
            <p className="text-xs text-muted-foreground font-light">
              Filter: {catInfo.name}
            </p>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-card border border-border/80 px-4 py-2 text-xs rounded-xl pr-10 cursor-pointer text-foreground focus:outline-none focus:ring-1 focus:ring-[#0d592f]"
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
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-16 bg-card border border-border/80 rounded-3xl">
              <p className="text-muted-foreground font-light text-sm">No plant specimens are currently available under this category.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
