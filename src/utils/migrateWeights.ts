import { db } from './firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

export const migrateWeights = async () => {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    const BATCH_SIZE = 450;
    let count = 0;
    let currentBatch = writeBatch(db);
    let totalMigrated = 0;

    for (const productDoc of snapshot.docs) {
      const data = productDoc.data();
      // Even if weights exist, if it only has one or we want to force refresh, we can update it
      // For this task, if it's missing or only has one (0.5 Kg), we'll upgrade it
      if (!data.weights || data.weights.length <= 1) {
        const basePrice = data.price;
        const weights = [
          { label: "0.5 Kg", price: basePrice },
          { label: "1 Kg", price: Math.round(basePrice * 1.8) },
          { label: "2 Kg", price: Math.round(basePrice * 3.5) }
        ];

        currentBatch.update(doc(db, 'products', productDoc.id), {
          weights: weights,
          updatedAt: new Date().toISOString()
        });
        count++;
        totalMigrated++;

        if (count >= BATCH_SIZE) {
          await currentBatch.commit();
          currentBatch = writeBatch(db);
          count = 0;
        }
      }
    }

    if (count > 0) {
      await currentBatch.commit();
    }

    if (totalMigrated > 0) {
      console.log(`Successfully migrated ${totalMigrated} products in Firestore.`);
    } else {
      console.log('No products needed migration.');
    }
    return true;
  } catch (error) {
    console.error('Migration error:', error);
    return false;
  }
};
