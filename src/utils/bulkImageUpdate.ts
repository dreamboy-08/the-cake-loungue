import { db } from './firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

/**
 * Bulk updates product images in Firestore based on a mapping.
 * @param imageMapping A record where keys are product IDs (as strings) and values are new image URLs.
 * @param dryRun If true, only logs the intended changes without performing them.
 */
export const bulkUpdateProductImages = async (
  imageMapping: Record<string, string>,
  dryRun: boolean = true
) => {
  try {
    const productsCollection = collection(db, 'products');
    const productIds = Object.keys(imageMapping);

    console.log(`Starting bulk update for ${productIds.length} products...`);
    if (dryRun) console.log('--- DRY RUN MODE: No changes will be written to Firestore ---');

    // Firestore batches are limited to 500 operations
    const BATCH_SIZE = 400;
    for (let i = 0; i < productIds.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const currentBatchIds = productIds.slice(i, i + BATCH_SIZE);

      currentBatchIds.forEach((id) => {
        const newImgUrl = imageMapping[id];
        const productRef = doc(productsCollection, id);

        if (!dryRun) {
          batch.update(productRef, { img: newImgUrl });
        }
      });

      if (!dryRun) {
        await batch.commit();
        console.log(`Successfully committed batch ${Math.floor(i/BATCH_SIZE) + 1}`);
      } else {
        console.log(`Dry run: Batch ${Math.floor(i/BATCH_SIZE) + 1} would have updated ${currentBatchIds.length} products.`);
      }
    }

    console.log('Bulk update process completed.');
  } catch (error) {
    console.error('Error during bulk image update:', error);
    throw error;
  }
};
