import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

// Load environment variables from .env.local
loadEnvConfig(process.cwd());

import { allProducts } from '../src/lib/products';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('CRITICAL ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

// Create a Supabase Client with service role token to bypass RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function ensureBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Error listing storage buckets:', listError.message);
    return;
  }

  const exists = buckets.some(b => b.name === 'products');
  if (!exists) {
    console.log("Bucket 'products' does not exist. Creating public 'products' bucket...");
    const { error: createError } = await supabase.storage.createBucket('products', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
    });
    if (createError) {
      console.error('Error creating bucket:', createError.message);
    } else {
      console.log("Bucket 'products' created successfully.");
    }
  } else {
    console.log("Bucket 'products' already exists.");
  }
}

async function uploadFile(localPath: string): Promise<string | null> {
  // Map leading slash or full path to standard public directory structure
  const relativePath = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  const absolutePath = path.join(process.cwd(), 'public', relativePath);

  if (!fs.existsSync(absolutePath)) {
    console.warn(`[Storage] Warning: File not found on disk: ${absolutePath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const mimeType = mime.lookup(absolutePath) || 'application/octet-stream';

  // Use the relative path as the destination in the bucket (keeps directory structure)
  const destinationPath = relativePath;

  console.log(`[Storage] Uploading ${relativePath} (${mimeType})...`);
  const { data, error } = await supabase.storage
    .from('products')
    .upload(destinationPath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    console.error(`[Storage] Failed to upload ${relativePath}:`, error.message);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('products')
    .getPublicUrl(destinationPath);

  return urlData.publicUrl;
}

async function main() {
  console.log('--- Starting Supabase Product Seeding ---');
  await ensureBucket();

  const plantCategories = ['Indoor Plants', 'Outdoor Plants', 'Flower Plants', 'Fruit Plants', 'Lucky Bamboo'];
  const uploadedUrls: Record<string, string> = {};

  // First, upload all images to avoid duplicates and map their URLs
  console.log('\n--- Step 1: Uploading Images to Supabase Storage ---');
  for (const product of allProducts) {
    const imagesToUpload = [product.image, ...(product.images || [])];
    for (const img of imagesToUpload) {
      if (img && img.startsWith('/') && !uploadedUrls[img]) {
        const publicUrl = await uploadFile(img);
        if (publicUrl) {
          uploadedUrls[img] = publicUrl;
        }
      }
    }
  }

  console.log('\n--- Step 1.5: Cleaning Existing Products from Database ---');
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .neq('name', 'does_not_exist_name');

  if (deleteError) {
    console.error('Error cleaning database products:', deleteError.message);
  } else {
    console.log('Database products cleared successfully.');
  }

  console.log('\n--- Step 2: Inserting/Upserting Products into Database ---');
  for (const product of allProducts) {
    const mainImageUrl = uploadedUrls[product.image] || product.image;
    const supportingImageUrls = (product.images || []).map(img => uploadedUrls[img] || img);

    const slug = product.slug || slugify(product.name);

    const dbPayload = {
      id: product.id,
      name: product.name,
      slug: slug,
      category: product.category,
      price: product.price,
      rating: product.rating,
      reviews: product.reviews,
      image: mainImageUrl,
      supporting_images: supportingImageUrls,
      details: product.details || {},
      sizes: product.sizes || [],
      care_instructions: product.careInstructions || [],
      scientific_name: product.scientificName || null,
      height: product.height || null,
      difficulty: product.difficulty || 'Easy',
      pet_friendly: product.petFriendly || 'Yes',
      air_purifying: product.airPurifying || 'High',
      stock_quantity: 50,
      reserved_quantity: 0,
    };

    console.log(`[DB] Saving product: ${product.name} (ID: ${product.id})...`);
    const { error: insertError } = await supabase
      .from('products')
      .upsert([dbPayload], { onConflict: 'id' });

    if (insertError) {
      console.error(`[DB] Error saving ${product.name}:`, insertError.message);
    }
  }

  console.log('\n--- Step 3: Setting up Product Recommendations ---');
  // Clear existing recommendations to prevent unique constraint errors
  const { error: clearError } = await supabase
    .from('product_recommendations')
    .delete()
    .neq('product_id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (clearError) {
    console.error('[Recommendations] Error clearing old recommendations:', clearError.message);
  }

  // Find tools, fertilizer, pots to recommend
  const gardeningTools = allProducts.filter(p => p.category === 'Gardening Tools');
  const fertilizers = allProducts.filter(p => p.category === 'Organic Fertilizer');
  const pots = allProducts.filter(p => p.category.includes('Pots'));

  // Get specific recommendation IDs
  const recommendedTool = gardeningTools.find(t => t.name.includes('Shears')) || gardeningTools[0];
  const recommendedFertilizer = fertilizers.find(f => f.name.includes('Vermicompost')) || fertilizers[0];
  const recommendedPot = pots[0];

  const recommendationsPayload: Array<{ product_id: string; recommended_id: string }> = [];

  for (const product of allProducts) {
    // If the product is a plant, recommend a tool, a fertilizer, and a pot
    if (plantCategories.includes(product.category)) {
      const recs = [recommendedTool, recommendedFertilizer, recommendedPot].filter(Boolean);
      for (const rec of recs) {
        recommendationsPayload.push({
          product_id: product.id,
          recommended_id: rec.id,
        });
      }
    } else {
      // If it's a tool/pot/fertilizer, recommend a couple of popular plants (e.g. ID 1 and ID 2)
      const popularPlants = allProducts.filter(p => plantCategories.includes(p.category)).slice(0, 2);
      for (const plant of popularPlants) {
        recommendationsPayload.push({
          product_id: product.id,
          recommended_id: plant.id,
        });
      }
    }
  }

  if (recommendationsPayload.length > 0) {
    console.log(`[Recommendations] Seeding ${recommendationsPayload.length} recommendation mappings...`);
    const { error: recError } = await supabase
      .from('product_recommendations')
      .insert(recommendationsPayload);

    if (recError) {
      console.error('[Recommendations] Failed to seed recommendations:', recError.message);
    } else {
      console.log('[Recommendations] Successfully seeded recommendations!');
    }
  }

  console.log('\n--- Seeding Completed Successfully ---');
}

main().catch(err => {
  console.error('Unhandled script error:', err);
  process.exit(1);
});
