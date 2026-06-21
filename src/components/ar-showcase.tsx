'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Camera, Smartphone,  } from 'lucide-react'
import Image from 'next/image'

export function ARShowcase() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Decorative nature blurring circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visualizer Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Virtual Room Fitting
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight">
              Augmented Reality Styling
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">
              Avoid the guesswork. Access our webcam styling workspace to place life-sized, high-definition plant specimens in your actual space in real-time, or simulate placement using our designer loft room templates.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: 'Real-Time Webcam Feed',
                  desc: 'Stream your room backdrop directly to calibrate spacing and layouts.',
                },
                {
                  title: 'Precision 3D Orbiting',
                  desc: 'Orbit, pan, and scale specimen placements directly in your browser.',
                },
                {
                  title: 'Nursery Stock Integration',
                  desc: 'Toggle through all 12 specimens and buy what fits your space instantly.',
                },
              ].map((feat, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-card border border-border/80 hover:border-[#0d592f]/45 hover:shadow-sm transition-all duration-300 flex items-start gap-4 group"
                >
                  {/* Styled plant leaf bullet */}
                  <div className="w-8 h-8 rounded-full bg-[#daf5e3] border border-[#0d592f]/10 flex items-center justify-center flex-shrink-0 text-xs shadow-sm group-hover:scale-105 transition-transform">
                    🌿
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 font-light leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/ar-experience">
                <Button size="lg" className="bg-[#023512] hover:bg-[#023512]/90 text-white font-semibold rounded-full px-8 shadow-md transition-all cursor-pointer">
                  <Camera size={16} className="mr-2" />
                  Try AR Simulator
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Visual Mockup Viewport */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6 flex justify-center"
          >
            {/* High-Fidelity Smartphone Mockup */}
            <div className="relative w-full max-w-[280px] aspect-[9/18.5] rounded-[48px] border-[10px] border-[#0c1f13] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] bg-black overflow-hidden flex flex-col justify-between z-20">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-40 border border-white/5 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 absolute right-2" />
              </div>

              {/* Loft backdrop image inside mockup */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/rooms/modern_loft_room.jpg"
                  alt="Living room mockup template"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating 3D Specimen preview card */}
              <motion.div
                animate={{ 
                  y: [0, -6, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="absolute left-[15%] top-[28%] z-20 cursor-pointer"
              >
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-[#0d592f] shadow-2xl bg-white/10 backdrop-blur-sm">
                  <Image
                    src="/images/plants/monstera-plant.jpg"
                    alt="Monstera preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Simulated UI controls overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12 z-30 flex flex-col gap-2 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Smartphone size={10} className="text-accent" />
                    <span className="text-[8px] uppercase tracking-wider font-semibold text-neutral-300">AR Feed Active</span>
                  </div>
                  <div className="bg-[#023512]/95 border border-white/15 px-2 py-0.5 rounded-full text-[8px] font-bold text-accent">
                    SCALE: 100%
                  </div>
                </div>
                
                {/* Mock bottom slider */}
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-0.5">
                  <div className="w-2/3 h-full bg-[#daf5e3]" />
                </div>
              </div>

              {/* Camera grid layout lines */}
              <div className="absolute inset-0 border border-white/5 pointer-events-none z-10 flex">
                <div className="w-1/3 border-r border-white/5" />
                <div className="w-1/3 border-r border-white/5" />
              </div>
              <div className="absolute inset-0 border border-white/5 pointer-events-none z-10 flex flex-col">
                <div className="h-1/3 border-b border-white/5" />
                <div className="h-1/3 border-b border-white/5" />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
