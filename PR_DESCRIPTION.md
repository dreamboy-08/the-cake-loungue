# Product Image Migration to Local Assets

This PR migrates 114 product images from external Unsplash URLs to local assets stored in \`public/images/products/\`.

## Changes
- Updated \`src/constants/products.ts\` with local image paths for 114 matched products.
- Updated \`src/constants/proposed_images.json\` to reflect the new local assets.
- Generated a comprehensive \`IMAGE_RESTORATION_REPORT.md\` detailing the mapping results.

## Summary
- **Total Products Matched:** 114
- **Unmatched Products:** 228
- **Confidence:** All matches are high-confidence exact name matches.

## Verification
- Verified on local development server (\`npm run dev\`).
- Playwright tests (\`tests/cart-sync.spec.ts\`) passing.
- Visual verification confirmed local images load correctly on Home and Menu pages.

*Note: Products without matching local images continue to use their existing external URLs to ensure no broken images.*
