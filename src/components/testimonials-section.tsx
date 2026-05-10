'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Plant Enthusiast',
    content:
      'The AR experience helped me choose the perfect plants for my living room! The visualization was so accurate, and the plants arrived healthy and beautiful.',
    rating: 5,
    image: '👩',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Home Designer',
    content:
      'As a designer, I appreciate the attention to detail. Every plant I ordered was exactly as shown. The customer service is exceptional!',
    rating: 5,
    image: '👨',
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Urban Gardener',
    content:
      'Best nursery experience online! Great variety, competitive prices, and the care guides are incredibly helpful for beginners like me.',
    rating: 4,
    image: '👩‍🌾',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by Plant Lovers
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our customers have to say
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-background border border-border hover:border-accent/50 transition-all"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-accent/50 mb-4" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                {testimonial.content}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-border pt-4">
                <span className="text-3xl">{testimonial.image}</span>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
