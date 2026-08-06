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
  
  // 1. Get official brand color theme maps based on templateType
  const getThemeColors = () => {
    switch (templateType) {
      case 'care_guide':
        return {
          primary: '#027846',      // Deep Forest Green
          accent: '#73b22c',       // Lime Green
          light: '#f0fdf4',        // Soft Mint tint
          border: '#dcfce7'
        }
      case 'seasonal_promo':
        return {
          primary: '#027846',      // Deep Forest Green
          accent: '#ffcf02',       // Golden Yellow / Amber
          light: '#fffbeb',        // Soft warm yellow tint
          border: '#fef3c7'
        }
      case 'new_arrivals':
        return {
          primary: '#007947',      // Dark Emerald Green
          accent: '#73b22c',       // Lime Green
          light: '#f0fdf4',        // Soft Mint tint
          border: '#dcfce7'
        }
      case 'wishlist_restock':
        return {
          primary: '#027846',      // Deep Forest Green
          accent: '#ffcf02',       // Golden Yellow
          light: '#f9fafb',        // Neutral grey tint
          border: '#e5e7eb'
        }
      default:
        return {
          primary: '#027846',
          accent: '#73b22c',
          light: '#f9fafb',
          border: '#e5e7eb'
        }
    }
  }

  const colors = getThemeColors()

  // 2. Map header logo image to the brand layouts
  const getLogoUrl = () => {
    switch (templateType) {
      case 'care_guide':
        return 'https://susmitanursery.com/logos/logo-with-ring.jpeg'
      case 'seasonal_promo':
        return 'https://susmitanursery.com/logos/logo-with-typo.jpeg'
      case 'new_arrivals':
        return 'https://susmitanursery.com/logos/logo-with-vertical-typo.jpeg'
      case 'wishlist_restock':
        return 'https://susmitanursery.com/logos/logo-sn.jpeg'
      default:
        return 'https://susmitanursery.com/logos/logo-sn.jpeg'
    }
  }

  // 3. Custom subheaders based on template type
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

  // 4. Get individual logo rendering heights based on template types
  const getLogoHeight = () => {
    switch (templateType) {
      case 'care_guide':
        return '80' // Circular badge looks best at 80px
      case 'seasonal_promo':
        return '72' // Wordmark looks best at 72px
      case 'new_arrivals':
        return '85' // Vertical logo looks best at 85px
      case 'wishlist_restock':
        return '80' // Compact initials look best at 80px
      default:
        return '76'
    }
  }

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f4f4f5', padding: '40px 0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <Container style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '16px', overflow: 'hidden', maxWidth: '580px', margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          {/* Header Banner - Premium White Background with Colored Top Border */}
          <Section style={{ borderTop: `5px solid ${colors.primary}`, backgroundColor: '#ffffff', padding: '36px 24px 28px 24px', textAlign: 'center', borderBottom: '1px solid #f4f4f5' }}>
            <Img
              src={getLogoUrl()}
              alt="Susmita Nursery"
              height={getLogoHeight()}
              style={{ margin: '0 auto', display: 'block', height: `${getLogoHeight()}px`, objectFit: 'contain' }}
            />
            <Text style={{ margin: '14px 0 0 0', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: '800', color: '#71717a' }}>
              {getSubheaderText()}
            </Text>
          </Section>

          {/* Email Body */}
          <Section style={{ padding: '40px 32px' }}>
            {/* Personalized Greeting */}
            <Text style={{ fontSize: '15px', color: '#18181b', margin: '0 0 16px 0', lineHeight: '1.6' }}>
              Hello <strong style={{ color: '#18181b' }}>{greetingName}</strong>,
            </Text>

            <Heading style={{ fontSize: '22px', fontWeight: 'bold', color: colors.primary, margin: '0 0 20px 0', lineHeight: '1.38', fontFamily: 'Georgia, serif' }}>
              {header}
            </Heading>

            <Text style={{ fontSize: '14px', lineHeight: '1.75', color: '#3f3f46', margin: '0 0 28px 0', fontWeight: 'normal' }}>
              {body}
            </Text>

            {/* Template Specific Blocks */}
            {templateType === 'seasonal_promo' && (
              <Section style={{ backgroundColor: colors.light, border: `1.5px dashed ${colors.accent}`, borderRadius: '16px', padding: '28px 24px', textAlign: 'center', margin: '32px 0' }}>
                <span style={{ backgroundColor: colors.primary, color: '#ffffff', padding: '4px 10px', borderRadius: '9999px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-block', marginBottom: '12px' }}>
                  Promo Coupon Offer
                </span>
                <Text style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'black', color: colors.primary, fontFamily: 'monospace', letterSpacing: '4px' }}>
                  {promoCode}
                </Text>
                <Text style={{ margin: 0, fontSize: '11px', color: '#71717a', lineHeight: '1.6' }}>
                  Present this coupon code at our counter pickup desk to redeem your nursery discount.
                </Text>
              </Section>
            )}

            {templateType === 'care_guide' && (
              <Section style={{ borderLeft: `4px solid ${colors.accent}`, paddingLeft: '20px', margin: '32px 0', backgroundColor: '#fafafa', padding: '20px', borderRadius: '0 16px 16px 0' }}>
                <Text style={{ margin: 0, fontStyle: 'italic', fontSize: '12.5px', color: '#27272a', lineHeight: '1.7' }}>
                  💡 <strong style={{ color: colors.primary }}>Horticultural Guide:</strong> Check leaf humidity indices weekly. Specimen health is heavily impacted by draft parameters and temperature fluctuations. Make sure to mist leaves in indirect sunlight.
                </Text>
              </Section>
            )}

            {/* Featured Product Section (Branded style) */}
            {featuredProduct && (
              <Section style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '20px', margin: '32px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '64px' }}>
                        <Img 
                          src={featuredProduct.image.startsWith('http') ? featuredProduct.image : `https://susmitanursery.com${featuredProduct.image}`} 
                          alt={featuredProduct.name} 
                          width="60" 
                          height="60" 
                          style={{ borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.06)' }} 
                        />
                      </td>
                      <td style={{ paddingLeft: '16px' }}>
                        <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: colors.primary, display: 'block', marginBottom: '2px' }}>
                          🌿 Featured Specimen
                        </span>
                        <Text style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#18181b', lineHeight: '1.3' }}>
                          {featuredProduct.name}
                        </Text>
                        <Text style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#52525b', fontWeight: '600' }}>
                          ₹{featuredProduct.price.toFixed(2)}
                        </Text>
                      </td>
                      <td style={{ textAlign: 'right', paddingLeft: '8px' }}>
                        <Link 
                          href={`https://susmitanursery.com/products/${featuredProduct.slug}`} 
                          style={{ backgroundColor: colors.primary, color: '#ffffff', padding: '10px 22px', borderRadius: '30px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                        >
                          {templateType === 'wishlist_restock' ? 'Buy Now' : 'Shop Specimen'}
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>
            )}

            <Hr style={{ borderColor: '#f4f4f5', margin: '40px 0 28px 0' }} />

            {/* Footer */}
            <Section style={{ textAlign: 'center', fontSize: '11px', color: '#71717a', lineHeight: '1.65' }}>
              <Text style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#18181b' }}>© 2026 Susmita Nursery. All rights reserved.</Text>
              <Text style={{ margin: 0 }}>Gangni, Badkulla, Nadia, West Bengal, 741121</Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
