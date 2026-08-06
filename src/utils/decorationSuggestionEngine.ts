import { db } from '@/utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { DecorationProduct } from '@/types/decorations';

const fallbackDecorations: DecorationProduct[] = [
  {
    id: 'dec_1',
    name: 'Party Poppers (Premium)',
    category: 'Party Essentials',
    brand: 'Celebrations Co.',
    shortDescription: 'Metallic confetti party popper for birthdays & anniversaries.',
    fullDescription: 'Make your party pop with these safe, premium quality spring-loaded party poppers filled with shiny golden & silver metallic foil confetti.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Party Popper' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 99,
    sku: 'PP-PREM',
    stockQuantity: 150,
    reservedStock: 2,
    soldQuantity: 45,
    lowStockWarning: 15,
    status: 'Active',
    sortOrder: 1,
    tags: ['birthday', 'party', 'popper'],
    visibility: {
      showOnHomepage: true,
      showInProductPageSuggestions: true,
      showInCartSuggestions: true,
      showInCheckoutPage: true,
      showInRelatedProducts: true,
      showInBirthdayCollection: true,
      showInSearchResults: true,
      showInFeaturedProducts: true,
      showInNewArrivals: true,
      showInFestivalCollection: true,
      hideEverywhere: false
    },
    recommendations: {
      recommendWithCakes: true,
      recommendWithPastries: false,
      recommendWithCupcakes: false,
      recommendWithHampers: false,
      recommendWithCustomCakes: true,
      specificProductIds: []
    },
    upsell: {
      frequentlyBoughtTogether: true,
      customersAlsoBought: true,
      recommendedAddons: true,
      popularWithThisCake: true
    },
    autoDisableWhenOutOfStock: true
  },
  {
    id: 'dec_2',
    name: 'Sparkle Candles (Pack of 5)',
    category: 'Candles',
    brand: 'GlowLight',
    shortDescription: 'Amazing sparkling candles to light up celebrations.',
    fullDescription: 'Premium indoor-safe cold pyro sparkler candles that burn with beautiful silver sparks for up to 30 seconds.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Sparkle Candles' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 149,
    sku: 'SPK-CAND',
    stockQuantity: 80,
    reservedStock: 0,
    soldQuantity: 120,
    lowStockWarning: 20,
    status: 'Active',
    sortOrder: 2,
    tags: ['sparkle', 'candles', 'celebration'],
    visibility: {
      showOnHomepage: true,
      showInProductPageSuggestions: true,
      showInCartSuggestions: true,
      showInCheckoutPage: true,
      showInRelatedProducts: true,
      showInBirthdayCollection: true,
      showInSearchResults: true,
      showInFeaturedProducts: true,
      showInNewArrivals: true,
      showInFestivalCollection: true,
      hideEverywhere: false
    },
    recommendations: {
      recommendWithCakes: true,
      recommendWithPastries: true,
      recommendWithCupcakes: true,
      recommendWithHampers: false,
      recommendWithCustomCakes: true,
      specificProductIds: []
    },
    upsell: {
      frequentlyBoughtTogether: true,
      customersAlsoBought: true,
      recommendedAddons: true,
      popularWithThisCake: true
    },
    autoDisableWhenOutOfStock: true
  },
  {
    id: 'dec_3',
    name: 'Spiral Candles (Pack of 10)',
    category: 'Candles',
    brand: 'GlowLight',
    shortDescription: 'Colorful spiral birthday candles.',
    fullDescription: 'Premium wax colorful candles in beautiful spiral shapes with matching holders.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Spiral Candles' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 49,
    sku: 'SPL-CAND',
    stockQuantity: 200,
    reservedStock: 5,
    soldQuantity: 300,
    lowStockWarning: 30,
    status: 'Active',
    sortOrder: 3,
    tags: ['candles', 'spiral', 'birthday'],
    visibility: {
      showOnHomepage: false,
      showInProductPageSuggestions: true,
      showInCartSuggestions: true,
      showInCheckoutPage: true,
      showInRelatedProducts: true,
      showInBirthdayCollection: false,
      showInSearchResults: true,
      showInFeaturedProducts: false,
      showInNewArrivals: false,
      showInFestivalCollection: false,
      hideEverywhere: false
    },
    recommendations: {
      recommendWithCakes: true,
      recommendWithPastries: true,
      recommendWithCupcakes: true,
      recommendWithHampers: false,
      recommendWithCustomCakes: false,
      specificProductIds: []
    },
    upsell: {
      frequentlyBoughtTogether: true,
      customersAlsoBought: true,
      recommendedAddons: true,
      popularWithThisCake: true
    },
    autoDisableWhenOutOfStock: true
  },
  {
    id: 'dec_4',
    name: 'Birthday Girl Sash',
    category: 'Birthday Accessories',
    brand: 'PartyVibe',
    shortDescription: 'Premium glitter satin sash for birthday girl.',
    fullDescription: 'High quality pink glitter satin sash with bold gold letters "Birthday Girl". Perfect fit with adjustable clip.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Birthday Girl Sash' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 199,
    sku: 'SSH-BGIRL',
    stockQuantity: 40,
    reservedStock: 1,
    soldQuantity: 15,
    lowStockWarning: 5,
    status: 'Active',
    sortOrder: 4,
    tags: ['sash', 'birthday', 'girl'],
    visibility: {
      showOnHomepage: true,
      showInProductPageSuggestions: true,
      showInCartSuggestions: false,
      showInCheckoutPage: false,
      showInRelatedProducts: true,
      showInBirthdayCollection: true,
      showInSearchResults: true,
      showInFeaturedProducts: true,
      showInNewArrivals: true,
      showInFestivalCollection: false,
      hideEverywhere: false
    },
    recommendations: {
      recommendWithCakes: true,
      recommendWithPastries: false,
      recommendWithCupcakes: false,
      recommendWithHampers: false,
      recommendWithCustomCakes: true,
      specificProductIds: []
    },
    upsell: {
      frequentlyBoughtTogether: false,
      customersAlsoBought: true,
      recommendedAddons: false,
      popularWithThisCake: false
    },
    autoDisableWhenOutOfStock: true
  },
  {
    id: 'dec_5',
    name: 'Birthday Crown',
    category: 'Birthday Accessories',
    brand: 'PartyVibe',
    shortDescription: 'Elegant golden crown for birthdays.',
    fullDescription: 'Comfortable, shining golden plastic crown decorated with jewels for kids & adults alike.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Birthday Crown' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 249,
    sku: 'CRN-BDAY',
    stockQuantity: 25,
    reservedStock: 0,
    soldQuantity: 8,
    lowStockWarning: 6,
    status: 'Active',
    sortOrder: 5,
    tags: ['crown', 'birthday', 'king', 'queen'],
    visibility: {
      showOnHomepage: true,
      showInProductPageSuggestions: true,
      showInCartSuggestions: false,
      showInCheckoutPage: false,
      showInRelatedProducts: true,
      showInBirthdayCollection: true,
      showInSearchResults: true,
      showInFeaturedProducts: true,
      showInNewArrivals: true,
      showInFestivalCollection: false,
      hideEverywhere: false
    },
    recommendations: {
      recommendWithCakes: true,
      recommendWithPastries: false,
      recommendWithCupcakes: false,
      recommendWithHampers: false,
      recommendWithCustomCakes: true,
      specificProductIds: []
    },
    upsell: {
      frequentlyBoughtTogether: false,
      customersAlsoBought: true,
      recommendedAddons: false,
      popularWithThisCake: false
    },
    autoDisableWhenOutOfStock: true
  },
  {
    id: 'dec_6',
    name: 'Birthday Tiara',
    category: 'Birthday Accessories',
    brand: 'PartyVibe',
    shortDescription: 'Shining diamond tiara accessory.',
    fullDescription: 'Beautiful metal rhinestone tiara with comb ends to fit securely on hair. Perfect for birthday girls.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Birthday Tiara' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 299,
    sku: 'TRA-BDAY',
    stockQuantity: 5,
    reservedStock: 0,
    soldQuantity: 12,
    lowStockWarning: 3,
    status: 'Active',
    sortOrder: 6,
    tags: ['tiara', 'birthday', 'princess'],
    visibility: {
      showOnHomepage: true,
      showInProductPageSuggestions: true,
      showInCartSuggestions: false,
      showInCheckoutPage: false,
      showInRelatedProducts: true,
      showInBirthdayCollection: true,
      showInSearchResults: true,
      showInFeaturedProducts: true,
      showInNewArrivals: true,
      showInFestivalCollection: false,
      hideEverywhere: false
    },
    recommendations: {
      recommendWithCakes: true,
      recommendWithPastries: false,
      recommendWithCupcakes: false,
      recommendWithHampers: false,
      recommendWithCustomCakes: true,
      specificProductIds: []
    },
    upsell: {
      frequentlyBoughtTogether: false,
      customersAlsoBought: true,
      recommendedAddons: false,
      popularWithThisCake: false
    },
    autoDisableWhenOutOfStock: true
  },
  {
    id: 'dec_7',
    name: 'Snow Spray (Premium)',
    category: 'Celebration Products',
    brand: 'FunBlast',
    shortDescription: 'Celebration artificial snow spray can.',
    fullDescription: 'Non-toxic, premium artificial snow spray can. Perfect for celebrations, weddings, and parties.',
    images: [{ url: '/images/products/placeholder.jpg', displayOrder: 1, altText: 'Snow Spray' }],
    thumbnailImage: '/images/products/placeholder.jpg',
    price: 79,
    sku: 'SNW-SPRY',
    stockQuantity: 120,
    reservedStock: 1,
    soldQuantity: 240,
    lowStockWarning: 20,
    status: 'Active',
    sortOrder: 7,
    tags: ['spray', 'snow', 'party', 'fun'],
    visibility: {
      showOnHomepage: false,
      showInProductPageSuggestions: true,
      showInCartSuggestions: true,
      showInCheckoutPage: true,
      showInRelatedProducts: true,
      showInBirthdayCollection: false,
      showInSearchResults: true,
      showInFeaturedProducts: false,
      showInNewArrivals: false,
      showInFestivalCollection: false,
      hideEverywhere: false
    },
    recommendations: {
      recommendWithCakes: true,
      recommendWithPastries: false,
      recommendWithCupcakes: false,
      recommendWithHampers: false,
      recommendWithCustomCakes: false,
      specificProductIds: []
    },
    upsell: {
      frequentlyBoughtTogether: true,
      customersAlsoBought: true,
      recommendedAddons: true,
      popularWithThisCake: true
    },
    autoDisableWhenOutOfStock: true
  }
];

export const getDecorationSuggestions = async (context: {
  placement: 'pdp' | 'cart' | 'checkout';
  cartCategories: string[];
  currentProductCategory?: string;
  currentProductId?: string;
}): Promise<DecorationProduct[]> => {
  let allDecos: DecorationProduct[] = [];

  // 1. Fetch from Firestore if configured
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "your_api_key") {
    console.warn("Firebase not configured, utilizing local fallback decorations catalog.");
    allDecos = (window as any)._adminDecorations || fallbackDecorations;
  } else {
    try {
      const snap = await getDocs(collection(db, 'decorations'));
      allDecos = snap.docs.map(doc => ({ ...doc.data(), id: doc.id })) as DecorationProduct[];
      if (allDecos.length === 0) {
        allDecos = fallbackDecorations;
      }
    } catch (err) {
      console.error("Error loading decorations suggestions:", err);
      allDecos = fallbackDecorations;
    }
  }

  // 2. Filter by status: must be Active & Stock > 0 (if autoDisableWhenOutOfStock is active)
  allDecos = allDecos.filter(d => {
    if (d.status === 'Draft' || d.status === 'Out of Stock') return false;
    if (d.visibility?.hideEverywhere) return false;
    if (d.autoDisableWhenOutOfStock && d.stockQuantity <= 0) return false;
    return true;
  });

  // 3. Filter by Placement constraints
  allDecos = allDecos.filter(d => {
    if (context.placement === 'pdp' && !d.visibility?.showInProductPageSuggestions) return false;
    if (context.placement === 'cart' && !d.visibility?.showInCartSuggestions) return false;
    if (context.placement === 'checkout' && !d.visibility?.showInCheckoutPage) return false;
    return true;
  });

  // 4. Smart Matching Engine rules based on category context
  const categoriesToCheck = new Set<string>();
  if (context.currentProductCategory) categoriesToCheck.add(context.currentProductCategory);
  context.cartCategories.forEach(cat => categoriesToCheck.add(cat));

  const hasCakes = Array.from(categoriesToCheck).some(cat => cat.toLowerCase().includes('cake') && !cat.toLowerCase().includes('custom'));
  const hasPastries = Array.from(categoriesToCheck).some(cat => cat.toLowerCase().includes('pastry'));
  const hasCupcakes = Array.from(categoriesToCheck).some(cat => cat.toLowerCase().includes('cupcake'));
  const hasHampers = Array.from(categoriesToCheck).some(cat => cat.toLowerCase().includes('hamper'));
  const hasCustomCakes = Array.from(categoriesToCheck).some(cat => cat.toLowerCase().includes('custom'));

  // Filter based on item rules
  let matchedDecos = allDecos.filter(d => {
    const rules = d.recommendations;
    if (!rules) return true; // if rules are empty/unconfigured, allow it

    // Manual specific overrides
    if (context.currentProductId && rules.specificProductIds?.includes(context.currentProductId)) {
      return true;
    }

    if (hasCakes && rules.recommendWithCakes) return true;
    if (hasPastries && rules.recommendWithPastries) return true;
    if (hasCupcakes && rules.recommendWithCupcakes) return true;
    if (hasHampers && rules.recommendWithHampers) return true;
    if (hasCustomCakes && rules.recommendWithCustomCakes) return true;

    // If no specific category matched but we have other products, default recommend if overall rules are empty or basic
    if (categoriesToCheck.size === 0) return true;

    return false;
  });

  // Sort by Sort Order
  matchedDecos.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));

  return matchedDecos;
};
