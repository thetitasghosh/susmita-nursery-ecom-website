# Plan: Connect Contact Form to Resend Email Dispatcher

This document details how we will make the website's Contact page form functional, sending user inquiries directly to **susmitanursery@gmail.com** via **Resend**.

---

## 1. Architectural Strategy

We will introduce a Server Action that takes the submitted contact form parameters, formats them into a clean HTML layout, and dispatches them using the existing `Resend` package.

```mermaid
graph LR
    User[Customer submits Form] -->|client-side handleSubmit| Action[sendContactMessageAction]
    Action -->|API call| Resend[Resend Service]
    Resend -->|Email Dispatch| Target[susmitanursery@gmail.com]
```

---

## 2. Implementation Steps

### Step 1: Create Contact Server Action (`src/server/contact.ts`)
Create a new file `src/server/contact.ts` that exports `sendContactMessageAction`. This handles rendering the email template and sending the query.

```typescript
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
  general: 'General Enquiry',
  care: 'Plant Care Support',
  landscape: 'Landscape Consultation',
  wholesale: 'Wholesale / Corporate Orders'
}

export async function sendContactMessageAction(payload: ContactPayload) {
  try {
    const subjectLabel = subjectLabels[payload.subject] || payload.subject
    const hasResendKey = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_mock_key'

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #1b3b22; border-bottom: 2px solid #1b3b22; padding-bottom: 8px;">New Horticultural Enquiry</h2>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
        <p><strong>Inquiry Category:</strong> ${subjectLabel}</p>
        <p><strong>Message Details:</strong></p>
        <div style="background-color: #f9f9f9; padding: 16px; border-radius: 8px; font-style: italic; white-space: pre-wrap;">
          ${payload.message}
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 24px;" />
        <p style="font-size: 11px; color: #999;">Received via Susmita Nursery Web Contact Form.</p>
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
      console.log('[Resend Mock] No API Key. Would forward contact message to susmitanursery@gmail.com:', payload)
    }

    return { success: true }
  } catch (err: unknown) {
    console.error('Contact form send error:', err)
    const errorMsg = err instanceof Error ? err.message : 'Message transmission failed'
    return { success: false, error: errorMsg }
  }
}
```

---

### Step 2: Update Contact Page UI (`src/app/contact/page.tsx`)
1. Import the newly created `sendContactMessageAction`.
2. Manage loading states (`const [isSubmitting, setIsSubmitting] = useState(false)`).
3. Bind the `handleSubmit` event:
   - Disable submission buttons while loading.
   - Invoke `sendContactMessageAction(formData)`.
   - On success, trigger standard visual feedback ("Message Sent!") and clear inputs.
   - On failure, show a red error notification warning.
