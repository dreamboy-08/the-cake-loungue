import { db } from './firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { products } from '../constants/products';

/**
 * recoverCatalog - Restores the 'products' collection in Firestore using
 * the local src/constants/products.ts as the source of truth.
 *
 * Each product is assigned a 'createdAt' and 'updatedAt' timestamp.
 * Operations are batched for efficiency and to comply with Firestore limits.
 */
export const recoverCatalog = async () => {
  try {
    console.log(`[Recovery] Starting recovery process for ${products.length} products...`);

    const BATCH_SIZE = 500; // Firestore maximum batch size
    let batch = writeBatch(db);
    let count = 0;
    const now = new Date().toISOString();

    for (const product of products) {
      // Use the numeric ID as the document ID for consistency
      const productRef = doc(collection(db, 'products'), product.id.toString());

      batch.set(productRef, {
        ...product,
        createdAt: now,
        updatedAt: now
      });

      count++;

      // Commit the batch when size limit is reached
      if (count % BATCH_SIZE === 0) {
        console.log(`[Recovery] Committing batch of ${count} products...`);
        await batch.commit();
        batch = writeBatch(db);
      }
    }

    // Commit any remaining products in the final batch
    if (count % BATCH_SIZE !== 0) {
      console.log(`[Recovery] Committing final batch of ${count % BATCH_SIZE} products...`);
      await batch.commit();
    }

    console.log('[Recovery] Catalog restoration completed successfully!');
    return true;
  } catch (error) {
    console.error('[Recovery] Critical error during catalog restoration:', error);
    return false;
  }
};
