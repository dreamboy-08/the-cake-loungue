/**
 * Converts a string into a URL-friendly slug.
 *
 * @param name The string to slugify
 * @returns The slugified string
 */
export const toSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};
