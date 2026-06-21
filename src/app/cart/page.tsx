'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useShop } from '@/lib/shop-context'

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotal, clearCart } = useShop()

  const subtotal = cartSubtotal
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-serif font-bold text-[#0d592f] mb-2 flex items-center gap-3">
              <ShoppingCart size={32} />
              Shopping Cart
            </h1>
            <p className="text-xs text-muted-foreground font-light">
              You have {cart.length} item(s) in your cart
            </p>
          </motion.div>

          {cart.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Cart Items */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 space-y-4"
              >
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedSize}`}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 p-5 rounded-3xl border border-border bg-card hover:border-[#0d592f]/35 transition-all items-center justify-between"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-muted/40 shadow-sm border border-neutral-100">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-1 ml-2">
                        <h3 className="font-serif font-bold text-foreground text-base leading-tight">
                          {item.product.name}
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wide">
                          Size: {item.selectedSize}
                        </p>
                        <p className="text-sm font-semibold text-[#0d592f]">
                          ₹{item.product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 border border-border/80 rounded-full px-2 py-1 bg-background shadow-sm flex-shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="p-1 hover:bg-muted rounded-full transition-colors cursor-pointer text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="p-1 hover:bg-muted rounded-full transition-colors cursor-pointer text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="p-2.5 hover:bg-destructive/10 rounded-full transition-colors cursor-pointer flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <Link href="/products" className="inline-flex items-center text-xs font-semibold text-[#0d592f] hover:underline cursor-pointer">
                    <ArrowRight size={14} className="mr-1.5 rotate-180" />
                    <span>Continue Shopping</span>
                  </Link>
                  
                  <button
                    onClick={clearCart}
                    className="ml-auto text-xs text-neutral-400 hover:text-destructive cursor-pointer font-light transition-colors"
                  >
                    Clear Shopping Cart
                  </button>
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="h-fit sticky top-24"
              >
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                  <h2 className="font-serif font-bold text-foreground text-lg mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-4 pb-4 border-b border-border/60 text-xs font-light">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Nursery Tax (10%)</span>
                      <span className="font-medium text-foreground">₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span className="font-medium text-accent font-semibold">FREE</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-foreground">Order Total</span>
                    <span className="text-2xl font-serif font-bold text-[#0d592f]">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>

                  <Button size="lg" className="w-full bg-[#023512] hover:bg-[#023512]/90 text-white rounded-full font-semibold cursor-pointer shadow-sm mb-3">
                    Proceed to Checkout
                  </Button>

                  <Link href="/products" className="block w-full">
                    <Button size="lg" variant="outline" className="w-full rounded-full border-border hover:bg-muted text-foreground cursor-pointer">
                      Browse More Specimens
                    </Button>
                  </Link>

                  {/* Note */}
                  <div className="mt-6 p-4 bg-[#daf5e3]/20 border border-[#0d592f]/10 rounded-2xl">
                    <p className="text-[10px] text-neutral-600 leading-normal font-light">
                      <span className="font-semibold text-foreground">Payment Notice:</span> This is a demonstration sandbox check. No credit/debit charges will be made.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            /* Empty Cart View */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-card border border-border/80 rounded-3xl"
            >
              <ShoppingCart size={48} className="mx-auto mb-4 text-neutral-300" />
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                Your cart is empty
              </h2>
              <p className="text-sm text-muted-foreground font-light mb-6">
                Add some plants to bring life and fresh air to your home!
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-[#023512] hover:bg-[#023512]/90 text-white rounded-full font-semibold cursor-pointer shadow-sm">
                  <ArrowRight size={14} className="mr-2 rotate-180" />
                  Explore Specimens Catalog
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
