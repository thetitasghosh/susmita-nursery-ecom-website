'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { Search, Filter, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

const allProducts = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    category: 'Indoor Plants',
    price: '$49.99',
    rating: 4.8,
    reviews: 128,
    image: '/images/plants/monstera-plant.jpg',
  },
  {
    id: 2,
    name: 'Peace Lily',
    category: 'Air Purifying',
    price: '$34.99',
    rating: 4.9,
    reviews: 156,
    image: '/images/plants/peace-lily.jpg',
  },
  {
    id: 3,
    name: 'Pothos Hanging',
    category: 'Indoor Plants',
    price: '$59.99',
    rating: 4.7,
    reviews: 92,
    image: '/images/plants/pothos-hanging.jpg',
  },
  {
    id: 4,
    name: 'Succulent Collection',
    category: 'Succulents',
    price: '$29.99',
    rating: 4.9,
    reviews: 203,
    image: '/images/plants/succulent-collection.jpg',
  },
  {
    id: 5,
    name: 'Red Roses Bouquet',
    category: 'Flowers',
    price: '$24.99',
    rating: 4.8,
    reviews: 178,
    image: '/images/plants/rose-flowers.jpg',
  },
  {
    id: 6,
    name: 'Lavender Plant',
    category: 'Herbs',
    price: '$39.99',
    rating: 4.6,
    reviews: 67,
    image: '/images/plants/lavender-plant.jpg',
  },
  {
    id: 7,
    name: 'Orchid Flower',
    category: 'Flowers',
    price: '$22.99',
    rating: 4.7,
    reviews: 145,
    image: '/images/plants/orchid-flower.jpg',
  },
  {
    id: 8,
    name: 'Bonsai Tree',
    category: 'Specialty',
    price: '$27.99',
    rating: 4.8,
    reviews: 89,
    image: '/images/plants/bonsai-tree.jpg',
  },
  {
    id: 9,
    name: 'Tulips Bouquet',
    category: 'Flowers',
    price: '$19.99',
    rating: 4.9,
    reviews: 234,
    image: '/images/plants/tulips-bouquet.jpg',
  },
  {
    id: 10,
    name: 'Sunflower Garden',
    category: 'Flowers',
    price: '$32.99',
    rating: 4.6,
    reviews: 76,
    image: '/images/plants/sunflower-garden.jpg',
  },
  {
    id: 11,
    name: 'Dahlia Bouquet',
    category: 'Flowers',
    price: '$44.99',
    rating: 4.7,
    reviews: 110,
    image: '/images/plants/dahlia-bouquet.jpg',
  },
  {
    id: 12,
    name: 'Premium Orchid',
    category: 'Specialty',
    price: '$36.99',
    rating: 4.8,
    reviews: 98,
    image: '/images/plants/orchid-flower.jpg',
  },
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['Indoor Plants', 'Air Purifying', 'Succulents', 'Flowers', 'Herbs', 'Specialty']

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return parseInt(a.price) - parseInt(b.price)
    if (sortBy === 'price-high') return parseInt(b.price) - parseInt(a.price)
    if (sortBy === 'rating')
      return b.rating - a.rating
    return 0
  })

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              All Plants
            </h1>
            <p className="text-muted-foreground">
              Browse our complete collection of premium plants
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            {/* Sidebar Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-20 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Search plants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Categories */}
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Filter size={18} />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      All Plants
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
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
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              {/* Sort Bar */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Showing {sortedProducts.length} products
                </p>
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
              </div>

              {/* Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {sortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No products found</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory(null)
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
