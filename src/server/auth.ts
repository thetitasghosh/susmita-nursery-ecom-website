'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export interface AuthResponse {
  success: boolean
  error?: string
  user?: Record<string, unknown> | null
  profile?: Record<string, unknown> | null
}

/**
 * Log in user using Supabase Auth and verify admin privileges for dashboard
 */
export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' }
  }

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || 'Invalid administrative credentials.',
      }
    }

    // Check user role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    // Enforce admin privileges for dashboard
    if (profile && profile.role !== 'admin') {
      await supabase.auth.signOut()
      return { success: false, error: 'Access denied: Administrative privileges required.' }
    }

    return {
      success: true,
      user: authData.user as unknown as Record<string, unknown>,
      profile: (profile || { role: 'admin', full_name: authData.user.email }) as Record<string, unknown>,
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'An unexpected authentication error occurred.'
    return {
      success: false,
      error: errorMsg,
    }
  }
}

/**
 * Sign up new user with Supabase Auth
 */
export async function signupAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = (formData.get('fullName') as string) || 'Nursery Client'
  const phone = (formData.get('phone') as string) || ''

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' }
  }

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    })

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || 'Failed to create user account.' }
    }

    return {
      success: true,
      user: authData.user as unknown as Record<string, unknown>,
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'An unexpected sign-up error occurred.'
    return {
      success: false,
      error: errorMsg,
    }
  }
}

/**
 * Sign out current authenticated session
 */
export async function signoutAction(): Promise<AuthResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signOut()
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Sign out error'
    return { success: false, error: errorMsg }
  }
}

/**
 * Retrieve currently logged in user and profile
 */
export async function getAccountAction(): Promise<AuthResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'No active session found.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      success: true,
      user: user as unknown as Record<string, unknown>,
      profile: profile as Record<string, unknown> | null,
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Session check error'
    return { success: false, error: errorMsg }
  }
}

/**
 * Log in customer using Supabase Auth (general purpose client login, no admin restriction)
 */
export async function customerLoginAction(data: { email: string; password?: string }): Promise<AuthResponse> {
  const { email, password } = data

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' }
  }

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || 'Invalid credentials.',
      }
    }

    // Check user role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    return {
      success: true,
      user: authData.user as unknown as Record<string, unknown>,
      profile: profile as Record<string, unknown> | null,
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'An unexpected authentication error occurred.'
    return {
      success: false,
      error: errorMsg,
    }
  }
}

/**
 * Sign up customer using Supabase Auth (general purpose client signup)
 */
export async function customerSignupAction(data: {
  email: string
  password?: string
  fullName?: string
  phone?: string
}): Promise<AuthResponse> {
  const { email, password, fullName = 'Nursery Client', phone = '' } = data

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' }
  }

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    })

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || 'Failed to create user account.' }
    }

    return {
      success: true,
      user: authData.user as unknown as Record<string, unknown>,
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'An unexpected sign-up error occurred.'
    return {
      success: false,
      error: errorMsg,
    }
  }
}


