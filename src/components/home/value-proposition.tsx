'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Leaf, Heart, Award, ShieldCheck } from 'lucide-react'

export function ValueProposition() {
  const points = [
    {
      icon: <Award className="w-5 h-5 text-primary" />,
      title: 'Generational Knowledge',
      desc: 'Raising plant varieties using over 40 years of Nadia family farming methods.',
    },
    {
      icon: <Leaf className="w-5 h-5 text-primary" />,
      title: 'Premium Potting Mixes',
      desc: 'Specially aerated, nutrition-rich compost mixes ensuring strong root structure.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      title: 'Safe Transit Guarantee',
      desc: 'Custom-fitted breathable cardboard structures protecting stems during transit.',
    },
    {
      icon: <Heart className="w-5 h-5 text-primary" />,
      title: 'Expert Support System',
      desc: 'Direct access to chat with horticultural experts to troubleshoot care cycles.',
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-background border-t border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Curved Mask Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-[400px] sm:h-[500px] w-full"
          >
            {/* Curved mask container */}
            <div className="relative w-full h-full rounded-[40px_10px_40px_10px] sm:rounded-[60px_15px_60px_15px] overflow-hidden border-2 border-primary/10 shadow-xl group">
              <Image
                src="/images/seedling-hands.jpg"
                alt="Seedling handling hands"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Subtle green overlay */}
              <div className="absolute inset-0 bg-primary/10 group-hover:opacity-0 transition-opacity duration-500" />
            </div>
            
            {/* Decorative leaf shadows or dots */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/10 rounded-full blur-xl z-0" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-xl z-0" />
          </motion.div>

          {/* Right Column: Text & Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-sans font-bold tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase block w-max">
                Our Promise
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                Rooted in Quality.<br />Dedicated to You.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-lg">
                Instead of simple transactions, we invite you to <span className="font-semibold text-primary">&quot;Bring Nature Home&quot;</span> with specimens built for longevity and guided by expert care.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {points.map((point, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5 text-primary">
                    {point.icon}
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-sm text-foreground mb-1">
                      {point.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-light">
                      {point.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
