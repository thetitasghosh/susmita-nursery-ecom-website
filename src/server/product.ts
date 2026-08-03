'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { allProducts, Product } from '@/lib/products'

export interface ProductResponse {
  success: boolean
  error?: string
  data?: unknown
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

/**
 * Fetch catalog products from Supabase database with fallback to local definitions
 */
export async function getProductsAction(): Promise<ProductResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })

    if (error || !dbProducts || dbProducts.length === 0) {
      return { success: true, data: allProducts }
    }

    // Fetch recommendations to map to nestedItemIds
    const { data: dbRecommendations } = await supabase
      .from('product_recommendations')
      .select('product_id, recommended_id')

    const recMap: Record<string, string[]> = {}
    if (dbRecommendations) {
      dbRecommendations.forEach((r: { product_id: string; recommended_id: string }) => {
        if (!recMap[r.product_id]) {
          recMap[r.product_id] = []
        }
        recMap[r.product_id].push(r.recommended_id)
      })
    }

    // Format DB products into Product interface shape
    const formatted = (dbProducts as Array<{
      id: string
      name: string
      slug?: string
      category: string
      price: number
      rating?: number
      reviews?: number
      image: string
      supporting_images?: string[]
      description?: string
      details?: Record<string, string>
      sizes?: string[]
      care_instructions?: string[]
      scientific_name?: string
      height?: string
      difficulty?: string
      pet_friendly?: string
      air_purifying?: string
      stock_quantity?: number
      reserved_quantity?: number
      featured?: boolean
    }>).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      price: Number(p.price),
      rating: Number(p.rating || 5.0),
      reviews: p.reviews || 0,
      image: p.image,
      images: p.supporting_images || [],
      description: p.description || `${p.name} - Premium plant selection from Susmita Nursery.`,
      details: p.details || {},
      sizes: p.sizes || ['Medium'],
      careInstructions: p.care_instructions || [],
      scientificName: p.scientific_name,
      height: p.height,
      difficulty: p.difficulty,
      petFriendly: p.pet_friendly,
      airPurifying: p.air_purifying,
      stock_quantity: p.stock_quantity,
      reserved_quantity: p.reserved_quantity,
      featured: p.featured,
      nestedItemIds: recMap[p.id] || []
    }))

    return { success: true, data: formatted }
  } catch {
    return { success: true, data: allProducts }
  }
}

/**
 * Create a new product in Supabase database
 */
export async function createProductAction(
  productInput: Partial<Product> & { nestedItemIds?: string[] }
): Promise<ProductResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const slug = productInput.slug || slugify(productInput.name || 'new-plant')

    const dbPayload = {
      name: productInput.name,
      slug: slug,
      category: productInput.category || 'Indoor Plants',
      price: productInput.price || 0,
      rating: productInput.rating || 5.0,
      reviews: productInput.reviews || 0,
      image: productInput.image || '/images/plants/monstera-plant.jpg',
      supporting_images: productInput.images || [],
      details: productInput.details || {},
      sizes: productInput.sizes || ['Medium'],
      care_instructions: productInput.careInstructions || [],
      scientific_name: productInput.scientificName || null,
      height: productInput.height || null,
      difficulty: productInput.difficulty || 'Easy',
      pet_friendly: productInput.petFriendly || 'Yes',
      air_purifying: productInput.airPurifying || 'High',
      stock_quantity: 50,
      reserved_quantity: 0,
      featured: productInput.featured || false,
    }

    const { data, error } = await supabase
      .from('products')
      .insert([dbPayload])
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Insert recommendations if any
    if (data && productInput.nestedItemIds && productInput.nestedItemIds.length > 0) {
      const recPayloads = productInput.nestedItemIds.map(recId => ({
        product_id: data.id,
        recommended_id: recId
      }))
      const { error: recError } = await supabase
        .from('product_recommendations')
        .insert(recPayloads)
      if (recError) {
        console.error('Failed to create recommendations:', recError.message)
      }
    }

    return { success: true, data }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error creating product'
    return { success: false, error: errorMsg }
  }
}

/**
 * Update an existing product in Supabase database
 */
export async function updateProductAction(
  id: string,
  productInput: Partial<Product> & { stock_quantity?: number; reserved_quantity?: number; nestedItemIds?: string[] }
): Promise<ProductResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const dbPayload: Record<string, unknown> = {}
    if (productInput.name) {
      dbPayload.name = productInput.name
      dbPayload.slug = slugify(productInput.name)
    }
    if (productInput.category) dbPayload.category = productInput.category
    if (productInput.price !== undefined) dbPayload.price = productInput.price
    if (productInput.rating !== undefined) dbPayload.rating = productInput.rating
    if (productInput.reviews !== undefined) dbPayload.reviews = productInput.reviews
    if (productInput.image) dbPayload.image = productInput.image
    if (productInput.images) dbPayload.supporting_images = productInput.images
    if (productInput.details) dbPayload.details = productInput.details
    if (productInput.sizes) dbPayload.sizes = productInput.sizes
    if (productInput.careInstructions) dbPayload.care_instructions = productInput.careInstructions
    if (productInput.scientificName !== undefined) dbPayload.scientific_name = productInput.scientificName
    if (productInput.height !== undefined) dbPayload.height = productInput.height
    if (productInput.difficulty !== undefined) dbPayload.difficulty = productInput.difficulty
    if (productInput.petFriendly !== undefined) dbPayload.pet_friendly = productInput.petFriendly
    if (productInput.airPurifying !== undefined) dbPayload.air_purifying = productInput.airPurifying
    if (productInput.stock_quantity !== undefined) dbPayload.stock_quantity = productInput.stock_quantity
    if (productInput.reserved_quantity !== undefined) dbPayload.reserved_quantity = productInput.reserved_quantity
    if (productInput.featured !== undefined) dbPayload.featured = productInput.featured

    const { data, error } = await supabase
      .from('products')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Sync recommendations
    if (productInput.nestedItemIds !== undefined) {
      await supabase
        .from('product_recommendations')
        .delete()
        .eq('product_id', id)

      if (productInput.nestedItemIds.length > 0) {
        const recPayloads = productInput.nestedItemIds.map(recId => ({
          product_id: id,
          recommended_id: recId
        }))
        const { error: recError } = await supabase
          .from('product_recommendations')
          .insert(recPayloads)
        if (recError) {
          console.error('Failed to sync recommendations:', recError.message)
        }
      }
    }

    return { success: true, data }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error updating product'
    return { success: false, error: errorMsg }
  }
}

/**
 * Delete a product from Supabase database
 */
export async function deleteProductAction(id: string): Promise<ProductResponse> {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error deleting product'
    return { success: false, error: errorMsg }
  }
}
