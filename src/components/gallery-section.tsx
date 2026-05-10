'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const galleryImages = [
  { id: 1, image: '/images/plants/monstera-plant.jpg', title: 'Monstera Deliciosa' },
  { id: 2, image: '/images/plants/rose-flowers.jpg', title: 'Rose Flowers' },
  { id: 3, image: '/images/plants/orchid-flower.jpg', title: 'Orchid' },
  { id: 4, image: '/images/plants/tulips-bouquet.jpg', title: 'Tulips' },
  { id: 5, image: '/images/plants/lavender-plant.jpg', title: 'Lavender' },
  { id: 6, image: '/images/plants/sunflower-garden.jpg', title: 'Sunflowers' },
]

export function GallerySection() {
  return (
    <section className="py-16 md:py-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Plant Collection
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our diverse selection
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group relative h-48 md:h-56 rounded-2xl overflow-hidden cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:brightness-75 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-4">
                <h3 className="text-lg font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
