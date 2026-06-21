'use client'

import { motion } from 'framer-motion'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { allProducts } from '@/lib/products'

export function FeaturedProducts() {
  // Select first 6 best selling plants
  const featured = allProducts.slice(0, 6)

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Bestsellers & Favorites
          </h2>
          <div className="h-1 w-16 bg-accent mx-auto rounded-full mb-4" />
          <p className="text-base sm:text-lg text-muted-foreground max-w-sm mx-auto font-light">
            Explore the most cherished additions to plant collections nationwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button size="lg" variant="outline" className="border-[#0d592f] text-[#0d592f] hover:bg-[#0d592f]/10 rounded-full px-8 cursor-pointer">
              View All Plants
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
