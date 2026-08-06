'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'
import { NurseryNewsletterEmail, NewsletterTemplateType } from '@/components/emails/NurseryNewsletter'
import React from 'react'
import { render } from '@react-email/render'

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key')

interface CampaignPayload {
  templateType: NewsletterTemplateType
  subject: string
  header: string
  body: string
  promoCode?: string
  featuredProductId?: string
}

// Fetch all subscribers (for the admin dashboard)
export async function getSubscribersAction() {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (err: unknown) {
    console.error('Failed to get subscribers:', err)
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch subscribers'
    return { success: false, error: errorMsg }
  }
}

// Get subscription status of an email
export async function getSubscriptionStatusAction(email: string) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from('subscribers')
      .select('is_active')
      .eq('email', email)
      .maybeSingle()
      
    if (error) throw error
    return { success: true, isActive: data ? data.is_active : false }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch status'
    return { success: false, error: errorMsg }
  }
}

// Update subscription status (Opt-out / Opt-in toggle)
export async function updateSubscriptionStatusAction(email: string, isActive: boolean) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // 1. Fetch matching user profile fields if they exist
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, phone')
      .eq('email', email)
      .maybeSingle()

    const upsertPayload: {
      email: string
      is_active: boolean
      profile_id?: string
      full_name?: string
      phone?: string
    } = {
      email,
      is_active: isActive
    }

    if (profile) {
      upsertPayload.profile_id = profile.id
      upsertPayload.full_name = profile.full_name
      upsertPayload.phone = profile.phone
    }

    const { error } = await supabase
      .from('subscribers')
      .upsert(upsertPayload, { onConflict: 'email' })

    if (error) throw error
    return { success: true }
  } catch (err: unknown) {
    console.error('[updateSubscriptionStatusAction Server Error]:', err)
    const errorMsg = err instanceof Error ? err.message : 'Failed to update subscription'
    return { success: false, error: errorMsg }
  }
}

// Send Campaign Action (with mock fallback if Resend API key is not configured)
export async function sendCampaignAction(payload: CampaignPayload) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // 1. Fetch active subscriber email addresses along with personalization names
    const { data: subscribers, error: fetchErr } = await supabase
      .from('subscribers')
      .select('email, full_name')
      .eq('is_active', true)

    if (fetchErr) throw fetchErr
    if (!subscribers || subscribers.length === 0) {
      return { success: true, message: 'No active subscribers found.' }
    }

    // 2. Fetch product details if highlighted
    let featuredProductDetails = undefined
    if (payload.featuredProductId) {
      const { data: product } = await supabase
        .from('products')
        .select('name, price, image, slug')
        .eq('id', payload.featuredProductId)
        .single()

      if (product) {
        featuredProductDetails = {
          name: product.name,
          price: Number(product.price),
          image: product.image,
          slug: product.slug
        }
      }
    }

    // 3. Dispatch emails (Resend batch dispatch caps at 100 emails/request)
    const hasResendKey = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_mock_key'

    if (hasResendKey) {
      const batchSize = 100
      for (let i = 0; i < subscribers.length; i += batchSize) {
        const currentBatch = subscribers.slice(i, i + batchSize)
        
        // Render templates to HTML strings asynchronously before sending
        const batchPayload = []
        for (const sub of currentBatch) {
          const htmlContent = await render(React.createElement(NurseryNewsletterEmail, {
            templateType: payload.templateType,
            subject: payload.subject,
            header: payload.header,
            body: payload.body,
            recipientName: sub.full_name || '',
            promoCode: payload.promoCode,
            featuredProduct: featuredProductDetails
          }))
          
          batchPayload.push({
            from: 'Susmita Nursery <newsletter@susmitanursery.com>',
            to: sub.email,
            subject: payload.subject,
            html: htmlContent
          })
        }

        const { error: sendErr } = await resend.batch.send(batchPayload)
        if (sendErr) throw sendErr
      }
    } else {
      console.log('[Resend Mock] API Key not set. Would send personalized emails to:', subscribers.map(s => `${s.full_name} (${s.email})`))
    }

    // 4. Log sent campaign in history
    try {
      await supabase.from('newsletter_campaigns').insert({
        subject: payload.subject,
        header: payload.header,
        body: payload.body,
        featured_product_id: payload.featuredProductId,
        template_type: payload.templateType
      })
    } catch (dbErr) {
      console.warn('Could not log campaign to newsletter_campaigns table:', dbErr)
    }

    return { success: true, count: subscribers.length }
  } catch (err: unknown) {
    console.error('Newsletter campaign error:', err)
    const errorMsg = err instanceof Error ? err.message : 'Delivery failed'
    return { success: false, error: errorMsg }
  }
}

// Fetch all sent newsletter campaigns
export async function getCampaignsAction() {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from('newsletter_campaigns')
      .select('*, products(name)')
      .order('sent_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (err: unknown) {
    console.error('Failed to get campaigns:', err)
    const errorMsg = err instanceof Error ? err.message : 'Failed to fetch campaigns'
    return { success: false, error: errorMsg }
  }
}
