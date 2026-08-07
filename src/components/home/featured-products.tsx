'use client'

import { motion } from 'framer-motion'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Product } from '@/lib/products'
import { Leaf, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { fetchProductsWithCache, getCachedProducts } from '@/utils/product-cache'

export function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true;
    
    // Check if we have cached products to immediately show so we can disable the loading state
    const cachedProducts = getCachedProducts();
    if (cachedProducts && cachedProducts.length > 0) {
      setLoading(false);
    }

    fetchProductsWithCache(
      (products) => {
        if (!active) return;
        const matches = products.filter(p => p.featured);
        if (matches.length > 0) {
          setFeatured(matches.slice(0, 5));
        } else {
          setFeatured(products.slice(0, 5));
        }
        setLoading(false);
      },
      () => {
        if (active) setLoading(false);
      }
    );

    return () => {
      active = false;
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

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

        {/* Mobile View: 2-Product Swipeable Carousel */}
        <div className="sm:hidden flex flex-col items-center mb-12 w-full">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="h-[280px] bg-muted/60 animate-pulse rounded-2xl border border-border/40" />
              <div className="h-[280px] bg-muted/60 animate-pulse rounded-2xl border border-border/40" />
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex gap-4 w-full overflow-x-auto snap-x snap-mandatory touch-pan-x pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featured.map((product) => (
                <div
                  key={product.id}
                  className="w-[calc(50%-8px)] flex-shrink-0 snap-start h-full"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Navigation Controls */}
          {!loading && featured.length > 2 && (
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => scroll('left')}
                className="p-2.5 border border-border bg-white text-foreground hover:bg-primary hover:text-white rounded-full transition-colors cursor-pointer shadow-sm"
                aria-label="Previous products"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2.5 border border-border bg-white text-foreground hover:bg-primary hover:text-white rounded-full transition-colors cursor-pointer shadow-sm"
                aria-label="Next products"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Bestsellers Grid (Tablet & Desktop Only) */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-[360px] bg-muted/60 animate-pulse rounded-3xl border border-border/40" />
              ))
            : featured.map((product, index) => (
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
