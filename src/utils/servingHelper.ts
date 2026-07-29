export const SERVING_MAPPING: Record<string, string> = {
  '0.5 Kg': '4–6 People',
  '1 Kg': '8–10 People',
  '1.5 Kg': '12–15 People',
  '2 Kg': '16–20 People',
  '3 Kg': '24–30 People',
  '4 Kg': '32–40 People',
  '5 Kg': '40–50 People'
};

export const getServingsForWeight = (weight: string): string => {
  const cleanWeight = weight.trim().toLowerCase().replace(/\s+/g, '');

  if (cleanWeight.includes('0.5')) return SERVING_MAPPING['0.5 Kg'];
  if (cleanWeight.startsWith('1.5')) return SERVING_MAPPING['1.5 Kg'];
  if (cleanWeight.startsWith('1')) return SERVING_MAPPING['1 Kg'];
  if (cleanWeight.startsWith('2')) return SERVING_MAPPING['2 Kg'];
  if (cleanWeight.startsWith('3')) return SERVING_MAPPING['3 Kg'];
  if (cleanWeight.startsWith('4')) return SERVING_MAPPING['4 Kg'];
  if (cleanWeight.startsWith('5')) return SERVING_MAPPING['5 Kg'];

  return '8–10 People'; // fallback default
};
