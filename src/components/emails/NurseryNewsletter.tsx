import * as React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
  Img,
  Hr
} from '@react-email/components'

export type NewsletterTemplateType = 'care_guide' | 'seasonal_promo' | 'new_arrivals' | 'wishlist_restock'

interface EmailProps {
  templateType: NewsletterTemplateType
  subject: string
  header: string
  body: string
  recipientName?: string
  promoCode?: string
  featuredProduct?: {
    name: string
    price: number
    image: string
    slug: string
  }
}

export const NurseryNewsletterEmail = ({
  templateType = 'care_guide',
  header,
  body,
  recipientName = '',
  promoCode = 'GROWGREEN20',
  featuredProduct
}: EmailProps) => {
  const isDefaultName = !recipientName || recipientName.trim() === '' || recipientName.toLowerCase().includes('nursery client')
  const greetingName = isDefaultName ? 'Plant Lover' : recipientName.trim().split(' ')[0]
  
  // Custom headers or subheaders based on template type
  const getSubheaderText = () => {
    switch (templateType) {
      case 'care_guide':
        return 'Botanical Care Guidelines & Tips'
      case 'seasonal_promo':
        return 'Exclusive Seasonal Spotlight & Offers'
      case 'new_arrivals':
        return 'Fresh Arrivals in the Nursery Catalog'
      case 'wishlist_restock':
        return 'Back-in-stock Specimen Updates'
      default:
        return 'Botanical Companion Guidelines'
    }
  }

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f5f5f5', padding: '24px 0', fontFamily: 'sans-serif' }}>
        <Container style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '16px', overflow: 'hidden', maxWidth: '580px', margin: '0 auto' }}>
          {/* Header Banner */}
          <Section style={{ backgroundColor: '#1b3b22', padding: '24px', textAlign: 'center' }}>
            <Text style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#ffffff' }}>Susmita Nursery</Text>
            <Text style={{ margin: '4px 0 0 0', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a3bfa8' }}>
              {getSubheaderText()}
            </Text>
          </Section>

          {/* Email Body */}
          <Section style={{ padding: '32px 24px' }}>
            {/* Personalized Greeting */}
            <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px 0' }}>
              Hello {greetingName},
            </Text>

            <Heading style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b3b22', margin: '0 0 16px 0', lineHeight: '1.3' }}>
              {header}
            </Heading>

            <Text style={{ fontSize: '13px', lineHeight: '1.6', color: '#4b5563', margin: '0 0 24px 0' }}>
              {body}
            </Text>

            {/* Template Specific Blocks */}
            {templateType === 'seasonal_promo' && (
              <Section style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '12px', padding: '20px', textAlign: 'center', margin: '24px 0' }}>
                <Text style={{ margin: '0 0 8px 0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#b45309', fontWeight: 'bold' }}>
                  Use promo code at checkout
                </Text>
                <Text style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'black', color: '#1b3b22', fontFamily: 'monospace', letterSpacing: '2px' }}>
                  {promoCode}
                </Text>
                <Text style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>
                  Apply code to receive seasonal discounts on your reservations.
                </Text>
              </Section>
            )}

            {templateType === 'care_guide' && (
              <Section style={{ borderLeft: '3px solid #10b981', paddingLeft: '16px', margin: '24px 0' }}>
                <Text style={{ margin: 0, fontStyle: 'italic', fontSize: '12px', color: '#4b5563', lineHeight: '1.6' }}>
                  💡 <strong>Green Tip:</strong> Check leaf humidity indices weekly. Specimen health is heavily impacted by draft parameters and temperature fluctuations. Make sure to mist leaves in indirect sunlight.
                </Text>
              </Section>
            )}

            {/* Featured Product Section (Applicable for all, but visual styles change slightly) */}
            {featuredProduct && (
              <Section style={{ backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '12px', padding: '16px', margin: '24px 0' }}>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '60px' }}>
                        <Img src={featuredProduct.image.startsWith('http') ? featuredProduct.image : `https://susmitanursery.com${featuredProduct.image}`} alt={featuredProduct.name} width="52" height="52" style={{ borderRadius: '8px', objectFit: 'cover' }} />
                      </td>
                      <td>
                        <Text style={{ margin: 0, fontWeight: 'bold', fontSize: '13px', color: '#111827' }}>
                          {featuredProduct.name}
                        </Text>
                        <Text style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
                          ₹{featuredProduct.price.toFixed(2)}
                        </Text>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link href={`https://susmitanursery.com/products/${featuredProduct.slug}`} style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '8px 16px', borderRadius: '9999px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
                          {templateType === 'wishlist_restock' ? 'Buy Now' : 'Shop Specimen'}
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>
            )}

            <Hr style={{ borderColor: '#e5e5e5', margin: '32px 0 24px 0' }} />

            {/* Footer */}
            <Section style={{ textAlign: 'center', fontSize: '10px', color: '#9ca3af' }}>
              <Text style={{ margin: '0 0 4px 0' }}>© 2026 Susmita Nursery. Cultivating Green Companions.</Text>
              <Text style={{ margin: '0 0 12px 0' }}>Gangni, Badkulla, Nadia, 741121, W.B.</Text>
              <Link href="https://susmitanursery.com/unsubscribe" style={{ textDecoration: 'underline', color: '#9ca3af' }}>
                Unsubscribe from this mailing list
              </Link>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
