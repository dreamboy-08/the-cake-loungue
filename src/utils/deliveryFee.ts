import { CMSGeneralSettings, DeliveryMatrixConfig, DeliveryDistanceBracket, DeliverySubtotalBracket, DeliveryMatrixCell } from '@/types/cms';
import { DEFAULT_GENERAL_SETTINGS, DEFAULT_DELIVERY_MATRIX } from '@/constants/cmsDefaults';

export interface DeliveryFeeResult {
  fee: number;
  isFree: boolean;
  isUnavailable: boolean;
  amountNeededForFreeDelivery: number | null;
  message: string | null;
  distanceZone?: string;
  subtotalZone?: string;
  distanceKm?: number;
}

/**
 * Estimates road distance in kilometres for Gurugram pincodes relative to store origin (122002 - DLF Phase 3).
 * Provides deterministic distance values for supported delivery pincodes.
 */
export function getEstimatedDistanceKm(zipCode?: string | null): number {
  if (!zipCode) return 1.5; // Default local neighborhood distance

  const sanitized = String(zipCode).trim();

  // Known Gurugram delivery distances relative to 122002 (DLF Phase 3)
  const PINCODE_DISTANCE_MAP: Record<string, number> = {
    '122002': 1.0, // DLF Phase 3 / Phase 2 (< 2 km)
    '122001': 3.5, // Sector 14 / DLF Phase 1 (2-5 km)
    '122003': 4.2, // Sector 21 / 22 (2-5 km)
    '122008': 2.8, // DLF Phase 5 / Golf Course Rd (2-5 km)
    '122009': 4.8, // Sector 42 / 43 (2-5 km)
    '122010': 6.5, // Sector 31 / 32 (5-10 km)
    '122011': 5.5, // Sector 17 / 18 (5-10 km)
    '122015': 3.8, // Sector 15 / 30 (2-5 km)
    '122016': 7.2, // Sector 38 / 39 (5-10 km)
    '122017': 8.5, // Sector 47 / 48 (5-10 km)
    '122018': 11.5, // Sector 56 / 57 (10-15 km)
    '122022': 12.8, // Sector 65 / 66 (10-15 km)
    '122101': 16.5, // Farrukhnagar / Outer (15+ km)
    '122102': 18.0, // Manesar / Outer (15+ km)
    '122505': 14.2, // Pataudi Rd (10-15 km)
    '122508': 15.8  // Sohna Rd Outer (15+ km)
  };

  if (PINCODE_DISTANCE_MAP[sanitized] !== undefined) {
    return PINCODE_DISTANCE_MAP[sanitized];
  }

  // Fallback heuristic for unknown pincodes based on digits
  const numericVal = parseInt(sanitized, 10);
  if (!isNaN(numericVal) && numericVal >= 122000 && numericVal <= 122999) {
    const lastDigits = numericVal % 100;
    return Math.min(20, Math.max(1.5, (lastDigits % 15) + 1.5));
  }

  return 3.5; // Standard fallback distance
}

/**
 * Centralized service to calculate matrix delivery charges or legacy fallback delivery charges.
 */
export function calculateDeliveryFee(
  subtotal: number,
  generalSettings?: Partial<CMSGeneralSettings> | null,
  distanceKmInput?: number | null
): DeliveryFeeResult {
  const validSubtotal = isNaN(Number(subtotal)) || Number(subtotal) < 0 ? 0 : Number(subtotal);

  // Extract general settings or default fallback
  const deliveryChargesEnabled = generalSettings?.deliveryChargesEnabled ?? DEFAULT_GENERAL_SETTINGS.deliveryChargesEnabled ?? true;
  const matrixConfig: DeliveryMatrixConfig = generalSettings?.deliveryMatrix ?? DEFAULT_DELIVERY_MATRIX;

  // If delivery charges are completely disabled globally
  if (!deliveryChargesEnabled) {
    return {
      fee: 0,
      isFree: true,
      isUnavailable: false,
      amountNeededForFreeDelivery: null,
      message: null
    };
  }

  // 1. SMART DELIVERY MATRIX CALCULATION
  if (matrixConfig && matrixConfig.enabled && matrixConfig.distanceBrackets?.length && matrixConfig.subtotalBrackets?.length) {
    const distanceKm = distanceKmInput ?? 1.5;

    // Match Distance Bracket
    let matchedDistanceBracket: DeliveryDistanceBracket | undefined = matrixConfig.distanceBrackets.find(b => {
      if (b.maxKm === null) {
        return distanceKm >= b.minKm;
      }
      return distanceKm >= b.minKm && distanceKm < b.maxKm;
    });

    // Fallback if boundary strictly equals highest or outside
    if (!matchedDistanceBracket) {
      if (distanceKm < 0) matchedDistanceBracket = matrixConfig.distanceBrackets[0];
      else matchedDistanceBracket = matrixConfig.distanceBrackets[matrixConfig.distanceBrackets.length - 1];
    }

    // Match Subtotal Bracket
    let matchedSubtotalBracket: DeliverySubtotalBracket | undefined = matrixConfig.subtotalBrackets.find(b => {
      if (b.maxSubtotal === null) {
        return validSubtotal >= b.minSubtotal;
      }
      return validSubtotal >= b.minSubtotal && validSubtotal < b.maxSubtotal;
    });

    if (!matchedSubtotalBracket) {
      if (validSubtotal < 0) matchedSubtotalBracket = matrixConfig.subtotalBrackets[0];
      else matchedSubtotalBracket = matrixConfig.subtotalBrackets[matrixConfig.subtotalBrackets.length - 1];
    }

    const cellKey = `${matchedDistanceBracket.id}_${matchedSubtotalBracket.id}`;
    const cell: DeliveryMatrixCell | undefined = matrixConfig.cells?.[cellKey];

    // Default or unconfigured cell
    if (!cell) {
      return {
        fee: 50,
        isFree: false,
        isUnavailable: false,
        amountNeededForFreeDelivery: null,
        message: null,
        distanceZone: matchedDistanceBracket.label,
        subtotalZone: matchedSubtotalBracket.label,
        distanceKm
      };
    }

    if (cell.mode === 'unavailable') {
      return {
        fee: 0,
        isFree: false,
        isUnavailable: true,
        amountNeededForFreeDelivery: null,
        message: 'Delivery is unavailable for this distance/subtotal combination.',
        distanceZone: matchedDistanceBracket.label,
        subtotalZone: matchedSubtotalBracket.label,
        distanceKm
      };
    }

    if (cell.mode === 'free' || cell.amount === 0) {
      return {
        fee: 0,
        isFree: true,
        isUnavailable: false,
        amountNeededForFreeDelivery: 0,
        message: '🎉 Congratulations! You unlocked FREE Delivery.',
        distanceZone: matchedDistanceBracket.label,
        subtotalZone: matchedSubtotalBracket.label,
        distanceKm
      };
    }

    return {
      fee: Math.round(cell.amount),
      isFree: false,
      isUnavailable: false,
      amountNeededForFreeDelivery: null,
      message: null,
      distanceZone: matchedDistanceBracket.label,
      subtotalZone: matchedSubtotalBracket.label,
      distanceKm
    };
  }

  // 2. LEGACY FLAT FEE & THRESHOLD FALLBACK
  const rawFee = generalSettings?.deliveryCharges ?? DEFAULT_GENERAL_SETTINGS.deliveryCharges;
  const rawThreshold = generalSettings?.freeDeliveryThreshold ?? DEFAULT_GENERAL_SETTINGS.freeDeliveryThreshold;
  const freeDeliveryThresholdEnabled = generalSettings?.freeDeliveryThresholdEnabled ?? DEFAULT_GENERAL_SETTINGS.freeDeliveryThresholdEnabled ?? true;

  const deliveryCharges = isNaN(Number(rawFee)) || Number(rawFee) < 0 ? 0 : Math.round(Number(rawFee));
  const freeDeliveryThreshold = isNaN(Number(rawThreshold)) || Number(rawThreshold) < 0 ? 0 : Math.round(Number(rawThreshold));

  if (deliveryCharges === 0) {
    return {
      fee: 0,
      isFree: true,
      isUnavailable: false,
      amountNeededForFreeDelivery: null,
      message: null
    };
  }

  if (freeDeliveryThresholdEnabled && validSubtotal >= freeDeliveryThreshold) {
    return {
      fee: 0,
      isFree: true,
      isUnavailable: false,
      amountNeededForFreeDelivery: 0,
      message: '🎉 Congratulations! You unlocked FREE Delivery.'
    };
  }

  if (freeDeliveryThresholdEnabled && freeDeliveryThreshold > 0) {
    const amountNeeded = Math.max(0, freeDeliveryThreshold - validSubtotal);
    return {
      fee: deliveryCharges,
      isFree: false,
      isUnavailable: false,
      amountNeededForFreeDelivery: amountNeeded,
      message: `Add ₹${amountNeeded} more to unlock FREE Delivery.`
    };
  }

  return {
    fee: deliveryCharges,
    isFree: false,
    isUnavailable: false,
    amountNeededForFreeDelivery: null,
    message: null
  };
}
