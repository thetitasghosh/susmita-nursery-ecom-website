-- Migration: Add Amazon and Flipkart marketplace URL parameters to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS amazon_link TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS flipkart_link TEXT;
