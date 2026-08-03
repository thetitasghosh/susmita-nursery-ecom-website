'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { createAdmin } from '@/utils/supabase/admin'

export interface UserResponse {
  success: boolean
  error?: string
  data?: unknown
}

/**
 * Fetch all user profiles for dashboard management
 */
export async function getUsersAction(): Promise<UserResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        *,
        orders (
          id,
          amount,
          order_status,
          created_at
        )
      `)
      .order('joined_date', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: profiles }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching profiles'
    return { success: false, error: errorMsg }
  }
}

/**
 * Update a user profile or role
 */
export async function updateUserProfileAction(
  profileId: string,
  updates: { full_name?: string; phone?: string; role?: 'customer' | 'admin' }
): Promise<UserResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', profileId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error updating profile'
    return { success: false, error: errorMsg }
  }
}

/**
 * Delete a user profile (using service role / admin client)
 */
export async function deleteUserAction(profileId: string): Promise<UserResponse> {
  try {
    const adminSupabase = await createAdmin()
    
    // Delete profile record
    const { error: profileError } = await adminSupabase
      .from('profiles')
      .delete()
      .eq('id', profileId)

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error deleting profile'
    return { success: false, error: errorMsg }
  }
}

/**
 * Fetch addresses for the current user
 */
export async function getAddressesAction(): Promise<UserResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('profile_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: addresses }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching addresses'
    return { success: false, error: errorMsg }
  }
}

/**
 * Add or update an address for the current user
 */
export async function saveAddressAction(addressInput: {
  id?: string
  label: string
  is_default: boolean
  full_name: string
  street: string
  city: string
  state?: string
  pincode: string
  phone: string
}): Promise<UserResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const payload = {
      ...addressInput,
      profile_id: user.id
    }

    // If making this address default, first mark all other user addresses as not default
    if (addressInput.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('profile_id', user.id)
    }

    let result
    if (addressInput.id) {
      result = await supabase
        .from('addresses')
        .update(payload)
        .eq('id', addressInput.id)
        .select()
        .single()
    } else {
      result = await supabase
        .from('addresses')
        .insert([payload])
        .select()
        .single()
    }

    if (result.error) {
      return { success: false, error: result.error.message }
    }

    return { success: true, data: result.data }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error saving address'
    return { success: false, error: errorMsg }
  }
}

/**
 * Delete an address for the current user
 */
export async function deleteAddressAction(addressId: string): Promise<UserResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('profile_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error deleting address'
    return { success: false, error: errorMsg }
  }
}
