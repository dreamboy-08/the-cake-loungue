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
      if (!data.weights) {
        currentBatch.update(doc(db, 'products', productDoc.id), {
          weights: [{ label: "0.5 Kg", price: data.price }],
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
