'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductCard } from '@/components/products/product-card'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

const categoryData: Record<number, any> = {
  1: {
    id: 1,
    name: 'Indoor Plants',
    description: 'Perfect for homes and offices',
    count: 24,
    products: [
      {
        id: 1,
        name: 'Monstera Deliciosa',
        category: 'Indoor Plants',
        price: '$49.99',
        rating: 4.8,
        reviews: 128,
        image: '🌿',
      },
      {
        id: 3,
        name: 'Fiddle Leaf Fig',
        category: 'Indoor Plants',
        price: '$59.99',
        rating: 4.7,
        reviews: 92,
        image: '🍃',
      },
      {
        id: 5,
        name: 'Pothos',
        category: 'Indoor Plants',
        price: '$24.99',
        rating: 4.8,
        reviews: 178,
        image: '🌿',
      },
      {
        id: 6,
        name: 'Boston Fern',
        category: 'Indoor Plants',
        price: '$39.99',
        rating: 4.6,
        reviews: 67,
        image: '🌱',
      },
      {
        id: 9,
        name: 'Spider Plant',
        category: 'Indoor Plants',
        price: '$19.99',
        rating: 4.9,
        reviews: 234,
        image: '🌿',
      },
      {
        id: 11,
        name: 'Rubber Plant',
        category: 'Indoor Plants',
        price: '$44.99',
        rating: 4.7,
        reviews: 110,
        image: '🌳',
      },
    ],
  },
}

export default function CategoryDetailPage({ params }: { params: { id: string } }) {
  const categoryId = parseInt(params.id)
  const category = categoryData[categoryId] || categoryData[1]
  const [sortBy, setSortBy] = useState('featured')

  const sortedProducts = [...category.products].sort((a, b) => {
    if (sortBy === 'price-low') return parseInt(a.price) - parseInt(b.price)
    if (sortBy === 'price-high') return parseInt(b.price) - parseInt(a.price)
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-3">
              {category.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {category.description}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {category.count} products available
            </p>
          </motion.div>

          {/* Sort Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-end mb-8"
          >
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-card border border-border px-4 py-2 rounded-lg pr-10 cursor-pointer text-foreground"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </div>

      <Footer />
    </main>
  )
}
