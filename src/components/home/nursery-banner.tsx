'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function NurseryBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-neutral-dark py-20 md:py-24 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-garden.jpg"
          alt="Susmita Nursery greenhouse backdrop"
          fill
          sizes="100vw"
          className="object-cover opacity-25 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-dark/95 via-neutral-dark/85 to-neutral-dark/70" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="text-[10px] font-sans font-bold tracking-widest text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full uppercase w-max block">
                Visit Us In Person
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight tracking-tight">
                See It. Feel It. Take It Home.
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 font-sans font-light leading-relaxed max-w-xl">
                Experience Nadia&apos;s largest collections of botanical beauty. Walk through our greenhouses, consult with our master growers, and find the perfect plants for your home.
              </p>
            </motion.div>
          </div>

          {/* Right Side: Info Box & CTA */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl space-y-6 shadow-xl"
            >
              <h3 className="font-serif font-bold text-xl text-accent border-b border-white/10 pb-3">
                Nursery Details
              </h3>

              <div className="space-y-4 text-sm font-sans font-light text-neutral-200">
                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Opening Timings</p>
                    <p className="text-xs text-neutral-300">9:00 AM – 7:00 PM All Days</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Hotline Contact</p>
                    <p className="text-xs text-neutral-300">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Location Coordinates</p>
                    <p className="text-xs text-neutral-300 leading-normal">
                      123 Green Valley, Botanical Road,<br />
                      Your City, State – 123456
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=123+Green+Valley,Botanical+Road,Nadia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button className="w-full bg-accent hover:bg-accent/90 text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-full py-6 flex items-center justify-center gap-2 cursor-pointer shadow-md">
                    <Navigation size={15} />
                    <span>Get Directions</span>
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
