"use client"

import React, { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { allProducts } from "@/lib/products"
import { useShop } from "@/lib/shop-context"
import Image from "next/image"

export default function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const productId = parseInt(params.id)
  const product = allProducts.find(p => p.id === productId) || allProducts[0]
  
  const { addToCart, toggleWishlist, isWishlisted } = useShop()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "Standard")

  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize)
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] sm:h-[550px] bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-w-768px) 100vw, 50vw"
                className="object-cover animate-pulse-slow"
                priority
              />
              <span className="absolute top-4 left-4 inline-block px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground font-semibold text-xs rounded-full uppercase tracking-wider">
                {product.category}
              </span>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground leading-tight mb-2">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "text-border"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-light">
                    {product.rating} ({product.reviews} customer reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <p className="text-3xl sm:text-4xl font-serif font-bold text-[#0d592f]">
                ₹{product.price.toFixed(2)}
              </p>

              <div className="border-t border-border/50 pt-4">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs rounded-full border-2 transition-all cursor-pointer ${
                        selectedSize === size
                          ? "border-[#0d592f] bg-[#daf5e3]/45 text-[#0d592f] font-semibold"
                          : "border-border bg-card text-foreground hover:border-[#0d592f]/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#023512] hover:bg-[#023512]/90 text-white font-semibold py-3 rounded-full cursor-pointer transition-all shadow-md"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-14 rounded-full border border-border flex items-center justify-center cursor-pointer transition-all ${
                    wishlisted ? "bg-accent/15 border-accent/30 text-accent" : "hover:bg-muted text-foreground"
                  }`}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={wishlisted ? "currentColor" : "none"}
                  />
                </Button>
              </div>

              {/* Quick Care Facts */}
              <div className="bg-card border border-border rounded-2xl p-6 mb-8 space-y-4">
                <h3 className="font-serif font-bold text-foreground text-lg mb-2">
                  Quick Care Guide
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-wider text-accent uppercase bg-accent/25 px-2 py-0.5 rounded-md">
                      LIGHT REQUIREMENT
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      {product.details.light}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-wider text-[#0d592f] uppercase bg-[#daf5e3]/60 px-2 py-0.5 rounded-md">
                      WATER SCHEDULE
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      {product.details.water}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-wider text-[#0d592f] uppercase bg-[#daf5e3]/60 px-2 py-0.5 rounded-md">
                      SOIL MIXTURE
                    </span>
                    <p className="text-xs font-semibold text-foreground leading-normal">
                      {product.details.soil}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-wider text-[#0d592f] uppercase bg-[#daf5e3]/60 px-2 py-0.5 rounded-md">
                      TEMPERATURE
                    </span>
                    <p className="text-xs font-semibold text-foreground">
                      {product.details.temperature}
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

          {/* Care Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-card border border-border rounded-3xl p-8"
          >
            <h2 className="text-2xl font-serif font-bold text-[#0d592f] mb-6">
              Horticultural Care Guide
            </h2>
            <ul className="space-y-4">
              {product.careInstructions.map(
                (instruction: string, index: number) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#daf5e3] text-[#0d592f] font-semibold text-xs flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground leading-relaxed font-light">
                      {instruction}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
