import {
  NavigationItem,
  MegaMenuSection,
  HomepageSection,
  Announcement,
  CollectionCMSItem,
  CMSWebsiteSettings,
  CMSMediaItem,
  CMSSEOMetadata,
  CMSGeneralSettings,
  AboutFeatureCard,
  AboutSectionSettings,
  CMSCategory,
  FeaturedProductsSettings,
  CMSTestimonial,
  CMSGalleryItem
} from '@/types/cms';

export const DEFAULT_NAVIGATION: NavigationItem[] = [
  {
    id: 'cakes',
    label: 'Cakes',
    linkType: 'internal',
    url: '/menu',
    enabled: true,
    displayOrder: 0,
    showOnDesktop: true,
    showOnMobile: true,
    hasDropdown: true,
    dropdownSectionIds: ['cakes_category', 'cakes_designer', 'cakes_flavours', 'cakes_occasions']
  },
  {
    id: 'bento',
    label: 'Bento',
    linkType: 'internal',
    url: '/menu?category=bento-cakes',
    enabled: true,
    displayOrder: 1,
    showOnDesktop: true,
    showOnMobile: true,
    hasDropdown: true,
    dropdownSectionIds: ['bento_cakes', 'bento_designs', 'bento_flavours', 'bento_combos']
  },
  {
    id: 'theme-cakes',
    label: 'Theme Cakes',
    linkType: 'internal',
    url: '/menu?category=theme-cakes',
    enabled: true,
    displayOrder: 2,
    showOnDesktop: true,
    showOnMobile: true,
    hasDropdown: true,
    dropdownSectionIds: ['theme_kids', 'theme_char', 'theme_girls', 'theme_boys']
  },
  {
    id: 'by-relationship',
    label: 'By Relationship',
    linkType: 'internal',
    url: '/menu?category=couple-cakes',
    enabled: true,
    displayOrder: 3,
    showOnDesktop: true,
    showOnMobile: true,
    hasDropdown: true,
    dropdownSectionIds: ['rel_family', 'rel_couples', 'rel_friends', 'rel_special']
  },
  {
    id: 'desserts',
    label: 'Desserts',
    linkType: 'internal',
    url: '/menu?category=dessert-boxes',
    enabled: true,
    displayOrder: 4,
    showOnDesktop: true,
    showOnMobile: true,
    hasDropdown: true,
    dropdownSectionIds: ['dess_items', 'dess_hampers', 'dess_combos', 'dess_premium']
  },
  {
    id: 'birthday',
    label: 'Birthday',
    linkType: 'internal',
    url: '/menu?category=birthday-cakes',
    enabled: true,
    displayOrder: 5,
    showOnDesktop: true,
    showOnMobile: true,
    hasDropdown: true,
    dropdownSectionIds: ['bday_cakes', 'bday_trending', 'bday_flavours', 'bday_combos']
  },
  {
    id: 'anniversary',
    label: 'Anniversary',
    linkType: 'internal',
    url: '/menu?category=anniversary-cakes',
    enabled: true,
    displayOrder: 6,
    showOnDesktop: true,
    showOnMobile: true,
    hasDropdown: true,
    dropdownSectionIds: ['ann_romantic', 'ann_designer', 'ann_special']
  }
];

export const DEFAULT_MEGA_MENUS: MegaMenuSection[] = [
  // Cakes Columns
  {
    id: 'cakes_category',
    title: 'Category',
    displayOrder: 0,
    enabled: true,
    items: [
      { id: 'c1', name: 'Birthday Cakes', slug: 'birthday-cakes', url: '/menu?category=birthday-cakes', displayOrder: 0, enabled: true },
      { id: 'c2', name: 'Wedding Cakes', slug: 'wedding-cakes', url: '/menu?category=wedding-cakes', displayOrder: 1, enabled: true },
      { id: 'c3', name: 'Anniversary Cakes', slug: 'anniversary-cakes', url: '/menu?category=anniversary-cakes', displayOrder: 2, enabled: true },
      { id: 'c4', name: 'Bento Cakes', slug: 'bento-cakes', url: '/menu?category=bento-cakes', displayOrder: 3, enabled: true },
      { id: 'c5', name: 'Theme Cakes', slug: 'theme-cakes', url: '/menu?category=theme-cakes', displayOrder: 4, enabled: true },
      { id: 'c6', name: 'Photo Cakes', slug: 'photo-cakes', url: '/menu?category=photo-cakes', displayOrder: 5, enabled: true }
    ]
  },
  {
    id: 'cakes_designer',
    title: 'Designer',
    displayOrder: 1,
    enabled: true,
    items: [
      { id: 'd1', name: 'Designer Cakes', slug: 'designer-cakes', url: '/menu?category=designer-cakes', displayOrder: 0, enabled: true },
      { id: 'd2', name: 'Fondant Cakes', slug: 'designer-cakes', url: '/menu?category=designer-cakes', displayOrder: 1, enabled: true },
      { id: 'd3', name: 'Tier Cakes', slug: 'wedding-cakes', url: '/menu?category=wedding-cakes', displayOrder: 2, enabled: true },
      { id: 'd4', name: 'Half Cakes', slug: 'custom-cake', url: '/custom-cake', displayOrder: 3, enabled: true }
    ]
  },
  {
    id: 'cakes_flavours',
    title: 'Flavours',
    displayOrder: 2,
    enabled: true,
    items: [
      { id: 'f1', name: 'Chocolate Cakes', slug: 'chocolate-cakes', url: '/menu?category=chocolate-cakes', displayOrder: 0, enabled: true },
      { id: 'f2', name: 'Vanilla Cakes', slug: 'vanilla-cakes', url: '/menu?category=vanilla-cakes', displayOrder: 1, enabled: true },
      { id: 'f3', name: 'Pineapple Cakes', slug: 'fruit-cakes', url: '/menu?category=fruit-cakes', displayOrder: 2, enabled: true },
      { id: 'f4', name: 'Oreo Cakes', slug: 'trending-cakes', url: '/menu?category=trending-cakes', displayOrder: 3, enabled: true },
      { id: 'f5', name: 'Kitkat Cakes', slug: 'trending-cakes', url: '/menu?category=trending-cakes', displayOrder: 4, enabled: true }
    ]
  },
  {
    id: 'cakes_occasions',
    title: 'Occasions',
    displayOrder: 3,
    enabled: true,
    items: [
      { id: 'o1', name: 'Birthday Cakes', slug: 'birthday-cakes', url: '/menu?category=birthday-cakes', displayOrder: 0, enabled: true },
      { id: 'o2', name: 'Wedding Cakes', slug: 'wedding-cakes', url: '/menu?category=wedding-cakes', displayOrder: 1, enabled: true },
      { id: 'o3', name: 'Anniversary Cakes', slug: 'anniversary-cakes', url: '/menu?category=anniversary-cakes', displayOrder: 2, enabled: true },
      { id: 'o4', name: 'Baby Shower Cakes', slug: 'baby-shower-cakes', url: '/menu?category=baby-shower-cakes', displayOrder: 3, enabled: true }
    ]
  },

  // Bento Columns
  {
    id: 'bento_cakes',
    title: 'Bento Cakes',
    displayOrder: 0,
    enabled: true,
    items: [
      { id: 'bc1', name: 'Mini Bento Cakes', slug: 'bento-cakes', url: '/menu?category=bento-cakes', displayOrder: 0, enabled: true },
      { id: 'bc2', name: 'Korean Bento Cakes', slug: 'korean-cakes', url: '/menu?category=korean-cakes', displayOrder: 1, enabled: true },
      { id: 'bc3', name: 'Cute Bento Cakes', slug: 'kids-cakes', url: '/menu?category=kids-cakes', displayOrder: 2, enabled: true },
      { id: 'bc4', name: 'Heart Bento Cakes', slug: 'heart-cakes', url: '/menu?category=heart-cakes', displayOrder: 3, enabled: true },
      { id: 'bc5', name: 'Funny Bento Cakes', slug: 'cartoon-cakes', url: '/menu?category=cartoon-cakes', displayOrder: 4, enabled: true }
    ]
  },
  {
    id: 'bento_designs',
    title: 'Designs',
    displayOrder: 1,
    enabled: true,
    items: [
      { id: 'bd1', name: 'Cartoon Bento', slug: 'cartoon-cakes', url: '/menu?category=cartoon-cakes', displayOrder: 0, enabled: true },
      { id: 'bd2', name: 'Pastel Bento', slug: 'minimal-cakes', url: '/menu?category=minimal-cakes', displayOrder: 1, enabled: true },
      { id: 'bd3', name: 'Minimal Bento', slug: 'minimal-cakes', url: '/menu?category=minimal-cakes', displayOrder: 2, enabled: true },
      { id: 'bd4', name: 'Chocolate Bento', slug: 'chocolate-cakes', url: '/menu?category=chocolate-cakes', displayOrder: 3, enabled: true }
    ]
  },
  {
    id: 'bento_flavours',
    title: 'Flavours',
    displayOrder: 2,
    enabled: true,
    items: [
      { id: 'bf1', name: 'Chocolate', slug: 'chocolate-cakes', url: '/menu?category=chocolate-cakes', displayOrder: 0, enabled: true },
      { id: 'bf2', name: 'Red Velvet', slug: 'red-velvet-cakes', url: '/menu?category=red-velvet-cakes', displayOrder: 1, enabled: true },
      { id: 'bf3', name: 'Vanilla', slug: 'vanilla-cakes', url: '/menu?category=vanilla-cakes', displayOrder: 2, enabled: true },
      { id: 'bf4', name: 'Strawberry', slug: 'fruit-cakes', url: '/menu?category=fruit-cakes', displayOrder: 3, enabled: true }
    ]
  },
  {
    id: 'bento_combos',
    title: 'Combos',
    displayOrder: 3,
    enabled: true,
    items: [
      { id: 'bco1', name: 'Bento + Cupcakes', slug: 'cupcakes', url: '/menu?category=cupcakes', displayOrder: 0, enabled: true },
      { id: 'bco2', name: 'Bento + Flowers', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 1, enabled: true },
      { id: 'bco3', name: 'Bento Gift Box', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 2, enabled: true }
    ]
  },

  // Theme Cakes Columns
  {
    id: 'theme_kids',
    title: 'Kids Cakes',
    displayOrder: 0,
    enabled: true,
    items: [
      { id: 'tk1', name: 'Cocomelon Cakes', slug: 'kids-cakes', url: '/menu?category=kids-cakes', displayOrder: 0, enabled: true },
      { id: 'tk2', name: 'Frozen Cakes', slug: 'kids-cakes', url: '/menu?category=kids-cakes', displayOrder: 1, enabled: true },
      { id: 'tk3', name: 'Unicorn Cakes', slug: 'kids-cakes', url: '/menu?category=kids-cakes', displayOrder: 2, enabled: true },
      { id: 'tk4', name: 'Baby Shark Cakes', slug: 'kids-cakes', url: '/menu?category=kids-cakes', displayOrder: 3, enabled: true },
      { id: 'tk5', name: 'Peppa Pig Cakes', slug: 'kids-cakes', url: '/menu?category=kids-cakes', displayOrder: 4, enabled: true }
    ]
  },
  {
    id: 'theme_char',
    title: 'Character Cakes',
    displayOrder: 1,
    enabled: true,
    items: [
      { id: 'tc1', name: 'Spiderman Cakes', slug: 'cartoon-cakes', url: '/menu?category=cartoon-cakes', displayOrder: 0, enabled: true },
      { id: 'tc2', name: 'Batman Cakes', slug: 'cartoon-cakes', url: '/menu?category=cartoon-cakes', displayOrder: 1, enabled: true },
      { id: 'tc3', name: 'Naruto Cakes', slug: 'anime-cakes', url: '/menu?category=anime-cakes', displayOrder: 2, enabled: true },
      { id: 'tc4', name: 'Pokemon Cakes', slug: 'anime-cakes', url: '/menu?category=anime-cakes', displayOrder: 3, enabled: true },
      { id: 'tc5', name: 'Avengers Cakes', slug: 'superhero-cakes', url: '/menu?category=superhero-cakes', displayOrder: 4, enabled: true }
    ]
  },
  {
    id: 'theme_girls',
    title: 'Girls Cakes',
    displayOrder: 2,
    enabled: true,
    items: [
      { id: 'tg1', name: 'Barbie Cakes', slug: 'romantic-cakes', url: '/menu?category=romantic-cakes', displayOrder: 0, enabled: true },
      { id: 'tg2', name: 'Princess Cakes', slug: 'romantic-cakes', url: '/menu?category=romantic-cakes', displayOrder: 1, enabled: true },
      { id: 'tg3', name: 'Butterfly Cakes', slug: 'romantic-cakes', url: '/menu?category=romantic-cakes', displayOrder: 2, enabled: true },
      { id: 'tg4', name: 'Pink Theme Cakes', slug: 'romantic-cakes', url: '/menu?category=romantic-cakes', displayOrder: 3, enabled: true }
    ]
  },
  {
    id: 'theme_boys',
    title: 'Boys Cakes',
    displayOrder: 3,
    enabled: true,
    items: [
      { id: 'tb1', name: 'Car Cakes', slug: 'superhero-cakes', url: '/menu?category=superhero-cakes', displayOrder: 0, enabled: true },
      { id: 'tb2', name: 'Football Cakes', slug: 'superhero-cakes', url: '/menu?category=superhero-cakes', displayOrder: 1, enabled: true },
      { id: 'tb3', name: 'Cricket Cakes', slug: 'superhero-cakes', url: '/menu?category=superhero-cakes', displayOrder: 2, enabled: true },
      { id: 'tb4', name: 'Bike Cakes', slug: 'superhero-cakes', url: '/menu?category=superhero-cakes', displayOrder: 3, enabled: true }
    ]
  },

  // By Relationship Columns
  {
    id: 'rel_family',
    title: 'Family',
    displayOrder: 0,
    enabled: true,
    items: [
      { id: 'rf1', name: 'Mom Cakes', slug: 'mothers-day-cakes', url: '/menu?category=mothers-day-cakes', displayOrder: 0, enabled: true },
      { id: 'rf2', name: 'Dad Cakes', slug: 'fathers-day-cakes', url: '/menu?category=fathers-day-cakes', displayOrder: 1, enabled: true },
      { id: 'rf3', name: 'Brother Cakes', slug: 'custom-cake', url: '/custom-cake', displayOrder: 2, enabled: true },
      { id: 'rf4', name: 'Sister Cakes', slug: 'custom-cake', url: '/custom-cake', displayOrder: 3, enabled: true }
    ]
  },
  {
    id: 'rel_couples',
    title: 'Couples',
    displayOrder: 1,
    enabled: true,
    items: [
      { id: 'rc1', name: 'Husband Cakes', slug: 'couple-cakes', url: '/menu?category=couple-cakes', displayOrder: 0, enabled: true },
      { id: 'rc2', name: 'Wife Cakes', slug: 'couple-cakes', url: '/menu?category=couple-cakes', displayOrder: 1, enabled: true },
      { id: 'rc3', name: 'Boyfriend Cakes', slug: 'couple-cakes', url: '/menu?category=couple-cakes', displayOrder: 2, enabled: true },
      { id: 'rc4', name: 'Girlfriend Cakes', slug: 'couple-cakes', url: '/menu?category=couple-cakes', displayOrder: 3, enabled: true }
    ]
  },
  {
    id: 'rel_friends',
    title: 'Friends',
    displayOrder: 2,
    enabled: true,
    items: [
      { id: 'rfr1', name: 'Best Friend Cakes', slug: 'friendship-cakes', url: '/menu?category=friendship-cakes', displayOrder: 0, enabled: true },
      { id: 'rfr2', name: 'Friendship Cakes', slug: 'friendship-cakes', url: '/menu?category=friendship-cakes', displayOrder: 1, enabled: true },
      { id: 'rfr3', name: 'Funny Cakes', slug: 'cartoon-cakes', url: '/menu?category=cartoon-cakes', displayOrder: 2, enabled: true }
    ]
  },
  {
    id: 'rel_special',
    title: 'Special',
    displayOrder: 3,
    enabled: true,
    items: [
      { id: 'rs1', name: 'Love Cakes', slug: 'romantic-cakes', url: '/menu?category=romantic-cakes', displayOrder: 0, enabled: true },
      { id: 'rs2', name: 'Miss You Cakes', slug: 'romantic-cakes', url: '/menu?category=romantic-cakes', displayOrder: 1, enabled: true },
      { id: 'rs3', name: 'Thank You Cakes', slug: 'romantic-cakes', url: '/menu?category=romantic-cakes', displayOrder: 2, enabled: true }
    ]
  },

  // Desserts Columns
  {
    id: 'dess_items',
    title: 'Desserts',
    displayOrder: 0,
    enabled: true,
    items: [
      { id: 'de1', name: 'Cupcakes', slug: 'cupcakes', url: '/menu?category=cupcakes', displayOrder: 0, enabled: true },
      { id: 'de2', name: 'Brownies', slug: 'brownies', url: '/menu?category=brownies', displayOrder: 1, enabled: true },
      { id: 'de3', name: 'Pastries', slug: 'pastries', url: '/menu?category=pastries', displayOrder: 2, enabled: true },
      { id: 'de4', name: 'Jar Cakes', slug: 'jar-cakes', url: '/menu?category=jar-cakes', displayOrder: 3, enabled: true }
    ]
  },
  {
    id: 'dess_hampers',
    title: 'Hampers',
    displayOrder: 1,
    enabled: true,
    items: [
      { id: 'deh1', name: 'Chocolate Hampers', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 0, enabled: true },
      { id: 'deh2', name: 'Cake Hampers', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 1, enabled: true },
      { id: 'deh3', name: 'Gift Boxes', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 2, enabled: true }
    ]
  },
  {
    id: 'dess_combos',
    title: 'Combos',
    displayOrder: 2,
    enabled: true,
    items: [
      { id: 'dec1', name: 'Cake + Flowers', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 0, enabled: true },
      { id: 'dec2', name: 'Cake + Teddy', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 1, enabled: true },
      { id: 'dec3', name: 'Cake + Chocolates', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 2, enabled: true }
    ]
  },
  {
    id: 'dess_premium',
    title: 'Premium',
    displayOrder: 3,
    enabled: true,
    items: [
      { id: 'dep1', name: 'Luxury Hampers', slug: 'luxury-cakes', url: '/menu?category=luxury-cakes', displayOrder: 0, enabled: true },
      { id: 'dep2', name: 'Custom Gifts', slug: 'custom-cake', url: '/custom-cake', displayOrder: 1, enabled: true },
      { id: 'dep3', name: 'Festival Hampers', slug: 'festival-cakes', url: '/menu?category=festival-cakes', displayOrder: 2, enabled: true }
    ]
  },

  // Birthday Columns
  {
    id: 'bday_cakes',
    title: 'Birthday Cakes',
    displayOrder: 0,
    enabled: true,
    items: [
      { id: 'bdc1', name: 'Kids Birthday Cakes', slug: 'kids-cakes', url: '/menu?category=kids-cakes', displayOrder: 0, enabled: true },
      { id: 'bdc2', name: 'Adult Cakes', slug: 'premium-cakes', url: '/menu?category=premium-cakes', displayOrder: 1, enabled: true },
      { id: 'bdc3', name: 'Photo Cakes', slug: 'photo-cakes', url: '/menu?category=photo-cakes', displayOrder: 2, enabled: true },
      { id: 'bdc4', name: 'Number Cakes', slug: 'custom-cake', url: '/custom-cake', displayOrder: 3, enabled: true }
    ]
  },
  {
    id: 'bday_trending',
    title: 'Trending',
    displayOrder: 1,
    enabled: true,
    items: [
      { id: 'bdt1', name: 'Pinata Cakes', slug: 'pinata-cakes', url: '/menu?category=pinata-cakes', displayOrder: 0, enabled: true },
      { id: 'bdt2', name: 'Bomb Cakes', slug: 'bomb-cakes', url: '/menu?category=bomb-cakes', displayOrder: 1, enabled: true },
      { id: 'bdt3', name: 'Pull Me Up Cakes', slug: 'pull-me-up-cakes', url: '/menu?category=pull-me-up-cakes', displayOrder: 2, enabled: true }
    ]
  },
  {
    id: 'bday_flavours',
    title: 'Flavours',
    displayOrder: 2,
    enabled: true,
    items: [
      { id: 'bdf1', name: 'Chocolate', slug: 'chocolate-cakes', url: '/menu?category=chocolate-cakes', displayOrder: 0, enabled: true },
      { id: 'bdf2', name: 'Black Forest', slug: 'black-forest-cakes', url: '/menu?category=black-forest-cakes', displayOrder: 1, enabled: true },
      { id: 'bdf3', name: 'Red Velvet', slug: 'red-velvet-cakes', url: '/menu?category=red-velvet-cakes', displayOrder: 2, enabled: true }
    ]
  },
  {
    id: 'bday_combos',
    title: 'Combos',
    displayOrder: 3,
    enabled: true,
    items: [
      { id: 'bdco1', name: 'Cake + Balloons', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 0, enabled: true },
      { id: 'bdco2', name: 'Cake + Gifts', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 1, enabled: true },
      { id: 'bdco3', name: 'Cake + Flowers', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 2, enabled: true }
    ]
  },

  // Anniversary Columns
  {
    id: 'ann_romantic',
    title: 'Romantic Cakes',
    displayOrder: 0,
    enabled: true,
    items: [
      { id: 'anr1', name: 'Heart Cakes', slug: 'heart-cakes', url: '/menu?category=heart-cakes', displayOrder: 0, enabled: true },
      { id: 'anr2', name: 'Red Velvet Cakes', slug: 'red-velvet-cakes', url: '/menu?category=red-velvet-cakes', displayOrder: 1, enabled: true },
      { id: 'anr3', name: 'Rose Cakes', slug: 'romantic-cakes', url: '/menu?category=romantic-cakes', displayOrder: 2, enabled: true }
    ]
  },
  {
    id: 'ann_designer',
    title: 'Designer',
    displayOrder: 1,
    enabled: true,
    items: [
      { id: 'and1', name: 'Tier Cakes', slug: 'wedding-cakes', url: '/menu?category=wedding-cakes', displayOrder: 0, enabled: true },
      { id: 'and2', name: 'Photo Cakes', slug: 'photo-cakes', url: '/menu?category=photo-cakes', displayOrder: 1, enabled: true },
      { id: 'and3', name: 'Fondant Cakes', slug: 'designer-cakes', url: '/menu?category=designer-cakes', displayOrder: 2, enabled: true }
    ]
  },
  {
    id: 'ann_special',
    title: 'Special Gifts',
    displayOrder: 2,
    enabled: true,
    items: [
      { id: 'ans1', name: 'Cake + Flowers', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 0, enabled: true },
      { id: 'ans2', name: 'Cake + Chocolates', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 1, enabled: true },
      { id: 'ans3', name: 'Gift Hampers', slug: 'bakery-hampers', url: '/menu?category=bakery-hampers', displayOrder: 2, enabled: true }
    ]
  }
];

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: 'hero',
    title: 'Exquisite Cakes Delivered Fresh',
    description: 'Handcrafted with love using only the finest premium ingredients.',
    enabled: true,
    order: 0,
    buttonText: 'Order Now',
    buttonLink: '/menu',
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=1200&auto=format&fit=crop'
    ]
  },
  {
    id: 'announcement',
    title: 'Announcement Strip',
    description: 'Promotional announcement scrolling marquee below the hero.',
    enabled: true,
    order: 1
  },
  {
    id: 'categories',
    title: 'Browse By Category',
    description: 'Indulge in our exquisite collection of premium handcrafted delights.',
    enabled: true,
    order: 2,
    buttonText: 'View All Menu',
    buttonLink: '/menu'
  },
  {
    id: 'trending',
    title: 'Trending Cakes',
    description: 'The latest and most requested showstoppers loved by our patrons.',
    enabled: true,
    order: 3
  },
  {
    id: 'bestsellers',
    title: 'Our Best Sellers',
    description: 'Time-tested flavor combinations that consistently steal the spotlight.',
    enabled: true,
    order: 4
  },
  {
    id: 'customCakes',
    title: 'Design Your Custom Masterpiece',
    description: 'Collaborate with our expert cake designers to craft the perfect centerpiece for your milestone celebration.',
    enabled: true,
    order: 5,
    buttonText: 'Customize Now',
    buttonLink: '/custom-cake'
  },
  {
    id: 'collections',
    title: 'Curated Milestone Collections',
    description: 'Exquisite themed catalog assortments matched perfectly with your celebratory theme.',
    enabled: true,
    order: 6
  },
  {
    id: 'testimonials',
    title: 'Milestones We\'ve Sweetened',
    description: 'Heartwarming stories of joy and celebrations shared by our wonderful family of patrons.',
    enabled: true,
    order: 7
  },
  {
    id: 'gallery',
    title: 'Visual Portfolio of Craftsmanship',
    description: 'Browse our visual showcase of handcrafted cake textures, fondant designs, and real celebration centerpieces.',
    enabled: true,
    order: 8
  },
  {
    id: 'instagram',
    title: 'Join Our Sweet Community',
    description: 'Follow our sweet journey @TheCakeLounge for daily doses of pastry styling, client stories, and behind-the-scenes magic.',
    enabled: true,
    order: 9,
    buttonText: 'Follow on Instagram',
    buttonLink: 'https://instagram.com'
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    description: 'Everything you need to know about cake shelf life, personalized serving sizes, customization timelines, and hand-delivery services.',
    enabled: true,
    order: 10
  },
  {
    id: 'about',
    title: 'Baked with Passion, Served with Love',
    description: 'The Cake Lounge was born from a grandmother\'s kitchen in 2015. What started as late-night baking sessions and recipes passed down through generations has blossomed into a beloved patisserie trusted by thousands. Every texture is balanced, and every cake represents a handcrafted memory.',
    enabled: true,
    order: 11
  },
  {
    id: 'newsletter',
    title: 'Unlock Exquisite Treats',
    description: 'Join our elite patrons club to receive private invitations to seasonal tasting menus, secret holiday recipes, and sweet promotional codes.',
    enabled: true,
    order: 12,
    buttonText: 'Subscribe',
    buttonLink: '#'
  }
];

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    text: 'Free Delivery on Orders Above ₹499',
    icon: '🚚',
    link: '/menu',
    enabled: true,
    displayOrder: 0
  },
  {
    id: 'ann2',
    text: 'Schedule Your Delivery Date in Advance',
    icon: '📅',
    link: '/menu',
    enabled: true,
    displayOrder: 1
  },
  {
    id: 'ann3',
    text: 'Custom Cakes Require 2 Days Advance Notice',
    icon: '🎁',
    link: '/custom-cake',
    enabled: true,
    displayOrder: 2
  },
  {
    id: 'ann4',
    text: 'Freshly Handcrafted for Every Milestone Celebration',
    icon: '🍰',
    link: '/menu',
    enabled: true,
    displayOrder: 3
  }
];

export const DEFAULT_COLLECTIONS: CollectionCMSItem[] = [
  {
    id: 'col_bday',
    title: 'Birthday Cakes',
    slug: 'birthday-cakes',
    description: 'Indulgent, premium custom designs crafted perfectly for milestone birthday celebrations.',
    bannerImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop',
    thumbnailImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300&auto=format&fit=crop',
    seoTitle: 'Milestone Birthday Cakes | Premium Custom Design',
    seoDescription: 'Order custom milestone birthday cakes designed to stand out. Real, fresh ingredients. Fast hand delivery in Gurugram.',
    seoKeywords: 'birthday cakes, premium birthday cakes, birthday cake delivery gurugram',
    enabled: true,
    displayOrder: 0
  },
  {
    id: 'col_wedding',
    title: 'Wedding Cakes',
    slug: 'wedding-cakes',
    description: 'Elegant multi-tiered floral fondant creations curated beautifully for your lifetime moments.',
    bannerImage: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=1200&auto=format&fit=crop',
    thumbnailImage: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=300&auto=format&fit=crop',
    seoTitle: 'Elegant Designer Wedding Cakes | Tiered Fondant Cakes',
    seoDescription: 'Exquisite multi-tiered floral designer wedding cakes. Collaborate with our elite chefs. Best taste and design guaranteed.',
    seoKeywords: 'wedding cakes, anniversary cakes, tier wedding cake gurugram',
    enabled: true,
    displayOrder: 1
  },
  {
    id: 'col_chocolate',
    title: 'Chocolate Cakes',
    slug: 'chocolate-cakes',
    description: 'Decadent, rich Belgian dark chocolate layers crafted for sweet chocolate purists.',
    bannerImage: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop',
    thumbnailImage: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=300&auto=format&fit=crop',
    seoTitle: 'Rich Belgian Dark Chocolate Cakes | Decadent Fudge Layers',
    seoDescription: 'Satisfy chocolate cravings with rich Belgian truffle fudge cakes. Free shipping above ₹499.',
    seoKeywords: 'chocolate cakes, dark chocolate truffle cake, belgian chocolate cake',
    enabled: true,
    displayOrder: 2
  },
  {
    id: 'col_eggless',
    title: 'Eggless Cakes',
    slug: 'eggless-cakes',
    description: 'Ultra-moist, deliciously balanced eggless cakes made with pure vegetarian premium recipes.',
    bannerImage: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1200&auto=format&fit=crop',
    thumbnailImage: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=300&auto=format&fit=crop',
    seoTitle: 'Moist Eggless Cakes Gurugram | Pure Vegetarian Cakes',
    seoDescription: 'Ultra-moist, balanced eggless cakes in multiple premium flavors. Safe vegetarian baking kitchen practices.',
    seoKeywords: 'eggless cakes, vegetarian cakes, eggless cake delivery',
    enabled: true,
    displayOrder: 3
  }
];

export const DEFAULT_WEBSITE_SETTINGS: CMSWebsiteSettings = {
  id: 'global_settings',
  logoText: 'The Cake Lounge',
  logoUrl: '',
  faviconUrl: '',
  websiteName: 'The Cake Lounge',
  primaryColor: '#3d1f10',
  secondaryColor: '#fdf6ee',
  accentColor: '#c9614a',
  typography: 'Playfair Display, Poppins',
  borderRadius: '22px',
  footerText: 'Crafting moments of sweetness since 2015. Every cake tells a story — let us tell yours.',
  businessName: 'The Cake Lounge',
  address: 'The Cake Lounge, U-block, DLF phase-3, sector-24, Gurugram, Haryana',
  email: 'thecakeloungegurgaon@gmail.com',
  phone: '+91 77038 70170',
  whatsapp: '+91 77038 70170',
  googleMapsUrl: '',
  businessHoursMonFri: '10:00 AM - 10:00 PM',
  businessHoursSatSun: '09:00 AM - 11:00 PM',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  pinterestUrl: 'https://pinterest.com',
  youtubeUrl: ''
};

export const DEFAULT_MEDIA_LIBRARY: CMSMediaItem[] = [
  {
    id: 'med_m1',
    url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=500&auto=format&fit=crop',
    name: 'exquisite_chocolate_cake.jpg',
    size: 245000,
    folder: 'Bestsellers',
    altText: 'Exquisite multi layered dark chocolate cake decorated with cocoa and premium berries',
    createdAt: '2025-01-10T10:00:00.000Z'
  },
  {
    id: 'med_m2',
    url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=500&auto=format&fit=crop',
    name: 'floral_strawberry_tiered.jpg',
    size: 198000,
    folder: 'Weddings',
    altText: 'Tiered strawberry cake layered with cream cheese and decorated with white roses',
    createdAt: '2025-01-12T11:30:00.000Z'
  },
  {
    id: 'med_m3',
    url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=500&auto=format&fit=crop',
    name: 'colorful_rainbow_kids.jpg',
    size: 320000,
    folder: 'Birthdays',
    altText: 'Kids fun rainbow layered sprinkle vanilla cake topped with colorful buttercream',
    createdAt: '2025-01-15T09:00:00.000Z'
  }
];

export const DEFAULT_SEO_METADATA: CMSSEOMetadata[] = [
  {
    id: 'home',
    seoTitle: 'The Cake Lounge | Handcrafted Premium Custom Cakes Gurugram',
    metaDescription: 'Order premium custom cakes, bento cakes, multi-tiered wedding fondant masterpieces, and rich eggless desserts online. Delivered fresh across Gurugram.',
    keywords: 'cakes, online cake delivery gurugram, premium cake shop, custom cakes, bento cakes, designer cakes',
    ogImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop',
    canonicalUrl: 'https://thecakelounge.com',
    indexPage: true
  },
  {
    id: 'shop',
    seoTitle: 'Milestone Celebration Cake Menu | The Cake Lounge Patisserie',
    metaDescription: 'Browse our complete catalog of freshly baked designer cakes, bento boxes, cup cakes, and luxury celebration hampers. Filter by flavors, occasions, and weights.',
    keywords: 'cake menu online, custom bento, eggless red velvet, purchase premium cake',
    ogImage: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=1200&auto=format&fit=crop',
    canonicalUrl: 'https://thecakelounge.com/menu',
    indexPage: true
  }
];

export const DEFAULT_GENERAL_SETTINGS: CMSGeneralSettings = {
  id: 'general_cms_config',
  deliveryCharges: 100,
  freeDeliveryThreshold: 499,
  minimumOrder: 299,
  serviceableZipCodes: [
    '122001', '122002', '122003', '122004', '122005', '122006', '122007', '122008', '122009', '122010',
    '122011', '122015', '122016', '122017', '122018', '122022', '122101', '122102', '122505', '122508'
  ],
  businessHolidays: [],
  emergencyBannerEnabled: false,
  emergencyBannerText: '⚠️ Due to heavy weather in Gurugram, hand deliveries may be slightly delayed. Thank you for your patience!',
  popupMessageEnabled: false,
  popupMessageTitle: 'Welcome to The Cake Lounge Premium Patisserie',
  popupMessageText: 'Get flat 10% off your first purchase! Use coupon code FIRSTLOUNGE at checkout.',
  couponBannerEnabled: true,
  couponBannerText: '🎉 Use code LOUNGEVALENTINE for Flat 15% off Anniversary & Couple Cakes!',
  maintenanceMode: false
};

export const DEFAULT_ABOUT_SETTINGS: AboutSectionSettings = {
  id: 'about_settings',
  enabled: true,
  sectionBadge: 'Our Story',
  heading: 'Baked with Passion,\nServed with Love',
  storyContent: '<p>The Cake Lounge was born from a grandmother\'s kitchen in 2015. What started as late-night baking sessions and recipes passed down through generations has blossomed into a beloved patisserie trusted by thousands.</p>',
  leftImageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80',
  experienceNumber: '10+',
  experienceTitle: 'Years',
  experienceDesc: 'Years of crafting joyful memories with every cake',
  features: [
    {
      id: 'f_nat',
      icon: 'Sprout',
      title: 'All-Natural Ingredients',
      desc: 'We source only the finest local produce — no artificial preservatives, ever.',
      displayOrder: 0,
      enabled: true
    },
    {
      id: 'f_hand',
      icon: 'Hand',
      title: 'Handcrafted Daily',
      desc: 'Each cake is made fresh the morning of delivery by our master pastry chefs.',
      displayOrder: 1,
      enabled: true
    },
    {
      id: 'f_truk',
      icon: 'Truck',
      title: 'Guaranteed Freshness',
      desc: 'Freshly Baked for Your Selected Date.',
      displayOrder: 2,
      enabled: true
    }
  ],
  backgroundColor: '#ffffff',
  gradient: 'none',
  accentColor: '#c9614a',
  headingColor: '#3d1f10',
  textColor: '#a07860',
  sectionPadding: 'py-[100px]',
  borderRadius: 'rounded-xl',
  shadow: 'shadow-lg',
  animationType: 'slide-up',
  animationDuration: 0.8,
  animationDelay: 0.1,
  imageLayout: 'left',
  imageWidth: 'w-full',
  imageBorderRadius: 'rounded-xl',
  imageShadow: 'shadow-lg'
};

export const DEFAULT_CATEGORIES: CMSCategory[] = [
  {
    id: 'cat_bday',
    name: 'Birthday Cakes',
    description: 'Indulgent, premium custom designs crafted perfectly for milestone birthday celebrations.',
    active: true,
    image: '/images/categories/Birthday Cakes.jpg',
    slug: 'birthday-cakes',
    displayOrder: 1,
    designs: '80+',
    tag: 'Popular',
    link: '/menu?category=birthday-cakes'
  },
  {
    id: 'cat_wedding',
    name: 'Wedding Cakes',
    description: 'Elegant multi-tiered floral fondant creations curated beautifully for your lifetime moments.',
    active: true,
    image: '/images/categories/Wedding Cakes.jpg',
    slug: 'wedding-cakes',
    displayOrder: 2,
    designs: '45+',
    tag: null,
    link: '/menu?category=wedding-cakes'
  },
  {
    id: 'cat_chocolate',
    name: 'Chocolate Cakes',
    description: 'Decadent, rich Belgian dark chocolate layers crafted for sweet chocolate purists.',
    active: true,
    image: '/images/categories/Chocolate Cakes.jpg',
    slug: 'chocolate-cakes',
    displayOrder: 3,
    designs: '60+',
    tag: 'Bestseller',
    link: '/menu?category=chocolate-cakes'
  },
  {
    id: 'cat_custom',
    name: 'Custom Cakes',
    description: 'Collaborate with our expert cake designers to craft the perfect centerpiece.',
    active: true,
    image: '/images/categories/Custom Cakes.png',
    slug: 'custom-cakes',
    displayOrder: 4,
    designs: 'Design Your Own',
    tag: 'Open',
    link: '/custom-cake'
  }
];

export const DEFAULT_FEATURED_PRODUCTS_SETTINGS: FeaturedProductsSettings = {
  id: 'featured_products',
  enabled: true,
  title: 'Featured Cakes',
  subtitle: 'Our Bestsellers',
  productIds: ['1', '2', '3', '5', '6', '7', '9', '11', '13', '17', '55', '59', '103', '114', '325', '327']
};

export const DEFAULT_TESTIMONIALS: CMSTestimonial[] = [
  {
    id: 'test_1',
    name: "Priya Sharma",
    tag: "Loyal Customer · 3 yrs",
    avatar: "https://i.pravatar.cc/100?img=47",
    text: "Ordered a custom birthday cake for my daughter and I was absolutely blown away. The attention to detail was incredible — it looked exactly like the design I requested, and it tasted even better!",
    rating: 5,
    displayOrder: 0,
    enabled: true
  },
  {
    id: 'test_2',
    name: "Rohan Mehta",
    tag: "Verified Buyer",
    avatar: "https://i.pravatar.cc/100?img=12",
    text: "The Belgian chocolate truffle cake was an absolute showstopper at our anniversary dinner. Our guests couldn't stop talking about it. Delivery was on time and packaging was beautiful!",
    rating: 5,
    displayOrder: 1,
    enabled: true
  },
  {
    id: 'test_3',
    name: "Ananya Kapoor",
    tag: "Premium Member",
    avatar: "https://i.pravatar.cc/100?img=32",
    text: "I've ordered from La Douceur 5 times now — red velvet, mango mousse, tiramisu — every single one is perfection. This is my go-to bakery for every celebration!",
    rating: 4.5,
    displayOrder: 2,
    enabled: true
  }
];

export const DEFAULT_GALLERY: CMSGalleryItem[] = [
  {
    id: 'gal_1',
    src: '/images/products/Royal Raspberry Birthday Cake.jpg',
    label: 'Royal Raspberry Birthday Cake',
    displayOrder: 0,
    enabled: true,
    link: '/shop/1'
  },
  {
    id: 'gal_2',
    src: '/images/products/Champagne Velvet Birthday Cake.jpg',
    label: 'Champagne Velvet Birthday Cake',
    displayOrder: 1,
    enabled: true,
    link: '/shop/2'
  },
  {
    id: 'gal_3',
    src: '/images/products/Golden Confetti Birthday Cake.jpg',
    label: 'Golden Confetti Birthday Cake',
    displayOrder: 2,
    enabled: true,
    link: '/shop/3'
  },
  {
    id: 'gal_4',
    src: '/images/products/Chocolate Crown Birthday Cake.jpg',
    label: 'Chocolate Crown Birthday Cake',
    displayOrder: 3,
    enabled: true,
    link: '/shop/5'
  },
  {
    id: 'gal_5',
    src: '/images/products/Pearl Blossom Birthday Cake.jpg',
    label: 'Pearl Blossom Birthday Cake',
    displayOrder: 4,
    enabled: true,
    link: '/shop/4'
  },
  {
    id: 'gal_6',
    src: '/images/products/Silk Anniversary Romance Cake.jpg',
    label: 'Silk Anniversary Romance Cake',
    displayOrder: 5,
    enabled: true,
    link: '/shop/7'
  }
];

