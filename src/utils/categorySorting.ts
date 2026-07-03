/**
 * sortCategories - Sorts categories based on displayOrder and name.
 *
 * Logic:
 * 1. Primary sort: displayOrder (ascending).
 *    - Missing, null, undefined, or 0 values are treated as Infinity (placed last).
 * 2. Secondary sort: name (alphabetical, ascending) for ties in displayOrder.
 */
export const sortCategories = <T extends { name: string; displayOrder?: number | null }>(
  categories: T[]
): T[] => {
  return [...categories].sort((a, b) => {
    const orderA = a.displayOrder && a.displayOrder > 0 ? a.displayOrder : Infinity;
    const orderB = b.displayOrder && b.displayOrder > 0 ? b.displayOrder : Infinity;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Secondary sort by name
    return a.name.localeCompare(b.name);
  });
};
