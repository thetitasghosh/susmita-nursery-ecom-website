'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useShop } from '@/lib/shop-context'
import { allProducts } from '@/lib/products'
import { ProductCard } from '@/components/products/product-card'

export default function WishlistPage() {
  const { wishlist } = useShop()

  // Filter products that are saved in the wishlist
  const wishlistProducts = allProducts.filter((product) => wishlist.includes(product.id))

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-serif font-bold text-primary mb-2 flex items-center gap-3">
              <Heart size={32} className="text-accent fill-accent animate-pulse" />
              My Wishlist
            </h1>
            <p className="text-xs text-muted-foreground font-light">
              You have {wishlistProducts.length} item(s) saved in your wishlist
            </p>
          </motion.div>

          {wishlistProducts.length > 0 ? (
            /* Wishlist Items Grid using modular ProductCard */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            /* Empty Wishlist View */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-card border border-border/80 rounded-3xl"
            >
              <Heart size={48} className="mx-auto mb-4 text-neutral-300" />
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-sm text-muted-foreground font-light mb-6">
                Add your favorite botanical specimens to save them for later!
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-primary-emerald hover:bg-primary-emerald/90 text-white rounded-full font-semibold cursor-pointer shadow-sm">
                  <ArrowLeft size={14} className="mr-2" />
                  Browse Specimens Catalog
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
