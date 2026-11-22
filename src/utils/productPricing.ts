interface DiscountableProduct {
  price: number;
  discountPrice?: number | null;
}

export interface ProductPricing {
  price: number;
  originalPrice?: number;
  discountPercent?: number;
}

export const getProductPricing = (
  product: DiscountableProduct,
  regularPrice: number = product.price
): ProductPricing => {
  const discountValue = product.discountPrice;
  const basePrice = Number(product.price);
  const discountPrice = Number(discountValue);

  if (
    discountValue === null ||
    discountValue === undefined ||
    String(discountValue).trim() === '' ||
    !Number.isFinite(basePrice) ||
    basePrice <= 0 ||
    !Number.isFinite(discountPrice) ||
    discountPrice <= 0 ||
    discountPrice >= basePrice ||
    !Number.isFinite(regularPrice) ||
    regularPrice <= 0
  ) {
    return { price: regularPrice };
  }

  return {
    price: Math.round(regularPrice * (discountPrice / basePrice)),
    originalPrice: regularPrice,
    discountPercent: Math.round(((basePrice - discountPrice) / basePrice) * 100),
  };
};
