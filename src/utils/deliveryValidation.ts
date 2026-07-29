import { DELIVERY_SLOTS } from '@/constants/delivery';

export const getSlotStartHour = (slot: string): number => {
  if (slot.startsWith("10:00 AM")) return 10;
  if (slot.startsWith("12:00 PM")) return 12;
  if (slot.startsWith("02:00 PM")) return 14;
  if (slot.startsWith("04:00 PM")) return 16;
  if (slot.startsWith("06:00 PM")) return 18;
  if (slot.startsWith("08:00 PM")) return 20;
  if (slot.startsWith("10:00 PM")) return 22;
  return 0; // fallback
};

export const getSlotDateTime = (date: Date | string, slot: string): Date => {
  const d = new Date(date);
  d.setHours(getSlotStartHour(slot), 0, 0, 0);
  return d;
};

/**
 * Validates if a delivery slot on a given date is available,
 * considering the current local time, the minimum preparation time (in hours),
 * and whether it's a custom cake (which has a base 2-day lead time instead of 1-day).
 */
export const isSlotValid = (
  date: Date | string,
  slot: string,
  now: Date = new Date(),
  prepHours: number = 16,
  hasCustomCake: boolean = false
): boolean => {
  // 1. Calculate slot date time
  const slotTime = getSlotDateTime(date, slot);

  // 2. Minimum time based on preparation hours
  const minPrepTime = new Date(now.getTime() + prepHours * 60 * 60 * 1000);

  // If slot start is before min prep time, it's invalid
  if (slotTime.getTime() < minPrepTime.getTime()) {
    return false;
  }

  // 3. Respect base date constraints (today + 1 for standard, today + 2 for custom)
  const baseMinDate = new Date(now);
  baseMinDate.setDate(now.getDate() + (hasCustomCake ? 2 : 1));
  baseMinDate.setHours(0, 0, 0, 0);

  const checkDateOnly = new Date(date);
  checkDateOnly.setHours(0, 0, 0, 0);

  if (checkDateOnly.getTime() < baseMinDate.getTime()) {
    return false;
  }

  return true;
};

/**
 * Returns the earliest selectable Date that has at least one valid slot
 * under the preparation rules.
 */
export const getMinSelectableDate = (
  now: Date = new Date(),
  prepHours: number = 16,
  hasCustomCake: boolean = false
): Date => {
  const baseMinDate = new Date(now);
  baseMinDate.setDate(now.getDate() + (hasCustomCake ? 2 : 1));
  baseMinDate.setHours(0, 0, 0, 0);

  const checkDate = new Date(baseMinDate);
  // Loop to find the first date that has at least one valid slot
  for (let i = 0; i < 30; i++) {
    const hasAnyValidSlot = DELIVERY_SLOTS.some(slot =>
      isSlotValid(checkDate, slot, now, prepHours, hasCustomCake)
    );
    if (hasAnyValidSlot) {
      return checkDate;
    }
    checkDate.setDate(checkDate.getDate() + 1);
  }
  return baseMinDate; // fallback
};

/**
 * Returns the earliest available Date and its earliest valid slot name.
 */
export const getEarliestAvailableDateAndSlot = (
  now: Date = new Date(),
  prepHours: number = 16,
  hasCustomCake: boolean = false
): { date: Date; slot: string } | null => {
  const minDate = getMinSelectableDate(now, prepHours, hasCustomCake);

  const checkDate = new Date(minDate);
  for (let d = 0; d < 10; d++) {
    const currentDateToCheck = new Date(checkDate);
    currentDateToCheck.setDate(minDate.getDate() + d);

    for (const slot of DELIVERY_SLOTS) {
      if (isSlotValid(currentDateToCheck, slot, now, prepHours, hasCustomCake)) {
        return { date: currentDateToCheck, slot };
      }
    }
  }
  return null;
};
