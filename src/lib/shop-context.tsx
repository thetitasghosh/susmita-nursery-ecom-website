'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from './products'
import { getAccountAction, signoutAction } from '@/server/auth'
import { toggleWishlistAction, syncWishlistAction } from '@/server/wishlist'
import {
  getCartAction,
  addToCartAction,
  removeFromCartAction,
  updateCartQuantityAction,
  clearCartAction,
  syncCartAction,
} from '@/server/cart'

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
  wishlist: string[] // Product IDs
  toasts: ToastMessage[]
  addToCart: (product: Product, quantity?: number, size?: string) => void
  removeFromCart: (productId: string, selectedSize: string) => void
  updateCartQuantity: (productId: string, selectedSize: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void
  removeToast: (id: string) => void
  cartCount: number
  cartSubtotal: number
  
  // Auth additions
  user: Record<string, unknown> | null
  profile: Record<string, unknown> | null
  isLoadingUser: boolean
  isLoginModalOpen: boolean
  openLoginModal: () => void
  closeLoginModal: () => void
  logoutUser: () => Promise<void>
  refreshSession: () => Promise<void>
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Auth States
  const [user, setUser] = useState<Record<string, unknown> | null>(null)
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const refreshSession = async () => {
    setIsLoadingUser(true)
    try {
      const res = await getAccountAction()
      if (res.success && res.user) {
        setUser(res.user)
        setProfile(res.profile || null)

        // Sync local guest wishlist to DB
        const localWishlistStr = localStorage.getItem('susmita_nursery_wishlist')
        let localIds: string[] = []
        if (localWishlistStr) {
          try {
            localIds = JSON.parse(localWishlistStr)
          } catch {}
        }

        const wlRes = await syncWishlistAction(localIds)
        if (wlRes.success && wlRes.data) {
          setWishlist(wlRes.data)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
    } catch (e) {
      console.error('Failed to restore user session', e)
    } finally {
      setIsLoadingUser(false)
    }
  }

  // Load wishlist and session on mount (hydration safe)
  useEffect(() => {
    setIsMounted(true)
    const storedWishlist = localStorage.getItem('susmita_nursery_wishlist')

    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist))
      } catch (e) {
        console.error('Failed to parse wishlist data', e)
      }
    }

    refreshSession()
  }, [])

  // Load/Sync cart based on auth state
  useEffect(() => {
    if (!isMounted || isLoadingUser) return

    const loadAndSyncCart = async () => {
      if (user) {
        // Logged in: first collect any guest items in local storage
        const guestCartKeys = ['susmita_nursery_cart_guest', 'susmita_nursery_cart']
        let guestCart: CartItem[] = []

        for (const key of guestCartKeys) {
          const storedGuestCart = localStorage.getItem(key)
          if (storedGuestCart) {
            try {
              const items: CartItem[] = JSON.parse(storedGuestCart)
              if (items.length > 0) {
                guestCart = [...guestCart, ...items]
              }
            } catch (e) {
              console.error(`Failed to parse guest cart from key ${key} for merging`, e)
            }
            localStorage.removeItem(key)
          }
        }

        if (guestCart.length > 0) {
          // Sync guest items to database
          const localPayload = guestCart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize
          }))
          const syncRes = await syncCartAction(localPayload)
          if (syncRes.success && syncRes.data) {
            setCart(syncRes.data)
            return
          }
        }

        // Otherwise, just fetch the user's database cart
        const cartRes = await getCartAction()
        if (cartRes.success && cartRes.data) {
          setCart(cartRes.data)
        }
      } else {
        // Guest: load from local storage guest key (with legacy fallback)
        const userCartKey = 'susmita_nursery_cart_guest'
        let storedUserCart = localStorage.getItem(userCartKey)

        if (!storedUserCart) {
          storedUserCart = localStorage.getItem('susmita_nursery_cart')
        }

        let userCart: CartItem[] = []
        if (storedUserCart) {
          try {
            userCart = JSON.parse(storedUserCart)
          } catch (e) {
            console.error('Failed to parse user cart data', e)
          }
        }
        setCart(userCart)
      }
    }

    loadAndSyncCart()
  }, [user, isLoadingUser, isMounted])

  // Save guest cart to localStorage
  useEffect(() => {
    if (isMounted && !isLoadingUser && !user) {
      localStorage.setItem('susmita_nursery_cart_guest', JSON.stringify(cart))
    }
  }, [cart, user, isLoadingUser, isMounted])

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

  const addToCart = async (product: Product, quantity = 1, size?: string) => {
    const chosenSize = size || product.sizes[0] || 'Standard'
    
    if (user) {
      try {
        const res = await addToCartAction(product.id, quantity, chosenSize)
        if (res.success && res.data) {
          setCart(res.data)
          addToast(`Added/Updated ${product.name} (${chosenSize}) in your database cart!`, 'success')
        }
      } catch (err) {
        console.error('Failed to add to database cart:', err)
        addToast('Failed to add to database cart.', 'error')
      }
    } else {
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
  }

  const removeFromCart = async (productId: string, selectedSize: string) => {
    if (user) {
      try {
        const res = await removeFromCartAction(productId, selectedSize)
        if (res.success && res.data) {
          setCart(res.data)
          addToast(`Removed item from database cart.`, 'info')
        }
      } catch (err) {
        console.error('Failed to remove from database cart:', err)
      }
    } else {
      setCart((prevCart) => {
        const item = prevCart.find((i) => i.product.id === productId && i.selectedSize === selectedSize)
        if (item) {
          addToast(`Removed ${item.product.name} (${selectedSize}) from cart.`, 'info')
        }
        return prevCart.filter((i) => !(i.product.id === productId && i.selectedSize === selectedSize))
      })
    }
  }

  const updateCartQuantity = async (productId: string, selectedSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize)
      return
    }

    if (user) {
      try {
        const res = await updateCartQuantityAction(productId, selectedSize, quantity)
        if (res.success && res.data) {
          setCart(res.data)
        }
      } catch (err) {
        console.error('Failed to update database cart quantity:', err)
      }
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId && item.selectedSize === selectedSize
            ? { ...item, quantity }
            : item
        )
      )
    }
  }

  const clearCart = async () => {
    if (user) {
      try {
        const res = await clearCartAction()
        if (res.success && res.data) {
          setCart(res.data)
          addToast('Cleared database shopping cart.', 'info')
        }
      } catch (err) {
        console.error('Failed to clear database cart:', err)
      }
    } else {
      setCart([])
      addToast('Cleared shopping cart.', 'info')
    }
  }

  const toggleWishlist = async (productId: string) => {
    // Optimistic Update
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

    if (user) {
      try {
        const res = await toggleWishlistAction(productId)
        if (res.success && res.data) {
          setWishlist(res.data)
        }
      } catch (err) {
        console.error('Failed to update database wishlist:', err)
      }
    }
  }

  const isWishlisted = (productId: string) => {
    return wishlist.includes(productId)
  }

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)

  const logoutUser = async () => {
    try {
      await signoutAction()
      setUser(null)
      setProfile(null)
      addToast('Logged out successfully.', 'info')
    } catch {
      addToast('Failed to log out.', 'error')
    }
  }

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
        user,
        profile,
        isLoadingUser,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        logoutUser,
        refreshSession,
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
