import { MetadataRoute } from 'next';
import { allProducts } from '@/lib/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.susmitanursery.com/';

  // Base static routes
  const staticRoutes = [
    '',
    '/about',
    '/ar-experience',
    '/cart',
    '/categories',
    '/contact',
    '/promo',
    '/wishlist',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic product routes
  const productRoutes = allProducts.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Dynamic category routes (categories 1 to 6 based on categoryIdToName)
  const categoryIds = [1, 2, 3, 4, 5, 6];
  const categoryRoutes = categoryIds.map((id) => ({
    url: `${baseUrl}/categories/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
