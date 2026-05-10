'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Flower2,
  Sprout,
  Trees,
  Leaf,
  Wind,
  Sun,
  Zap,
  Droplet,
} from 'lucide-react'

const categories = [
  {
    id: 1,
    name: 'Indoor Plants',
    description: 'Perfect for homes and offices',
    icon: Sprout,
    color: 'from-primary to-primary/60',
    count: 24,
    image: '/images/plants/monstera-plant.jpg',
  },
  {
    id: 2,
    name: 'Flowering Plants',
    description: 'Vibrant colors and fragrance',
    icon: Flower2,
    color: 'from-accent to-accent/60',
    count: 18,
    image: '/images/plants/rose-flowers.jpg',
  },
  {
    id: 3,
    name: 'Orchids',
    description: 'Elegant exotic flowers',
    icon: Flower2,
    color: 'from-primary/70 to-accent/70',
    count: 12,
    image: '/images/plants/orchid-flower.jpg',
  },
  {
    id: 4,
    name: 'Succulents',
    description: 'Low maintenance and hardy',
    icon: Leaf,
    color: 'from-accent/80 to-primary/50',
    count: 16,
    image: '/images/plants/succulent-collection.jpg',
  },
  {
    id: 5,
    name: 'Herbs & Fragrant',
    description: 'Aromatic and flavorful plants',
    icon: Wind,
    color: 'from-primary/60 to-accent/60',
    count: 14,
    image: '/images/plants/lavender-plant.jpg',
  },
  {
    id: 6,
    name: 'Specialty Plants',
    description: 'Unique and rare varieties',
    icon: Leaf,
    color: 'from-accent/70 to-primary/70',
    count: 20,
    image: '/images/plants/bonsai-tree.jpg',
  },
]

export default function CategoriesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Browse Categories
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our diverse plant collections
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Link href={`/categories/${category.id}`}>
                    <div className="group h-full rounded-2xl overflow-hidden border border-border hover:border-accent/50 transition-all duration-300 cursor-pointer bg-card">
                      {/* Image Area */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded">
                            {category.count} items
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {category.description}
                        </p>

                        <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                          Explore →
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
