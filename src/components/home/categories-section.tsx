'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react'

const categories = [
  {
    name: 'Indoor Plants',
    image: '/images/plants/monstera-plant.jpg?v=2',
    href: '/products?category=Indoor Plants',
  },
  {
    name: 'Lucky Bamboo',
    image: '/images/plants/lucky-bamboo.png?v=2',
    href: '/products?category=Lucky Bamboo',
  },
  {
    name: 'No1. Fiber Pots',
    image: '/images/plants/fiber-pots.png?v=2',
    href: '/products?category=No1. Fiber Pots',
  },
  {
    name: 'Ceramic Pots',
    image: '/images/plants/ceramic-pots.png?v=2',
    href: '/products?category=Ceramic Pots',
  },
  {
    name: 'No1. Clay Pots',
    image: '/images/plants/clay-pots.png?v=2',
    href: '/products?category=No1. Clay Pots',
  },
  {
    name: 'Plastic Pots',
    image: '/images/plants/plastic-pots.png?v=2',
    href: '/products?category=Plastic Pots',
  },
  {
    name: 'Organic Fertilizer',
    image: '/images/plants/organic-fertilizer.png?v=2',
    href: '/products?category=Organic Fertilizer',
  },
  {
    name: 'Plants Medicine',
    image: '/images/plants/neem-oil.jpg',
    href: '/products?category=Plants Medicine',
  },
  {
    name: 'Gardening Tools',
    image: '/images/plants/gardening-tools.png?v=2',
    href: '/products?category=Gardening Tools',
  },
  {
    name: 'Fruit Plants',
    image: '/images/plants/fruit-plant.jpg',
    href: '/products?category=Fruit Plants',
  },
  {
    name: 'Flower Plants',
    image: '/images/plants/rose-flowers.jpg',
    href: '/products?category=Flower Plants',
  },
  {
    name: 'Outdoor Plants',
    image: '/images/plants/sunflower-garden.jpg',
    href: '/products?category=Outdoor Plants',
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

        {/* Mobile Grid View */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
            >
              <Link href={cat.href} className="block w-full">
                <div className="bg-[#05512c] rounded-2xl p-3 flex flex-col items-center gap-3.5 shadow-md border border-[#043e22]">
                  {/* Large circle */}
                  <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-white bg-white">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 150px"
                      className="object-cover"
                    />
                  </div>
                  {/* Yellow badge with italic category name */}
                  <div className="bg-[#facc15] text-[#05512c] font-sans font-extrabold italic text-[11px] px-2.5 py-1 rounded-full text-center w-full shadow-sm truncate">
                    {cat.name}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Circles row — horizontal scroll (Desktop & Tablet) */}
        <div
          ref={scrollRef}
          className="hidden md:flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory touch-pan-x pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="snap-start flex-shrink-0 group"
            >
              <Link href={cat.href} className="block">
                <div className="bg-[#05512c] rounded-2xl p-4 flex flex-col items-center gap-4 shadow-md border border-[#043e22] w-[160px] sm:w-[180px] md:w-[192px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-white/20">
                  {/* Large circle */}
                  <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-white bg-white transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(min-width: 768px) 160px, 130px"
                      className="object-cover"
                    />
                  </div>
                  {/* Yellow badge with italic category name */}
                  <div className="bg-[#facc15] text-[#05512c] font-sans font-extrabold italic text-[11px] sm:text-xs md:text-sm px-2.5 py-1.5 rounded-full text-center w-full shadow-sm truncate transition-colors duration-300 group-hover:bg-yellow-300">
                    {cat.name}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Scroll arrows (Desktop & Tablet) */}
        <div className="hidden md:flex justify-end gap-2 mt-6">
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
