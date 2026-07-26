export const DELIVERY_SLOTS = [
  "10:00 AM – 12:00 PM",
  "12:00 PM – 02:00 PM",
  "02:00 PM – 04:00 PM",
  "04:00 PM – 06:00 PM",
  "06:00 PM – 08:00 PM",
  "08:00 PM – 10:00 PM",
  "10:00 PM – 12:00 AM (Midnight Delivery)"
] as const;

export const MIDNIGHT_SLOT = "10:00 PM – 12:00 AM (Midnight Delivery)";
export const MIDNIGHT_CHARGE = 150;

export const SERVICEABLE_GURUGRAM_ZIP_CODES = [
  "122001", "122002", "122003", "122004", "122005", "122006", "122007", "122008", "122009", "122010",
  "122011", "122015", "122016", "122017", "122018", "122022", "122101", "122102", "122505", "122508"
] as const;

export const isServiceableZipCode = (zipCode: string): boolean => {
  const cleanZip = zipCode.trim();
  return (SERVICEABLE_GURUGRAM_ZIP_CODES as readonly string[]).includes(cleanZip);
};
