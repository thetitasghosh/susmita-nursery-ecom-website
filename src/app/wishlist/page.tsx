'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const mockWishlistItems = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    price: 49.99,
    rating: 4.8,
    reviews: 128,
    image: '🌿',
  },
  {
    id: 3,
    name: 'Fiddle Leaf Fig',
    price: 59.99,
    rating: 4.7,
    reviews: 92,
    image: '🍃',
  },
  {
    id: 7,
    name: 'Aloe Vera',
    price: 22.99,
    rating: 4.7,
    reviews: 145,
    image: '🌾',
  },
]

export default function WishlistPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Heart size={32} className="text-accent fill-accent" />
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              You have {mockWishlistItems.length} item(s) saved
            </p>
          </motion.div>

          {mockWishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockWishlistItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-accent/50 transition-all"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-muted/50 flex items-center justify-center overflow-hidden">
                    <span className="text-6xl group-hover:scale-110 transition-transform">
                      {item.image}
                    </span>

                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      In Stock
                    </div>

                    {/* Remove Button */}
                    <button className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur rounded-lg hover:bg-background transition-colors">
                      <Trash2 size={18} className="text-destructive" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={i < Math.floor(item.rating) ? 'text-accent' : 'text-border'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.rating} ({item.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-primary text-lg">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                      >
                        <ShoppingCart size={16} />
                      </Button>
                      <Link href={`/products/${item.id}`} className="flex-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Heart size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Add your favorite plants to save them for later
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Browse Plants
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
