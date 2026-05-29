# Product Image System Audit Report

## 1. Image Storage Identification
*   **External URLs:** The primary source of images is **Unsplash**. These URLs are hardcoded in `src/constants/products.ts`.
*   **Firebase Storage:** The system is configured to support admin-uploaded images. These are stored in the Firebase Storage bucket under the `products/` path, as evidenced by the logic in `src/components/admin/ProductForm.tsx`.
*   **Local Assets:** No local image files for products (e.g., in `/public`) were found.

## 2. Image Mapping Analysis
*   **Mechanism:** Images are mapped to products via the `img` property in the `products` array within `src/constants/products.ts`.
*   **Restoration Effort:** A parallel mapping exists in `src/constants/proposed_images.json`, which pairs current placeholder images with proposed high-quality restorations.
*   **Integration:** A searchable dashboard at `/preview-images` allows for manual review of these proposed changes.

## 3. Data Audit Results
*   **Total Products:** 342
*   **Total Unique Images (Current):** 13
*   **Unique Proposed Images:** 57
*   **Missing Image References:** 0 (Every product has an `img` string assigned).

### Duplicate Image Usage
The current system relies heavily on a small set of placeholder images. The top 5 most used images account for 285 out of 342 products (83.3%).

| Usage Count | Unsplash ID | Example Product Category |
| :--- | :--- | :--- |
| 122 | `photo-1561758033-7e924f619b47` | Trending, Festival, Photo Cakes |
| 66 | `photo-1578985545062-69928b1d9587` | Chocolate, Truffle, Bomb Cakes |
| 48 | `photo-1535141192574-5d4897c12636` | Birthday, Romantic, Valentine Cakes |
| 34 | `photo-1519915028121-7d3463d20b13` | Kids, Cartoon, Anime Cakes |
| 15 | `photo-1464349095431-e9a21285b5f3` | Wedding, Anniversary Cakes |

### Likely Image Mismatches
There is a high rate of semantic mismatch where the visual content of the image does not align with the product flavor or description.

*   **Flavor Overload:** Image `photo-1535141192574-5d4897c12636` is used for **48 products** covering **6 distinct flavor profiles** (e.g., Mixed Berry Ganache, Saffron Rasmalai, Seasonal Fresh Fruits, Premium Vanilla Almond).
*   **Inconsistent Visuals:** Image `photo-1616031037011-087000171abe` is shared across **13 products** with **8 different flavors**, including 'Rich Belgian Chocolate' and 'Lotus Biscoff Crunch', which are visually distinct.

## 4. Root Cause Analysis
The audit indicates that the current state is not a result of "incorrect" manual entry, but rather a **deliberate bulk placeholder assignment** likely performed during a data migration or initial catalog setup.

*   **Incorrect Mapping:** Not present (IDs and basic fields are consistent).
*   **Bulk Placeholder Assignments:** **Primary Cause.** 320 products (93.6%) are using the initial restricted set of 13 images.
*   **Missing Source Images:** No evidence of broken links; all URLs are valid but generic.
*   **Migration Gaps:** There is a clear transition in progress. 22 products (6.4%) have already been migrated to the more specific images proposed in the restoration plan.

## 5. Restoration Readiness
The infrastructure for fixing these issues is already in place:
*   `src/constants/proposed_images.json` contains a high-quality mapping for all 342 products.
*   `src/utils/bulkImageUpdate.ts` provides a utility to apply these changes to the Firestore database in batches.
*   The system is currently 6.4% restored based on the comparison of `products.ts` and the proposed data.
