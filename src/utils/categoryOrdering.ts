import { writeBatch, doc, collection, Firestore, WriteBatch } from 'firebase/firestore';

/**
 * Generates a Firestore WriteBatch to handle category reordering atomically.
 * Ensures 1-N continuous numbering and uniqueness.
 */
export const getReorderBatch = (
  db: Firestore,
  allCategories: any[],
  targetCategoryId: string | null,
  newOrder: number,
  targetCategoryData: any
): WriteBatch => {
  const batch = writeBatch(db);

  // 1. Filter out the target category and sort remaining by displayOrder
  const others = allCategories
    .filter(c => c.id !== targetCategoryId)
    .sort((a, b) => (a.displayOrder || Infinity) - (b.displayOrder || Infinity));

  // 2. Clamp newOrder within valid range [1, others.length + 1]
  const clampedOrder = Math.max(1, Math.min(newOrder, others.length + 1));

  // 3. Reconstruct the full list with target at its new position
  const newSequence = [...others];
  // Note: we use a placeholder object for the target category
  const targetPlaceholder = { ...targetCategoryData, id: targetCategoryId, isTarget: true };
  newSequence.splice(clampedOrder - 1, 0, targetPlaceholder);

  // 4. Update all categories to match their new index-based order
  newSequence.forEach((cat, index) => {
    const expectedOrder = index + 1;
    const isTarget = cat.isTarget;

    if (isTarget) {
      // For the target category (new or existing)
      const docRef = targetCategoryId
        ? doc(db, 'categories', targetCategoryId)
        : doc(collection(db, 'categories'));

      const data = {
        ...targetCategoryData,
        displayOrder: expectedOrder,
        updatedAt: new Date().toISOString(),
      };

      if (!targetCategoryId) {
        // Create new
        batch.set(docRef, {
          ...data,
          createdAt: new Date().toISOString(),
          productCount: 0
        });
      } else {
        // Update existing
        batch.update(docRef, data);
      }
    } else {
      // For other categories, only update if their order changed
      if (cat.displayOrder !== expectedOrder) {
        batch.update(doc(db, 'categories', cat.id), {
          displayOrder: expectedOrder,
          updatedAt: new Date().toISOString()
        });
      }
    }
  });

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
