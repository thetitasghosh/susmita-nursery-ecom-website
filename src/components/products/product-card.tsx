'use client'

import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  category: string
  price: string
  rating: number
  reviews: number
  image: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group h-full bg-background border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-300 cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-muted/50 h-64 flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsWishlisted(!isWishlisted)
            }}
            className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur rounded-lg hover:bg-background transition-colors"
          >
            <Heart
              size={20}
              className={isWishlisted ? 'fill-accent text-accent' : 'text-foreground'}
            />
          </button>

          {/* Badge */}
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {product.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(product.rating)
                      ? 'fill-accent text-accent'
                      : 'text-border'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>

          {/* Price and Button */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary text-lg">{product.price}</span>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <ShoppingCart size={16} />
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
