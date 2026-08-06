'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key')

interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

const subjectLabels: Record<string, string> = {
  reservation: 'In-Store Plant Reservations & Pickups',
  care: 'Plant Care & Botanical Advice',
  landscape: 'Landscaping & Plant Rental Services',
  wholesale: 'Nursery Visits & Bulk Wholesales'
}

export async function sendContactMessageAction(payload: ContactPayload) {
  try {
    const subjectLabel = subjectLabels[payload.subject] || payload.subject
    const hasResendKey = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_mock_key'

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 24px; color: #374151; max-width: 580px; border: 1px solid #e5e7eb; border-radius: 16px; margin: 0 auto; background-color: #ffffff;">
        <div style="background-color: #1b3b22; padding: 20px; text-align: center; border-top-left-radius: 16px; border-top-right-radius: 16px;">
          <h2 style="color: #ffffff; margin: 0; font-family: serif; font-size: 20px;">Susmita Nursery</h2>
          <span style="color: #a3bfa8; font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; display: block;">Customer Contact Inquiry</span>
        </div>
        <div style="padding: 24px;">
          <p style="margin-top: 0; font-size: 13px;"><strong>Name of Sender:</strong> ${payload.name}</p>
          <p style="font-size: 13px;"><strong>Email Address:</strong> <a href="mailto:${payload.email}" style="color: #10b981; text-decoration: none;">${payload.email}</a></p>
          <p style="font-size: 13px;"><strong>Subject Interest:</strong> ${subjectLabel}</p>
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
          <p style="font-size: 13px; font-weight: bold; margin-bottom: 8px; color: #111827;">Message Body:</p>
          <div style="background-color: #f9fafb; border: 1px solid #f3f4f6; padding: 16px; border-radius: 8px; font-size: 12px; line-height: 1.6; color: #4b5563; white-space: pre-wrap;">
            ${payload.message}
          </div>
        </div>
        <div style="background-color: #f9fafb; padding: 12px 24px; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; font-size: 10px; color: #9ca3af; text-align: center;">
          Received via Susmita Nursery Web Portal • Badkulla, Nadia, 741121, W.B.
        </div>
      </div>
    `

    if (hasResendKey) {
      const { error } = await resend.emails.send({
        from: 'Susmita Nursery Contact <contact@susmitanursery.com>',
        to: 'susmitanursery@gmail.com',
        subject: `[Contact Form] ${subjectLabel}: ${payload.name}`,
        html: htmlContent
      })
      
      if (error) throw error
    } else {
      console.log('[Resend Mock] No API Key set. Would dispatch contact email to susmitanursery@gmail.com:', payload)
    }

    return { success: true }
  } catch (err: unknown) {
    console.error('Contact email action error:', err)
    const errorMsg = err instanceof Error ? err.message : 'Failed to dispatch email'
    return { success: false, error: errorMsg }
  }
}
