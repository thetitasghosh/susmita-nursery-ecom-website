'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Camera, Smartphone, Leaf } from 'lucide-react'
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
              <span className="text-xs font-semibold text-accent uppercase tracking-wider font-sans">
                Virtual Room Fitting
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight">
              Augmented Reality Styling
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light font-sans">
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
                  className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/45 hover:shadow-sm transition-all duration-300 flex items-start gap-4 group"
                >
                  {/* Styled plant leaf bullet */}
                  <div className="w-8 h-8 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0 text-xs shadow-sm group-hover:scale-105 transition-transform">
                    <Leaf className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors font-sans">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 font-light leading-relaxed font-sans">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/ar-experience">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full px-8 shadow-md transition-all cursor-pointer font-sans">
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
            className="lg:col-span-6 flex justify-center w-full relative group"
          >
            {/* Outer container resembling a photo of the room fitting */}
            <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[36px] overflow-hidden flex items-center justify-center p-6 border border-border/80 shadow-2xl">

              {/* Cozy Room Backdrop (Blurred background representing the room) */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/rooms/modern_loft_room.jpg"
                  alt="Living room backdrop"
                  fill
                  className="object-cover blur-sm brightness-95 scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* High-Fidelity Smartphone Mockup held in center */}
              <div className="relative w-[230px] aspect-[9/18.5] rounded-[42px] border-[8px] border-[#0c1f13] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] bg-black overflow-hidden flex flex-col justify-between z-20 transition-transform duration-500 group-hover:scale-[1.02]">

                {/* Dynamic Island Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-40 border border-white/5 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 absolute right-2" />
                </div>

                {/* Camera Feed Viewport (Unblurred room inside phone) */}
                <div className="absolute inset-0 z-0 redd">
                  <Image
                    src="/images/rooms/modern_loft_room.jpg"
                    alt="AR Camera Feed"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Subtle Camera Feed Overlay */}
                  <div className="absolute inset-0 bg-black/5" />
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

                {/* Simulated UI controls overlay */}

                {/* 1. Top AR Banner Popup Card */}
                <div className="absolute top-8 inset-x-2.5 z-30">
                  <div className="flex items-center justify-between gap-1.5 p-1.5 bg-primary-deep/95 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-6 h-6 rounded bg-white/10 border border-white/10 flex-shrink-0">
                        <Image
                          src="/images/plants/bonsai-tree-trans.png"
                          alt="Snake plant thumbnail"
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      </div>
                      <div className="text-left">
                        <h5 className="text-[8px] font-bold text-white leading-tight font-sans">Snake Plant</h5>
                        <p className="text-[7px] text-neutral-300 font-sans leading-none">Perfect fit for this spot!</p>
                      </div>
                    </div>
                    <button className="text-white/60 hover:text-white transition-colors cursor-pointer pr-0.5">
                      <span className="text-[8px] font-bold">✕</span>
                    </button>
                  </div>
                </div>

                {/* 2. Target Indicator Ring under the plant */}
                <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-24 h-6 bg-accent/20 border border-accent/60 rounded-full blur-[1px] z-10 flex items-center justify-center animate-pulse">
                  <div className="w-16 h-3 border border-accent/40 rounded-full" />
                </div>

                {/* 3. Plant specimen model placement (Snake Plant in white pot) */}
                <motion.div
                  animate={{
                    y: [0, -4, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-[18%] z-25 w-28 h-28 flex items-end justify-center select-none pointer-events-none"
                >
                  <div className="relative w-24 h-24 mix-blend-multiply">
                    <Image
                      src="/images/plants/bonsai-tree-trans.png"
                      alt="AR Simulated Snake Plant"
                      fill
                      className="object-contain"
                      sizes="96px"
                      priority
                    />
                  </div>
                </motion.div>

                {/* 4. Right Side Toolbar (Vertical Icons Column) */}
                <div className="absolute right-2 top-24 z-30 flex flex-col gap-2">
                  {[
                    { icon: '☀️', label: 'Lux' },
                    { icon: '📐', label: 'Scale' },
                    { icon: '🔄', label: 'Rotate' },
                    { icon: '📦', label: '3D' },
                    { icon: '⏱️', label: 'Reset' }
                  ].map((ctrl, i) => (
                    <button
                      key={i}
                      className="w-5 h-5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[9px] text-white hover:bg-primary transition-all shadow-md cursor-pointer"
                      title={ctrl.label}
                    >
                      {ctrl.icon}
                    </button>
                  ))}
                </div>

                {/* 5. Bottom Controls (Shutter Capture Button & Info) */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-3 pt-8 z-30 flex flex-col items-center gap-1.5 text-white">

                  {/* White Shutter Button */}
                  <div className="relative w-10 h-10 rounded-full border border-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                    <div className="w-8 h-8 rounded-full bg-white hover:bg-neutral-100 transition-colors" />
                  </div>

                  <div className="flex items-center gap-1">
                    <Smartphone size={8} className="text-accent" />
                    <span className="text-[7px] uppercase tracking-wider font-semibold text-neutral-300 font-sans">AR Feed Active</span>
                  </div>
                </div>

              </div>

              {/* Floating Badge (Real Size, Real Space, Real Preview) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-4 top-1/3 -translate-y-1/2 z-35 w-[110px] bg-white border border-border/80 p-3 rounded-2xl shadow-xl flex flex-col items-center gap-1.5"
              >
                <div className="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center">
                  <Leaf className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="text-center font-sans">
                  <h6 className="text-[8px] font-bold text-foreground leading-tight">Real Size</h6>
                  <p className="text-[7px] text-muted-foreground">Real Space</p>
                  <p className="text-[7px] text-muted-foreground">Real Preview</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
