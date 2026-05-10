'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Star, Leaf, Droplet, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

// Mock product data
const productDetails: Record<number, any> = {
  1: {
    id: 1,
    name: 'Monstera Deliciosa',
    category: 'Indoor Plants',
    price: '$49.99',
    rating: 4.8,
    reviews: 128,
    image: '🌿',
    description:
      'The iconic Monstera Deliciosa, also known as the Swiss Cheese Plant, is a stunning tropical plant perfect for any indoor space. Known for its distinctive split leaves and climbing nature.',
    details: {
      light: 'Bright, indirect light',
      water: 'Water when soil is dry',
      humidity: 'Moderate to high',
      temperature: '65-75°F',
      soil: 'Well-draining potting soil',
    },
    sizes: ['Small (6-8 inch)', 'Medium (10-12 inch)', 'Large (14-16 inch)'],
    careInstructions: [
      'Allow top inch of soil to dry between waterings',
      'Provide bright, indirect light',
      'Wipe leaves monthly with soft cloth',
      'Fertilize monthly during growing season',
      'Support with moss pole as plant grows',
    ],
  },
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id)
  const product = productDetails[productId] || productDetails[1]
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[500px] bg-card border border-border rounded-2xl flex items-center justify-center"
            >
              <span className="text-8xl">{product.image}</span>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-accent/20 text-accent font-semibold text-sm rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < Math.floor(product.rating)
                          ? 'fill-accent text-accent'
                          : 'text-border'
                      }
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <p className="text-4xl font-bold text-primary mb-6">
                {product.price}
              </p>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Size
                </label>
                <div className="space-y-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-full p-3 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border bg-card text-foreground hover:border-primary/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={isWishlisted ? 'bg-accent/10' : ''}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={isWishlisted ? 'currentColor' : 'none'}
                    color={isWishlisted ? '#4a9d6f' : 'currentColor'}
                  />
                </Button>
              </div>

              {/* Quick Care Facts */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-4">Quick Care</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Sun className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Light</p>
                      <p className="text-sm font-semibold text-foreground">
                        {product.details.light}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Droplet className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Water</p>
                      <p className="text-sm font-semibold text-foreground">
                        {product.details.water}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Care Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16 bg-card border border-border rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Leaf className="text-primary" />
              Care Instructions
            </h2>
            <ul className="space-y-3">
              {product.careInstructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-semibold text-sm flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-foreground pt-0.5">{instruction}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
