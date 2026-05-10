'use client'

import { motion } from 'framer-motion'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const featuredProducts = [
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
    name: 'Red Roses Bouquet',
    category: 'Flowers',
    price: '$59.99',
    rating: 4.7,
    reviews: 92,
    image: '/images/plants/rose-flowers.jpg',
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
    name: 'Pothos Hanging',
    category: 'Indoor Plants',
    price: '$24.99',
    rating: 4.8,
    reviews: 178,
    image: '/images/plants/pothos-hanging.jpg',
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
]

export function FeaturedProducts() {
  return (
    <section className="py-16 md:py-24 bg-muted/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Bestsellers & Favorites
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover our most loved plants
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
