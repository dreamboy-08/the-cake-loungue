import { db } from './firebase';
import { collection, doc, setDoc, getDocs, query, limit } from 'firebase/firestore';
import { products } from '../constants/products';
import { MEGA_MENU } from '../constants/navigation';

export const seedFirestore = async () => {
  try {
    console.log('Starting seeding process...');

    // 1. Seed Categories
    console.log('Seeding categories...');
    const categoriesSet = new Set<string>();
    MEGA_MENU.forEach(item => {
      if (item.columns) {
        item.columns.forEach(col => {
          col.items.forEach(subItem => {
            if (subItem.href.includes('#')) {
              categoriesSet.add(subItem.label);
            }
          });
        });
      }
    });

    for (const categoryName of Array.from(categoriesSet)) {
      const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(collection(db, 'categories'), categoryId), {
        name: categoryName,
        slug: categoryId,
        createdAt: new Date().toISOString()
      });
    }

    // 2. Seed Products
    console.log('Seeding products...');
    for (const product of products) {
      await setDoc(doc(collection(db, 'products'), product.id.toString()), {
        ...product,
        createdAt: new Date().toISOString()
      });
    }

    // 3. Initialize other collections (Users, Orders, Reviews) with a dummy doc if empty
    // This isn't strictly necessary but good for structure
    const initEmptyCollection = async (colName: string) => {
      const q = query(collection(db, colName), limit(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.log(`Initializing empty collection: ${colName}`);
        // We just leave it empty for now, or add a schema doc
        await setDoc(doc(collection(db, '_metadata'), colName), {
          initialized: true,
          schemaVersion: '1.0'
        });
      }
    };

    await initEmptyCollection('users');
    await initEmptyCollection('orders');
    await initEmptyCollection('reviews');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding Firestore:', error);
  }
};
