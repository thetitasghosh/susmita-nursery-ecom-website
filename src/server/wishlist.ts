'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export interface WishlistResponse {
  success: boolean
  error?: string
  data?: string[]
}

/**
 * Fetch all product IDs in the wishlist for the authenticated user
 */
export async function getWishlistAction(): Promise<WishlistResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('profile_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    const productIds = data.map((item) => String(item.product_id))
    return { success: true, data: productIds }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching wishlist'
    return { success: false, error: errorMsg }
  }
}

/**
 * Add or remove a product from the authenticated user's wishlist
 */
export async function toggleWishlistAction(productId: string): Promise<WishlistResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if it already exists
    const { data: existing, error: checkError } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('profile_id', user.id)
      .eq('product_id', productId)
      .maybeSingle()

    if (checkError) {
      return { success: false, error: checkError.message }
    }

    if (existing) {
      // Remove
      const { error: deleteError } = await supabase
        .from('wishlist')
        .delete()
        .eq('profile_id', user.id)
        .eq('product_id', productId)

      if (deleteError) {
        return { success: false, error: deleteError.message }
      }
    } else {
      // Insert
      const { error: insertError } = await supabase
        .from('wishlist')
        .insert({ profile_id: user.id, product_id: productId })

      if (insertError) {
        return { success: false, error: insertError.message }
      }
    }

    // Return the updated list
    return getWishlistAction()
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error toggling wishlist'
    return { success: false, error: errorMsg }
  }
}

/**
 * Merge local guest wishlist items into database upon login
 */
export async function syncWishlistAction(localProductIds: string[]): Promise<WishlistResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    if (localProductIds.length === 0) {
      return getWishlistAction()
    }

    // Insert all missing ones
    const payload = localProductIds.map((pid) => ({
      profile_id: user.id,
      product_id: pid,
    }))

    const { error } = await supabase
      .from('wishlist')
      .upsert(payload, { onConflict: 'profile_id,product_id' })

    if (error) {
      return { success: false, error: error.message }
    }

    return getWishlistAction()
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error syncing wishlist'
    return { success: false, error: errorMsg }
  }
}
