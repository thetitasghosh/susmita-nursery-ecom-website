'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react'

const categories = [
  {
    name: 'Indoor Plants',
    image: '/images/plants/monstera-plant.jpg',
    href: '/products?category=Indoor Plants',
  },
  {
    name: 'Outdoor Plants',
    image: '/images/plants/sunflower-garden.jpg',
    href: '/products?category=Outdoor Plants',
  },
  {
    name: 'Flowering Plants',
    image: '/images/plants/rose-flowers.jpg',
    href: '/products?category=Flowering Plants',
  },
  {
    name: 'Fruit Plants',
    image: '/images/plants/fruit-plant.jpg',
    href: '/products?category=Fruit Plants',
  },
  {
    name: 'Palms',
    image: '/images/plants/areca-palm.jpg',
    href: '/products?category=Palms',
  },
  {
    name: 'Succulents',
    image: '/images/plants/succulent-collection.jpg',
    href: '/products?category=Succulents',
  },
  {
    name: 'Bonsai',
    image: '/images/plants/bonsai-tree.jpg',
    href: '/products?category=Bonsai',
  },
  {
    name: 'Pots & Planters',
    image: '/images/plants/pots-planters.jpg',
    href: '/products?category=Pots & Planters',
  },
  {
    name: 'Garden Accessories',
    image: '/images/plants/garden-accessories.jpg',
    href: '/products?category=Tools',
  },
]

export function CategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-10 md:py-14 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-8"
        >
          <Leaf size={13} className="text-secondary" />
          <span>Shop by Category</span>
        </motion.div>

        {/* Circles row — horizontal scroll */}
        <div
          ref={scrollRef}
          className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory touch-pan-x pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="flex flex-col items-center gap-3 snap-start flex-shrink-0 group"
            >
              <Link href={cat.href} className="flex flex-col items-center gap-3">
                {/* Large circle */}
                <div className="relative w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] md:w-[160px] md:h-[160px] rounded-full overflow-hidden border-2 border-border/40 bg-muted group-hover:border-primary/50 group-hover:shadow-lg transition-all duration-300">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="160px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-300 rounded-full" />
                </div>

                {/* Label */}
                <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors text-center leading-tight max-w-[140px]">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Scroll arrows */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 border border-border bg-white text-foreground hover:bg-primary hover:text-white rounded-full transition-colors cursor-pointer shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 border border-border bg-white text-foreground hover:bg-primary hover:text-white rounded-full transition-colors cursor-pointer shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </section>
  )
}
