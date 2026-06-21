'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Leaf } from 'lucide-react'
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
    eyebrow: 'Welcome to Susmita Nursery',
    title: 'Spring Sale',
    subtitle: 'Renew Your Living Spaces',
    description: 'Breathe new life into your home with our curated collection of indoor & air-purifying plants. Enjoy up to 20% off during our spring collection launch.',
    ctaText: 'SHOP THE SALE',
    ctaLink: '/products',
    secondaryCtaText: 'Explore Collection',
    secondaryCtaLink: '/products',
    image: '/images/hero-garden.jpg',
    badgeText: '20% OFF',
  },
  {
    eyebrow: 'Specialty Plants & Art',
    title: 'Living Sculpture',
    subtitle: 'Rare Bonsai & Exotic Orchids',
    description: 'Experience the elegance of meticulously trained Juniper Bonsais and rare hybrid orchids, propagated directly in our local Nadia farms.',
    ctaText: 'VIEW SPECIALTIES',
    ctaLink: '/products',
    secondaryCtaText: 'Our Greenhouses',
    secondaryCtaLink: '/contact',
    image: '/images/plants/bonsai-tree.jpg',
    badgeText: 'NEW STOCKS',
  },
  {
    eyebrow: 'Next-Gen Plant Shopping',
    title: 'AR View Technology',
    subtitle: 'Visualize Plants in Your Room',
    description: 'Unsure if a Monstera fits your bedroom corner? Use our mobile augmented reality experience to place life-sized 3D plants in your room.',
    ctaText: 'LAUNCH AR VIEW',
    ctaLink: '/ar-experience',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '/about',
    image: '/images/plants/monstera-plant.jpg',
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
    }, 6000)

    return () => clearInterval(timer)
  }, [api])

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          duration: 35,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide, idx) => (
            <CarouselItem key={idx} className="pl-0 relative min-h-[70vh] md:min-h-[80vh] flex items-center">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover object-center"
                  priority={idx === 0}
                />
                {/* Deep charcoal-green gradient overlay to ensure premium readability & high contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#011406]/95 via-[#011406]/75 to-transparent z-10" />
              </div>

              {/* Content Container */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 py-20 md:py-32">
                <div className="max-w-2xl text-left text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={current === idx ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex items-center gap-2 mb-6"
                  >
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-accent font-semibold text-xs uppercase tracking-wider">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>{slide.eyebrow}</span>
                    </div>
                    {slide.badgeText && (
                      <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {slide.badgeText}
                      </span>
                    )}
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={current === idx ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl lg:text-7xl font-bold font-serif leading-none tracking-tight mb-2"
                  >
                    {slide.title}
                  </motion.h1>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={current === idx ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-2xl sm:text-3xl text-[#daf5e3] mb-6 font-light font-serif"
                  >
                    {slide.subtitle}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={current === idx ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm sm:text-base text-neutral-300 mb-8 max-w-lg leading-relaxed font-light"
                  >
                    {slide.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={current === idx ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Link href={slide.ctaLink}>
                      <Button size="lg" className="bg-[#023512] hover:bg-[#023512]/90 border border-primary/20 text-white font-semibold rounded-full px-8 shadow-lg transition-all duration-300">
                        {slide.ctaText}
                      </Button>
                    </Link>
                    <Link href={slide.secondaryCtaLink}>
                      <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full px-8 backdrop-blur-sm">
                        {slide.secondaryCtaText}
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Navigation buttons - Desktop Only */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:inline-flex bg-black/30 text-white hover:bg-black/50 border-none w-12 h-12 rounded-full cursor-pointer z-30" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:inline-flex bg-black/30 text-white hover:bg-black/50 border-none w-12 h-12 rounded-full cursor-pointer z-30" />
      </Carousel>

      {/* Dots Indicator Overlay */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              current === i ? 'w-8 bg-accent' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
