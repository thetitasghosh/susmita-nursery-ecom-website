'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Flower2, Sprout, Trees, Leaf, Wind, Sun } from 'lucide-react'

const categories = [
  {
    id: 1,
    name: 'Indoor Plants',
    description: 'Perfect for homes and offices',
    icon: Sprout,
    color: 'from-primary to-primary/60',
  },
  {
    id: 2,
    name: 'Flowering Plants',
    description: 'Vibrant colors and fragrance',
    icon: Flower2,
    color: 'from-accent to-accent/60',
  },
  {
    id: 3,
    name: 'Outdoor Trees',
    description: 'Large and ornamental varieties',
    icon: Trees,
    color: 'from-primary/70 to-accent/70',
  },
  {
    id: 4,
    name: 'Succulents',
    description: 'Low maintenance and hardy',
    icon: Leaf,
    color: 'from-accent/80 to-primary/50',
  },
  {
    id: 5,
    name: 'Air Purifying',
    description: 'Clean air for healthy living',
    icon: Wind,
    color: 'from-primary/60 to-accent/60',
  },
  {
    id: 6,
    name: 'Sun Lovers',
    description: 'Thriving in direct sunlight',
    icon: Sun,
    color: 'from-accent/70 to-primary/70',
  },
]

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-muted-foreground">
            Find the perfect plants for your space
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link href={`/categories/${category.id}`}>
                  <div className="group h-full p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300 cursor-pointer">
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      Explore →
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
