import { Product } from '@/lib/products'
import { getProductsAction } from '@/server/product'

const CACHE_KEY = 'susmita_nursery_products_cache'

export interface CacheData {
  products: Product[]
  timestamp: number
}

/**
 * Retrieve cached products from localStorage.
 */
export function getCachedProducts(): Product[] | null {
  if (typeof window === 'undefined') return null
  try {
    const val = localStorage.getItem(CACHE_KEY)
    if (!val) return null
    const parsed = JSON.parse(val) as CacheData
    if (parsed && Array.isArray(parsed.products)) {
      return parsed.products
    }
  } catch (e) {
    console.error('Error reading from product cache:', e)
  }
  return null
}

/**
 * Persist products to localStorage.
 */
export function setCachedProducts(products: Product[]): void {
  if (typeof window === 'undefined') return
  try {
    const data: CacheData = {
      products,
      timestamp: Date.now()
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error writing to product cache:', e)
  }
}

/**
 * Implements SWR logic: calls onSuccess immediately with cached products (if any),
 * then fetches from database in the background, updates cache, and calls onSuccess with fresh data.
 */
export async function fetchProductsWithCache(
  onSuccess: (products: Product[]) => void,
  onFinal?: () => void
): Promise<void> {
  // 1. Instantly use cached products
  const cached = getCachedProducts()
  if (cached && cached.length > 0) {
    onSuccess(cached)
  }

  // 2. Revalidate in the background
  try {
    const res = await getProductsAction()
    if (res.success && res.data && Array.isArray(res.data)) {
      const freshProducts = res.data as Product[]
      
      // Only trigger update if data actually changed to avoid unnecessary renders
      const cachedStr = cached ? JSON.stringify(cached) : ''
      const freshStr = JSON.stringify(freshProducts)
      
      if (cachedStr !== freshStr) {
        setCachedProducts(freshProducts)
        onSuccess(freshProducts)
      }
    }
  } catch (e) {
    console.error('Error revalidating product cache:', e)
  } finally {
    if (onFinal) {
      onFinal()
    }
  }
}
