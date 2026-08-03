'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, CheckCircle2, X } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useShop } from '@/lib/shop-context'
import { useState, useEffect } from 'react'
import { createOrderAction } from '@/server/order'

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotal, clearCart, profile } = useShop()

  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reservationSuccess, setReservationSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setCustomerName((profile.full_name as string) || '')
      setPhone((profile.phone as string) || '')
      setEmail((profile.email as string) || '')
    }
  }, [profile])

  const subtotal = cartSubtotal
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !phone) return

    setIsSubmitting(true)
    try {
      const itemsPayload = cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        size: item.selectedSize
      }))

      const res = await createOrderAction({
        customer_name: customerName,
        phone: phone,
        email: email || undefined,
        amount: total,
        notes: notes || undefined,
        items: itemsPayload
      })

      if (res.success && res.data) {
        const orderId = (res.data as { id: string }).id
        setReservationSuccess(orderId)
        clearCart()
        setIsReservationModalOpen(false)
      } else {
        alert(res.error || 'Failed to create reservation order.')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred while creating your reservation.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <h1 className="text-4xl font-serif font-bold text-primary mb-2 flex items-center gap-3">
              <ShoppingCart size={32} />
              Shopping Cart
            </h1>
            <p className="text-xs text-muted-foreground font-light">
              {reservationSuccess ? 'Your reservation is confirmed!' : `You have ${cart.length} item(s) in your cart`}
            </p>
          </motion.div>

          {reservationSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-6 bg-card border border-border/80 rounded-3xl max-w-2xl mx-auto shadow-sm space-y-6"
            >
              <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                <CheckCircle2 size={36} className="text-emerald-600 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-foreground">
                  Reservation Confirmed!
                </h2>
                <p className="text-sm text-muted-foreground font-light">
                  Your offline pickup reservation has been successfully registered.
                </p>
              </div>

              <div className="bg-stone-50 border border-neutral-200 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">RESERVATION ID</span>
                  <span className="font-sans font-bold text-emerald-800 tracking-wider text-sm select-all">{reservationSuccess}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-neutral-100 pt-3">
                  <span className="text-neutral-400">PICKUP NAME</span>
                  <span className="font-semibold text-foreground">{customerName}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-neutral-100 pt-3">
                  <span className="text-neutral-400">PHONE NUMBER</span>
                  <span className="font-semibold text-foreground">{phone}</span>
                </div>
              </div>

              <div className="text-xs text-neutral-500 leading-relaxed max-w-md mx-auto font-light">
                Please show this Reservation ID or mention your name/phone to our nursery staff when you visit. Payment will be collected offline at the counter.
              </div>

              <div className="flex gap-4 justify-center pt-2">
                <Link href="/products">
                  <Button size="lg" className="bg-primary-emerald hover:bg-primary-emerald/90 text-white rounded-full font-semibold px-8 cursor-pointer shadow-sm">
                    Browse More Plants
                  </Button>
                </Link>
                <Link href="/account">
                  <Button size="lg" variant="outline" className="border-neutral-200 rounded-full font-semibold px-8 cursor-pointer shadow-sm">
                    View Account Pass
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : cart.length > 0 ? (
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
                      className="flex gap-4 p-5 rounded-3xl border border-border bg-card hover:border-primary/35 transition-all items-center justify-between"
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
                        <p className="text-sm font-semibold text-primary tabular-nums">
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
                        <span className="w-6 text-center text-xs font-semibold text-foreground tabular-nums">
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
                  <Link href="/products" className="inline-flex items-center text-xs font-semibold text-primary hover:underline cursor-pointer">
                    <ArrowLeft size={14} className="mr-1.5" />
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
                      <span className="font-medium text-foreground tabular-nums">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Nursery Tax (10%)</span>
                      <span className="font-medium text-foreground tabular-nums">₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span className="font-medium text-accent font-semibold">FREE</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-foreground">Estimated Total</span>
                    <span className="text-2xl font-sans font-bold text-primary tabular-nums">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>

                  <Button 
                    onClick={() => setIsReservationModalOpen(true)}
                    size="lg" 
                    className="w-full bg-primary-emerald hover:bg-primary-emerald/90 text-white rounded-full font-semibold cursor-pointer shadow-sm mb-3"
                  >
                    Reserve Plants for In-Store Pickup
                  </Button>

                  <Link href="/products" className="block w-full">
                    <Button size="lg" variant="outline" className="w-full rounded-full border-border hover:bg-muted text-foreground cursor-pointer">
                      Browse More Specimens
                    </Button>
                  </Link>

                  {/* Offline Store Pickup Notice */}
                  <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl space-y-1">
                    <p className="text-xs font-bold text-emerald-900">In-Store Offline Pickup Notice</p>
                    <p className="text-[11px] text-emerald-800 leading-normal font-light">
                      Susmita Nursery is an offline store. Submitting this reservation saves your plant selections to your account pass. When visiting our store, simply give your name or phone number to the nursery staff to pick up your plants!
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
                <Button size="lg" className="bg-primary-emerald hover:bg-primary-emerald/90 text-white rounded-full font-semibold cursor-pointer shadow-sm">
                  <ArrowLeft size={14} className="mr-2" />
                  Explore Specimens Catalog
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isReservationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReservationModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-background border border-border w-full max-w-md rounded-3xl p-6 shadow-xl z-10 space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsReservationModalOpen(false)}
                className="absolute right-4 top-4 p-2 text-neutral-400 hover:text-foreground rounded-full hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <h3 className="text-xl font-serif font-bold text-foreground">
                  Confirm In-Store Reservation
                </h3>
                <p className="text-xs text-muted-foreground font-light">
                  Please confirm or enter your pickup details below.
                </p>
              </div>

              <form onSubmit={handleConfirmReservation} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="res-name" className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="res-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter pickup name"
                    className="w-full text-sm bg-card border border-border/80 px-4 py-2.5 rounded-2xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-neutral-400"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="res-phone" className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="res-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter contact number"
                    className="w-full text-sm bg-card border border-border/80 px-4 py-2.5 rounded-2xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-neutral-400"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="res-email" className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Email Address (Optional)
                  </label>
                  <input
                    id="res-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full text-sm bg-card border border-border/80 px-4 py-2.5 rounded-2xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-neutral-400"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="res-notes" className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="res-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g., Special pickup instructions, preferred time"
                    rows={2}
                    className="w-full text-sm bg-card border border-border/80 px-4 py-2.5 rounded-2xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-neutral-400 resize-none"
                  />
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl text-[10px] text-emerald-800 leading-normal font-light">
                  <strong>Notice:</strong> Your reservation will hold selected stock in our inventory. Please collect items within 48 hours.
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsReservationModalOpen(false)}
                    className="flex-1 rounded-full border-border cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary-emerald hover:bg-primary-emerald/90 text-white rounded-full font-semibold cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? 'Reserving...' : 'Confirm'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
