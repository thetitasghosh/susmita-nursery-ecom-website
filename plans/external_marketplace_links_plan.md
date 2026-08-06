# Implementation Plan: External Marketplace Links (Amazon & Flipkart)

We will implement support for external marketplace link bindings, enabling store owners to link e-commerce inventory items directly to their corresponding listings on Amazon and Flipkart.

---

## 1. Database Updates (Supabase)
We will add two new fields to the `products` table schema to store dynamic listing links.

### SQL Migration Script
```sql
-- Migration: Add Amazon and Flipkart marketplace URL parameters to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS amazon_link TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS flipkart_link TEXT;
```

---

## 2. Product Type Definitions
We need to register the new fields in our core application model interfaces:
*   Modify `Product` in [products.ts](file:///d:/Documents/01_Freelance/susmita-nursery-ecom-website/src/lib/products.ts):
    ```typescript
    export interface Product {
      // ... existing parameters
      amazon_link?: string;
      flipkart_link?: string;
    }
    ```

---

## 3. Admin Console Product Sheet Inputs
We will update the add/edit product form fields in the admin dashboard:
*   Modify [products/page.tsx](file:///d:/Documents/01_Freelance/susmita-nursery-ecom-website/src/app/%28dashboard%29/dashboard/products/page.tsx):
    - Add inputs for **Amazon Link** and **Flipkart Link** inside the main `<SheetContent>` scrollable form container.
    - Bind inputs to state variables `amazonLink` and `flipkartLink`.
    - Update the insert/update database submit actions to submit these fields.

---

## 4. Public Product Detail Page Buttons
On the public product pages, we will render new action buttons matching the existing height, width, and typography of the "Add to Cart" and "Buy via WhatsApp" actions.

*   Modify [products/[id]/page.tsx](file:///d:/Documents/01_Freelance/susmita-nursery-ecom-website/src/app/products/%5Bid%5D/page.tsx) and [products/\[id\]/page.tsx](file:///d:/Documents/01_Freelance/susmita-nursery-ecom-website/src/app/products/%5Bid%5D/page.tsx):
    - Fetch the `amazon_link` and `flipkart_link` attributes.
    - Render the following button options underneath the primary cart controls:
      
      #### Amazon Button:
      - **Label**: `Buy on Amazon`
      - **Color/Theme**: Amazon Brand Orange (`bg-[#FF9900] hover:bg-[#e58900] text-black`)
      - **Dimensions**: Match height (`h-12`/`py-3`) and full-width layout parameters of the existing WhatsApp buttons.
      
      #### Flipkart Button:
      - **Label**: `Buy on Flipkart`
      - **Color/Theme**: Flipkart Brand Blue (`bg-[#2874F0] hover:bg-[#1b62db] text-white`)
      - **Dimensions**: Match height (`h-12`/`py-3`) and full-width layout parameters.
    
    - **Conditional Visibility**: Only render the marketplace buttons if their corresponding links exist and are not empty/null.
