'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const mockCartItems = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    price: 49.99,
    quantity: 1,
    image: '🌿',
  },
  {
    id: 2,
    name: 'Peace Lily',
    price: 34.99,
    quantity: 2,
    image: '🌱',
  },
]

export default function CartPage() {
  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <ShoppingCart size={32} className="text-primary" />
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              You have {mockCartItems.length} item(s) in your cart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="space-y-4">
                {mockCartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-6 rounded-lg border border-border bg-card hover:border-accent/50 transition-all"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-5xl">{item.image}</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.name}
                      </h3>
                      <p className="text-2xl font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Minus size={18} className="text-foreground" />
                      </button>
                      <span className="w-8 text-center font-semibold text-foreground">
                        {item.quantity}
                      </span>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Plus size={18} className="text-foreground" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors self-start">
                      <Trash2 size={18} className="text-destructive" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <Link href="/products" className="mt-6 inline-flex items-center text-primary hover:gap-2 transition-all">
                <span>Continue Shopping</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="h-fit sticky top-20"
            >
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-bold text-foreground text-lg mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 mb-3">
                  Proceed to Checkout
                </Button>

                <Button size="lg" variant="outline" className="w-full">
                  Continue Shopping
                </Button>

                {/* Note */}
                <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Note:</span> This is a demo cart. No actual purchases will be made.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
