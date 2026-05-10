'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Smartphone, Eye } from 'lucide-react'

export function ARShowcase() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden min-h-screen">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                AR Technology
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Visualize Plants in Your Space
            </h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Use our augmented reality technology to see how plants will look in your home before making a purchase. Point your camera at your space and explore different varieties.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                'Real-time visualization with AR',
                'See size and placement options',
                'Compare multiple plant varieties',
                'Perfect lighting and care information',
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-accent font-bold">✓</span>
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/ar-experience">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Smartphone className="w-5 h-5 mr-2" />
                Try AR Experience
              </Button>
            </Link>
          </motion.div>

          {/* AR Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] md:h-[500px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl overflow-hidden">
              <div className="w-full h-full flex flex-col items-center justify-center bg-card border border-border/50">
                <Smartphone className="w-20 h-20 text-primary/40 mb-4" />
                <p className="text-muted-foreground text-center px-4">
                  AR Experience Preview
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
