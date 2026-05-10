import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { motion } from 'framer-motion'
import { Heart, Users, Leaf, Target } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'We practice eco-friendly growing methods and sustainable packaging',
    },
    {
      icon: Heart,
      title: 'Quality',
      description: 'Every plant is carefully nurtured and inspected before delivery',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We foster a community of plant lovers sharing knowledge and passion',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Embracing AR technology to revolutionize plant shopping experience',
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="py-20 md:py-32 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                About Susmita Nursery
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We&apos;re passionate about bringing the beauty of nature into every
                home. Founded in 2015, Susmita Nursery has grown to become a
                trusted source for premium plants and gardening expertise.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Our Story
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  What started as a small neighborhood nursery in the heart of the
                  city has blossomed into a thriving online plant marketplace. Our
                  founder, a passionate plant enthusiast, dreamed of making premium
                  plants accessible to everyone.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Today, we serve thousands of happy customers across the region,
                  providing not just plants, but a complete ecosystem of care guides,
                  expert advice, and community support.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  With the introduction of AR technology, we&apos;ve revolutionized how
                  people shop for plants, allowing them to visualize their purchases
                  before buying.
                </p>
              </div>

              <div className="h-96 bg-card border border-border rounded-2xl flex items-center justify-center">
                <span className="text-9xl">🌱</span>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Our Values
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 border-t border-border bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold mb-2">10K+</p>
                <p className="text-sm opacity-90">Happy Customers</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">500+</p>
                <p className="text-sm opacity-90">Plant Varieties</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">50K+</p>
                <p className="text-sm opacity-90">Plants Delivered</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">9.8★</p>
                <p className="text-sm opacity-90">Average Rating</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
