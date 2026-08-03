'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export interface OrderResponse {
  success: boolean
  error?: string
  data?: unknown
}

/**
 * Fetch orders and associated line items for dashboard management
 */
export async function getOrdersAction(): Promise<OrderResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          price,
          size,
          products ( name, image, category )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: orders }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error fetching orders'
    return { success: false, error: errorMsg }
  }
}

/**
 * Update an order's status (processing, ready_for_pickup, fulfilled, cancelled)
 * This triggers automatic stock and reservation updates in Supabase PostgreSQL database
 */
export async function updateOrderStatusAction(
  orderId: string,
  orderStatus: 'processing' | 'ready_for_pickup' | 'fulfilled' | 'cancelled'
): Promise<OrderResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from('orders')
      .update({ order_status: orderStatus })
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error updating order status'
    return { success: false, error: errorMsg }
  }
}

/**
 * Log or create a new reservation order
 */
export async function createOrderAction(orderInput: {
  id?: string
  customer_name: string
  phone: string
  email?: string
  address?: string
  amount: number
  notes?: string
  items: Array<{ product_id: string; quantity: number; price: number; size: string }>
}): Promise<OrderResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    const customerId = user ? user.id : null

    const orderId = orderInput.id || `SN-RES-${Math.floor(10000 + Math.random() * 90000)}`

    // Insert order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          id: orderId,
          customer_id: customerId,
          customer_name: orderInput.customer_name,
          phone: orderInput.phone,
          email: orderInput.email || null,
          address: orderInput.address || null,
          amount: orderInput.amount,
          notes: orderInput.notes || null,
          order_status: 'processing',
          payment_status: 'pending',
        },
      ])
      .select()
      .single()

    if (orderError || !order) {
      return { success: false, error: orderError?.message || 'Failed to record reservation order.' }
    }

    // Insert line items
    const lineItemsPayload = orderInput.items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(lineItemsPayload)

    if (itemsError) {
      return { success: false, error: itemsError.message }
    }

    return { success: true, data: order }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error creating order'
    return { success: false, error: errorMsg }
  }
}
