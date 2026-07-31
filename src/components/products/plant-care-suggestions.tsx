'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowRight, ShieldAlert, Wrench, Sprout, Sparkles } from 'lucide-react'
import { Product, allProducts } from '@/lib/products'
import { useShop } from '@/lib/shop-context'
import { Button } from '@/components/ui/button'

interface PlantCareSuggestionsProps {
  currentProduct: Product
}

export function PlantCareSuggestions({ currentProduct }: PlantCareSuggestionsProps) {
  const { addToCart } = useShop()

  // Dynamic recommendation engine based on current product type
  const getDynamicRecommendations = () => {
    const isPlant = !['Gardening Tools', 'Plants Medicine', 'Organic Fertilizer', 'No1. Clay Pots', 'No1. Fiber Pots', 'Ceramic Pots', 'Plastic Pots'].includes(currentProduct.category)

    if (!isPlant) {
      // If viewing a tool/pot/medicine, recommend popular indoor & flowering plants + complementary tools
      const plants = allProducts.filter(p => ['Indoor Plants', 'Flower Plants', 'Fruit Plants'].includes(p.category)).slice(0, 3)
      return plants.map(p => ({
        product: p,
        tag: 'COMPANION PLANT',
        reason: `Ideal specimen to cultivate using ${currentProduct.name}`,
        icon: Sprout,
      }))
    }

    // 1. Pick Medicine
    const medicines = allProducts.filter(p => p.category === 'Plants Medicine')
    let selectedMedicine = medicines[0]
    if (currentProduct.difficulty === 'Medium' || currentProduct.difficulty === 'Hard') {
      selectedMedicine = medicines.find(p => p.name.includes('Root Growth')) || medicines[0]
    } else {
      selectedMedicine = medicines.find(p => p.name.includes('Neem Oil')) || medicines[0]
    }

    // 2. Pick Fertilizer
    const fertilizers = allProducts.filter(p => p.category === 'Organic Fertilizer')
    let selectedFertilizer = fertilizers[0]
    if (currentProduct.category === 'Fruit Plants' || currentProduct.category === 'Flower Plants') {
      selectedFertilizer = fertilizers.find(p => p.name.includes('Vermicompost')) || fertilizers[0]
    }

    // 3. Pick Tool
    const tools = allProducts.filter(p => p.category === 'Gardening Tools')
    let selectedTool = tools[0]
    if (currentProduct.details?.humidity?.toLowerCase().includes('high') || currentProduct.category === 'Indoor Plants') {
      selectedTool = tools.find(p => p.name.includes('Micro-Mist') || p.name.includes('Watering Can')) || tools[0]
    } else {
      selectedTool = tools.find(p => p.name.includes('Pruning Shears') || p.name.includes('Precision')) || tools[0]
    }

    // 4. Pick Pot / Container
    const pots = allProducts.filter(p => ['No1. Clay Pots', 'No1. Fiber Pots', 'Ceramic Pots', 'Plastic Pots'].includes(p.category))
    let selectedPot = pots[0]
    if (currentProduct.category === 'Indoor Plants') {
      selectedPot = pots.find(p => p.category === 'Ceramic Pots' || p.category === 'No1. Fiber Pots') || pots[0]
    } else {
      selectedPot = pots.find(p => p.category === 'No1. Clay Pots' || p.category === 'Plastic Pots') || pots[0]
    }

    return [
      {
        product: selectedMedicine,
        tag: 'MEDICINE',
        reason: `Protects ${currentProduct.name} from pests, leaf spots, and soil rot`,
        icon: ShieldAlert,
      },
      {
        product: selectedFertilizer,
        tag: 'ORGANIC NUTRITION',
        reason: `Boosts root strength and foliage growth for ${currentProduct.name}`,
        icon: Sparkles,
      },
      {
        product: selectedTool,
        tag: 'ESSENTIAL TOOL',
        reason: `Tailored tool for pruning and hydrating ${currentProduct.name}`,
        icon: Wrench,
      },
      {
        product: selectedPot,
        tag: 'MATCHING POT',
        reason: `Optimal drainage & aesthetic pot size for ${currentProduct.name}`,
        icon: Sprout,
      },
    ].filter(item => item.product && item.product.id !== currentProduct.id)
  }

  const recommendations = getDynamicRecommendations()

  if (recommendations.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-border/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[10px] font-sans font-bold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full inline-block mb-2">
            Dynamic Botanical Care Suggestions
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Recommended Tools, Medicines & Potting Essentials
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1">
            Handpicked care products specifically matched for <span className="font-semibold text-foreground">{currentProduct.name}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map(({ product, tag, reason, icon: IconIcon }, idx) => (
          <motion.div
            key={product.id + '-' + idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group bg-white border border-border rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 relative"
          >
            {/* Tag Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <IconIcon size={11} className="text-primary" />
                {tag}
              </span>
              <span className="text-xs font-bold font-sans text-primary tabular-nums">
                ₹{product.price.toFixed(2)}
              </span>
            </div>

            {/* Thumbnail Image */}
            <Link href={`/products/${product.id}`} className="block relative aspect-square w-full bg-muted/20 rounded-2xl overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform duration-300">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover"
              />
            </Link>

            {/* Title & Contextual Reason */}
            <div className="flex-1 space-y-1.5 mb-4">
              <Link href={`/products/${product.id}`} className="font-serif font-bold text-foreground text-base hover:text-primary transition-colors line-clamp-1 block">
                {product.name}
              </Link>
              <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                {reason}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/40">
              <Button
                size="sm"
                onClick={() => addToCart(product, 1)}
                className="flex-1 bg-primary-emerald hover:bg-primary text-white text-xs font-semibold rounded-full py-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ShoppingCart size={13} />
                <span>Add to Cart</span>
              </Button>
              <Link href={`/products/${product.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full px-2.5 py-2 border-border hover:bg-muted text-foreground cursor-pointer"
                  title="View Details"
                >
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
