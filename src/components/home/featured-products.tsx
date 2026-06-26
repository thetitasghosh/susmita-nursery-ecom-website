'use client'

import { motion } from 'framer-motion'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { allProducts, Product } from '@/lib/products'
import { Leaf } from 'lucide-react'

export function FeaturedProducts() {
  // Best Sellers Deck: Monstera Deliciosa (1), Areca Palm (13), Ficus Lyrata (14), Peace Lily (2), Aglaonema Red (15)
  const featuredIds = [1, 13, 14, 2, 15]
  
  const featured = featuredIds
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean) as Product[]

  return (
    <section className="py-20 md:py-28 bg-muted/30 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Leaf size={14} className="text-secondary" />
            <span>Customer Favorites</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            Best Sellers Deck
          </h2>
          <div className="h-1 w-12 bg-accent mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-muted-foreground font-light max-w-md mx-auto">
            Bring nature home with our most cherished, healthy plant specimens grown with absolute horticultural care.
          </p>
        </motion.div>

        {/* Dynamic Bestsellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* View All Action */}
        <div className="text-center">
          <Link href="/products">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-full px-8 cursor-pointer font-semibold shadow-sm transition-all">
              Explore All Plants
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
