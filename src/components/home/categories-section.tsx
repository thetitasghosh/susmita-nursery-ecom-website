"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    id: 1,
    name: "Indoor Plants",
    description: "Breathe life into your rooms and office spaces",
    image: "/images/plants/monstera-plant.jpg",
  },
  {
    id: 2,
    name: "Flowering Plants",
    description: "Vibrant colors, delicate blooms, and sweet fragrance",
    image: "/images/plants/rose-flowers.jpg",
  },
  {
    id: 3,
    name: "Outdoor Trees",
    description: "Stately and ornamental trees to grace your garden",
    image: "/images/plants/bonsai-tree.jpg",
  },
  {
    id: 4,
    name: "Succulents",
    description: "Hardy desert natives requiring minimal care",
    image: "/images/plants/succulent-collection.jpg",
  },
  {
    id: 5,
    name: "Air Purifying",
    description: "Natural filters to clear airborne toxins",
    image: "/images/plants/peace-lily.jpg",
  },
  {
    id: 6,
    name: "Sun Lovers",
    description: "Sturdy varieties that flourish under full sun",
    image: "/images/plants/sunflower-garden.jpg",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Curated Categories
          </h2>
          <div className="h-1 w-16 bg-accent mx-auto rounded-full mb-4" />
          <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
            Find the perfect specimens raised by our master growers to
            complement your living spaces.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="relative overflow-hidden rounded-3xl aspect-[4/3] cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/categories/${category.id}`}>
                  <div className="relative w-full h-full group">
                    {/* Image Cover */}
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />

                    {/* Card Content Overlay */}
                    <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end text-white">
                      <span className="text-[10px] font-bold tracking-wider text-accent uppercase mb-1.5 bg-accent/20 backdrop-blur-md px-2.5 py-0.5 rounded-full w-max">
                        Explore Collection
                      </span>
                      <h3 className="text-2xl font-semibold font-serif mb-2 text-white">
                        {category.name}
                      </h3>
                      <p className="text-xs text-neutral-300 font-light max-w-[90%] leading-relaxed line-clamp-2">
                        {category.description}
                      </p>

                      {/* Interactive Trigger link */}
                      <div className="mt-4 flex items-center text-xs font-semibold text-accent group-hover:translate-x-1 transition-transform">
                        Explore Range <span className="ml-1">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
