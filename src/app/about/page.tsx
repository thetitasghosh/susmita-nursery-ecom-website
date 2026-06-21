'use client'

import React from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutPage() {
  const values = [
    {
      image: '/images/plants/peace-lily.jpg',
      title: 'Sustainability First',
      description: 'We prioritize organic compost mixes, biodegradable packaging, and micro-drip water conservation systems throughout our growing tunnels.',
    },
    {
      image: '/images/plants/monstera-plant.jpg',
      title: 'Botanical Quality',
      description: 'Every plant is slow-grown under expert guidance and undergoes meticulous root and leaf wellness checks before being shipped.',
    },
    {
      image: '/images/plants/succulent-collection.jpg',
      title: 'Community Growth',
      description: 'We believe plant care is a wellness journey. We offer educational resources and nursery workshops to support home gardeners.',
    },
    {
      image: '/images/plants/bonsai-tree.jpg',
      title: 'Digital Innovation',
      description: 'By pairing traditional propagation techniques with our interactive AR room-fitting tools, we bridge the gap between nature and tech.',
    },
  ]

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1">
        {/* Page Header */}
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#daf5e3]/30 via-transparent to-transparent border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <span className="text-xs uppercase tracking-wider text-accent font-semibold mb-3 block">Our Heritage</span>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#0d592f] mb-6">
                Cultivating Green Sanctuary
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">
                Founded with a mission to bring high-quality, sustainably grown flora to plant lovers, Susmita Nursery merges expert horticultural practice with modern digital convenience.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <span className="text-xs uppercase tracking-wider text-accent font-semibold">The Journey</span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                  From a Propagation Shed to a Modern Sanctuary
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light">
                  Our journey began in 2015 as a modest local propagation greenhouse outside Kolkata. Focused initially on supplying healthy rootstock and native shrubs to local horticulturists, we quickly earned a reputation for raising unusually resilient specimens.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light">
                  Over the years, we expanded into custom substrate formulations, fiber planter crafting, and rare foliage acclimatization. By keeping the growing process local and biological, we ensure every plant has the microbial foundation it needs to thrive in a home environment.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light">
                  Today, we leverage augmented reality to help you visualize exactly how a specimen will integrate into your decor, ensuring a seamless styling experience from our greenhouses to your living room.
                </p>
              </motion.div>

              {/* Styled Garden Graphic Card instead of text emoji placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-[350px] sm:h-[450px] rounded-3xl overflow-hidden shadow-lg border border-border/80 group"
              >
                <Image
                  src="/images/hero-garden.jpg"
                  alt="Susmita Nursery greenhouse farm"
                  fill
                  sizes="(max-w-1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20 text-white">
                  <span className="text-xs text-accent uppercase tracking-wider font-semibold">Propagation Greenhouse</span>
                  <p className="text-lg font-serif font-medium mt-1">Our Nadia Botanical Facility</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0d592f] mb-3">
                Core Botanical Values
              </h2>
              <div className="h-1 w-12 bg-accent mx-auto rounded-full mb-3" />
              <p className="text-sm text-muted-foreground max-w-sm mx-auto font-light">
                Our operations are guided by a dedication to plant longevity and environmental stewardship.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((val, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-8 rounded-3xl bg-card border border-border/80 shadow-sm hover:border-[#0d592f]/30 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start"
                  >
                    {/* Plant image thumbnail replaces generic Lucide icons */}
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative shadow-sm border border-neutral-100">
                      <Image
                        src={val.image}
                        alt={val.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold font-serif text-foreground">
                        {val.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-light">
                        {val.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Clean, Non-AI-Generated Stats Section */}
        <section className="py-16 bg-[#023512] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl sm:text-5xl font-serif font-bold text-accent mb-2">12K+</p>
                <p className="text-xs uppercase tracking-wider text-neutral-300 font-light">Happy Cultivators</p>
              </div>
              <div>
                <p className="text-4xl sm:text-5xl font-serif font-bold text-accent mb-2">400+</p>
                <p className="text-xs uppercase tracking-wider text-neutral-300 font-light">Foliage Species</p>
              </div>
              <div>
                <p className="text-4xl sm:text-5xl font-serif font-bold text-accent mb-2">60K+</p>
                <p className="text-xs uppercase tracking-wider text-neutral-300 font-light">Plants Propagated</p>
              </div>
              <div>
                <p className="text-4xl sm:text-5xl font-serif font-bold text-accent mb-2">4.9★</p>
                <p className="text-xs uppercase tracking-wider text-neutral-300 font-light">Nursery Rating</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
