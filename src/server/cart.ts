'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { Product } from '@/lib/products'
import { CartItem } from '@/lib/shop-context'

export interface CartResponse {
  success: boolean
  error?: string
  data?: CartItem[]
}

/**
 * Fetch all cart items for the authenticated user
 */
export async function getCartAction(): Promise<CartResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('cart')
      .select('quantity, selected_size, product:products (*)')
      .eq('profile_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    const cartItems: CartItem[] = (data || []).map((item: any) => ({
      product: item.product as Product,
      quantity: item.quantity,
      selectedSize: item.selected_size,
    })).filter(item => item.product !== null)

    return { success: true, data: cartItems }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching cart'
    return { success: false, error: errorMsg }
  }
}

/**
 * Add or update item quantity in the cart
 */
export async function addToCartAction(productId: string, quantity: number, selectedSize: string): Promise<CartResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if it already exists
    const { data: existing, error: checkError } = await supabase
      .from('cart')
      .select('quantity')
      .eq('profile_id', user.id)
      .eq('product_id', productId)
      .eq('selected_size', selectedSize)
      .maybeSingle()

    if (checkError) {
      return { success: false, error: checkError.message }
    }

    if (existing) {
      // Update quantity
      const { error: updateError } = await supabase
        .from('cart')
        .update({ quantity: existing.quantity + quantity })
        .eq('profile_id', user.id)
        .eq('product_id', productId)
        .eq('selected_size', selectedSize)

      if (updateError) {
        return { success: false, error: updateError.message }
      }
    } else {
      // Insert
      const { error: insertError } = await supabase
        .from('cart')
        .insert({
          profile_id: user.id,
          product_id: productId,
          selected_size: selectedSize,
          quantity: quantity,
        })

      if (insertError) {
        return { success: false, error: insertError.message }
      }
    }

    return getCartAction()
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error adding to cart'
    return { success: false, error: errorMsg }
  }
}

/**
 * Remove an item from the cart
 */
export async function removeFromCartAction(productId: string, selectedSize: string): Promise<CartResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('profile_id', user.id)
      .eq('product_id', productId)
      .eq('selected_size', selectedSize)

    if (error) {
      return { success: false, error: error.message }
    }

    return getCartAction()
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error removing from cart'
    return { success: false, error: errorMsg }
  }
}

/**
 * Update an item's quantity in the cart
 */
export async function updateCartQuantityAction(productId: string, selectedSize: string, quantity: number): Promise<CartResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    if (quantity <= 0) {
      return removeFromCartAction(productId, selectedSize)
    }

    const { error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('profile_id', user.id)
      .eq('product_id', productId)
      .eq('selected_size', selectedSize)

    if (error) {
      return { success: false, error: error.message }
    }

    return getCartAction()
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error updating cart quantity'
    return { success: false, error: errorMsg }
  }
}

/**
 * Clear all items in the user's cart
 */
export async function clearCartAction(): Promise<CartResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('profile_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: [] }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error clearing cart'
    return { success: false, error: errorMsg }
  }
}

/**
 * Merge local guest cart items into database upon login
 */
export async function syncCartAction(localCart: Array<{ productId: string; quantity: number; selectedSize: string }>): Promise<CartResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    if (localCart.length === 0) {
      return getCartAction()
    }

    for (const item of localCart) {
      const { data: existing } = await supabase
        .from('cart')
        .select('quantity')
        .eq('profile_id', user.id)
        .eq('product_id', item.productId)
        .eq('selected_size', item.selectedSize)
        .maybeSingle()

      if (existing) {
        await supabase
          .from('cart')
          .update({ quantity: existing.quantity + item.quantity })
          .eq('profile_id', user.id)
          .eq('product_id', item.productId)
          .eq('selected_size', item.selectedSize)
      } else {
        await supabase
          .from('cart')
          .insert({
            profile_id: user.id,
            product_id: item.productId,
            selected_size: item.selectedSize,
            quantity: item.quantity,
          })
      }
    }

    return getCartAction()
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error syncing cart'
    return { success: false, error: errorMsg }
  }
}
