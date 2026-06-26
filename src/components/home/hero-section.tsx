'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Leaf, Calendar } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'

const slides = [
  {
    eyebrow: 'Susmita Nursery Launch',
    title: 'Grow a Home That Feels Alive.',
    subtitle: 'Premium plants, expert guidance, and beautiful landscapes for every space.',
    description: 'Breathe new life into your home with our curated collection of indoor & air-purifying plants, raised with generational care.',
    ctaText: 'Explore Plants',
    ctaLink: '/products',
    secondaryCtaText: 'Book a Visit',
    secondaryCtaLink: '/contact?booking=true',
    image: '/images/banners/plant-hero-monstera-peace-lily-right.png',
    badgeText: 'WE ARE LIVE',
  },
  {
    eyebrow: 'Premium Botanical Quality',
    title: 'Bring Nature Home.',
    subtitle: 'Over 500 varieties grown with care for stronger, healthier life.',
    description: 'We prioritize premium potting mixes and slow-grow practices, ensuring that your botanical companions thrive from day one.',
    ctaText: 'Shop Best Sellers',
    ctaLink: '/products',
    secondaryCtaText: 'Our Services',
    secondaryCtaLink: '/contact',
    image: '/images/banners/plant-hero-bamboo-peace-lily-succulent.png',
    badgeText: '40+ YEARS EXP',
  },
  {
    eyebrow: 'Interactive Spatial Preview',
    title: 'Augmented Plant Fit.',
    subtitle: 'Visualize plants in your exact space before buying.',
    description: 'Unsure if a Ficus Lyrata fits your bedroom corner? Use our web AR simulation to place life-sized plants in your room.',
    ctaText: 'Try AR Experience',
    ctaLink: '/ar-experience',
    secondaryCtaText: 'Watch Demo',
    secondaryCtaLink: '/ar-experience?demo=true',
    image: '/images/banners/plant-hero-peace-lily-fern-succulent.png',
    badgeText: 'INTERACTIVE',
  },
]

export function HeroSection() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    if (!api) return

    const timer = setInterval(() => {
      api.scrollNext()
    }, 8000)

    return () => clearInterval(timer)
  }, [api])

  return (
    <section className="relative w-full overflow-hidden bg-background border-b border-border/40">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          duration: 40,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, idx) => (
            <CarouselItem key={idx} className="pl-0 relative min-h-[80vh] md:min-h-[55vh] flex items-center">
              {/* Background Banner Image */}
              <div className="absolute inset-0 z-0 bg-background">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover object-right md:object-center select-none"
                  priority={idx === 0}
                />
                {/* Visual shadow overlay gradient to assure absolute text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-dark/90 via-neutral-dark/55 md:via-neutral-dark/40 to-transparent z-10" />
              </div>

              {/* Content Container */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 py-24 md:py-36">
                <div className="max-w-2xl text-left text-white">

                  {/* Eyebrow badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={current === idx ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex items-center gap-2.5 mb-6"
                  >
                    <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-secondary font-sans font-semibold text-[10px] uppercase tracking-wider">
                      <Leaf className="w-3 h-3 text-secondary" />
                      <span>{slide.eyebrow}</span>
                    </div>
                    {slide.badgeText && (
                      <span className="bg-accent text-neutral-900 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-sans">
                        {slide.badgeText}
                      </span>
                    )}
                  </motion.div>

                  {/* Title (Cormorant Garamond serif) */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={current === idx ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl lg:text-7xl font-bold font-serif leading-tight tracking-tight mb-3"
                  >
                    {slide.title}
                  </motion.h1>

                  {/* Subtitle (Cormorant Garamond italic light serif) */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={current === idx ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-xl sm:text-2xl lg:text-3xl text-neutral-200 mb-6 font-light font-serif italic"
                  >
                    {slide.subtitle}
                  </motion.h2>

                  {/* Description (Inter / Manrope sans) */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={current === idx ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm sm:text-base text-neutral-300 mb-8 max-w-lg leading-relaxed font-sans font-light"
                  >
                    {slide.description}
                  </motion.p>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={current === idx ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Link href={slide.ctaLink}>
                      <Button size="lg" className="bg-primary hover:bg-primary-emerald text-white font-semibold rounded-full px-8 shadow-lg shadow-primary/20 transition-all duration-300 flex items-center gap-2 cursor-pointer group-hover:translate-x-0.5">
                        <span>{slide.ctaText}</span>
                        <Leaf className="w-4 h-4 text-secondary" />
                      </Button>
                    </Link>
                    <Link href={slide.secondaryCtaLink}>
                      <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full px-8 backdrop-blur-sm cursor-pointer">
                        {slide.secondaryCtaText === 'Book a Visit' && <Calendar size={14} className="mr-1.5" />}
                        <span>{slide.secondaryCtaText}</span>
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Navigation buttons - Desktop Only */}
        <CarouselPrevious className="absolute hidden md:inline-flex bg-black/20 text-white hover:bg-primary border-none w-12 h-12 rounded-full cursor-pointer z-30 transition-colors" />
        <CarouselNext className="absolute hidden md:inline-flex bg-black/20 text-white hover:bg-primary border-none w-12 h-12 rounded-full cursor-pointer z-30 transition-colors" />
      </Carousel>

      {/* Dots Indicator Overlay */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${current === i ? 'w-8 bg-accent' : 'w-2.5 bg-white/40 hover:bg-white/60'
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
