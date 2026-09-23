import { CMSGeneralSettings } from '@/types/cms';
import { DEFAULT_GENERAL_SETTINGS } from '@/constants/cmsDefaults';

export interface DeliveryFeeResult {
  fee: number;
  isFree: boolean;
  amountNeededForFreeDelivery: number | null;
  message: string | null;
}

/**
 * Centralized utility to calculate delivery fee and threshold messages.
 * Handles disabled states, threshold conditions, zero fee, and invalid numbers safely.
 */
export function calculateDeliveryFee(
  subtotal: number,
  generalSettings?: Partial<CMSGeneralSettings> | null
): DeliveryFeeResult {
  // Safe extraction with default fallback values
  const rawFee = generalSettings?.deliveryCharges ?? DEFAULT_GENERAL_SETTINGS.deliveryCharges;
  const deliveryChargesEnabled = generalSettings?.deliveryChargesEnabled ?? DEFAULT_GENERAL_SETTINGS.deliveryChargesEnabled ?? true;
  const rawThreshold = generalSettings?.freeDeliveryThreshold ?? DEFAULT_GENERAL_SETTINGS.freeDeliveryThreshold;
  const freeDeliveryThresholdEnabled = generalSettings?.freeDeliveryThresholdEnabled ?? DEFAULT_GENERAL_SETTINGS.freeDeliveryThresholdEnabled ?? true;

  // Sanitize numeric inputs (prevent NaN, negative values)
  const deliveryCharges = isNaN(Number(rawFee)) || Number(rawFee) < 0 ? 0 : Math.round(Number(rawFee));
  const freeDeliveryThreshold = isNaN(Number(rawThreshold)) || Number(rawThreshold) < 0 ? 0 : Math.round(Number(rawThreshold));
  const validSubtotal = isNaN(Number(subtotal)) || Number(subtotal) < 0 ? 0 : Number(subtotal);

  // Case 1: Delivery charges completely disabled by admin
  if (!deliveryChargesEnabled) {
    return {
      fee: 0,
      isFree: true,
      amountNeededForFreeDelivery: null,
      message: null
    };
  }

  // Case 2: Configured delivery fee is 0
  if (deliveryCharges === 0) {
    return {
      fee: 0,
      isFree: true,
      amountNeededForFreeDelivery: null,
      message: null
    };
  }

  // Case 3: Free delivery threshold is enabled and subtotal reaches or exceeds threshold
  if (freeDeliveryThresholdEnabled && validSubtotal >= freeDeliveryThreshold) {
    return {
      fee: 0,
      isFree: true,
      amountNeededForFreeDelivery: 0,
      message: null
    };
  }

  // Case 4: Free delivery threshold is enabled and subtotal is below threshold
  if (freeDeliveryThresholdEnabled && freeDeliveryThreshold > 0) {
    const amountNeeded = Math.max(0, freeDeliveryThreshold - validSubtotal);
    return {
      fee: deliveryCharges,
      isFree: false,
      amountNeededForFreeDelivery: amountNeeded,
      message: `Add ₹${amountNeeded} more to unlock FREE Delivery.`
    };
  }

  // Case 5: Threshold disabled, standard fee applies
  return {
    fee: deliveryCharges,
    isFree: false,
    amountNeededForFreeDelivery: null,
    message: null
  };
}
