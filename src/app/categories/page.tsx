'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Flower2,
  Sprout,
  // Trees,
  Leaf,
  Wind,
  // Sun,
  // Zap,
  // Droplet,
} from 'lucide-react'

const categories = [
  {
    id: 1,
    name: 'Indoor Plants',
    description: 'Perfect for homes and offices',
    icon: Sprout,
    color: 'from-primary to-primary/60',
    count: 7,
    image: '/images/plants/monstera-plant.jpg?v=2',
  },
  {
    id: 2,
    name: 'Lucky Bamboo',
    description: 'Brings good luck and positive energy',
    icon: Sprout,
    color: 'from-accent to-accent/60',
    count: 1,
    image: '/images/plants/lucky-bamboo.png?v=2',
  },
  {
    id: 3,
    name: 'No1. Fiber Pots',
    description: 'Lightweight and weather-resistant fiber planters',
    icon: Leaf,
    color: 'from-primary/70 to-accent/70',
    count: 1,
    image: '/images/plants/fiber-pots.png?v=2',
  },
  {
    id: 4,
    name: 'Ceramic Pots',
    description: 'Handcrafted and elegant ceramic containers',
    icon: Leaf,
    color: 'from-accent/80 to-primary/50',
    count: 1,
    image: '/images/plants/ceramic-pots.png?v=2',
  },
  {
    id: 5,
    name: 'No1. Clay Pots',
    description: 'Traditional breathable terracotta clay pots',
    icon: Leaf,
    color: 'from-primary/60 to-accent/60',
    count: 1,
    image: '/images/plants/clay-pots.png?v=2',
  },
  {
    id: 6,
    name: 'Plastic Pots',
    description: 'Intelligent self-watering plastic containers',
    icon: Leaf,
    color: 'from-accent/70 to-primary/70',
    count: 1,
    image: '/images/plants/plastic-pots.png?v=2',
  },
  {
    id: 7,
    name: 'Organic Fertilizer',
    description: 'Rich organic nutrients and compost mixes',
    icon: Sprout,
    color: 'from-primary to-primary/60',
    count: 1,
    image: '/images/plants/organic-fertilizer.png?v=2',
  },
  {
    id: 8,
    name: 'Plants Medicine',
    description: 'Organic pest controllers and health sprays',
    icon: Wind,
    color: 'from-accent to-accent/60',
    count: 1,
    image: '/images/plants/neem-oil.jpg',
  },
  {
    id: 9,
    name: 'Gardening Tools',
    description: 'Premium hand tools, shears, and sprayers',
    icon: Wind,
    color: 'from-primary/70 to-accent/70',
    count: 2,
    image: '/images/plants/gardening-tools.png?v=2',
  },
  {
    id: 10,
    name: 'Fruit Plants',
    description: 'High-yielding grafted local fruit trees',
    icon: Sprout,
    color: 'from-accent/80 to-primary/50',
    count: 1,
    image: '/images/plants/fruit-plant.jpg?v=2',
  },
  {
    id: 11,
    name: 'Flower Plants',
    description: 'Fragrant roses, dahlias, and ornamental flowers',
    icon: Flower2,
    color: 'from-primary/60 to-accent/60',
    count: 7,
    image: '/images/plants/rose-flowers.jpg?v=2',
  },
  {
    id: 12,
    name: 'Outdoor Plants',
    description: 'Beautiful landscaping sun-loving garden plants',
    icon: Flower2,
    color: 'from-accent/70 to-primary/70',
    count: 2,
    image: '/images/plants/sunflower-garden.jpg?v=2',
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
