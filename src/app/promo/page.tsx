'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Sprout, Wrench } from 'lucide-react'

export default function PromoPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1">
        
        {/* Banner Announcement */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-primary/10 via-transparent to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto space-y-4"
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-accent/10 border border-accent/25 text-accent-earth rounded-full text-xs font-bold uppercase tracking-wider font-sans">
                <Sparkles size={12} className="text-accent animate-pulse" />
                <span>Web Launch Promo</span>
              </div>
              <h1 className="text-4xl sm:text-7xl font-serif font-bold text-foreground leading-none tracking-tight">
                WE&apos;RE LIVE!<br />
                <span className="text-primary">Our New Website is Live!</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto font-sans">
                A fresh new experience to explore plants, tools, plant medicines & more. Everything you need for a greener, healthier life, directly from Nadia horticultural farms.
              </p>
            </motion.div>

            {/* Launch CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex justify-center"
            >
              <Link href="/">
                <Button size="lg" className="bg-primary hover:bg-primary-emerald text-white font-bold rounded-full px-10 py-7 text-sm uppercase tracking-wider cursor-pointer shadow-lg shadow-primary/20 flex items-center gap-2">
                  <span>Visit Now</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </motion.div>

            {/* Sub-label */}
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-sans font-bold pt-1">
              www.susmitanursery.com
            </p>
          </div>
        </section>

        {/* Promo Mockups Showcases */}
        <section className="py-12 md:py-24 border-t border-border/40 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
            
            {/* Showcase 1: Homepage & Plants Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Laptop Image Mockup */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-7 relative aspect-[16/10] w-full rounded-[32px] overflow-hidden border border-border bg-neutral-950/5 shadow-2xl p-4 sm:p-6"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border shadow-inner">
                  <Image
                    src="/images/inspo/website-launch-laptop-homepage-promo.png"
                    alt="Homepage and plants catalog mockup screenshot"
                    fill
                    className="object-cover object-top select-none"
                  />
                </div>
              </motion.div>

              {/* Copy Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 space-y-6 text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-sans">
                    <Sprout size={14} className="text-secondary" />
                    <span>Plant & Design Showcase</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                    The Home & Plant Showcase Matrix
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 font-light font-sans leading-relaxed">
                    Designed to inspire. Features high-fidelity photography grids, curated categories, interactive plant details, and customizable spatial AR fitting simulations.
                  </p>
                </div>

                <ul className="space-y-3.5 text-xs text-neutral-600 font-light font-sans">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span><strong className="font-semibold text-foreground">Interactive Categories</strong> — Round cards pathing to Palms, Succulents, and Bonsai.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span><strong className="font-semibold text-foreground">Bestsellers Grid</strong> — Scientific descriptions and instant card add actions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span><strong className="font-semibold text-foreground">Aesthetic Hero Carousel</strong> — Clean left text alignment on botanical banners.</span>
                  </li>
                </ul>
              </motion.div>

            </div>

            {/* Showcase 2: Tools & Plant Medicine Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Copy Info (Left aligned on Desktop) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 order-2 lg:order-1 space-y-6 text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-sans">
                    <Wrench size={14} className="text-secondary" />
                    <span>Ecosystem Expansion</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                    The Practical Tooling Ecosystem
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 font-light font-sans leading-relaxed">
                    Expanding our transaction catalog beyond foliage. We now provide professional bypass tools and organic remedies to assure that your garden remains pest-free and healthy.
                  </p>
                </div>

                <ul className="space-y-3.5 text-xs text-neutral-600 font-light font-sans">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span><strong className="font-semibold text-foreground">Premium Accessories</strong> — Golden gooseneck brass cans and carbon pruning shears.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span><strong className="font-semibold text-foreground">Organic Plant Medicine</strong> — Foliar Neem Oil pest sprays and compost boosters.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span><strong className="font-semibold text-foreground">Botanical Specs Matrix</strong> — Immediate display of difficulty, height, and water needs.</span>
                  </li>
                </ul>
              </motion.div>

              {/* Laptop Image Mockup (Right aligned on Desktop) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="lg:col-span-7 order-1 lg:order-2 relative aspect-[16/10] w-full rounded-[32px] overflow-hidden border border-border bg-neutral-950/5 shadow-2xl p-4 sm:p-6"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border shadow-inner">
                  <Image
                    src="/images/inspo/website-launch-laptop-tools-promo.png"
                    alt="Tools and plant medicine catalog mockup screenshot"
                    fill
                    className="object-cover object-top select-none"
                  />
                </div>
              </motion.div>

            </div>

          </div>
        </section>

        {/* trust badge section */}
        <section className="py-16 md:py-20 bg-background border-t border-border/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <ShieldCheck className="w-12 h-12 text-primary mx-auto" />
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-foreground">
              Everything for a Greener, Healthier Life.
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-lg mx-auto font-sans leading-relaxed">
              Explore plant companions, check soil lifecycles, and configure spatial AR overlays. We support your gardening journey from Nadia farms to your living room.
            </p>
            <div className="pt-2">
              <Link href="/">
                <Button className="bg-primary hover:bg-primary-emerald text-white font-bold rounded-full px-8 py-5 text-xs uppercase tracking-wider cursor-pointer">
                  Go to Homepage
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  )
}
