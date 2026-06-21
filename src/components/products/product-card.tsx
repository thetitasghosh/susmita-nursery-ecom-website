'use client'

import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useShop } from '@/lib/shop-context'
import { Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop()
  const wishlisted = isWishlisted(product.id)

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group h-full bg-card border border-border/80 rounded-3xl overflow-hidden hover:border-[#0d592f]/30 transition-all duration-300 cursor-pointer flex flex-col justify-between"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-muted/30 aspect-square flex items-center justify-center flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-w-768px) 100vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleWishlist(product.id)
            }}
            className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full hover:bg-white text-foreground transition-colors shadow-sm cursor-pointer z-10"
          >
            <Heart
              size={16}
              className={wishlisted ? 'fill-accent text-accent' : 'text-neutral-500 hover:text-foreground'}
            />
          </button>

          {/* Category Badge */}
          <span className="absolute top-4 left-4 text-[9px] font-bold tracking-wider text-white bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-full uppercase">
            {product.category}
          </span>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-foreground text-lg group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < Math.floor(product.rating)
                        ? 'fill-accent text-accent'
                        : 'text-border'
                    }
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground font-light">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>

          {/* Footer details: Price and Action */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-serif font-bold text-[#0d592f] text-lg">
              ₹{product.price.toFixed(2)}
            </span>
            <Button
              size="sm"
              className="bg-[#023512] hover:bg-[#023512]/90 text-white font-medium rounded-full px-4 py-1.5 text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addToCart(product, 1)
              }}
            >
              <ShoppingCart size={12} />
              <span>Add</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
