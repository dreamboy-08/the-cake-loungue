import { db } from './firebase';
import { collection, doc, writeBatch, getDocs, query, where } from 'firebase/firestore';
import { products } from '../constants/products';

/**
 * seedCategories - Extracts unique categories from the products constant
 * and populates the 'categories' collection in Firestore.
 */
export const seedCategories = async () => {
  try {
    console.log('[Seeding] Starting category seeding process...');

    // 1. Extract unique category names from products
    const uniqueCategoryNames = Array.from(new Set(products.map(p => p.category)));
    console.log(`[Seeding] Found ${uniqueCategoryNames.length} unique categories.`);

    // 2. Check existing categories to avoid duplicates
    const existingCatsSnapshot = await getDocs(collection(db, 'categories'));
    const existingNames = new Set(existingCatsSnapshot.docs.map(doc => doc.data().name));

    const batch = writeBatch(db);
    let count = 0;
    const now = new Date().toISOString();

    for (const name of uniqueCategoryNames) {
      if (existingNames.has(name)) continue;

      const categoryRef = doc(collection(db, 'categories'));
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      batch.set(categoryRef, {
        name,
        slug,
        description: `Premium collection of ${name}.`,
        image: '', // Will be updated via Admin UI or can be matched with static assets if needed
        active: true,
        createdAt: now,
        updatedAt: now,
        productCount: 0
      });

      count++;
    }

    if (count > 0) {
      await batch.commit();
      console.log(`[Seeding] Successfully seeded ${count} new categories.`);
    } else {
      console.log('[Seeding] No new categories to seed.');
    }

    return true;
  } catch (error) {
    console.error('[Seeding] Error seeding categories:', error);
    return false;
  }
};
