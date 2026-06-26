'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Leaf } from 'lucide-react'

const editorialPanels = [
  {
    id: 1,
    title: 'Indoor Jungle',
    subtitle: 'Transform your indoor spaces into green sanctuaries.',
    image: '/images/rooms/modern_loft_room.jpg',
    href: '/products?category=Indoor Plants',
    sizeClass: 'lg:col-span-2 h-[350px] sm:h-[450px]',
  },
  {
    id: 2,
    title: 'Terrace Gardens',
    subtitle: 'Maximize sunlight with structured rooftop designs.',
    image: '/images/rooms/garden_patio_terrace.jpg',
    href: '/contact?service=Landscape Design',
    sizeClass: 'lg:col-span-1 h-[350px] sm:h-[450px]',
  },
  {
    id: 3,
    title: 'Landscape Projects',
    subtitle: 'Generational garden designs tailored for grand estates.',
    image: '/images/rooms/landscape_project.jpg',
    href: '/contact?service=Landscape Design',
    sizeClass: 'lg:col-span-3 h-[400px] sm:h-[500px]',
  },
]

export function GallerySection() {
  return (
    <section id="inspiration" className="py-20 md:py-28 bg-background border-b border-border/40 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Leaf size={14} className="text-secondary" />
            <span>Design Ideas</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            Inspiration & Editorial Section
          </h2>
          <div className="h-1 w-12 bg-accent mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-muted-foreground font-light max-w-md mx-auto">
            Explore curated design concepts for styling interiors and structural outdoor garden landscapes.
          </p>
        </motion.div>

        {/* Editorial Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {editorialPanels.map((panel, index) => (
            <motion.div
              key={panel.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 0.99 }}
              className={`relative ${panel.sizeClass} rounded-[32px] overflow-hidden border border-border/60 shadow-md group cursor-pointer`}
            >
              <Link href={panel.href}>
                <div className="relative w-full h-full">
                  {/* Backdrop Image */}
                  <Image
                    src={panel.image}
                    alt={panel.title}
                    fill
                    sizes="(max-w-1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Elegant Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-dark/90 via-neutral-dark/40 to-transparent z-10" />

                  {/* Panel Copy */}
                  <div className="absolute inset-0 z-20 p-8 sm:p-10 flex flex-col justify-end text-white">
                    <span className="text-[9px] font-sans font-bold tracking-widest text-accent bg-accent/15 border border-accent/25 px-2.5 py-0.5 rounded-full uppercase w-max mb-3">
                      Design Concept
                    </span>
                    <h3 className="font-serif font-bold text-2xl sm:text-3xl mb-2 text-white">
                      {panel.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-md leading-relaxed mb-4">
                      {panel.subtitle}
                    </p>
                    <div className="flex items-center text-xs font-semibold text-accent group-hover:translate-x-1 transition-transform">
                      <span>Explore Projects</span>
                      <span className="ml-1">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
