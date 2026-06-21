'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from './products'

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
}

interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
}

interface ShopContextType {
  cart: CartItem[]
  wishlist: number[] // Product IDs
  toasts: ToastMessage[]
  addToCart: (product: Product, quantity?: number, size?: string) => void
  removeFromCart: (productId: number, selectedSize: string) => void
  updateCartQuantity: (productId: number, selectedSize: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (productId: number) => void
  isWishlisted: (productId: number) => boolean
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void
  removeToast: (id: string) => void
  cartCount: number
  cartSubtotal: number
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Load cart and wishlist from localStorage on mount (hydration safe)
  useEffect(() => {
    setIsMounted(true)
    const storedCart = localStorage.getItem('susmita_nursery_cart')
    const storedWishlist = localStorage.getItem('susmita_nursery_wishlist')

    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart))
      } catch (e) {
        console.error('Failed to parse cart data', e)
      }
    }
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist))
      } catch (e) {
        console.error('Failed to parse wishlist data', e)
      }
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('susmita_nursery_cart', JSON.stringify(cart))
    }
  }, [cart, isMounted])

  // Save wishlist to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('susmita_nursery_wishlist', JSON.stringify(wishlist))
    }
  }, [wishlist, isMounted])

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const addToCart = (product: Product, quantity = 1, size?: string) => {
    const chosenSize = size || product.sizes[0] || 'Standard'
    
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === chosenSize
      )

      if (existingIndex > -1) {
        const updatedCart = [...prevCart]
        updatedCart[existingIndex].quantity += quantity
        addToast(`Increased ${product.name} (${chosenSize}) quantity to ${updatedCart[existingIndex].quantity}.`, 'success')
        return updatedCart
      } else {
        addToast(`Added ${product.name} (${chosenSize}) to cart!`, 'success')
        return [...prevCart, { product, quantity, selectedSize: chosenSize }]
      }
    })
  }

  const removeFromCart = (productId: number, selectedSize: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.product.id === productId && i.selectedSize === selectedSize)
      if (item) {
        addToast(`Removed ${item.product.name} (${selectedSize}) from cart.`, 'info')
      }
      return prevCart.filter((i) => !(i.product.id === productId && i.selectedSize === selectedSize))
    })
  }

  const updateCartQuantity = (productId: number, selectedSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    addToast('Cleared shopping cart.', 'info')
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((prevWishlist) => {
      const isAlreadyWishlisted = prevWishlist.includes(productId)
      if (isAlreadyWishlisted) {
        addToast('Removed from wishlist.', 'info')
        return prevWishlist.filter((id) => id !== productId)
      } else {
        addToast('Added to wishlist!', 'success')
        return [...prevWishlist, productId]
      }
    })
  }

  const isWishlisted = (productId: number) => {
    return wishlist.includes(productId)
  }

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        toasts,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        addToast,
        removeToast,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}

      {/* Elegant floating Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg flex items-center justify-between border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 ${
              toast.type === 'success'
                ? 'bg-primary/95 text-primary-foreground border-primary/20'
                : toast.type === 'error'
                ? 'bg-destructive/95 text-destructive-foreground border-destructive/20'
                : 'bg-card/95 text-foreground border-border'
            }`}
          >
            <div className="text-sm font-medium mr-4">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-xs font-bold opacity-70 hover:opacity-100 p-1 cursor-pointer transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ShopContext.Provider>
  )
}

export function useShop() {
  const context = useContext(ShopContext)
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider')
  }
  return context
}
