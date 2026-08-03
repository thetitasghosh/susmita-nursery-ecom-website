import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase credentials missing in env!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function linkOrders() {
  try {
    console.log('Fetching profiles...')
    const { data: profiles, error: profileErr } = await supabase
      .from('profiles')
      .select('id, email, phone')

    if (profileErr || !profiles) {
      console.error('Failed to fetch profiles:', profileErr)
      return
    }

    console.log(`Found ${profiles.length} profiles. Fetching orders without customer_id...`)
    const { data: orders, error: orderErr } = await supabase
      .from('orders')
      .select('id, email, phone')
      .is('customer_id', null)

    if (orderErr || !orders) {
      console.error('Failed to fetch orders:', orderErr)
      return
    }

    console.log(`Found ${orders.length} unlinked orders. Linking...`)

    let linkedCount = 0
    for (const order of orders) {
      // Find matching profile
      const match = profiles.find(
        (p) =>
          (order.email && p.email && order.email.toLowerCase() === p.email.toLowerCase()) ||
          (order.phone && p.phone && order.phone.replace(/[^0-9]/g, '') === p.phone.replace(/[^0-9]/g, ''))
      )

      if (match) {
        console.log(`Linking order ${order.id} to profile ${match.email} (${match.id})`)
        const { error: updateErr } = await supabase
          .from('orders')
          .update({ customer_id: match.id })
          .eq('id', order.id)

        if (updateErr) {
          console.error(`Failed to link order ${order.id}:`, updateErr.message)
        } else {
          linkedCount++
        }
      }
    }

    console.log(`Successfully linked ${linkedCount} orders to profiles!`)
  } catch (err) {
    console.error('Error linking orders:', err)
  }
}

linkOrders()
