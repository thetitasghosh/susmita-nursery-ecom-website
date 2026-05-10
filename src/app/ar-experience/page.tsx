'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Camera, Smartphone, Download, } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ARExperiencePage() {
  const [selectedPlant, setSelectedPlant] = useState(0)

  const plants = [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      emoji: '🌿',
      color: 'from-primary to-primary/60',
      description: 'View in your living room with real-time AR visualization',
    },
    {
      id: 2,
      name: 'Fiddle Leaf Fig',
      emoji: '🍃',
      color: 'from-accent to-accent/60',
      description: 'See how it fits in your space',
    },
    {
      id: 3,
      name: 'Snake Plant',
      emoji: '🌾',
      color: 'from-primary/70 to-accent/70',
      description: 'Experiment with different placements',
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-block mb-4 px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold">
                ✨ Augmented Reality
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Visualize Plants in Your Space
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Use your smartphone camera to see how our plants will look in your
                home before you buy. Our AR technology makes shopping for plants
                easier and more fun than ever.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start AR Experience
              </Button>
            </motion.div>
          </div>
        </section>

        {/* AR Demo Section */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* AR Viewer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden border-2 border-border bg-gradient-to-br from-primary/10 to-accent/10"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-9xl block mb-4">{plants[selectedPlant].emoji}</span>
                    <p className="text-muted-foreground">
                      {plants[selectedPlant].name}
                    </p>
                  </div>
                </div>

                {/* Camera Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur px-3 py-2 rounded-lg">
                  <Camera size={16} className="text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Camera Ready
                  </span>
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  How It Works
                </h2>

                <div className="space-y-4 mb-8">
                  {plants.map((plant, index) => (
                    <motion.button
                      key={plant.id}
                      onClick={() => setSelectedPlant(index)}
                      whileHover={{ scale: 1.02 }}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedPlant === index
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {plant.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {plant.description}
                          </p>
                        </div>
                        <span className="text-3xl">{plant.emoji}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <p className="text-sm font-semibold text-foreground flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mr-3">
                      1
                    </span>
                    Allow camera access in your browser
                  </p>
                  <p className="text-sm font-semibold text-foreground flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mr-3">
                      2
                    </span>
                    Point your camera at your space
                  </p>
                  <p className="text-sm font-semibold text-foreground flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mr-3">
                      3
                    </span>
                    Place and visualize the plant
                  </p>
                  <p className="text-sm font-semibold text-foreground flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mr-3">
                      4
                    </span>
                    Add to cart when satisfied
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              AR Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: '📏',
                  title: 'Real-Time Size',
                  description: 'See accurate plant dimensions in your space',
                },
                {
                  icon: '🎨',
                  title: 'Color Matching',
                  description: 'Plants adapt to your room lighting',
                },
                {
                  icon: '📱',
                  title: 'Mobile Friendly',
                  description: 'Works on any smartphone with a camera',
                },
                {
                  icon: '🔄',
                  title: 'Rotate & Move',
                  description: 'Adjust placement and rotation freely',
                },
                {
                  icon: '💾',
                  title: 'Save & Share',
                  description: 'Capture and share your AR visualizations',
                },
                {
                  icon: '🌳',
                  title: 'Multiple Plants',
                  description: 'Visualize different plant combinations',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-background border border-border hover:border-accent/50 transition-all text-center"
                >
                  <p className="text-5xl mb-4">{feature.icon}</p>
                  <h3 className="font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Ready to Experience AR?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Download our app or use your browser to start visualizing plants
                in your space right now.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Launch AR Experience
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download App
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
