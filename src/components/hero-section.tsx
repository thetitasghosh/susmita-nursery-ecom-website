'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Leaf } from 'lucide-react'
import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32 min-h-[60vh]">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-full">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                Welcome to Susmita Nursery
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Bring{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Nature
              </span>{' '}
              Into Your Home
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Discover our curated collection of premium indoor and outdoor plants. Visualize how they look in your space with our innovative AR technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  Explore Plants
                </Button>
              </Link>
              <Link href="/ar-experience">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Try AR Experience
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden"
          >
            <Image
              src="/images/hero-garden.jpg"
              alt="Beautiful garden with vibrant plants"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
