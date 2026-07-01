import { db } from './firebase';
import { collection, doc, writeBatch, getDocs, query, where } from 'firebase/firestore';
import { products } from '../constants/products';
import { MEGA_MENU } from '../constants/navigation';

/**
 * seedCategories - Extracts unique categories from products and navigation
 * and populates the 'categories' collection in Firestore.
 */
export const seedCategories = async () => {
  try {
    console.log('[Seeding] Starting category seeding process...');

    // 1. Extract categories from products constant
    const productCategories = products.map(p => p.category);

    // 2. Extract categories from MEGA_MENU navigation constant
    const navCategories: string[] = [];
    MEGA_MENU.forEach(menuItem => {
      // Top level labels (e.g., "Bento", "Theme Cakes", "Desserts")
      if (menuItem.label) navCategories.push(menuItem.label);

      if (menuItem.columns) {
        menuItem.columns.forEach(column => {
          // Column titles can be categories too (e.g., "Kids Cakes", "Romantic Cakes")
          // But we skip generic ones
          const genericTitles = ['Category', 'Designer', 'Flavours', 'Occasions', 'Designs', 'Combos', 'Family', 'Couples', 'Friends', 'Special', 'Hampers', 'Premium', 'Special Gifts'];
          if (column.title && !genericTitles.includes(column.title)) {
            navCategories.push(column.title);
          }

          column.items.forEach(item => {
            navCategories.push(item.label);
          });
        });
      }
    });

    // 3. Combine and get unique names
    const uniqueCategoryNames = Array.from(new Set([...productCategories, ...navCategories]))
      .filter(name => name && name.trim() !== '')
      .sort();

    console.log(`[Seeding] Found ${uniqueCategoryNames.length} unique categories total.`);

    // 4. Check existing categories to avoid duplicates
    const existingCatsSnapshot = await getDocs(collection(db, 'categories'));
    const existingNames = new Set(existingCatsSnapshot.docs.map(doc => doc.data().name));

    const batch = writeBatch(db);
    let count = 0;
    const now = new Date().toISOString();

    for (const name of uniqueCategoryNames) {
      if (existingNames.has(name)) continue;

      const categoryRef = doc(collection(db, 'categories'));
      // Consistent slug generation
      const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      batch.set(categoryRef, {
        name: name.trim(),
        slug,
        description: `Premium collection of ${name}.`,
        image: '',
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
