import { writeBatch, doc, collection, Firestore, WriteBatch } from 'firebase/firestore';

/**
 * Generates a Firestore WriteBatch to handle category reordering atomically.
 * Implements Swap-Based Ordering: only the target and the occupant of the target position are updated.
 */
export const getReorderBatch = (
  db: Firestore,
  allCategories: any[],
  targetCategoryId: string | null,
  newOrder: number,
  targetCategoryData: any
): WriteBatch => {
  const batch = writeBatch(db);

  if (targetCategoryId) {
    // UPDATE CASE
    const targetCategory = allCategories.find(c => c.id === targetCategoryId);
    const oldOrder = targetCategory?.displayOrder;
    const hasValidOldOrder = typeof oldOrder === 'number' && oldOrder > 0;

    // Find the category currently occupying the target position
    const occupant = allCategories.find(c => c.displayOrder === newOrder && c.id !== targetCategoryId);

    // 1. Update the target category to the new order
    const targetRef = doc(db, 'categories', targetCategoryId);
    batch.update(targetRef, {
      ...targetCategoryData,
      displayOrder: newOrder,
      updatedAt: new Date().toISOString(),
    });

    // 2. Handle the occupant
    if (occupant && newOrder !== oldOrder) {
      // If target had a valid old position, swap occupant to it.
      // Otherwise, move occupant to the end of the list.
      const swapToOrder = hasValidOldOrder ? oldOrder : allCategories.length;

      batch.update(doc(db, 'categories', occupant.id), {
        displayOrder: swapToOrder,
        updatedAt: new Date().toISOString(),
      });
    }
  } else {
    // CREATE CASE
    const docRef = doc(collection(db, 'categories'));
    const occupant = allCategories.find(c => c.displayOrder === newOrder);

    // 1. Create the new category at the target position
    batch.set(docRef, {
      ...targetCategoryData,
      displayOrder: newOrder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productCount: 0
    });

    // 2. If there's an occupant at the target position, move them to the end
    if (occupant) {
      const nextAvailableOrder = allCategories.length + 1;
      batch.update(doc(db, 'categories', occupant.id), {
        displayOrder: nextAvailableOrder,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  return batch;
};

/**
 * Generates a Firestore WriteBatch to handle category deletion and subsequent reordering.
 */
export const getDeleteBatch = (
  db: Firestore,
  allCategories: any[],
  deletedCategoryId: string
): WriteBatch => {
  const batch = writeBatch(db);

  const remaining = allCategories
    .filter(c => c.id !== deletedCategoryId)
    .sort((a, b) => (a.displayOrder || Infinity) - (b.displayOrder || Infinity));

  batch.delete(doc(db, 'categories', deletedCategoryId));

  remaining.forEach((cat, index) => {
    const expectedOrder = index + 1;
    if (cat.displayOrder !== expectedOrder) {
      batch.update(doc(db, 'categories', cat.id), {
        displayOrder: expectedOrder,
        updatedAt: new Date().toISOString()
      });
    }
  });

  return batch;
};

/**
 * Generates a Firestore WriteBatch to repair all category orders to a strict 1-N sequence.
 */
export const getRepairBatch = (
  db: Firestore,
  allCategories: any[]
): WriteBatch => {
  const batch = writeBatch(db);

  const sorted = [...allCategories].sort((a, b) => {
    const orderA = a.displayOrder && a.displayOrder > 0 ? a.displayOrder : Infinity;
    const orderB = b.displayOrder && b.displayOrder > 0 ? b.displayOrder : Infinity;
    if (orderA !== orderB) return orderA - orderB;
    return a.name.localeCompare(b.name);
  });

  sorted.forEach((cat, index) => {
    const expectedOrder = index + 1;
    if (cat.displayOrder !== expectedOrder) {
      batch.update(doc(db, 'categories', cat.id), {
        displayOrder: expectedOrder,
        updatedAt: new Date().toISOString()
      });
    }
  });

  return batch;
};
