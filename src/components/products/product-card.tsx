'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useShop } from '@/lib/shop-context'
import { Product } from '@/lib/products'
import { WHATSAPP_NUMBER } from '@/constants'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop()
  const wishlisted = isWishlisted(product.id)

  const [isAdding, setIsAdding] = useState(false)

  const pageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/products/${product.slug || product.id}`
    : `https://susmitanursery.com/products/${product.slug || product.id}`
  const scientific = product.scientificName ? ` (${product.scientificName})` : ''
  const whatsappMessage = `Hello Susmita Nursery! I want to discuss and buy this plant:

Plant Name: ${product.name}${scientific}
Price: ₹${product.price.toFixed(2)}
Selected Size: Standard
Quantity: 1

Botanical Details:
- Category: ${product.category}
- Light Requirement: ${product.details?.light || 'Standard'}
- Watering Needs: ${product.details?.water || 'Standard'}
- Care Difficulty: ${product.difficulty || 'Easy'}
- Air Purifying: ${product.airPurifying || 'Yes'}

Product Link: ${pageUrl}`
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(whatsappMessage)}`

  return (
    <Link href={`/products/${product.slug || product.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group h-full bg-card border border-border/80 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col justify-between"
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
            {product.scientificName && (
              <p className="text-[11px] text-muted-foreground italic font-serif leading-none -mt-0.5 pb-1 line-clamp-1">
                {product.scientificName}
              </p>
            )}
            
            {/* Rating */}
            <div className="flex items-center gap-1.5 pt-0.5">
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

          {/* Footer details: Price and Buttons */}
          <div className="flex flex-col gap-3 pt-2.5 border-t border-border/40">
            <div className="flex items-center justify-between">
              <span className="font-sans font-extrabold text-primary text-base tabular-nums">
                ₹{product.price.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 w-full">
              {/* Add to Cart Button */}
              <Button
                size="sm"
                disabled={isAdding}
                className="flex-1 bg-primary-emerald hover:bg-primary-emerald/90 text-white font-semibold rounded-full h-8 px-3 text-[11px] cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-sm disabled:opacity-75"
                onClick={async (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsAdding(true)
                  try {
                    await addToCart(product, 1)
                  } finally {
                    setIsAdding(false)
                  }
                }}
              >
                {isAdding ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingCart size={13} />
                )}
                <span>{isAdding ? 'Adding' : 'Add to Cart'}</span>
              </Button>

              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation()
                }}
                className="flex-shrink-0"
              >
                <Button
                  size="sm"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full w-8 h-8 p-0 flex items-center justify-center cursor-pointer transition-all shadow-sm border border-[#20ba5a]/20"
                >
                  <div className="relative w-4.5 h-4.5">
                    <Image
                      src="/images/whatsapp-2.png"
                      alt="WhatsApp"
                      fill
                      sizes="18px"
                      className="object-contain"
                      priority
                    />
                  </div>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
