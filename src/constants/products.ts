export interface ProductWeight {
  label: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  flavor: string;
  category: string;
  price: number;
  weights?: ProductWeight[];
  oldPrice: number;
  rating: number;
  reviews: number;
  tag: string;
  img: string;
  description: string;
}

export const products: Product[] = [
  {
    "id": 1,
    "name": "Royal Raspberry Birthday Cake",
    "flavor": "Mixed Berry Ganache",
    "category": "Birthday Cakes",
    "price": 499,
    "weights": [
      { "label": "0.5 Kg", "price": 499 },
      { "label": "1 Kg", "price": 898 },
      { "label": "2 Kg", "price": 1747 }
    ],
    "oldPrice": 619,
    "rating": 4,
    "reviews": 63,
    "tag": "Bestseller",
    "img": "/images/products/Royal Raspberry Birthday Cake.jpg",
    "description": "Royal Raspberry Birthday Cake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 2,
    "name": "Champagne Velvet Birthday Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Birthday Cakes",
    "price": 529,
    "weights": [
      { "label": "0.5 Kg", "price": 529 },
      { "label": "1 Kg", "price": 952 },
      { "label": "2 Kg", "price": 1852 }
    ],
    "oldPrice": 649,
    "rating": 4,
    "reviews": 66,
    "tag": "Trending",
    "img": "/images/products/Champagne Velvet Birthday Cake.jpg",
    "description": "Champagne Velvet Birthday Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 3,
    "name": "Golden Confetti Birthday Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Birthday Cakes",
    "price": 559,
    "weights": [
      { "label": "0.5 Kg", "price": 559 },
      { "label": "1 Kg", "price": 1006 },
      { "label": "2 Kg", "price": 1957 }
    ],
    "oldPrice": 679,
    "rating": 4,
    "reviews": 69,
    "tag": "New",
    "img": "/images/products/Golden Confetti Birthday Cake.jpg",
    "description": "Golden Confetti Birthday Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 4,
    "name": "Pearl Blossom Birthday Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Birthday Cakes",
    "price": 589,
    "weights": [
      { "label": "0.5 Kg", "price": 589 },
      { "label": "1 Kg", "price": 1060 },
      { "label": "2 Kg", "price": 2062 }
    ],
    "oldPrice": 709,
    "rating": 5,
    "reviews": 72,
    "tag": "Seasonal",
    "img": "/images/products/Pearl Blossom Birthday Cake.jpg",
    "description": "Pearl Blossom Birthday Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 5,
    "name": "Chocolate Crown Birthday Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Birthday Cakes",
    "price": 619,
    "weights": [
      { "label": "0.5 Kg", "price": 619 },
      { "label": "1 Kg", "price": 1114 },
      { "label": "2 Kg", "price": 2167 }
    ],
    "oldPrice": 739,
    "rating": 5,
    "reviews": 75,
    "tag": "Luxury",
    "img": "/images/products/Chocolate Crown Birthday Cake.jpg",
    "description": "Chocolate Crown Birthday Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 6,
    "name": "Sunrise Celebration Birthday Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Birthday Cakes",
    "price": 649,
    "weights": [
      { "label": "0.5 Kg", "price": 649 },
      { "label": "1 Kg", "price": 1168 },
      { "label": "2 Kg", "price": 2272 }
    ],
    "oldPrice": 769,
    "rating": 5,
    "reviews": 78,
    "tag": "Premium",
    "img": "/images/products/Sunrise Celebration Birthday Cake.jpg",
    "description": "Sunrise Celebration Birthday Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 7,
    "name": "Silk Anniversary Romance Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Anniversary Cakes",
    "price": 549,
    "weights": [
      { "label": "0.5 Kg", "price": 549 },
      { "label": "1 Kg", "price": 988 },
      { "label": "2 Kg", "price": 1922 }
    ],
    "oldPrice": 669,
    "rating": 5,
    "reviews": 81,
    "tag": "Bestseller",
    "img": "/images/products/Silk Anniversary Romance Cake.jpg",
    "description": "Silk Anniversary Romance Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 8,
    "name": "Eternal Love Anniversary Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Anniversary Cakes",
    "price": 579,
    "weights": [
      { "label": "0.5 Kg", "price": 579 },
      { "label": "1 Kg", "price": 1042 },
      { "label": "2 Kg", "price": 2027 }
    ],
    "oldPrice": 699,
    "rating": 5,
    "reviews": 84,
    "tag": "Trending",
    "img": "/images/products/Eternal Love Anniversary Cake.jpg",
    "description": "Eternal Love Anniversary Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 9,
    "name": "Pearl Lace Anniversary Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Anniversary Cakes",
    "price": 609,
    "weights": [
      { "label": "0.5 Kg", "price": 609 },
      { "label": "1 Kg", "price": 1096 },
      { "label": "2 Kg", "price": 2132 }
    ],
    "oldPrice": 729,
    "rating": 5,
    "reviews": 87,
    "tag": "New",
    "img": "/images/products/Pearl Lace Anniversary Cake.jpg",
    "description": "Pearl Lace Anniversary Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 10,
    "name": "Velvet Duo Anniversary Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Anniversary Cakes",
    "price": 639,
    "weights": [
      { "label": "0.5 Kg", "price": 639 },
      { "label": "1 Kg", "price": 1150 },
      { "label": "2 Kg", "price": 2237 }
    ],
    "oldPrice": 759,
    "rating": 4,
    "reviews": 90,
    "tag": "Seasonal",
    "img": "/images/products/Velvet Duo Anniversary Cake.jpg",
    "description": "Velvet Duo Anniversary Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 11,
    "name": "Rose Quartz Anniversary Cake",
    "flavor": "Saffron Rasmalai",
    "category": "Anniversary Cakes",
    "price": 669,
    "weights": [
      { "label": "0.5 Kg", "price": 669 },
      { "label": "1 Kg", "price": 1204 },
      { "label": "2 Kg", "price": 2342 }
    ],
    "oldPrice": 789,
    "rating": 4,
    "reviews": 93,
    "tag": "Luxury",
    "img": "/images/products/Rose Quartz Anniversary Cake.jpg",
    "description": "Rose Quartz Anniversary Cake crafted with saffron rasmalai, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 12,
    "name": "Milestone Memory Anniversary Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Anniversary Cakes",
    "price": 699,
    "weights": [
      { "label": "0.5 Kg", "price": 699 },
      { "label": "1 Kg", "price": 1258 },
      { "label": "2 Kg", "price": 2447 }
    ],
    "oldPrice": 819,
    "rating": 4,
    "reviews": 96,
    "tag": "Premium",
    "img": "/images/products/Milestone Memory Anniversary Cake.jpg",
    "description": "Milestone Memory Anniversary Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 13,
    "name": "Ivory Lace Wedding Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Wedding Cakes",
    "price": 599,
    "weights": [
      { "label": "0.5 Kg", "price": 599 },
      { "label": "1 Kg", "price": 1078 },
      { "label": "2 Kg", "price": 2097 }
    ],
    "oldPrice": 719,
    "rating": 4,
    "reviews": 99,
    "tag": "Bestseller",
    "img": "/images/products/Ivory Lace Wedding Cake.jpg",
    "description": "Ivory Lace Wedding Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 14,
    "name": "Diamond Satin Wedding Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Wedding Cakes",
    "price": 629,
    "weights": [
      { "label": "0.5 Kg", "price": 629 },
      { "label": "1 Kg", "price": 1132 },
      { "label": "2 Kg", "price": 2202 }
    ],
    "oldPrice": 749,
    "rating": 5,
    "reviews": 102,
    "tag": "Trending",
    "img": "/images/products/Diamond Satin Wedding Cake.jpg",
    "description": "Diamond Satin Wedding Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 15,
    "name": "Garden Romance Wedding Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Wedding Cakes",
    "price": 659,
    "weights": [
      { "label": "0.5 Kg", "price": 659 },
      { "label": "1 Kg", "price": 1186 },
      { "label": "2 Kg", "price": 2307 }
    ],
    "oldPrice": 779,
    "rating": 5,
    "reviews": 105,
    "tag": "New",
    "img": "/images/products/Garden Romance Wedding Cake.jpg",
    "description": "Garden Romance Wedding Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 16,
    "name": "Classic Blanc Wedding Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Wedding Cakes",
    "price": 689,
    "weights": [
      { "label": "0.5 Kg", "price": 689 },
      { "label": "1 Kg", "price": 1240 },
      { "label": "2 Kg", "price": 2412 }
    ],
    "oldPrice": 809,
    "rating": 5,
    "reviews": 108,
    "tag": "Seasonal",
    "img": "/images/products/Classic Blanc Wedding Cake.jpg",
    "description": "Classic Blanc Wedding Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 17,
    "name": "Royal Pearl Wedding Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Wedding Cakes",
    "price": 719,
    "weights": [
      { "label": "0.5 Kg", "price": 719 },
      { "label": "1 Kg", "price": 1294 },
      { "label": "2 Kg", "price": 2517 }
    ],
    "oldPrice": 839,
    "rating": 5,
    "reviews": 111,
    "tag": "Luxury",
    "img": "/images/products/Royal Pearl Wedding Cake.jpg",
    "description": "Royal Pearl Wedding Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 18,
    "name": "Starlight Wedding Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Wedding Cakes",
    "price": 749,
    "weights": [
      { "label": "0.5 Kg", "price": 749 },
      { "label": "1 Kg", "price": 1348 },
      { "label": "2 Kg", "price": 2622 }
    ],
    "oldPrice": 869,
    "rating": 5,
    "reviews": 114,
    "tag": "Premium",
    "img": "/images/products/Starlight Wedding Cake.jpg",
    "description": "Starlight Wedding Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 19,
    "name": "Mini Berry Bento Celebration",
    "flavor": "Mixed Berry Ganache",
    "category": "Bento Cakes",
    "price": 649,
    "weights": [
      { "label": "0.5 Kg", "price": 649 },
      { "label": "1 Kg", "price": 1168 },
      { "label": "2 Kg", "price": 2272 }
    ],
    "oldPrice": 769,
    "rating": 5,
    "reviews": 117,
    "tag": "Bestseller",
    "img": "/images/products/Mini Berry Bento Celebration.jpg",
    "description": "Mini Berry Bento Celebration crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 20,
    "name": "Chocolate Luxe Bento Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Bento Cakes",
    "price": 679,
    "weights": [
      { "label": "0.5 Kg", "price": 679 },
      { "label": "1 Kg", "price": 1222 },
      { "label": "2 Kg", "price": 2377 }
    ],
    "oldPrice": 799,
    "rating": 4,
    "reviews": 120,
    "tag": "Trending",
    "img": "/images/products/Chocolate Luxe Bento Cake.jpg",
    "description": "Chocolate Luxe Bento Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 21,
    "name": "Caramel Dream Bento Slice",
    "flavor": "Caramel Butterscotch",
    "category": "Bento Cakes",
    "price": 709,
    "weights": [
      { "label": "0.5 Kg", "price": 709 },
      { "label": "1 Kg", "price": 1276 },
      { "label": "2 Kg", "price": 2482 }
    ],
    "oldPrice": 829,
    "rating": 4,
    "reviews": 123,
    "tag": "New",
    "img": "/images/products/Caramel Dream Bento Slice.jpg",
    "description": "Caramel Dream Bento Slice crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 22,
    "name": "Vanilla Berry Bento Cake",
    "flavor": "Classic French Vanilla",
    "category": "Bento Cakes",
    "price": 739,
    "weights": [
      { "label": "0.5 Kg", "price": 739 },
      { "label": "1 Kg", "price": 1330 },
      { "label": "2 Kg", "price": 2587 }
    ],
    "oldPrice": 859,
    "rating": 4,
    "reviews": 126,
    "tag": "Seasonal",
    "img": "/images/products/Vanilla Berry Bento Cake.jpg",
    "description": "Vanilla Berry Bento Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 23,
    "name": "Lotus Blossom Bento Cake",
    "flavor": "Lotus Biscoff Crunch",
    "category": "Bento Cakes",
    "price": 769,
    "weights": [
      { "label": "0.5 Kg", "price": 769 },
      { "label": "1 Kg", "price": 1384 },
      { "label": "2 Kg", "price": 2692 }
    ],
    "oldPrice": 889,
    "rating": 4,
    "reviews": 129,
    "tag": "Luxury",
    "img": "/images/products/Lotus Blossom Bento Cake.jpg",
    "description": "Lotus Blossom Bento Cake crafted with lotus biscoff crunch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 24,
    "name": "Hazelnut Fudge Bento Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Bento Cakes",
    "price": 799,
    "weights": [
      { "label": "0.5 Kg", "price": 799 },
      { "label": "1 Kg", "price": 1438 },
      { "label": "2 Kg", "price": 2797 }
    ],
    "oldPrice": 919,
    "rating": 5,
    "reviews": 132,
    "tag": "Premium",
    "img": "/images/products/Hazelnut Fudge Bento Cake.jpg",
    "description": "Hazelnut Fudge Bento Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 25,
    "name": "Galaxy Party Theme Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Theme Cakes",
    "price": 699,
    "weights": [
      { "label": "0.5 Kg", "price": 699 },
      { "label": "1 Kg", "price": 1258 },
      { "label": "2 Kg", "price": 2447 }
    ],
    "oldPrice": 819,
    "rating": 5,
    "reviews": 135,
    "tag": "Bestseller",
    "img": "/images/products/Galaxy Party Theme Cake.jpg",
    "description": "Galaxy Party Theme Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 26,
    "name": "Safari Adventure Theme Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Theme Cakes",
    "price": 729,
    "weights": [
      { "label": "0.5 Kg", "price": 729 },
      { "label": "1 Kg", "price": 1312 },
      { "label": "2 Kg", "price": 2552 }
    ],
    "oldPrice": 849,
    "rating": 5,
    "reviews": 138,
    "tag": "Trending",
    "img": "/images/products/Safari Adventure Theme Cake.jpg",
    "description": "Safari Adventure Theme Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 27,
    "name": "Vintage Paris Theme Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Theme Cakes",
    "price": 759,
    "weights": [
      { "label": "0.5 Kg", "price": 759 },
      { "label": "1 Kg", "price": 1366 },
      { "label": "2 Kg", "price": 2657 }
    ],
    "oldPrice": 879,
    "rating": 5,
    "reviews": 141,
    "tag": "New",
    "img": "/images/products/Vintage Paris Theme Cake.jpg",
    "description": "Vintage Paris Theme Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 28,
    "name": "Mermaid Lagoon Theme Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Theme Cakes",
    "price": 789,
    "weights": [
      { "label": "0.5 Kg", "price": 789 },
      { "label": "1 Kg", "price": 1420 },
      { "label": "2 Kg", "price": 2762 }
    ],
    "oldPrice": 909,
    "rating": 5,
    "reviews": 144,
    "tag": "Seasonal",
    "img": "/images/products/Mermaid Lagoon Theme Cake.jpg",
    "description": "Mermaid Lagoon Theme Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 29,
    "name": "Bollywood Masala Theme Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Theme Cakes",
    "price": 819,
    "weights": [
      { "label": "0.5 Kg", "price": 819 },
      { "label": "1 Kg", "price": 1474 },
      { "label": "2 Kg", "price": 2867 }
    ],
    "oldPrice": 939,
    "rating": 5,
    "reviews": 147,
    "tag": "Luxury",
    "img": "/images/products/Bollywood Masala Theme Cake.jpg",
    "description": "Bollywood Masala Theme Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 30,
    "name": "Rustic Garden Theme Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Theme Cakes",
    "price": 849,
    "weights": [
      { "label": "0.5 Kg", "price": 849 },
      { "label": "1 Kg", "price": 1528 },
      { "label": "2 Kg", "price": 2972 }
    ],
    "oldPrice": 969,
    "rating": 4,
    "reviews": 150,
    "tag": "Premium",
    "img": "/images/products/Rustic Garden Theme Cake.jpg",
    "description": "Rustic Garden Theme Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 31,
    "name": "Golden Frame Photo Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Photo Cakes",
    "price": 749,
    "weights": [
      { "label": "0.5 Kg", "price": 749 },
      { "label": "1 Kg", "price": 1348 },
      { "label": "2 Kg", "price": 2622 }
    ],
    "oldPrice": 869,
    "rating": 4,
    "reviews": 153,
    "tag": "Bestseller",
    "img": "/images/products/Golden Frame Photo Cake.jpg",
    "description": "Golden Frame Photo Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 32,
    "name": "Memories Collage Photo Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Photo Cakes",
    "price": 779,
    "weights": [
      { "label": "0.5 Kg", "price": 779 },
      { "label": "1 Kg", "price": 1402 },
      { "label": "2 Kg", "price": 2727 }
    ],
    "oldPrice": 899,
    "rating": 4,
    "reviews": 156,
    "tag": "Trending",
    "img": "/images/products/Memories Collage Photo Cake.jpg",
    "description": "Memories Collage Photo Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 33,
    "name": "Vintage Portrait Photo Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Photo Cakes",
    "price": 809,
    "weights": [
      { "label": "0.5 Kg", "price": 809 },
      { "label": "1 Kg", "price": 1456 },
      { "label": "2 Kg", "price": 2832 }
    ],
    "oldPrice": 929,
    "rating": 4,
    "reviews": 159,
    "tag": "New",
    "img": "/images/products/Vintage Portrait Photo Cake.jpg",
    "description": "Vintage Portrait Photo Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 34,
    "name": "Sparkle Moment Photo Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Photo Cakes",
    "price": 839,
    "weights": [
      { "label": "0.5 Kg", "price": 839 },
      { "label": "1 Kg", "price": 1510 },
      { "label": "2 Kg", "price": 2937 }
    ],
    "oldPrice": 959,
    "rating": 5,
    "reviews": 162,
    "tag": "Seasonal",
    "img": "/images/products/Sparkle Moment Photo Cake.jpg",
    "description": "Sparkle Moment Photo Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 35,
    "name": "Rose Petal Photo Cake",
    "flavor": "Saffron Rasmalai",
    "category": "Photo Cakes",
    "price": 869,
    "weights": [
      { "label": "0.5 Kg", "price": 869 },
      { "label": "1 Kg", "price": 1564 },
      { "label": "2 Kg", "price": 3042 }
    ],
    "oldPrice": 989,
    "rating": 5,
    "reviews": 165,
    "tag": "Luxury",
    "img": "/images/products/Rose Petal Photo Cake.jpg",
    "description": "Rose Petal Photo Cake crafted with saffron rasmalai, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 36,
    "name": "Silver Screen Photo Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Photo Cakes",
    "price": 899,
    "weights": [
      { "label": "0.5 Kg", "price": 899 },
      { "label": "1 Kg", "price": 1618 },
      { "label": "2 Kg", "price": 3147 }
    ],
    "oldPrice": 1019,
    "rating": 5,
    "reviews": 168,
    "tag": "Premium",
    "img": "/images/products/Silver Screen Photo Cake.jpg",
    "description": "Silver Screen Photo Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 37,
    "name": "Candy Burst Pinata Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Pinata Cakes",
    "price": 799,
    "weights": [
      { "label": "0.5 Kg", "price": 799 },
      { "label": "1 Kg", "price": 1438 },
      { "label": "2 Kg", "price": 2797 }
    ],
    "oldPrice": 919,
    "rating": 5,
    "reviews": 171,
    "tag": "Bestseller",
    "img": "/images/products/Candy Burst Pinata Cake.jpg",
    "description": "Candy Burst Pinata Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 38,
    "name": "Jewel Treasure Pinata Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Pinata Cakes",
    "price": 829,
    "weights": [
      { "label": "0.5 Kg", "price": 829 },
      { "label": "1 Kg", "price": 1492 },
      { "label": "2 Kg", "price": 2902 }
    ],
    "oldPrice": 949,
    "rating": 5,
    "reviews": 174,
    "tag": "Trending",
    "img": "/images/products/Jewel Treasure Pinata Cake.jpg",
    "description": "Jewel Treasure Pinata Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 39,
    "name": "Rainbow Surprise Pinata Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Pinata Cakes",
    "price": 859,
    "weights": [
      { "label": "0.5 Kg", "price": 859 },
      { "label": "1 Kg", "price": 1546 },
      { "label": "2 Kg", "price": 3007 }
    ],
    "oldPrice": 979,
    "rating": 5,
    "reviews": 177,
    "tag": "New",
    "img": "/images/products/Rainbow Surprise Pinata Cake.jpg",
    "description": "Rainbow Surprise Pinata Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 40,
    "name": "Chocolate Volcano Pinata Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Pinata Cakes",
    "price": 889,
    "weights": [
      { "label": "0.5 Kg", "price": 889 },
      { "label": "1 Kg", "price": 1600 },
      { "label": "2 Kg", "price": 3112 }
    ],
    "oldPrice": 1009,
    "rating": 4,
    "reviews": 180,
    "tag": "Seasonal",
    "img": "/images/products/Chocolate Volcano Pinata Cake.jpg",
    "description": "Chocolate Volcano Pinata Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 41,
    "name": "Unicorn Dream Pinata Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Pinata Cakes",
    "price": 919,
    "weights": [
      { "label": "0.5 Kg", "price": 919 },
      { "label": "1 Kg", "price": 1654 },
      { "label": "2 Kg", "price": 3217 }
    ],
    "oldPrice": 1039,
    "rating": 4,
    "reviews": 183,
    "tag": "Luxury",
    "img": "/images/products/Unicorn Dream Pinata Cake.jpg",
    "description": "Unicorn Dream Pinata Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 42,
    "name": "Treasure Chest Pinata Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Pinata Cakes",
    "price": 949,
    "weights": [
      { "label": "0.5 Kg", "price": 949 },
      { "label": "1 Kg", "price": 1708 },
      { "label": "2 Kg", "price": 3322 }
    ],
    "oldPrice": 1069,
    "rating": 4,
    "reviews": 186,
    "tag": "Premium",
    "img": "/images/products/Treasure Chest Pinata Cake.jpg",
    "description": "Treasure Chest Pinata Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 43,
    "name": "Velvet Pull Me Up Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Pull Me Up Cakes",
    "price": 849,
    "weights": [
      { "label": "0.5 Kg", "price": 849 },
      { "label": "1 Kg", "price": 1528 },
      { "label": "2 Kg", "price": 2972 }
    ],
    "oldPrice": 969,
    "rating": 4,
    "reviews": 189,
    "tag": "Bestseller",
    "img": "/images/products/Velvet Pull Me Up Cake.jpg",
    "description": "Velvet Pull Me Up Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 44,
    "name": "Caramel Drip Pull Me Up Cake",
    "flavor": "Caramel Butterscotch",
    "category": "Pull Me Up Cakes",
    "price": 879,
    "weights": [
      { "label": "0.5 Kg", "price": 879 },
      { "label": "1 Kg", "price": 1582 },
      { "label": "2 Kg", "price": 3077 }
    ],
    "oldPrice": 999,
    "rating": 5,
    "reviews": 192,
    "tag": "Trending",
    "img": "/images/products/Caramel Drip Pull Me Up Cake.jpg",
    "description": "Caramel Drip Pull Me Up Cake crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 45,
    "name": "Rose Gold Pull Me Up Cake",
    "flavor": "Saffron Rasmalai",
    "category": "Pull Me Up Cakes",
    "price": 909,
    "weights": [
      { "label": "0.5 Kg", "price": 909 },
      { "label": "1 Kg", "price": 1636 },
      { "label": "2 Kg", "price": 3182 }
    ],
    "oldPrice": 1029,
    "rating": 5,
    "reviews": 195,
    "tag": "New",
    "img": "/images/products/Rose Gold Pull Me Up Cake.jpg",
    "description": "Rose Gold Pull Me Up Cake crafted with saffron rasmalai, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 46,
    "name": "Praline Pull Me Up Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Pull Me Up Cakes",
    "price": 939,
    "weights": [
      { "label": "0.5 Kg", "price": 939 },
      { "label": "1 Kg", "price": 1690 },
      { "label": "2 Kg", "price": 3287 }
    ],
    "oldPrice": 1059,
    "rating": 5,
    "reviews": 198,
    "tag": "Seasonal",
    "img": "/images/products/Praline Pull Me Up Cake.jpg",
    "description": "Praline Pull Me Up Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 47,
    "name": "Berry Bliss Pull Me Up Cake",
    "flavor": "Mixed Berry Ganache",
    "category": "Pull Me Up Cakes",
    "price": 969,
    "weights": [
      { "label": "0.5 Kg", "price": 969 },
      { "label": "1 Kg", "price": 1744 },
      { "label": "2 Kg", "price": 3392 }
    ],
    "oldPrice": 1089,
    "rating": 5,
    "reviews": 201,
    "tag": "Luxury",
    "img": "/images/products/Berry Bliss Pull Me Up Cake.jpg",
    "description": "Berry Bliss Pull Me Up Cake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 48,
    "name": "Midnight Chocolate Pull Me Up Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Pull Me Up Cakes",
    "price": 999,
    "weights": [
      { "label": "0.5 Kg", "price": 999 },
      { "label": "1 Kg", "price": 1798 },
      { "label": "2 Kg", "price": 3497 }
    ],
    "oldPrice": 1119,
    "rating": 5,
    "reviews": 204,
    "tag": "Premium",
    "img": "/images/products/Midnight Chocolate Pull Me Up Cake.jpg",
    "description": "Midnight Chocolate Pull Me Up Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 49,
    "name": "Hazelnut Bomb Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Bomb Cakes",
    "price": 899,
    "weights": [
      { "label": "0.5 Kg", "price": 899 },
      { "label": "1 Kg", "price": 1618 },
      { "label": "2 Kg", "price": 3147 }
    ],
    "oldPrice": 1019,
    "rating": 5,
    "reviews": 207,
    "tag": "Bestseller",
    "img": "/images/products/Hazelnut Bomb Cake.jpg",
    "description": "Hazelnut Bomb Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 50,
    "name": "Golden Crunch Bomb Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Bomb Cakes",
    "price": 929,
    "weights": [
      { "label": "0.5 Kg", "price": 929 },
      { "label": "1 Kg", "price": 1672 },
      { "label": "2 Kg", "price": 3252 }
    ],
    "oldPrice": 1049,
    "rating": 4,
    "reviews": 210,
    "tag": "Trending",
    "img": "/images/products/Golden Crunch Bomb Cake.jpg",
    "description": "Golden Crunch Bomb Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 51,
    "name": "Caramel Bombastic Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Bomb Cakes",
    "price": 959,
    "weights": [
      { "label": "0.5 Kg", "price": 959 },
      { "label": "1 Kg", "price": 1726 },
      { "label": "2 Kg", "price": 3357 }
    ],
    "oldPrice": 1079,
    "rating": 4,
    "reviews": 213,
    "tag": "New",
    "img": "/images/products/Caramel Bombastic Cake.jpg",
    "description": "Caramel Bombastic Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 52,
    "name": "Biscoff Blast Bomb Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Bomb Cakes",
    "price": 989,
    "weights": [
      { "label": "0.5 Kg", "price": 989 },
      { "label": "1 Kg", "price": 1780 },
      { "label": "2 Kg", "price": 3462 }
    ],
    "oldPrice": 1109,
    "rating": 4,
    "reviews": 216,
    "tag": "Seasonal",
    "img": "/images/products/Biscoff Blast Bomb Cake.jpg",
    "description": "Biscoff Blast Bomb Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 53,
    "name": "Layered Truffle Bomb Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Bomb Cakes",
    "price": 1019,
    "weights": [
      { "label": "0.5 Kg", "price": 1019 },
      { "label": "1 Kg", "price": 1834 },
      { "label": "2 Kg", "price": 3567 }
    ],
    "oldPrice": 1139,
    "rating": 4,
    "reviews": 219,
    "tag": "Luxury",
    "img": "/images/products/Layered Truffle Bomb Cake.jpg",
    "description": "Layered Truffle Bomb Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 54,
    "name": "Nutella Explosion Bomb Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Bomb Cakes",
    "price": 1049,
    "weights": [
      { "label": "0.5 Kg", "price": 1049 },
      { "label": "1 Kg", "price": 1888 },
      { "label": "2 Kg", "price": 3672 }
    ],
    "oldPrice": 1169,
    "rating": 5,
    "reviews": 222,
    "tag": "Premium",
    "img": "/images/products/Nutella Explosion Bomb Cake.jpg",
    "description": "Nutella Explosion Bomb Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 55,
    "name": "Artisan Marble Designer Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Designer Cakes",
    "price": 949,
    "weights": [
      { "label": "0.5 Kg", "price": 949 },
      { "label": "1 Kg", "price": 1708 },
      { "label": "2 Kg", "price": 3322 }
    ],
    "oldPrice": 1069,
    "rating": 5,
    "reviews": 225,
    "tag": "Bestseller",
    "img": "/images/products/Artisan Marble Designer Cake.jpg",
    "description": "Artisan Marble Designer Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 56,
    "name": "Sculpted Bloom Designer Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Designer Cakes",
    "price": 979,
    "weights": [
      { "label": "0.5 Kg", "price": 979 },
      { "label": "1 Kg", "price": 1762 },
      { "label": "2 Kg", "price": 3427 }
    ],
    "oldPrice": 1099,
    "rating": 5,
    "reviews": 228,
    "tag": "Trending",
    "img": "/images/products/Sculpted Bloom Designer Cake.jpg",
    "description": "Sculpted Bloom Designer Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 57,
    "name": "Gold Leaf Designer Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Designer Cakes",
    "price": 1009,
    "weights": [
      { "label": "0.5 Kg", "price": 1009 },
      { "label": "1 Kg", "price": 1816 },
      { "label": "2 Kg", "price": 3532 }
    ],
    "oldPrice": 1129,
    "rating": 5,
    "reviews": 231,
    "tag": "New",
    "img": "/images/products/Gold Leaf Designer Cake.jpg",
    "description": "Gold Leaf Designer Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 58,
    "name": "Minimalist Muse Designer Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Designer Cakes",
    "price": 1039,
    "weights": [
      { "label": "0.5 Kg", "price": 1039 },
      { "label": "1 Kg", "price": 1870 },
      { "label": "2 Kg", "price": 3637 }
    ],
    "oldPrice": 1159,
    "rating": 5,
    "reviews": 234,
    "tag": "Seasonal",
    "img": "/images/products/Minimalist Muse Designer Cake.jpg",
    "description": "Minimalist Muse Designer Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 59,
    "name": "Emerald Jewel Designer Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Designer Cakes",
    "price": 1069,
    "weights": [
      { "label": "0.5 Kg", "price": 1069 },
      { "label": "1 Kg", "price": 1924 },
      { "label": "2 Kg", "price": 3742 }
    ],
    "oldPrice": 1189,
    "rating": 5,
    "reviews": 237,
    "tag": "Luxury",
    "img": "/images/products/Emerald Jewel Designer Cake.jpg",
    "description": "Emerald Jewel Designer Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 60,
    "name": "Silk Ribbon Designer Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Designer Cakes",
    "price": 1099,
    "weights": [
      { "label": "0.5 Kg", "price": 1099 },
      { "label": "1 Kg", "price": 1978 },
      { "label": "2 Kg", "price": 3847 }
    ],
    "oldPrice": 1219,
    "rating": 4,
    "reviews": 240,
    "tag": "Premium",
    "img": "/images/products/Silk Ribbon Designer Cake.jpg",
    "description": "Silk Ribbon Designer Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 61,
    "name": "Candy Cloud Kids Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Kids Cakes",
    "price": 999,
    "weights": [
      { "label": "0.5 Kg", "price": 999 },
      { "label": "1 Kg", "price": 1798 },
      { "label": "2 Kg", "price": 3497 }
    ],
    "oldPrice": 1119,
    "rating": 4,
    "reviews": 243,
    "tag": "Bestseller",
    "img": "/images/products/Candy Cloud Kids Cake.jpg",
    "description": "Candy Cloud Kids Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 62,
    "name": "Princess Garden Kids Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Kids Cakes",
    "price": 1029,
    "weights": [
      { "label": "0.5 Kg", "price": 1029 },
      { "label": "1 Kg", "price": 1852 },
      { "label": "2 Kg", "price": 3602 }
    ],
    "oldPrice": 1149,
    "rating": 4,
    "reviews": 246,
    "tag": "Trending",
    "img": "/images/products/Princess Garden Kids Cake.jpg",
    "description": "Princess Garden Kids Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 63,
    "name": "Dino Delight Kids Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Kids Cakes",
    "price": 1059,
    "weights": [
      { "label": "0.5 Kg", "price": 1059 },
      { "label": "1 Kg", "price": 1906 },
      { "label": "2 Kg", "price": 3707 }
    ],
    "oldPrice": 1179,
    "rating": 4,
    "reviews": 249,
    "tag": "New",
    "img": "/images/products/Dino Delight Kids Cake.jpg",
    "description": "Dino Delight Kids Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 64,
    "name": "Rocket Adventure Kids Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Kids Cakes",
    "price": 1089,
    "weights": [
      { "label": "0.5 Kg", "price": 1089 },
      { "label": "1 Kg", "price": 1960 },
      { "label": "2 Kg", "price": 3812 }
    ],
    "oldPrice": 1209,
    "rating": 5,
    "reviews": 252,
    "tag": "Seasonal",
    "img": "/images/products/Rocket Adventure Kids Cake.jpg",
    "description": "Rocket Adventure Kids Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 65,
    "name": "Paw Patrol Kids Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Kids Cakes",
    "price": 1119,
    "weights": [
      { "label": "0.5 Kg", "price": 1119 },
      { "label": "1 Kg", "price": 2014 },
      { "label": "2 Kg", "price": 3917 }
    ],
    "oldPrice": 1239,
    "rating": 5,
    "reviews": 255,
    "tag": "Luxury",
    "img": "/images/products/Paw Patrol Kids Cake.jpg",
    "description": "Paw Patrol Kids Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 66,
    "name": "Fiesta Fun Kids Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Kids Cakes",
    "price": 1149,
    "weights": [
      { "label": "0.5 Kg", "price": 1149 },
      { "label": "1 Kg", "price": 2068 },
      { "label": "2 Kg", "price": 4022 }
    ],
    "oldPrice": 1269,
    "rating": 5,
    "reviews": 258,
    "tag": "Premium",
    "img": "/images/products/Fiesta Fun Kids Cake.jpg",
    "description": "Fiesta Fun Kids Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 67,
    "name": "Magical Unicorn Cartoon Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Cartoon Cakes",
    "price": 1049,
    "weights": [
      { "label": "0.5 Kg", "price": 1049 },
      { "label": "1 Kg", "price": 1888 },
      { "label": "2 Kg", "price": 3672 }
    ],
    "oldPrice": 1169,
    "rating": 5,
    "reviews": 261,
    "tag": "Bestseller",
    "img": "/images/products/Magical Unicorn Cartoon Cake.jpg",
    "description": "Magical Unicorn Cartoon Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 68,
    "name": "Super Panda Cartoon Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Cartoon Cakes",
    "price": 1079,
    "weights": [
      { "label": "0.5 Kg", "price": 1079 },
      { "label": "1 Kg", "price": 1942 },
      { "label": "2 Kg", "price": 3777 }
    ],
    "oldPrice": 1199,
    "rating": 5,
    "reviews": 264,
    "tag": "Trending",
    "img": "/images/products/Super Panda Cartoon Cake.jpg",
    "description": "Super Panda Cartoon Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 69,
    "name": "Happy Minion Cartoon Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Cartoon Cakes",
    "price": 1109,
    "weights": [
      { "label": "0.5 Kg", "price": 1109 },
      { "label": "1 Kg", "price": 1996 },
      { "label": "2 Kg", "price": 3882 }
    ],
    "oldPrice": 1229,
    "rating": 5,
    "reviews": 267,
    "tag": "New",
    "img": "/images/products/Happy Minion Cartoon Cake.jpg",
    "description": "Happy Minion Cartoon Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 70,
    "name": "Toy Story Cartoon Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Cartoon Cakes",
    "price": 1139,
    "weights": [
      { "label": "0.5 Kg", "price": 1139 },
      { "label": "1 Kg", "price": 2050 },
      { "label": "2 Kg", "price": 3987 }
    ],
    "oldPrice": 1259,
    "rating": 4,
    "reviews": 270,
    "tag": "Seasonal",
    "img": "/images/products/Toy Story Cartoon Cake.jpg",
    "description": "Toy Story Cartoon Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 71,
    "name": "Frozen Princess Cartoon Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Cartoon Cakes",
    "price": 1169,
    "weights": [
      { "label": "0.5 Kg", "price": 1169 },
      { "label": "1 Kg", "price": 2104 },
      { "label": "2 Kg", "price": 4092 }
    ],
    "oldPrice": 1289,
    "rating": 4,
    "reviews": 273,
    "tag": "Luxury",
    "img": "/images/products/Frozen Princess Cartoon Cake.jpg",
    "description": "Frozen Princess Cartoon Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 72,
    "name": "SpongeBob Cartoon Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Cartoon Cakes",
    "price": 1199,
    "weights": [
      { "label": "0.5 Kg", "price": 1199 },
      { "label": "1 Kg", "price": 2158 },
      { "label": "2 Kg", "price": 4197 }
    ],
    "oldPrice": 1319,
    "rating": 4,
    "reviews": 276,
    "tag": "Premium",
    "img": "/images/products/SpongeBob Cartoon Cake.jpg",
    "description": "SpongeBob Cartoon Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 73,
    "name": "Cherry Blossom Anime Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Anime Cakes",
    "price": 1099,
    "weights": [
      { "label": "0.5 Kg", "price": 1099 },
      { "label": "1 Kg", "price": 1978 },
      { "label": "2 Kg", "price": 3847 }
    ],
    "oldPrice": 1219,
    "rating": 4,
    "reviews": 279,
    "tag": "Bestseller",
    "img": "/images/products/Cherry Blossom Anime Cake.jpg",
    "description": "Cherry Blossom Anime Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 74,
    "name": "Ninja Star Anime Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Anime Cakes",
    "price": 1129,
    "weights": [
      { "label": "0.5 Kg", "price": 1129 },
      { "label": "1 Kg", "price": 2032 },
      { "label": "2 Kg", "price": 3952 }
    ],
    "oldPrice": 1249,
    "rating": 5,
    "reviews": 282,
    "tag": "Trending",
    "img": "/images/products/Ninja Star Anime Cake.jpg",
    "description": "Ninja Star Anime Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 75,
    "name": "Galaxy Hero Anime Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Anime Cakes",
    "price": 1159,
    "weights": [
      { "label": "0.5 Kg", "price": 1159 },
      { "label": "1 Kg", "price": 2086 },
      { "label": "2 Kg", "price": 4057 }
    ],
    "oldPrice": 1279,
    "rating": 5,
    "reviews": 285,
    "tag": "New",
    "img": "/images/products/Galaxy Hero Anime Cake.jpg",
    "description": "Galaxy Hero Anime Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 76,
    "name": "Dragon Flame Anime Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Anime Cakes",
    "price": 1189,
    "weights": [
      { "label": "0.5 Kg", "price": 1189 },
      { "label": "1 Kg", "price": 2140 },
      { "label": "2 Kg", "price": 4162 }
    ],
    "oldPrice": 1309,
    "rating": 5,
    "reviews": 288,
    "tag": "Seasonal",
    "img": "/images/products/Dragon Flame Anime Cake.jpg",
    "description": "Dragon Flame Anime Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 77,
    "name": "Sakura Dream Anime Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Anime Cakes",
    "price": 1219,
    "weights": [
      { "label": "0.5 Kg", "price": 1219 },
      { "label": "1 Kg", "price": 2194 },
      { "label": "2 Kg", "price": 4267 }
    ],
    "oldPrice": 1339,
    "rating": 5,
    "reviews": 291,
    "tag": "Luxury",
    "img": "/images/products/Sakura Dream Anime Cake.jpg",
    "description": "Sakura Dream Anime Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 78,
    "name": "Samurai Moon Anime Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Anime Cakes",
    "price": 1249,
    "weights": [
      { "label": "0.5 Kg", "price": 1249 },
      { "label": "1 Kg", "price": 2248 },
      { "label": "2 Kg", "price": 4372 }
    ],
    "oldPrice": 1369,
    "rating": 5,
    "reviews": 294,
    "tag": "Premium",
    "img": "/images/products/Samurai Moon Anime Cake.jpg",
    "description": "Samurai Moon Anime Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 79,
    "name": "Galaxy Guardian Superhero Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Superhero Cakes",
    "price": 1149,
    "weights": [
      { "label": "0.5 Kg", "price": 1149 },
      { "label": "1 Kg", "price": 2068 },
      { "label": "2 Kg", "price": 4022 }
    ],
    "oldPrice": 1269,
    "rating": 5,
    "reviews": 297,
    "tag": "Bestseller",
    "img": "/images/products/Galaxy Guardian Superhero Cake.jpg",
    "description": "Galaxy Guardian Superhero Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 80,
    "name": "Crimson Crusader Superhero Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Superhero Cakes",
    "price": 1179,
    "weights": [
      { "label": "0.5 Kg", "price": 1179 },
      { "label": "1 Kg", "price": 2122 },
      { "label": "2 Kg", "price": 4127 }
    ],
    "oldPrice": 1299,
    "rating": 4,
    "reviews": 300,
    "tag": "Trending",
    "img": "/images/products/Crimson Crusader Superhero Cake.jpg",
    "description": "Crimson Crusader Superhero Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 81,
    "name": "Golden Shield Superhero Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Superhero Cakes",
    "price": 1209,
    "weights": [
      { "label": "0.5 Kg", "price": 1209 },
      { "label": "1 Kg", "price": 2176 },
      { "label": "2 Kg", "price": 4232 }
    ],
    "oldPrice": 1329,
    "rating": 4,
    "reviews": 303,
    "tag": "New",
    "img": "/images/products/Golden Shield Superhero Cake.jpg",
    "description": "Golden Shield Superhero Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 82,
    "name": "Mystic Hero Superhero Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Superhero Cakes",
    "price": 1239,
    "weights": [
      { "label": "0.5 Kg", "price": 1239 },
      { "label": "1 Kg", "price": 2230 },
      { "label": "2 Kg", "price": 4337 }
    ],
    "oldPrice": 1359,
    "rating": 4,
    "reviews": 306,
    "tag": "Seasonal",
    "img": "/images/products/Mystic Hero Superhero Cake.jpg",
    "description": "Mystic Hero Superhero Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 83,
    "name": "Thunder Strike Superhero Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Superhero Cakes",
    "price": 1269,
    "weights": [
      { "label": "0.5 Kg", "price": 1269 },
      { "label": "1 Kg", "price": 2284 },
      { "label": "2 Kg", "price": 4442 }
    ],
    "oldPrice": 1389,
    "rating": 4,
    "reviews": 309,
    "tag": "Luxury",
    "img": "/images/products/Thunder Strike Superhero Cake.jpg",
    "description": "Thunder Strike Superhero Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 84,
    "name": "Quantum Leap Superhero Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Superhero Cakes",
    "price": 1299,
    "weights": [
      { "label": "0.5 Kg", "price": 1299 },
      { "label": "1 Kg", "price": 2338 },
      { "label": "2 Kg", "price": 4547 }
    ],
    "oldPrice": 1419,
    "rating": 5,
    "reviews": 312,
    "tag": "Premium",
    "img": "/images/products/Quantum Leap Superhero Cake.jpg",
    "description": "Quantum Leap Superhero Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 85,
    "name": "Moonlight Romance Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Romantic Cakes",
    "price": 1199,
    "weights": [
      { "label": "0.5 Kg", "price": 1199 },
      { "label": "1 Kg", "price": 2158 },
      { "label": "2 Kg", "price": 4197 }
    ],
    "oldPrice": 1319,
    "rating": 5,
    "reviews": 315,
    "tag": "Bestseller",
    "img": "/images/products/Moonlight Romance Cake.jpg",
    "description": "Moonlight Romance Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 86,
    "name": "Silk Rose Romance Cake",
    "flavor": "Saffron Rasmalai",
    "category": "Romantic Cakes",
    "price": 1229,
    "weights": [
      { "label": "0.5 Kg", "price": 1229 },
      { "label": "1 Kg", "price": 2212 },
      { "label": "2 Kg", "price": 4302 }
    ],
    "oldPrice": 1349,
    "rating": 5,
    "reviews": 318,
    "tag": "Trending",
    "img": "/images/products/Silk Rose Romance Cake.jpg",
    "description": "Silk Rose Romance Cake crafted with saffron rasmalai, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 87,
    "name": "Velvet Whisper Romance Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Romantic Cakes",
    "price": 1259,
    "weights": [
      { "label": "0.5 Kg", "price": 1259 },
      { "label": "1 Kg", "price": 2266 },
      { "label": "2 Kg", "price": 4407 }
    ],
    "oldPrice": 1379,
    "rating": 5,
    "reviews": 321,
    "tag": "New",
    "img": "/images/products/Velvet Whisper Romance Cake.jpg",
    "description": "Velvet Whisper Romance Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 88,
    "name": "Champagne Kisses Romance Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Romantic Cakes",
    "price": 1289,
    "weights": [
      { "label": "0.5 Kg", "price": 1289 },
      { "label": "1 Kg", "price": 2320 },
      { "label": "2 Kg", "price": 4512 }
    ],
    "oldPrice": 1409,
    "rating": 5,
    "reviews": 324,
    "tag": "Seasonal",
    "img": "/images/products/Champagne Kisses Romance Cake.jpg",
    "description": "Champagne Kisses Romance Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 89,
    "name": "Petal Promise Romance Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Romantic Cakes",
    "price": 1319,
    "weights": [
      { "label": "0.5 Kg", "price": 1319 },
      { "label": "1 Kg", "price": 2374 },
      { "label": "2 Kg", "price": 4617 }
    ],
    "oldPrice": 1439,
    "rating": 5,
    "reviews": 327,
    "tag": "Luxury",
    "img": "/images/products/Petal Promise Romance Cake.jpg",
    "description": "Petal Promise Romance Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 90,
    "name": "Midnight Lovers Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Romantic Cakes",
    "price": 1349,
    "weights": [
      { "label": "0.5 Kg", "price": 1349 },
      { "label": "1 Kg", "price": 2428 },
      { "label": "2 Kg", "price": 4722 }
    ],
    "oldPrice": 1469,
    "rating": 4,
    "reviews": 330,
    "tag": "Premium",
    "img": "/images/products/Midnight Lovers Cake.jpg",
    "description": "Midnight Lovers Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 91,
    "name": "Dual Heart Couple Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Couple Cakes",
    "price": 1249,
    "weights": [
      { "label": "0.5 Kg", "price": 1249 },
      { "label": "1 Kg", "price": 2248 },
      { "label": "2 Kg", "price": 4372 }
    ],
    "oldPrice": 1369,
    "rating": 4,
    "reviews": 333,
    "tag": "Bestseller",
    "img": "/images/products/Dual Heart Couple Cake.jpg",
    "description": "Dual Heart Couple Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 92,
    "name": "Together Forever Couple Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Couple Cakes",
    "price": 1279,
    "weights": [
      { "label": "0.5 Kg", "price": 1279 },
      { "label": "1 Kg", "price": 2302 },
      { "label": "2 Kg", "price": 4477 }
    ],
    "oldPrice": 1399,
    "rating": 4,
    "reviews": 336,
    "tag": "Trending",
    "img": "/images/products/Together Forever Couple Cake.jpg",
    "description": "Together Forever Couple Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 93,
    "name": "Harmony Pair Couple Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Couple Cakes",
    "price": 1309,
    "weights": [
      { "label": "0.5 Kg", "price": 1309 },
      { "label": "1 Kg", "price": 2356 },
      { "label": "2 Kg", "price": 4582 }
    ],
    "oldPrice": 1429,
    "rating": 4,
    "reviews": 339,
    "tag": "New",
    "img": "/images/products/Harmony Pair Couple Cake.jpg",
    "description": "Harmony Pair Couple Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 94,
    "name": "Sunset Duo Couple Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Couple Cakes",
    "price": 1339,
    "weights": [
      { "label": "0.5 Kg", "price": 1339 },
      { "label": "1 Kg", "price": 2410 },
      { "label": "2 Kg", "price": 4687 }
    ],
    "oldPrice": 1459,
    "rating": 5,
    "reviews": 342,
    "tag": "Seasonal",
    "img": "/images/products/Sunset Duo Couple Cake.jpg",
    "description": "Sunset Duo Couple Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 95,
    "name": "Eternal Bond Couple Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Couple Cakes",
    "price": 1369,
    "weights": [
      { "label": "0.5 Kg", "price": 1369 },
      { "label": "1 Kg", "price": 2464 },
      { "label": "2 Kg", "price": 4792 }
    ],
    "oldPrice": 1489,
    "rating": 5,
    "reviews": 345,
    "tag": "Luxury",
    "img": "/images/products/Eternal Bond Couple Cake.jpg",
    "description": "Eternal Bond Couple Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 96,
    "name": "Dream Date Couple Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Couple Cakes",
    "price": 1399,
    "weights": [
      { "label": "0.5 Kg", "price": 1399 },
      { "label": "1 Kg", "price": 2518 },
      { "label": "2 Kg", "price": 4897 }
    ],
    "oldPrice": 1519,
    "rating": 5,
    "reviews": 348,
    "tag": "Premium",
    "img": "/images/products/Dream Date Couple Cake.jpg",
    "description": "Dream Date Couple Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 97,
    "name": "Charcoal Heart Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Heart Cakes",
    "price": 1299,
    "weights": [
      { "label": "0.5 Kg", "price": 1299 },
      { "label": "1 Kg", "price": 2338 },
      { "label": "2 Kg", "price": 4547 }
    ],
    "oldPrice": 1419,
    "rating": 5,
    "reviews": 351,
    "tag": "Bestseller",
    "img": "/images/products/Charcoal Heart Cake.jpg",
    "description": "Charcoal Heart Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 98,
    "name": "Golden Heart Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Heart Cakes",
    "price": 1329,
    "weights": [
      { "label": "0.5 Kg", "price": 1329 },
      { "label": "1 Kg", "price": 2392 },
      { "label": "2 Kg", "price": 4652 }
    ],
    "oldPrice": 1449,
    "rating": 5,
    "reviews": 354,
    "tag": "Trending",
    "img": "/images/products/Golden Heart Cake.jpg",
    "description": "Golden Heart Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 99,
    "name": "Rosy Heart Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Heart Cakes",
    "price": 1359,
    "weights": [
      { "label": "0.5 Kg", "price": 1359 },
      { "label": "1 Kg", "price": 2446 },
      { "label": "2 Kg", "price": 4757 }
    ],
    "oldPrice": 1479,
    "rating": 5,
    "reviews": 357,
    "tag": "New",
    "img": "/images/products/Rosy Heart Cake.jpg",
    "description": "Rosy Heart Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 100,
    "name": "Velvet Heart Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Heart Cakes",
    "price": 1389,
    "weights": [
      { "label": "0.5 Kg", "price": 1389 },
      { "label": "1 Kg", "price": 2500 },
      { "label": "2 Kg", "price": 4862 }
    ],
    "oldPrice": 1509,
    "rating": 4,
    "reviews": 360,
    "tag": "Seasonal",
    "img": "/images/products/Velvet Heart Cake.jpg",
    "description": "Velvet Heart Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 101,
    "name": "Fruit Burst Heart Cake",
    "flavor": "Seasonal Fresh Fruits",
    "category": "Heart Cakes",
    "price": 1419,
    "weights": [
      { "label": "0.5 Kg", "price": 1419 },
      { "label": "1 Kg", "price": 2554 },
      { "label": "2 Kg", "price": 4967 }
    ],
    "oldPrice": 1539,
    "rating": 4,
    "reviews": 363,
    "tag": "Luxury",
    "img": "/images/products/Fruit Burst Heart Cake.jpg",
    "description": "Fruit Burst Heart Cake crafted with seasonal fresh fruits, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 102,
    "name": "Iced Heart Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Heart Cakes",
    "price": 1449,
    "weights": [
      { "label": "0.5 Kg", "price": 1449 },
      { "label": "1 Kg", "price": 2608 },
      { "label": "2 Kg", "price": 5072 }
    ],
    "oldPrice": 1569,
    "rating": 4,
    "reviews": 366,
    "tag": "Premium",
    "img": "/images/products/Iced Heart Cake.jpg",
    "description": "Iced Heart Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 103,
    "name": "Opulent Velvet Premium Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Premium Cakes",
    "price": 1349,
    "weights": [
      { "label": "0.5 Kg", "price": 1349 },
      { "label": "1 Kg", "price": 2428 },
      { "label": "2 Kg", "price": 4722 }
    ],
    "oldPrice": 1469,
    "rating": 4,
    "reviews": 369,
    "tag": "Bestseller",
    "img": "/images/products/Opulent Velvet Premium Cake.jpg",
    "description": "Opulent Velvet Premium Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 104,
    "name": "Signature Gold Premium Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Premium Cakes",
    "price": 1379,
    "weights": [
      { "label": "0.5 Kg", "price": 1379 },
      { "label": "1 Kg", "price": 2482 },
      { "label": "2 Kg", "price": 4827 }
    ],
    "oldPrice": 1499,
    "rating": 5,
    "reviews": 372,
    "tag": "Trending",
    "img": "/images/products/Signature Gold Premium Cake.jpg",
    "description": "Signature Gold Premium Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 105,
    "name": "Pearl Mist Premium Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Premium Cakes",
    "price": 1409,
    "weights": [
      { "label": "0.5 Kg", "price": 1409 },
      { "label": "1 Kg", "price": 2536 },
      { "label": "2 Kg", "price": 4932 }
    ],
    "oldPrice": 1529,
    "rating": 5,
    "reviews": 375,
    "tag": "New",
    "img": "/images/products/Pearl Mist Premium Cake.jpg",
    "description": "Pearl Mist Premium Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 106,
    "name": "Elite Truffle Premium Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Premium Cakes",
    "price": 1439,
    "weights": [
      { "label": "0.5 Kg", "price": 1439 },
      { "label": "1 Kg", "price": 2590 },
      { "label": "2 Kg", "price": 5037 }
    ],
    "oldPrice": 1559,
    "rating": 5,
    "reviews": 378,
    "tag": "Seasonal",
    "img": "/images/products/Elite Truffle Premium Cake.jpg",
    "description": "Elite Truffle Premium Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 107,
    "name": "Silk Almond Premium Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Premium Cakes",
    "price": 1469,
    "weights": [
      { "label": "0.5 Kg", "price": 1469 },
      { "label": "1 Kg", "price": 2644 },
      { "label": "2 Kg", "price": 5142 }
    ],
    "oldPrice": 1589,
    "rating": 5,
    "reviews": 381,
    "tag": "Luxury",
    "img": "/images/products/Silk Almond Premium Cake.jpg",
    "description": "Silk Almond Premium Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 108,
    "name": "Royal Berry Premium Cake",
    "flavor": "Mixed Berry Ganache",
    "category": "Premium Cakes",
    "price": 1499,
    "weights": [
      { "label": "0.5 Kg", "price": 1499 },
      { "label": "1 Kg", "price": 2698 },
      { "label": "2 Kg", "price": 5247 }
    ],
    "oldPrice": 1619,
    "rating": 5,
    "reviews": 384,
    "tag": "Premium",
    "img": "/images/products/Royal Berry Premium Cake.jpg",
    "description": "Royal Berry Premium Cake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 109,
    "name": "Platinum Orchid Luxury Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Luxury Cakes",
    "price": 1399,
    "weights": [
      { "label": "0.5 Kg", "price": 1399 },
      { "label": "1 Kg", "price": 2518 },
      { "label": "2 Kg", "price": 4897 }
    ],
    "oldPrice": 1519,
    "rating": 5,
    "reviews": 387,
    "tag": "Bestseller",
    "img": "/images/products/Platinum Orchid Luxury Cake.jpg",
    "description": "Platinum Orchid Luxury Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 110,
    "name": "Crystal Pearl Luxury Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Luxury Cakes",
    "price": 1429,
    "weights": [
      { "label": "0.5 Kg", "price": 1429 },
      { "label": "1 Kg", "price": 2572 },
      { "label": "2 Kg", "price": 5002 }
    ],
    "oldPrice": 1549,
    "rating": 4,
    "reviews": 390,
    "tag": "Trending",
    "img": "/images/products/Crystal Pearl Luxury Cake.jpg",
    "description": "Crystal Pearl Luxury Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 111,
    "name": "Champagne Dream Luxury Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Luxury Cakes",
    "price": 1459,
    "weights": [
      { "label": "0.5 Kg", "price": 1459 },
      { "label": "1 Kg", "price": 2626 },
      { "label": "2 Kg", "price": 5107 }
    ],
    "oldPrice": 1579,
    "rating": 4,
    "reviews": 393,
    "tag": "New",
    "img": "/images/products/Champagne Dream Luxury Cake.jpg",
    "description": "Champagne Dream Luxury Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 112,
    "name": "Velvet Jewel Luxury Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Luxury Cakes",
    "price": 1489,
    "weights": [
      { "label": "0.5 Kg", "price": 1489 },
      { "label": "1 Kg", "price": 2680 },
      { "label": "2 Kg", "price": 5212 }
    ],
    "oldPrice": 1609,
    "rating": 4,
    "reviews": 396,
    "tag": "Seasonal",
    "img": "/images/products/Velvet Jewel Luxury Cake.jpg",
    "description": "Velvet Jewel Luxury Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 113,
    "name": "Lotus Crown Luxury Cake",
    "flavor": "Lotus Biscoff Crunch",
    "category": "Luxury Cakes",
    "price": 1519,
    "weights": [
      { "label": "0.5 Kg", "price": 1519 },
      { "label": "1 Kg", "price": 2734 },
      { "label": "2 Kg", "price": 5317 }
    ],
    "oldPrice": 1639,
    "rating": 4,
    "reviews": 399,
    "tag": "Luxury",
    "img": "/images/products/Lotus Crown Luxury Cake.jpg",
    "description": "Lotus Crown Luxury Cake crafted with lotus biscoff crunch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 114,
    "name": "Caviar Red Luxury Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Luxury Cakes",
    "price": 1549,
    "weights": [
      { "label": "0.5 Kg", "price": 1549 },
      { "label": "1 Kg", "price": 2788 },
      { "label": "2 Kg", "price": 5422 }
    ],
    "oldPrice": 1669,
    "rating": 5,
    "reviews": 402,
    "tag": "Premium",
    "img": "/images/products/Caviar Red Luxury Cake.jpg",
    "description": "Caviar Red Luxury Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 115,
    "name": "Midnight Chocolate Symphony",
    "flavor": "Rich Belgian Chocolate",
    "category": "Chocolate Cakes",
    "price": 1449,
    "weights": [
      { "label": "0.5 Kg", "price": 1449 },
      { "label": "1 Kg", "price": 2608 },
      { "label": "2 Kg", "price": 5072 }
    ],
    "oldPrice": 1569,
    "rating": 5,
    "reviews": 405,
    "tag": "Bestseller",
    "img": "/images/products/Midnight Chocolate Pull Me Up Cake.jpg",
    "description": "Midnight Chocolate Symphony crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 116,
    "name": "Belgian Elegance Chocolate Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Chocolate Cakes",
    "price": 1479,
    "weights": [
      { "label": "0.5 Kg", "price": 1479 },
      { "label": "1 Kg", "price": 2662 },
      { "label": "2 Kg", "price": 5177 }
    ],
    "oldPrice": 1599,
    "rating": 5,
    "reviews": 408,
    "tag": "Trending",
    "img": "/images/products/Elite Truffle Premium Cake.jpg",
    "description": "Belgian Elegance Chocolate Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 117,
    "name": "Mocha Velvet Chocolate Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Chocolate Cakes",
    "price": 1509,
    "weights": [
      { "label": "0.5 Kg", "price": 1509 },
      { "label": "1 Kg", "price": 2716 },
      { "label": "2 Kg", "price": 5282 }
    ],
    "oldPrice": 1629,
    "rating": 5,
    "reviews": 411,
    "tag": "New",
    "img": "/images/products/Chocolate Crown Birthday Cake.jpg",
    "description": "Mocha Velvet Chocolate Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 118,
    "name": "Chocolate Fudge Cascade",
    "flavor": "Rich Belgian Chocolate",
    "category": "Chocolate Cakes",
    "price": 1539,
    "weights": [
      { "label": "0.5 Kg", "price": 1539 },
      { "label": "1 Kg", "price": 2770 },
      { "label": "2 Kg", "price": 5387 }
    ],
    "oldPrice": 1659,
    "rating": 5,
    "reviews": 414,
    "tag": "Seasonal",
    "img": "/images/products/Chocolate Hazelnut Mousse Cake.jpg",
    "description": "Chocolate Fudge Cascade crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 119,
    "name": "Praline Chocolate Layers",
    "flavor": "Rich Belgian Chocolate",
    "category": "Chocolate Cakes",
    "price": 1569,
    "weights": [
      { "label": "0.5 Kg", "price": 1569 },
      { "label": "1 Kg", "price": 2824 },
      { "label": "2 Kg", "price": 5492 }
    ],
    "oldPrice": 1689,
    "rating": 5,
    "reviews": 417,
    "tag": "Luxury",
    "img": "/images/products/Chocolate Luxe Bento Cake.jpg",
    "description": "Praline Chocolate Layers crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 120,
    "name": "Silken Chocolate Truffle Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Chocolate Cakes",
    "price": 1599,
    "weights": [
      { "label": "0.5 Kg", "price": 1599 },
      { "label": "1 Kg", "price": 2878 },
      { "label": "2 Kg", "price": 5597 }
    ],
    "oldPrice": 1719,
    "rating": 4,
    "reviews": 420,
    "tag": "Premium",
    "img": "/images/products/Eggless Chocolate Truffle Cake.jpg",
    "description": "Silken Chocolate Truffle Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 121,
    "name": "Hazelnut Truffle Indulgence",
    "flavor": "Rich Belgian Chocolate",
    "category": "Truffle Cakes",
    "price": 1499,
    "weights": [
      { "label": "0.5 Kg", "price": 1499 },
      { "label": "1 Kg", "price": 2698 },
      { "label": "2 Kg", "price": 5247 }
    ],
    "oldPrice": 1619,
    "rating": 4,
    "reviews": 423,
    "tag": "Bestseller",
    "img": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    "description": "Hazelnut Truffle Indulgence crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 122,
    "name": "Berry Truffle Fantasy",
    "flavor": "Rich Belgian Chocolate",
    "category": "Truffle Cakes",
    "price": 1529,
    "weights": [
      { "label": "0.5 Kg", "price": 1529 },
      { "label": "1 Kg", "price": 2752 },
      { "label": "2 Kg", "price": 5352 }
    ],
    "oldPrice": 1649,
    "rating": 4,
    "reviews": 426,
    "tag": "Trending",
    "img": "/images/products/Berry Mousse Elegance.jpg",
    "description": "Berry Truffle Fantasy crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 123,
    "name": "Caramel Truffle Royale",
    "flavor": "Rich Belgian Chocolate",
    "category": "Truffle Cakes",
    "price": 1559,
    "weights": [
      { "label": "0.5 Kg", "price": 1559 },
      { "label": "1 Kg", "price": 2806 },
      { "label": "2 Kg", "price": 5457 }
    ],
    "oldPrice": 1679,
    "rating": 4,
    "reviews": 429,
    "tag": "New",
    "img": "/images/products/Caramel Bombastic Cake.jpg",
    "description": "Caramel Truffle Royale crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 124,
    "name": "Dark Truffle Elegance",
    "flavor": "Rich Belgian Chocolate",
    "category": "Truffle Cakes",
    "price": 1589,
    "weights": [
      { "label": "0.5 Kg", "price": 1589 },
      { "label": "1 Kg", "price": 2860 },
      { "label": "2 Kg", "price": 5562 }
    ],
    "oldPrice": 1709,
    "rating": 5,
    "reviews": 432,
    "tag": "Seasonal",
    "img": "/images/products/Elite Truffle Premium Cake.jpg",
    "description": "Dark Truffle Elegance crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 125,
    "name": "Rose Truffle Velvet",
    "flavor": "Rich Belgian Chocolate",
    "category": "Truffle Cakes",
    "price": 1619,
    "weights": [
      { "label": "0.5 Kg", "price": 1619 },
      { "label": "1 Kg", "price": 2914 },
      { "label": "2 Kg", "price": 5667 }
    ],
    "oldPrice": 1739,
    "rating": 5,
    "reviews": 435,
    "tag": "Luxury",
    "img": "/images/products/Velvet Jewel Luxury Cake.jpg",
    "description": "Rose Truffle Velvet crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 126,
    "name": "Espresso Truffle Dream",
    "flavor": "Rich Belgian Chocolate",
    "category": "Truffle Cakes",
    "price": 1649,
    "weights": [
      { "label": "0.5 Kg", "price": 1649 },
      { "label": "1 Kg", "price": 2968 },
      { "label": "2 Kg", "price": 5772 }
    ],
    "oldPrice": 1769,
    "rating": 5,
    "reviews": 438,
    "tag": "Premium",
    "img": "/images/products/Espresso Mousse Delight.jpg",
    "description": "Espresso Truffle Dream crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 127,
    "name": "Citrus Orchard Fruit Cake",
    "flavor": "Seasonal Fresh Fruits",
    "category": "Fruit Cakes",
    "price": 1549,
    "weights": [
      { "label": "0.5 Kg", "price": 1549 },
      { "label": "1 Kg", "price": 2788 },
      { "label": "2 Kg", "price": 5422 }
    ],
    "oldPrice": 1669,
    "rating": 5,
    "reviews": 441,
    "tag": "Bestseller",
    "img": "/images/products/Fruit Cake Noel.jpg",
    "description": "Citrus Orchard Fruit Cake crafted with seasonal fresh fruits, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 129,
    "name": "Tropical Mango Fruit Cake",
    "flavor": "Fresh Mango Cream",
    "category": "Fruit Cakes",
    "price": 1609,
    "weights": [
      { "label": "0.5 Kg", "price": 1609 },
      { "label": "1 Kg", "price": 2896 },
      { "label": "2 Kg", "price": 5632 }
    ],
    "oldPrice": 1729,
    "rating": 5,
    "reviews": 447,
    "tag": "New",
    "img": "/images/products/Eggless Mango Cream Cake.jpg",
    "description": "Tropical Mango Fruit Cake crafted with fresh mango cream, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 133,
    "name": "Salted Caramel Butterscotch Cake",
    "flavor": "Caramel Butterscotch",
    "category": "Butterscotch Cakes",
    "price": 1599,
    "weights": [
      { "label": "0.5 Kg", "price": 1599 },
      { "label": "1 Kg", "price": 2878 },
      { "label": "2 Kg", "price": 5597 }
    ],
    "oldPrice": 1719,
    "rating": 4,
    "reviews": 459,
    "tag": "Bestseller",
    "img": "/images/products/Eggless Butterscotch Cake.jpg",
    "description": "Salted Caramel Butterscotch Cake crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 134,
    "name": "Honeycomb Butterscotch Cake",
    "flavor": "Caramel Butterscotch",
    "category": "Butterscotch Cakes",
    "price": 1629,
    "weights": [
      { "label": "0.5 Kg", "price": 1629 },
      { "label": "1 Kg", "price": 2932 },
      { "label": "2 Kg", "price": 5702 }
    ],
    "oldPrice": 1749,
    "rating": 5,
    "reviews": 462,
    "tag": "Trending",
    "img": "/images/products/Golden Crunch Bomb Cake.jpg",
    "description": "Honeycomb Butterscotch Cake crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 135,
    "name": "Pecan Butterscotch Cake",
    "flavor": "Caramel Butterscotch",
    "category": "Butterscotch Cakes",
    "price": 1659,
    "weights": [
      { "label": "0.5 Kg", "price": 1659 },
      { "label": "1 Kg", "price": 2986 },
      { "label": "2 Kg", "price": 5807 }
    ],
    "oldPrice": 1779,
    "rating": 5,
    "reviews": 465,
    "tag": "New",
    "img": "/images/products/Caramel Drip Pull Me Up Cake.jpg",
    "description": "Pecan Butterscotch Cake crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 136,
    "name": "Maple Butterscotch Wonder",
    "flavor": "Caramel Butterscotch",
    "category": "Butterscotch Cakes",
    "price": 1689,
    "weights": [
      { "label": "0.5 Kg", "price": 1689 },
      { "label": "1 Kg", "price": 3040 },
      { "label": "2 Kg", "price": 5912 }
    ],
    "oldPrice": 1809,
    "rating": 5,
    "reviews": 468,
    "tag": "Seasonal",
    "img": "/images/products/Maple Crunch Father's Day Cake.jpg",
    "description": "Maple Butterscotch Wonder crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 137,
    "name": "Vanilla Butterscotch Dream",
    "flavor": "Classic French Vanilla",
    "category": "Butterscotch Cakes",
    "price": 1719,
    "weights": [
      { "label": "0.5 Kg", "price": 1719 },
      { "label": "1 Kg", "price": 3094 },
      { "label": "2 Kg", "price": 6017 }
    ],
    "oldPrice": 1839,
    "rating": 5,
    "reviews": 471,
    "tag": "Luxury",
    "img": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    "description": "Vanilla Butterscotch Dream crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 138,
    "name": "Crunchy Butterscotch Layer Cake",
    "flavor": "Caramel Butterscotch",
    "category": "Butterscotch Cakes",
    "price": 1749,
    "weights": [
      { "label": "0.5 Kg", "price": 1749 },
      { "label": "1 Kg", "price": 3148 },
      { "label": "2 Kg", "price": 6122 }
    ],
    "oldPrice": 1869,
    "rating": 5,
    "reviews": 474,
    "tag": "Premium",
    "img": "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80",
    "description": "Crunchy Butterscotch Layer Cake crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 139,
    "name": "French Vanilla Cloud Cake",
    "flavor": "Classic French Vanilla",
    "category": "Vanilla Cakes",
    "price": 1649,
    "weights": [
      { "label": "0.5 Kg", "price": 1649 },
      { "label": "1 Kg", "price": 2968 },
      { "label": "2 Kg", "price": 5772 }
    ],
    "oldPrice": 1769,
    "rating": 5,
    "reviews": 477,
    "tag": "Bestseller",
    "img": "/images/products/Eggless Vanilla Bean Cake.jpg",
    "description": "French Vanilla Cloud Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 140,
    "name": "Silk Vanilla Bean Cake",
    "flavor": "Classic French Vanilla",
    "category": "Vanilla Cakes",
    "price": 1679,
    "weights": [
      { "label": "0.5 Kg", "price": 1679 },
      { "label": "1 Kg", "price": 3022 },
      { "label": "2 Kg", "price": 5877 }
    ],
    "oldPrice": 1799,
    "rating": 4,
    "reviews": 60,
    "tag": "Trending",
    "img": "/images/products/Champagne Velvet Birthday Cake.jpg",
    "description": "Silk Vanilla Bean Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 141,
    "name": "Almond Vanilla Lace Cake",
    "flavor": "Classic French Vanilla",
    "category": "Vanilla Cakes",
    "price": 1709,
    "weights": [
      { "label": "0.5 Kg", "price": 1709 },
      { "label": "1 Kg", "price": 3076 },
      { "label": "2 Kg", "price": 5982 }
    ],
    "oldPrice": 1829,
    "rating": 4,
    "reviews": 63,
    "tag": "New",
    "img": "/images/products/Classic Blanc Wedding Cake.jpg",
    "description": "Almond Vanilla Lace Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 142,
    "name": "Vanilla Rose Garden Cake",
    "flavor": "Classic French Vanilla",
    "category": "Vanilla Cakes",
    "price": 1739,
    "weights": [
      { "label": "0.5 Kg", "price": 1739 },
      { "label": "1 Kg", "price": 3130 },
      { "label": "2 Kg", "price": 6087 }
    ],
    "oldPrice": 1859,
    "rating": 4,
    "reviews": 66,
    "tag": "Seasonal",
    "img": "/images/products/Rose Garden Mother's Day Cake.jpg",
    "description": "Vanilla Rose Garden Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 143,
    "name": "Vanilla Berry Whisper Cake",
    "flavor": "Classic French Vanilla",
    "category": "Vanilla Cakes",
    "price": 1769,
    "weights": [
      { "label": "0.5 Kg", "price": 1769 },
      { "label": "1 Kg", "price": 3184 },
      { "label": "2 Kg", "price": 6192 }
    ],
    "oldPrice": 1889,
    "rating": 4,
    "reviews": 69,
    "tag": "Luxury",
    "img": "/images/products/Vanilla Berry Bento Cake.jpg",
    "description": "Vanilla Berry Whisper Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 144,
    "name": "Creamy Vanilla Elegance",
    "flavor": "Classic French Vanilla",
    "category": "Vanilla Cakes",
    "price": 1799,
    "weights": [
      { "label": "0.5 Kg", "price": 1799 },
      { "label": "1 Kg", "price": 3238 },
      { "label": "2 Kg", "price": 6297 }
    ],
    "oldPrice": 1919,
    "rating": 5,
    "reviews": 72,
    "tag": "Premium",
    "img": "/images/products/Pure White Minimal Cake.jpg",
    "description": "Creamy Vanilla Elegance crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 146,
    "name": "Cherry Noir Black Forest Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Black Forest Cakes",
    "price": 1729,
    "weights": [
      { "label": "0.5 Kg", "price": 1729 },
      { "label": "1 Kg", "price": 3112 },
      { "label": "2 Kg", "price": 6052 }
    ],
    "oldPrice": 1849,
    "rating": 5,
    "reviews": 78,
    "tag": "Trending",
    "img": "/images/products/Eggless Black Forest Cake.jpg",
    "description": "Cherry Noir Black Forest Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 148,
    "name": "Chocolate Cherry Black Forest",
    "flavor": "Rich Belgian Chocolate",
    "category": "Black Forest Cakes",
    "price": 1789,
    "weights": [
      { "label": "0.5 Kg", "price": 1789 },
      { "label": "1 Kg", "price": 3220 },
      { "label": "2 Kg", "price": 6262 }
    ],
    "oldPrice": 1909,
    "rating": 5,
    "reviews": 84,
    "tag": "Seasonal",
    "img": "/images/products/Chocolate Crown Birthday Cake.jpg",
    "description": "Chocolate Cherry Black Forest crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 149,
    "name": "Midnight Woods Black Forest Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Black Forest Cakes",
    "price": 1819,
    "weights": [
      { "label": "0.5 Kg", "price": 1819 },
      { "label": "1 Kg", "price": 3274 },
      { "label": "2 Kg", "price": 6367 }
    ],
    "oldPrice": 1939,
    "rating": 5,
    "reviews": 87,
    "tag": "Luxury",
    "img": "/images/products/Midnight Chocolate Pull Me Up Cake.jpg",
    "description": "Midnight Woods Black Forest Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 152,
    "name": "Ruby Charm Red Velvet Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Red Velvet Cakes",
    "price": 1779,
    "weights": [
      { "label": "0.5 Kg", "price": 1779 },
      { "label": "1 Kg", "price": 3202 },
      { "label": "2 Kg", "price": 6227 }
    ],
    "oldPrice": 1899,
    "rating": 4,
    "reviews": 96,
    "tag": "Trending",
    "img": "/images/products/Eggless Red Velvet Cake.jpg",
    "description": "Ruby Charm Red Velvet Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 153,
    "name": "Creamy Red Velvet Delight",
    "flavor": "Classic French Vanilla",
    "category": "Red Velvet Cakes",
    "price": 1809,
    "weights": [
      { "label": "0.5 Kg", "price": 1809 },
      { "label": "1 Kg", "price": 3256 },
      { "label": "2 Kg", "price": 6332 }
    ],
    "oldPrice": 1929,
    "rating": 4,
    "reviews": 99,
    "tag": "New",
    "img": "/images/products/Opulent Velvet Premium Cake.jpg",
    "description": "Creamy Red Velvet Delight crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 157,
    "name": "Royal Rasmalai Delight",
    "flavor": "Saffron Rasmalai",
    "category": "Rasmalai Cakes",
    "price": 1799,
    "weights": [
      { "label": "0.5 Kg", "price": 1799 },
      { "label": "1 Kg", "price": 3238 },
      { "label": "2 Kg", "price": 6297 }
    ],
    "oldPrice": 1919,
    "rating": 5,
    "reviews": 111,
    "tag": "Bestseller",
    "img": "/images/products/Rose Quartz Anniversary Cake.jpg",
    "description": "Royal Rasmalai Delight crafted with saffron rasmalai, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 159,
    "name": "Almond Rasmalai Dream",
    "flavor": "Saffron Rasmalai",
    "category": "Rasmalai Cakes",
    "price": 1859,
    "weights": [
      { "label": "0.5 Kg", "price": 1859 },
      { "label": "1 Kg", "price": 3346 },
      { "label": "2 Kg", "price": 6507 }
    ],
    "oldPrice": 1979,
    "rating": 5,
    "reviews": 117,
    "tag": "New",
    "img": "/images/products/Silk Almond Premium Cake.jpg",
    "description": "Almond Rasmalai Dream crafted with saffron rasmalai, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 160,
    "name": "Cardamom Rasmalai Whisper",
    "flavor": "Saffron Rasmalai",
    "category": "Rasmalai Cakes",
    "price": 1889,
    "weights": [
      { "label": "0.5 Kg", "price": 1889 },
      { "label": "1 Kg", "price": 3400 },
      { "label": "2 Kg", "price": 6612 }
    ],
    "oldPrice": 2009,
    "rating": 4,
    "reviews": 120,
    "tag": "Seasonal",
    "img": "/images/products/Cardamom Rose Tea Cake.jpg",
    "description": "Cardamom Rasmalai Whisper crafted with saffron rasmalai, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 161,
    "name": "Kulfi Rasmalai Cake",
    "flavor": "Saffron Rasmalai",
    "category": "Rasmalai Cakes",
    "price": 1919,
    "weights": [
      { "label": "0.5 Kg", "price": 1919 },
      { "label": "1 Kg", "price": 3454 },
      { "label": "2 Kg", "price": 6717 }
    ],
    "oldPrice": 2039,
    "rating": 4,
    "reviews": 123,
    "tag": "Luxury",
    "img": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    "description": "Kulfi Rasmalai Cake crafted with saffron rasmalai, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 162,
    "name": "Rose Rasmalai Indulgence",
    "flavor": "Saffron Rasmalai",
    "category": "Rasmalai Cakes",
    "price": 1949,
    "weights": [
      { "label": "0.5 Kg", "price": 1949 },
      { "label": "1 Kg", "price": 3508 },
      { "label": "2 Kg", "price": 6822 }
    ],
    "oldPrice": 2069,
    "rating": 4,
    "reviews": 126,
    "tag": "Premium",
    "img": "/images/products/Rose Garden Mother's Day Cake.jpg",
    "description": "Rose Rasmalai Indulgence crafted with saffron rasmalai, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 163,
    "name": "Crunchy Biscoff Layer Cake",
    "flavor": "Lotus Biscoff Crunch",
    "category": "Biscoff Cakes",
    "price": 1849,
    "weights": [
      { "label": "0.5 Kg", "price": 1849 },
      { "label": "1 Kg", "price": 3328 },
      { "label": "2 Kg", "price": 6472 }
    ],
    "oldPrice": 1969,
    "rating": 4,
    "reviews": 129,
    "tag": "Bestseller",
    "img": "/images/products/Biscoff Blast Bomb Cake.jpg",
    "description": "Crunchy Biscoff Layer Cake crafted with lotus biscoff crunch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 164,
    "name": "Lotus Biscoff Caramel Cake",
    "flavor": "Caramel Butterscotch",
    "category": "Biscoff Cakes",
    "price": 1879,
    "weights": [
      { "label": "0.5 Kg", "price": 1879 },
      { "label": "1 Kg", "price": 3382 },
      { "label": "2 Kg", "price": 6577 }
    ],
    "oldPrice": 1999,
    "rating": 5,
    "reviews": 132,
    "tag": "Trending",
    "img": "/images/products/Lotus Blossom Bento Cake.jpg",
    "description": "Lotus Biscoff Caramel Cake crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 165,
    "name": "Coffee Biscoff Delight",
    "flavor": "Lotus Biscoff Crunch",
    "category": "Biscoff Cakes",
    "price": 1909,
    "weights": [
      { "label": "0.5 Kg", "price": 1909 },
      { "label": "1 Kg", "price": 3436 },
      { "label": "2 Kg", "price": 6682 }
    ],
    "oldPrice": 2029,
    "rating": 5,
    "reviews": 135,
    "tag": "New",
    "img": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    "description": "Coffee Biscoff Delight crafted with lotus biscoff crunch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 166,
    "name": "Biscoff Praline Dream",
    "flavor": "Lotus Biscoff Crunch",
    "category": "Biscoff Cakes",
    "price": 1939,
    "weights": [
      { "label": "0.5 Kg", "price": 1939 },
      { "label": "1 Kg", "price": 3490 },
      { "label": "2 Kg", "price": 6787 }
    ],
    "oldPrice": 2059,
    "rating": 5,
    "reviews": 138,
    "tag": "Seasonal",
    "img": "/images/products/Biscoff Blast Bomb Cake.jpg",
    "description": "Biscoff Praline Dream crafted with lotus biscoff crunch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 167,
    "name": "Biscoff Mousse Fusion",
    "flavor": "Rich Belgian Chocolate",
    "category": "Biscoff Cakes",
    "price": 1969,
    "weights": [
      { "label": "0.5 Kg", "price": 1969 },
      { "label": "1 Kg", "price": 3544 },
      { "label": "2 Kg", "price": 6892 }
    ],
    "oldPrice": 2089,
    "rating": 5,
    "reviews": 141,
    "tag": "Luxury",
    "img": "/images/products/Chocolate Hazelnut Mousse Cake.jpg",
    "description": "Biscoff Mousse Fusion crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 168,
    "name": "Creamy Biscoff Symphony",
    "flavor": "Classic French Vanilla",
    "category": "Biscoff Cakes",
    "price": 1999,
    "weights": [
      { "label": "0.5 Kg", "price": 1999 },
      { "label": "1 Kg", "price": 3598 },
      { "label": "2 Kg", "price": 6997 }
    ],
    "oldPrice": 2119,
    "rating": 5,
    "reviews": 144,
    "tag": "Premium",
    "img": "/images/products/Lotus Blossom Bento Cake.jpg",
    "description": "Creamy Biscoff Symphony crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 169,
    "name": "New York Classic Cheesecake",
    "flavor": "Creamy Cheesecake",
    "category": "Cheesecakes",
    "price": 1899,
    "weights": [
      { "label": "0.5 Kg", "price": 1899 },
      { "label": "1 Kg", "price": 3418 },
      { "label": "2 Kg", "price": 6647 }
    ],
    "oldPrice": 2019,
    "rating": 5,
    "reviews": 147,
    "tag": "Bestseller",
    "img": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    "description": "New York Classic Cheesecake crafted with creamy cheesecake, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 170,
    "name": "Blueberry Brûlée Cheesecake",
    "flavor": "Mixed Berry Ganache",
    "category": "Cheesecakes",
    "price": 1929,
    "weights": [
      { "label": "0.5 Kg", "price": 1929 },
      { "label": "1 Kg", "price": 3472 },
      { "label": "2 Kg", "price": 6752 }
    ],
    "oldPrice": 2049,
    "rating": 4,
    "reviews": 150,
    "tag": "Trending",
    "img": "/images/products/Berry Bliss Pull Me Up Cake.jpg",
    "description": "Blueberry Brûlée Cheesecake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 171,
    "name": "Salted Caramel Cheesecake",
    "flavor": "Caramel Butterscotch",
    "category": "Cheesecakes",
    "price": 1959,
    "weights": [
      { "label": "0.5 Kg", "price": 1959 },
      { "label": "1 Kg", "price": 3526 },
      { "label": "2 Kg", "price": 6857 }
    ],
    "oldPrice": 2079,
    "rating": 4,
    "reviews": 153,
    "tag": "New",
    "img": "/images/products/Salted Caramel Brownie.jpg",
    "description": "Salted Caramel Cheesecake crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 172,
    "name": "Exotic Mango Cheesecake",
    "flavor": "Fresh Mango Cream",
    "category": "Cheesecakes",
    "price": 1989,
    "weights": [
      { "label": "0.5 Kg", "price": 1989 },
      { "label": "1 Kg", "price": 3580 },
      { "label": "2 Kg", "price": 6962 }
    ],
    "oldPrice": 2109,
    "rating": 4,
    "reviews": 156,
    "tag": "Seasonal",
    "img": "/images/products/Eggless Mango Cream Cake.jpg",
    "description": "Exotic Mango Cheesecake crafted with fresh mango cream, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 173,
    "name": "Oreo Velvet Cheesecake",
    "flavor": "Creamy Cheesecake",
    "category": "Cheesecakes",
    "price": 2019,
    "weights": [
      { "label": "0.5 Kg", "price": 2019 },
      { "label": "1 Kg", "price": 3634 },
      { "label": "2 Kg", "price": 7067 }
    ],
    "oldPrice": 2139,
    "rating": 4,
    "reviews": 159,
    "tag": "Luxury",
    "img": "/images/products/Oreo Cheesecake Brownie.jpg",
    "description": "Oreo Velvet Cheesecake crafted with creamy cheesecake, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 175,
    "name": "Berry Bliss Jar Cake",
    "flavor": "Mixed Berry Ganache",
    "category": "Jar Cakes",
    "price": 1949,
    "weights": [
      { "label": "0.5 Kg", "price": 1949 },
      { "label": "1 Kg", "price": 3508 },
      { "label": "2 Kg", "price": 6822 }
    ],
    "oldPrice": 2069,
    "rating": 5,
    "reviews": 165,
    "tag": "Bestseller",
    "img": "/images/products/Mini Berry Bento Celebration.jpg",
    "description": "Berry Bliss Jar Cake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 176,
    "name": "Chocolate Ganache Jar Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Jar Cakes",
    "price": 1979,
    "weights": [
      { "label": "0.5 Kg", "price": 1979 },
      { "label": "1 Kg", "price": 3562 },
      { "label": "2 Kg", "price": 6927 }
    ],
    "oldPrice": 2099,
    "rating": 5,
    "reviews": 168,
    "tag": "Trending",
    "img": "/images/products/Hazelnut Fudge Bento Cake.jpg",
    "description": "Chocolate Ganache Jar Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 177,
    "name": "Tiramisu Jar Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Jar Cakes",
    "price": 2009,
    "weights": [
      { "label": "0.5 Kg", "price": 2009 },
      { "label": "1 Kg", "price": 3616 },
      { "label": "2 Kg", "price": 7032 }
    ],
    "oldPrice": 2129,
    "rating": 5,
    "reviews": 171,
    "tag": "New",
    "img": "/images/products/Espresso Mousse Delight.jpg",
    "description": "Tiramisu Jar Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 179,
    "name": "Caramel Crunch Jar Cake",
    "flavor": "Caramel Butterscotch",
    "category": "Jar Cakes",
    "price": 2069,
    "weights": [
      { "label": "0.5 Kg", "price": 2069 },
      { "label": "1 Kg", "price": 3724 },
      { "label": "2 Kg", "price": 7242 }
    ],
    "oldPrice": 2189,
    "rating": 5,
    "reviews": 177,
    "tag": "Luxury",
    "img": "/images/products/Caramel Dream Bento Slice.jpg",
    "description": "Caramel Crunch Jar Cake crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 180,
    "name": "Lemon Meringue Jar Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Jar Cakes",
    "price": 2099,
    "weights": [
      { "label": "0.5 Kg", "price": 2099 },
      { "label": "1 Kg", "price": 3778 },
      { "label": "2 Kg", "price": 7347 }
    ],
    "oldPrice": 2219,
    "rating": 4,
    "reviews": 180,
    "tag": "Premium",
    "img": "/images/products/Lemon Zest Cupcake.jpg",
    "description": "Lemon Meringue Jar Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 181,
    "name": "Almond Croissant Pastry",
    "flavor": "Premium Vanilla Almond",
    "category": "Pastries",
    "price": 1999,
    "weights": [
      { "label": "0.5 Kg", "price": 1999 },
      { "label": "1 Kg", "price": 3598 },
      { "label": "2 Kg", "price": 6997 }
    ],
    "oldPrice": 2119,
    "rating": 4,
    "reviews": 183,
    "tag": "Bestseller",
    "img": "/images/products/Almond Croissant Pastry.jpg",
    "description": "Almond Croissant Pastry crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 182,
    "name": "Chocolate Éclair Pastry",
    "flavor": "Rich Belgian Chocolate",
    "category": "Pastries",
    "price": 2029,
    "weights": [
      { "label": "0.5 Kg", "price": 2029 },
      { "label": "1 Kg", "price": 3652 },
      { "label": "2 Kg", "price": 7102 }
    ],
    "oldPrice": 2149,
    "rating": 4,
    "reviews": 186,
    "tag": "Trending",
    "img": "/images/products/Chocolate Éclair Pastry.jpg",
    "description": "Chocolate Éclair Pastry crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 183,
    "name": "Berry Tart Pastry",
    "flavor": "Mixed Berry Ganache",
    "category": "Pastries",
    "price": 2059,
    "weights": [
      { "label": "0.5 Kg", "price": 2059 },
      { "label": "1 Kg", "price": 3706 },
      { "label": "2 Kg", "price": 7207 }
    ],
    "oldPrice": 2179,
    "rating": 4,
    "reviews": 189,
    "tag": "New",
    "img": "/images/products/Berry Tart Pastry.jpg",
    "description": "Berry Tart Pastry crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 184,
    "name": "Vanilla Millefeuille Pastry",
    "flavor": "Classic French Vanilla",
    "category": "Pastries",
    "price": 2089,
    "weights": [
      { "label": "0.5 Kg", "price": 2089 },
      { "label": "1 Kg", "price": 3760 },
      { "label": "2 Kg", "price": 7312 }
    ],
    "oldPrice": 2209,
    "rating": 5,
    "reviews": 192,
    "tag": "Seasonal",
    "img": "/images/products/Vanilla Millefeuille Pastry.jpg",
    "description": "Vanilla Millefeuille Pastry crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 185,
    "name": "Pistachio Cream Pastry",
    "flavor": "Classic French Vanilla",
    "category": "Pastries",
    "price": 2119,
    "weights": [
      { "label": "0.5 Kg", "price": 2119 },
      { "label": "1 Kg", "price": 3814 },
      { "label": "2 Kg", "price": 7417 }
    ],
    "oldPrice": 2239,
    "rating": 5,
    "reviews": 195,
    "tag": "Luxury",
    "img": "/images/products/Pistachio Cream Pastry.jpg",
    "description": "Pistachio Cream Pastry crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 186,
    "name": "Caramel Apple Danish",
    "flavor": "Caramel Butterscotch",
    "category": "Pastries",
    "price": 2149,
    "weights": [
      { "label": "0.5 Kg", "price": 2149 },
      { "label": "1 Kg", "price": 3868 },
      { "label": "2 Kg", "price": 7522 }
    ],
    "oldPrice": 2269,
    "rating": 5,
    "reviews": 198,
    "tag": "Premium",
    "img": "/images/products/Caramel Apple Danish.jpg",
    "description": "Caramel Apple Danish crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 187,
    "name": "Velvet Pearl Cupcake",
    "flavor": "Premium Vanilla Almond",
    "category": "Cupcakes",
    "price": 2049,
    "weights": [
      { "label": "0.5 Kg", "price": 2049 },
      { "label": "1 Kg", "price": 3688 },
      { "label": "2 Kg", "price": 7172 }
    ],
    "oldPrice": 2169,
    "rating": 5,
    "reviews": 201,
    "tag": "Bestseller",
    "img": "/images/products/Velvet Pearl Cupcake.jpg",
    "description": "Velvet Pearl Cupcake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 188,
    "name": "Choco Hazelnut Cupcake",
    "flavor": "Premium Vanilla Almond",
    "category": "Cupcakes",
    "price": 2079,
    "weights": [
      { "label": "0.5 Kg", "price": 2079 },
      { "label": "1 Kg", "price": 3742 },
      { "label": "2 Kg", "price": 7277 }
    ],
    "oldPrice": 2199,
    "rating": 5,
    "reviews": 204,
    "tag": "Trending",
    "img": "/images/products/Choco Hazelnut Cupcake.jpg",
    "description": "Choco Hazelnut Cupcake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 189,
    "name": "Mango Cream Cupcake",
    "flavor": "Classic French Vanilla",
    "category": "Cupcakes",
    "price": 2109,
    "weights": [
      { "label": "0.5 Kg", "price": 2109 },
      { "label": "1 Kg", "price": 3796 },
      { "label": "2 Kg", "price": 7382 }
    ],
    "oldPrice": 2229,
    "rating": 5,
    "reviews": 207,
    "tag": "New",
    "img": "/images/products/Mango Cream Cupcake.jpg",
    "description": "Mango Cream Cupcake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 190,
    "name": "Strawberry Bliss Cupcake",
    "flavor": "Mixed Berry Ganache",
    "category": "Cupcakes",
    "price": 2139,
    "weights": [
      { "label": "0.5 Kg", "price": 2139 },
      { "label": "1 Kg", "price": 3850 },
      { "label": "2 Kg", "price": 7487 }
    ],
    "oldPrice": 2259,
    "rating": 4,
    "reviews": 210,
    "tag": "Seasonal",
    "img": "/images/products/Strawberry Bliss Cupcake.jpg",
    "description": "Strawberry Bliss Cupcake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 191,
    "name": "Salted Caramel Cupcake",
    "flavor": "Caramel Butterscotch",
    "category": "Cupcakes",
    "price": 2169,
    "weights": [
      { "label": "0.5 Kg", "price": 2169 },
      { "label": "1 Kg", "price": 3904 },
      { "label": "2 Kg", "price": 7592 }
    ],
    "oldPrice": 2289,
    "rating": 4,
    "reviews": 213,
    "tag": "Luxury",
    "img": "/images/products/Salted Caramel Cupcake.jpg",
    "description": "Salted Caramel Cupcake crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 192,
    "name": "Lemon Zest Cupcake",
    "flavor": "Premium Vanilla Almond",
    "category": "Cupcakes",
    "price": 2199,
    "weights": [
      { "label": "0.5 Kg", "price": 2199 },
      { "label": "1 Kg", "price": 3958 },
      { "label": "2 Kg", "price": 7697 }
    ],
    "oldPrice": 2319,
    "rating": 4,
    "reviews": 216,
    "tag": "Premium",
    "img": "/images/products/Lemon Zest Cupcake.jpg",
    "description": "Lemon Zest Cupcake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 193,
    "name": "Walnut Fudge Brownie",
    "flavor": "Rich Belgian Chocolate",
    "category": "Brownies",
    "price": 2099,
    "weights": [
      { "label": "0.5 Kg", "price": 2099 },
      { "label": "1 Kg", "price": 3778 },
      { "label": "2 Kg", "price": 7347 }
    ],
    "oldPrice": 2219,
    "rating": 4,
    "reviews": 219,
    "tag": "Bestseller",
    "img": "/images/products/Walnut Fudge Brownie.jpg",
    "description": "Walnut Fudge Brownie crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 194,
    "name": "Salted Caramel Brownie",
    "flavor": "Rich Belgian Chocolate",
    "category": "Brownies",
    "price": 2129,
    "weights": [
      { "label": "0.5 Kg", "price": 2129 },
      { "label": "1 Kg", "price": 3832 },
      { "label": "2 Kg", "price": 7452 }
    ],
    "oldPrice": 2249,
    "rating": 5,
    "reviews": 222,
    "tag": "Trending",
    "img": "/images/products/Salted Caramel Brownie.jpg",
    "description": "Salted Caramel Brownie crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 195,
    "name": "Red Velvet Brownie",
    "flavor": "Rich Belgian Chocolate",
    "category": "Brownies",
    "price": 2159,
    "weights": [
      { "label": "0.5 Kg", "price": 2159 },
      { "label": "1 Kg", "price": 3886 },
      { "label": "2 Kg", "price": 7557 }
    ],
    "oldPrice": 2279,
    "rating": 5,
    "reviews": 225,
    "tag": "New",
    "img": "/images/products/Red Velvet Brownie.jpg",
    "description": "Red Velvet Brownie crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 196,
    "name": "Triple Chocolate Brownie",
    "flavor": "Rich Belgian Chocolate",
    "category": "Brownies",
    "price": 2189,
    "weights": [
      { "label": "0.5 Kg", "price": 2189 },
      { "label": "1 Kg", "price": 3940 },
      { "label": "2 Kg", "price": 7662 }
    ],
    "oldPrice": 2309,
    "rating": 5,
    "reviews": 228,
    "tag": "Seasonal",
    "img": "/images/products/Triple Chocolate Brownie.jpg",
    "description": "Triple Chocolate Brownie crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 197,
    "name": "Oreo Cheesecake Brownie",
    "flavor": "Rich Belgian Chocolate",
    "category": "Brownies",
    "price": 2219,
    "weights": [
      { "label": "0.5 Kg", "price": 2219 },
      { "label": "1 Kg", "price": 3994 },
      { "label": "2 Kg", "price": 7767 }
    ],
    "oldPrice": 2339,
    "rating": 5,
    "reviews": 231,
    "tag": "Luxury",
    "img": "/images/products/Oreo Cheesecake Brownie.jpg",
    "description": "Oreo Cheesecake Brownie crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 198,
    "name": "Nutella Swirl Brownie",
    "flavor": "Rich Belgian Chocolate",
    "category": "Brownies",
    "price": 2249,
    "weights": [
      { "label": "0.5 Kg", "price": 2249 },
      { "label": "1 Kg", "price": 4048 },
      { "label": "2 Kg", "price": 7872 }
    ],
    "oldPrice": 2369,
    "rating": 5,
    "reviews": 234,
    "tag": "Premium",
    "img": "/images/products/Nutella Swirl Brownie.jpg",
    "description": "Nutella Swirl Brownie crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 199,
    "name": "Butter Almond Cookie",
    "flavor": "Premium Vanilla Almond",
    "category": "Cookies",
    "price": 2149,
    "weights": [
      { "label": "0.5 Kg", "price": 2149 },
      { "label": "1 Kg", "price": 3868 },
      { "label": "2 Kg", "price": 7522 }
    ],
    "oldPrice": 2269,
    "rating": 5,
    "reviews": 237,
    "tag": "Bestseller",
    "img": "/images/products/Butter Almond Cookie.jpg",
    "description": "Butter Almond Cookie crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 200,
    "name": "Chocolate Chunk Cookie",
    "flavor": "Rich Belgian Chocolate",
    "category": "Cookies",
    "price": 2179,
    "weights": [
      { "label": "0.5 Kg", "price": 2179 },
      { "label": "1 Kg", "price": 3922 },
      { "label": "2 Kg", "price": 7627 }
    ],
    "oldPrice": 2299,
    "rating": 4,
    "reviews": 240,
    "tag": "Trending",
    "img": "/images/products/Chocolate Chunk Cookie.jpg",
    "description": "Chocolate Chunk Cookie crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 201,
    "name": "Rose Pistachio Cookie",
    "flavor": "Saffron Rasmalai",
    "category": "Cookies",
    "price": 2209,
    "weights": [
      { "label": "0.5 Kg", "price": 2209 },
      { "label": "1 Kg", "price": 3976 },
      { "label": "2 Kg", "price": 7732 }
    ],
    "oldPrice": 2329,
    "rating": 4,
    "reviews": 243,
    "tag": "New",
    "img": "/images/products/Rose Pistachio Cookie.jpg",
    "description": "Rose Pistachio Cookie crafted with saffron rasmalai, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 202,
    "name": "Salted Caramel Cookie",
    "flavor": "Caramel Butterscotch",
    "category": "Cookies",
    "price": 2239,
    "weights": [
      { "label": "0.5 Kg", "price": 2239 },
      { "label": "1 Kg", "price": 4030 },
      { "label": "2 Kg", "price": 7837 }
    ],
    "oldPrice": 2359,
    "rating": 4,
    "reviews": 246,
    "tag": "Seasonal",
    "img": "/images/products/Salted Caramel Cookie.jpg",
    "description": "Salted Caramel Cookie crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 203,
    "name": "Espresso Biscotti Cookie",
    "flavor": "Signature Coffee Espresso",
    "category": "Cookies",
    "price": 2269,
    "weights": [
      { "label": "0.5 Kg", "price": 2269 },
      { "label": "1 Kg", "price": 4084 },
      { "label": "2 Kg", "price": 7942 }
    ],
    "oldPrice": 2389,
    "rating": 4,
    "reviews": 249,
    "tag": "Luxury",
    "img": "/images/products/Espresso Biscotti Cookie.jpg",
    "description": "Espresso Biscotti Cookie crafted with signature coffee espresso, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 204,
    "name": "Orange Zest Cookie",
    "flavor": "Premium Vanilla Almond",
    "category": "Cookies",
    "price": 2299,
    "weights": [
      { "label": "0.5 Kg", "price": 2299 },
      { "label": "1 Kg", "price": 4138 },
      { "label": "2 Kg", "price": 8047 }
    ],
    "oldPrice": 2419,
    "rating": 5,
    "reviews": 252,
    "tag": "Premium",
    "img": "/images/products/Orange Zest Cookie.jpg",
    "description": "Orange Zest Cookie crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 205,
    "name": "Earl Grey Tea Cake",
    "flavor": "Classic French Vanilla",
    "category": "Tea Cakes",
    "price": 2199,
    "weights": [
      { "label": "0.5 Kg", "price": 2199 },
      { "label": "1 Kg", "price": 3958 },
      { "label": "2 Kg", "price": 7697 }
    ],
    "oldPrice": 2319,
    "rating": 5,
    "reviews": 255,
    "tag": "Bestseller",
    "img": "/images/products/Earl Grey Tea Cake.jpg",
    "description": "Earl Grey Tea Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 206,
    "name": "Lemon Poppy Seed Tea Cake",
    "flavor": "Classic French Vanilla",
    "category": "Tea Cakes",
    "price": 2229,
    "weights": [
      { "label": "0.5 Kg", "price": 2229 },
      { "label": "1 Kg", "price": 4012 },
      { "label": "2 Kg", "price": 7802 }
    ],
    "oldPrice": 2349,
    "rating": 5,
    "reviews": 258,
    "tag": "Trending",
    "img": "/images/products/Lemon Poppy Seed Tea Cake.jpg",
    "description": "Lemon Poppy Seed Tea Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 207,
    "name": "Masala Chai Tea Cake",
    "flavor": "Classic French Vanilla",
    "category": "Tea Cakes",
    "price": 2259,
    "weights": [
      { "label": "0.5 Kg", "price": 2259 },
      { "label": "1 Kg", "price": 4066 },
      { "label": "2 Kg", "price": 7907 }
    ],
    "oldPrice": 2379,
    "rating": 5,
    "reviews": 261,
    "tag": "New",
    "img": "/images/products/Masala Chai Tea Cake.jpg",
    "description": "Masala Chai Tea Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 208,
    "name": "Darjeeling Dream Tea Cake",
    "flavor": "Classic French Vanilla",
    "category": "Tea Cakes",
    "price": 2289,
    "weights": [
      { "label": "0.5 Kg", "price": 2289 },
      { "label": "1 Kg", "price": 4120 },
      { "label": "2 Kg", "price": 8012 }
    ],
    "oldPrice": 2409,
    "rating": 5,
    "reviews": 264,
    "tag": "Seasonal",
    "img": "/images/products/Darjeeling Dream Tea Cake.jpg",
    "description": "Darjeeling Dream Tea Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 209,
    "name": "Cardamom Rose Tea Cake",
    "flavor": "Classic French Vanilla",
    "category": "Tea Cakes",
    "price": 2319,
    "weights": [
      { "label": "0.5 Kg", "price": 2319 },
      { "label": "1 Kg", "price": 4174 },
      { "label": "2 Kg", "price": 8117 }
    ],
    "oldPrice": 2439,
    "rating": 5,
    "reviews": 267,
    "tag": "Luxury",
    "img": "/images/products/Cardamom Rose Tea Cake.jpg",
    "description": "Cardamom Rose Tea Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 210,
    "name": "Orange Blossom Tea Cake",
    "flavor": "Classic French Vanilla",
    "category": "Tea Cakes",
    "price": 2349,
    "weights": [
      { "label": "0.5 Kg", "price": 2349 },
      { "label": "1 Kg", "price": 4228 },
      { "label": "2 Kg", "price": 8222 }
    ],
    "oldPrice": 2469,
    "rating": 4,
    "reviews": 270,
    "tag": "Premium",
    "img": "/images/products/Orange Blossom Tea Cake.jpg",
    "description": "Orange Blossom Tea Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 211,
    "name": "Chocolate Hazelnut Mousse Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Mousse Cakes",
    "price": 2249,
    "weights": [
      { "label": "0.5 Kg", "price": 2249 },
      { "label": "1 Kg", "price": 4048 },
      { "label": "2 Kg", "price": 7872 }
    ],
    "oldPrice": 2369,
    "rating": 4,
    "reviews": 273,
    "tag": "Bestseller",
    "img": "/images/products/Chocolate Hazelnut Mousse Cake.jpg",
    "description": "Chocolate Hazelnut Mousse Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 212,
    "name": "Berry Mousse Elegance",
    "flavor": "Rich Belgian Chocolate",
    "category": "Mousse Cakes",
    "price": 2279,
    "weights": [
      { "label": "0.5 Kg", "price": 2279 },
      { "label": "1 Kg", "price": 4102 },
      { "label": "2 Kg", "price": 7977 }
    ],
    "oldPrice": 2399,
    "rating": 4,
    "reviews": 276,
    "tag": "Trending",
    "img": "/images/products/Berry Mousse Elegance.jpg",
    "description": "Berry Mousse Elegance crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 213,
    "name": "Mango Passion Mousse Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Mousse Cakes",
    "price": 2309,
    "weights": [
      { "label": "0.5 Kg", "price": 2309 },
      { "label": "1 Kg", "price": 4156 },
      { "label": "2 Kg", "price": 8082 }
    ],
    "oldPrice": 2429,
    "rating": 4,
    "reviews": 279,
    "tag": "New",
    "img": "/images/products/Mango Passion Mousse Cake.jpg",
    "description": "Mango Passion Mousse Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 214,
    "name": "Vanilla Almond Mousse Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Mousse Cakes",
    "price": 2339,
    "weights": [
      { "label": "0.5 Kg", "price": 2339 },
      { "label": "1 Kg", "price": 4210 },
      { "label": "2 Kg", "price": 8187 }
    ],
    "oldPrice": 2459,
    "rating": 5,
    "reviews": 282,
    "tag": "Seasonal",
    "img": "/images/products/Vanilla Almond Mousse Cake.jpg",
    "description": "Vanilla Almond Mousse Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 215,
    "name": "Espresso Mousse Delight",
    "flavor": "Rich Belgian Chocolate",
    "category": "Mousse Cakes",
    "price": 2369,
    "weights": [
      { "label": "0.5 Kg", "price": 2369 },
      { "label": "1 Kg", "price": 4264 },
      { "label": "2 Kg", "price": 8292 }
    ],
    "oldPrice": 2489,
    "rating": 5,
    "reviews": 285,
    "tag": "Luxury",
    "img": "/images/products/Espresso Mousse Delight.jpg",
    "description": "Espresso Mousse Delight crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 216,
    "name": "White Chocolate Mousse Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Mousse Cakes",
    "price": 2399,
    "weights": [
      { "label": "0.5 Kg", "price": 2399 },
      { "label": "1 Kg", "price": 4318 },
      { "label": "2 Kg", "price": 8397 }
    ],
    "oldPrice": 2519,
    "rating": 5,
    "reviews": 288,
    "tag": "Premium",
    "img": "/images/products/White Chocolate Mousse Cake.jpg",
    "description": "White Chocolate Mousse Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 217,
    "name": "Orange Cranberry Dry Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Dry Cakes",
    "price": 2299,
    "weights": [
      { "label": "0.5 Kg", "price": 2299 },
      { "label": "1 Kg", "price": 4138 },
      { "label": "2 Kg", "price": 8047 }
    ],
    "oldPrice": 2419,
    "rating": 5,
    "reviews": 291,
    "tag": "Bestseller",
    "img": "/images/products/Orange Cranberry Dry Cake.jpg",
    "description": "Orange Cranberry Dry Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 218,
    "name": "Almond Fig Dry Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Dry Cakes",
    "price": 2329,
    "weights": [
      { "label": "0.5 Kg", "price": 2329 },
      { "label": "1 Kg", "price": 4192 },
      { "label": "2 Kg", "price": 8152 }
    ],
    "oldPrice": 2449,
    "rating": 5,
    "reviews": 294,
    "tag": "Trending",
    "img": "/images/products/Almond Fig Dry Cake.jpg",
    "description": "Almond Fig Dry Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 219,
    "name": "Walnut Spice Dry Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Dry Cakes",
    "price": 2359,
    "weights": [
      { "label": "0.5 Kg", "price": 2359 },
      { "label": "1 Kg", "price": 4246 },
      { "label": "2 Kg", "price": 8257 }
    ],
    "oldPrice": 2479,
    "rating": 5,
    "reviews": 297,
    "tag": "New",
    "img": "/images/products/Walnut Spice Dry Cake.jpg",
    "description": "Walnut Spice Dry Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 220,
    "name": "Date Walnut Dry Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Dry Cakes",
    "price": 2389,
    "weights": [
      { "label": "0.5 Kg", "price": 2389 },
      { "label": "1 Kg", "price": 4300 },
      { "label": "2 Kg", "price": 8362 }
    ],
    "oldPrice": 2509,
    "rating": 4,
    "reviews": 300,
    "tag": "Seasonal",
    "img": "/images/products/Date Walnut Dry Cake.jpg",
    "description": "Date Walnut Dry Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 221,
    "name": "Pistachio Dry Fruit Cake",
    "flavor": "Seasonal Fresh Fruits",
    "category": "Dry Cakes",
    "price": 2419,
    "weights": [
      { "label": "0.5 Kg", "price": 2419 },
      { "label": "1 Kg", "price": 4354 },
      { "label": "2 Kg", "price": 8467 }
    ],
    "oldPrice": 2539,
    "rating": 4,
    "reviews": 303,
    "tag": "Luxury",
    "img": "/images/products/Pistachio Dry Fruit Cake.jpg",
    "description": "Pistachio Dry Fruit Cake crafted with seasonal fresh fruits, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 222,
    "name": "Coconut Crunch Dry Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Dry Cakes",
    "price": 2449,
    "weights": [
      { "label": "0.5 Kg", "price": 2449 },
      { "label": "1 Kg", "price": 4408 },
      { "label": "2 Kg", "price": 8572 }
    ],
    "oldPrice": 2569,
    "rating": 4,
    "reviews": 306,
    "tag": "Premium",
    "img": "/images/products/Coconut Crunch Dry Cake.jpg",
    "description": "Coconut Crunch Dry Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 223,
    "name": "Eggless Chocolate Truffle Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Eggless Cakes",
    "price": 2349,
    "weights": [
      { "label": "0.5 Kg", "price": 2349 },
      { "label": "1 Kg", "price": 4228 },
      { "label": "2 Kg", "price": 8222 }
    ],
    "oldPrice": 2469,
    "rating": 4,
    "reviews": 309,
    "tag": "Bestseller",
    "img": "/images/products/Eggless Chocolate Truffle Cake.jpg",
    "description": "Eggless Chocolate Truffle Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 224,
    "name": "Eggless Mango Cream Cake",
    "flavor": "Classic French Vanilla",
    "category": "Eggless Cakes",
    "price": 2379,
    "weights": [
      { "label": "0.5 Kg", "price": 2379 },
      { "label": "1 Kg", "price": 4282 },
      { "label": "2 Kg", "price": 8327 }
    ],
    "oldPrice": 2499,
    "rating": 5,
    "reviews": 312,
    "tag": "Trending",
    "img": "/images/products/Eggless Mango Cream Cake.jpg",
    "description": "Eggless Mango Cream Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 225,
    "name": "Eggless Vanilla Bean Cake",
    "flavor": "Classic French Vanilla",
    "category": "Eggless Cakes",
    "price": 2409,
    "weights": [
      { "label": "0.5 Kg", "price": 2409 },
      { "label": "1 Kg", "price": 4336 },
      { "label": "2 Kg", "price": 8432 }
    ],
    "oldPrice": 2529,
    "rating": 5,
    "reviews": 315,
    "tag": "New",
    "img": "/images/products/Eggless Vanilla Bean Cake.jpg",
    "description": "Eggless Vanilla Bean Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 226,
    "name": "Eggless Red Velvet Cake",
    "flavor": "Eggless Almond Sponge",
    "category": "Eggless Cakes",
    "price": 2439,
    "weights": [
      { "label": "0.5 Kg", "price": 2439 },
      { "label": "1 Kg", "price": 4390 },
      { "label": "2 Kg", "price": 8537 }
    ],
    "oldPrice": 2559,
    "rating": 5,
    "reviews": 318,
    "tag": "Seasonal",
    "img": "/images/products/Eggless Red Velvet Cake.jpg",
    "description": "Eggless Red Velvet Cake crafted with eggless almond sponge, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 227,
    "name": "Eggless Butterscotch Cake",
    "flavor": "Caramel Butterscotch",
    "category": "Eggless Cakes",
    "price": 2469,
    "weights": [
      { "label": "0.5 Kg", "price": 2469 },
      { "label": "1 Kg", "price": 4444 },
      { "label": "2 Kg", "price": 8642 }
    ],
    "oldPrice": 2589,
    "rating": 5,
    "reviews": 321,
    "tag": "Luxury",
    "img": "/images/products/Eggless Butterscotch Cake.jpg",
    "description": "Eggless Butterscotch Cake crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 228,
    "name": "Eggless Black Forest Cake",
    "flavor": "Eggless Almond Sponge",
    "category": "Eggless Cakes",
    "price": 2499,
    "weights": [
      { "label": "0.5 Kg", "price": 2499 },
      { "label": "1 Kg", "price": 4498 },
      { "label": "2 Kg", "price": 8747 }
    ],
    "oldPrice": 2619,
    "rating": 5,
    "reviews": 324,
    "tag": "Premium",
    "img": "/images/products/Eggless Black Forest Cake.jpg",
    "description": "Eggless Black Forest Cake crafted with eggless almond sponge, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 229,
    "name": "Personalized Name Plaque Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Custom Cakes",
    "price": 2399,
    "weights": [
      { "label": "0.5 Kg", "price": 2399 },
      { "label": "1 Kg", "price": 4318 },
      { "label": "2 Kg", "price": 8397 }
    ],
    "oldPrice": 2519,
    "rating": 5,
    "reviews": 327,
    "tag": "Bestseller",
    "img": "/images/products/Personalized Name Plaque Cake.jpg",
    "description": "Personalized Name Plaque Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 230,
    "name": "Monogrammed Signature Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Custom Cakes",
    "price": 2429,
    "weights": [
      { "label": "0.5 Kg", "price": 2429 },
      { "label": "1 Kg", "price": 4372 },
      { "label": "2 Kg", "price": 8502 }
    ],
    "oldPrice": 2549,
    "rating": 4,
    "reviews": 330,
    "tag": "Trending",
    "img": "/images/products/Monogrammed Signature Cake.jpg",
    "description": "Monogrammed Signature Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 231,
    "name": "Custom Flavor Fusion Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Custom Cakes",
    "price": 2459,
    "weights": [
      { "label": "0.5 Kg", "price": 2459 },
      { "label": "1 Kg", "price": 4426 },
      { "label": "2 Kg", "price": 8607 }
    ],
    "oldPrice": 2579,
    "rating": 4,
    "reviews": 333,
    "tag": "New",
    "img": "/images/products/Custom Flavor Fusion Cake.jpg",
    "description": "Custom Flavor Fusion Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 232,
    "name": "Bespoke Palette Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Custom Cakes",
    "price": 2489,
    "weights": [
      { "label": "0.5 Kg", "price": 2489 },
      { "label": "1 Kg", "price": 4480 },
      { "label": "2 Kg", "price": 8712 }
    ],
    "oldPrice": 2609,
    "rating": 4,
    "reviews": 336,
    "tag": "Seasonal",
    "img": "/images/products/Bespoke Palette Cake.jpg",
    "description": "Bespoke Palette Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 233,
    "name": "Tailored Celebration Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Custom Cakes",
    "price": 2519,
    "weights": [
      { "label": "0.5 Kg", "price": 2519 },
      { "label": "1 Kg", "price": 4534 },
      { "label": "2 Kg", "price": 8817 }
    ],
    "oldPrice": 2639,
    "rating": 4,
    "reviews": 339,
    "tag": "Luxury",
    "img": "/images/products/Tailored Celebration Cake.jpg",
    "description": "Tailored Celebration Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 234,
    "name": "Custom Artistry Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Custom Cakes",
    "price": 2549,
    "weights": [
      { "label": "0.5 Kg", "price": 2549 },
      { "label": "1 Kg", "price": 4588 },
      { "label": "2 Kg", "price": 8922 }
    ],
    "oldPrice": 2669,
    "rating": 5,
    "reviews": 342,
    "tag": "Premium",
    "img": "/images/products/Custom Artistry Cake.jpg",
    "description": "Custom Artistry Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 235,
    "name": "Diwali Gold Festival Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Festival Cakes",
    "price": 2449,
    "weights": [
      { "label": "0.5 Kg", "price": 2449 },
      { "label": "1 Kg", "price": 4408 },
      { "label": "2 Kg", "price": 8572 }
    ],
    "oldPrice": 2569,
    "rating": 5,
    "reviews": 345,
    "tag": "Bestseller",
    "img": "/images/products/Diwali Gold Festival Cake.jpg",
    "description": "Diwali Gold Festival Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 236,
    "name": "Holi Colorburst Festival Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Festival Cakes",
    "price": 2479,
    "weights": [
      { "label": "0.5 Kg", "price": 2479 },
      { "label": "1 Kg", "price": 4462 },
      { "label": "2 Kg", "price": 8677 }
    ],
    "oldPrice": 2599,
    "rating": 5,
    "reviews": 348,
    "tag": "Trending",
    "img": "/images/products/Holi Colorburst Festival Cake.jpg",
    "description": "Holi Colorburst Festival Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 237,
    "name": "Eid Celebration Festival Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Festival Cakes",
    "price": 2509,
    "weights": [
      { "label": "0.5 Kg", "price": 2509 },
      { "label": "1 Kg", "price": 4516 },
      { "label": "2 Kg", "price": 8782 }
    ],
    "oldPrice": 2629,
    "rating": 5,
    "reviews": 351,
    "tag": "New",
    "img": "/images/products/Eid Celebration Festival Cake.jpg",
    "description": "Eid Celebration Festival Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 238,
    "name": "Ganesh Chaturthi Sweet Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Festival Cakes",
    "price": 2539,
    "weights": [
      { "label": "0.5 Kg", "price": 2539 },
      { "label": "1 Kg", "price": 4570 },
      { "label": "2 Kg", "price": 8887 }
    ],
    "oldPrice": 2659,
    "rating": 5,
    "reviews": 354,
    "tag": "Seasonal",
    "img": "/images/products/Ganesh Chaturthi Sweet Cake.jpg",
    "description": "Ganesh Chaturthi Sweet Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 239,
    "name": "Navratri Delight Festival Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Festival Cakes",
    "price": 2569,
    "weights": [
      { "label": "0.5 Kg", "price": 2569 },
      { "label": "1 Kg", "price": 4624 },
      { "label": "2 Kg", "price": 8992 }
    ],
    "oldPrice": 2689,
    "rating": 5,
    "reviews": 357,
    "tag": "Luxury",
    "img": "/images/products/Navratri Delight Festival Cake.jpg",
    "description": "Navratri Delight Festival Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 240,
    "name": "Pongal Harvest Festival Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Festival Cakes",
    "price": 2599,
    "weights": [
      { "label": "0.5 Kg", "price": 2599 },
      { "label": "1 Kg", "price": 4678 },
      { "label": "2 Kg", "price": 9097 }
    ],
    "oldPrice": 2719,
    "rating": 4,
    "reviews": 360,
    "tag": "Premium",
    "img": "/images/products/Pongal Harvest Festival Cake.jpg",
    "description": "Pongal Harvest Festival Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 241,
    "name": "Queen Mom Mother's Day Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Mother's Day Cakes",
    "price": 2499,
    "weights": [
      { "label": "0.5 Kg", "price": 2499 },
      { "label": "1 Kg", "price": 4498 },
      { "label": "2 Kg", "price": 8747 }
    ],
    "oldPrice": 2619,
    "rating": 4,
    "reviews": 363,
    "tag": "Bestseller",
    "img": "/images/products/Queen Mom Mother's Day Cake.jpg",
    "description": "Queen Mom Mother's Day Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 242,
    "name": "Blossom Heart Mother's Day Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Mother's Day Cakes",
    "price": 2529,
    "weights": [
      { "label": "0.5 Kg", "price": 2529 },
      { "label": "1 Kg", "price": 4552 },
      { "label": "2 Kg", "price": 8852 }
    ],
    "oldPrice": 2649,
    "rating": 4,
    "reviews": 366,
    "tag": "Trending",
    "img": "/images/products/Blossom Heart Mother's Day Cake.jpg",
    "description": "Blossom Heart Mother's Day Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 243,
    "name": "Rose Garden Mother's Day Cake",
    "flavor": "Saffron Rasmalai",
    "category": "Mother's Day Cakes",
    "price": 2559,
    "weights": [
      { "label": "0.5 Kg", "price": 2559 },
      { "label": "1 Kg", "price": 4606 },
      { "label": "2 Kg", "price": 8957 }
    ],
    "oldPrice": 2679,
    "rating": 4,
    "reviews": 369,
    "tag": "New",
    "img": "/images/products/Rose Garden Mother's Day Cake.jpg",
    "description": "Rose Garden Mother's Day Cake crafted with saffron rasmalai, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 244,
    "name": "Silk Ribbon Mother's Day Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Mother's Day Cakes",
    "price": 2589,
    "weights": [
      { "label": "0.5 Kg", "price": 2589 },
      { "label": "1 Kg", "price": 4660 },
      { "label": "2 Kg", "price": 9062 }
    ],
    "oldPrice": 2709,
    "rating": 5,
    "reviews": 372,
    "tag": "Seasonal",
    "img": "/images/products/Silk Ribbon Mother's Day Cake.jpg",
    "description": "Silk Ribbon Mother's Day Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 245,
    "name": "Berry Love Mother's Day Cake",
    "flavor": "Mixed Berry Ganache",
    "category": "Mother's Day Cakes",
    "price": 2619,
    "weights": [
      { "label": "0.5 Kg", "price": 2619 },
      { "label": "1 Kg", "price": 4714 },
      { "label": "2 Kg", "price": 9167 }
    ],
    "oldPrice": 2739,
    "rating": 5,
    "reviews": 375,
    "tag": "Luxury",
    "img": "/images/products/Berry Love Mother's Day Cake.jpg",
    "description": "Berry Love Mother's Day Cake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 246,
    "name": "Honey Almond Mother's Day Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Mother's Day Cakes",
    "price": 2649,
    "weights": [
      { "label": "0.5 Kg", "price": 2649 },
      { "label": "1 Kg", "price": 4768 },
      { "label": "2 Kg", "price": 9272 }
    ],
    "oldPrice": 2769,
    "rating": 5,
    "reviews": 378,
    "tag": "Premium",
    "img": "/images/products/Honey Almond Mother's Day Cake.jpg",
    "description": "Honey Almond Mother's Day Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 247,
    "name": "Gentleman's Choice Father's Day Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Father's Day Cakes",
    "price": 2549,
    "weights": [
      { "label": "0.5 Kg", "price": 2549 },
      { "label": "1 Kg", "price": 4588 },
      { "label": "2 Kg", "price": 8922 }
    ],
    "oldPrice": 2669,
    "rating": 5,
    "reviews": 381,
    "tag": "Bestseller",
    "img": "/images/products/Gentleman's Choice Father's Day Cake.jpg",
    "description": "Gentleman's Choice Father's Day Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 248,
    "name": "Coffee Caramel Father's Day Cake",
    "flavor": "Caramel Butterscotch",
    "category": "Father's Day Cakes",
    "price": 2579,
    "weights": [
      { "label": "0.5 Kg", "price": 2579 },
      { "label": "1 Kg", "price": 4642 },
      { "label": "2 Kg", "price": 9027 }
    ],
    "oldPrice": 2699,
    "rating": 5,
    "reviews": 384,
    "tag": "Trending",
    "img": "/images/products/Coffee Caramel Father's Day Cake.jpg",
    "description": "Coffee Caramel Father's Day Cake crafted with caramel butterscotch, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 249,
    "name": "Dark Chocolate Father's Day Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Father's Day Cakes",
    "price": 2609,
    "weights": [
      { "label": "0.5 Kg", "price": 2609 },
      { "label": "1 Kg", "price": 4696 },
      { "label": "2 Kg", "price": 9132 }
    ],
    "oldPrice": 2729,
    "rating": 5,
    "reviews": 387,
    "tag": "New",
    "img": "/images/products/Dark Chocolate Father's Day Cake.jpg",
    "description": "Dark Chocolate Father's Day Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 250,
    "name": "Whiskey Barrel Father's Day Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Father's Day Cakes",
    "price": 2639,
    "weights": [
      { "label": "0.5 Kg", "price": 2639 },
      { "label": "1 Kg", "price": 4750 },
      { "label": "2 Kg", "price": 9237 }
    ],
    "oldPrice": 2759,
    "rating": 4,
    "reviews": 390,
    "tag": "Seasonal",
    "img": "/images/products/Whiskey Barrel Father's Day Cake.jpg",
    "description": "Whiskey Barrel Father's Day Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 251,
    "name": "Maple Crunch Father's Day Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Father's Day Cakes",
    "price": 2669,
    "weights": [
      { "label": "0.5 Kg", "price": 2669 },
      { "label": "1 Kg", "price": 4804 },
      { "label": "2 Kg", "price": 9342 }
    ],
    "oldPrice": 2789,
    "rating": 4,
    "reviews": 393,
    "tag": "Luxury",
    "img": "/images/products/Maple Crunch Father's Day Cake.jpg",
    "description": "Maple Crunch Father's Day Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 252,
    "name": "Classic Leather Father's Day Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Father's Day Cakes",
    "price": 2699,
    "weights": [
      { "label": "0.5 Kg", "price": 2699 },
      { "label": "1 Kg", "price": 4858 },
      { "label": "2 Kg", "price": 9447 }
    ],
    "oldPrice": 2819,
    "rating": 4,
    "reviews": 396,
    "tag": "Premium",
    "img": "/images/products/Classic Leather Father's Day Cake.jpg",
    "description": "Classic Leather Father's Day Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 253,
    "name": "Cupid's Velvet Valentine Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Valentine Cakes",
    "price": 2599,
    "weights": [
      { "label": "0.5 Kg", "price": 2599 },
      { "label": "1 Kg", "price": 4678 },
      { "label": "2 Kg", "price": 9097 }
    ],
    "oldPrice": 2719,
    "rating": 4,
    "reviews": 399,
    "tag": "Bestseller",
    "img": "/images/products/Cupid's Velvet Valentine Cake.jpg",
    "description": "Cupid's Velvet Valentine Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 254,
    "name": "Rose Petal Valentine Cake",
    "flavor": "Saffron Rasmalai",
    "category": "Valentine Cakes",
    "price": 2629,
    "weights": [
      { "label": "0.5 Kg", "price": 2629 },
      { "label": "1 Kg", "price": 4732 },
      { "label": "2 Kg", "price": 9202 }
    ],
    "oldPrice": 2749,
    "rating": 5,
    "reviews": 402,
    "tag": "Trending",
    "img": "/images/products/Rose Petal Valentine Cake.jpg",
    "description": "Rose Petal Valentine Cake crafted with saffron rasmalai, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 255,
    "name": "Chocolate Love Valentine Cake",
    "flavor": "Rich Belgian Chocolate",
    "category": "Valentine Cakes",
    "price": 2659,
    "weights": [
      { "label": "0.5 Kg", "price": 2659 },
      { "label": "1 Kg", "price": 4786 },
      { "label": "2 Kg", "price": 9307 }
    ],
    "oldPrice": 2779,
    "rating": 5,
    "reviews": 405,
    "tag": "New",
    "img": "/images/products/Chocolate Love Valentine Cake.jpg",
    "description": "Chocolate Love Valentine Cake crafted with rich belgian chocolate, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 256,
    "name": "Heart Melody Valentine Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Valentine Cakes",
    "price": 2689,
    "weights": [
      { "label": "0.5 Kg", "price": 2689 },
      { "label": "1 Kg", "price": 4840 },
      { "label": "2 Kg", "price": 9412 }
    ],
    "oldPrice": 2809,
    "rating": 5,
    "reviews": 408,
    "tag": "Seasonal",
    "img": "/images/products/Heart Melody Valentine Cake.jpg",
    "description": "Heart Melody Valentine Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 257,
    "name": "Strawberry Kiss Valentine Cake",
    "flavor": "Mixed Berry Ganache",
    "category": "Valentine Cakes",
    "price": 2719,
    "weights": [
      { "label": "0.5 Kg", "price": 2719 },
      { "label": "1 Kg", "price": 4894 },
      { "label": "2 Kg", "price": 9517 }
    ],
    "oldPrice": 2839,
    "rating": 5,
    "reviews": 411,
    "tag": "Luxury",
    "img": "/images/products/Strawberry Kiss Valentine Cake.jpg",
    "description": "Strawberry Kiss Valentine Cake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 258,
    "name": "Passion Berry Valentine Cake",
    "flavor": "Mixed Berry Ganache",
    "category": "Valentine Cakes",
    "price": 2749,
    "weights": [
      { "label": "0.5 Kg", "price": 2749 },
      { "label": "1 Kg", "price": 4948 },
      { "label": "2 Kg", "price": 9622 }
    ],
    "oldPrice": 2869,
    "rating": 5,
    "reviews": 414,
    "tag": "Premium",
    "img": "/images/products/Passion Berry Valentine Cake.jpg",
    "description": "Passion Berry Valentine Cake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 259,
    "name": "Winter Spice Christmas Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Christmas Cakes",
    "price": 2649,
    "weights": [
      { "label": "0.5 Kg", "price": 2649 },
      { "label": "1 Kg", "price": 4768 },
      { "label": "2 Kg", "price": 9272 }
    ],
    "oldPrice": 2769,
    "rating": 5,
    "reviews": 417,
    "tag": "Bestseller",
    "img": "/images/products/Winter Spice Christmas Cake.jpg",
    "description": "Winter Spice Christmas Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 260,
    "name": "Gingerbread Santa Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Christmas Cakes",
    "price": 2679,
    "weights": [
      { "label": "0.5 Kg", "price": 2679 },
      { "label": "1 Kg", "price": 4822 },
      { "label": "2 Kg", "price": 9377 }
    ],
    "oldPrice": 2799,
    "rating": 4,
    "reviews": 420,
    "tag": "Trending",
    "img": "/images/products/Gingerbread Santa Cake.jpg",
    "description": "Gingerbread Santa Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 261,
    "name": "Fruit Cake Noel",
    "flavor": "Seasonal Fresh Fruits",
    "category": "Christmas Cakes",
    "price": 2709,
    "weights": [
      { "label": "0.5 Kg", "price": 2709 },
      { "label": "1 Kg", "price": 4876 },
      { "label": "2 Kg", "price": 9482 }
    ],
    "oldPrice": 2829,
    "rating": 4,
    "reviews": 423,
    "tag": "New",
    "img": "/images/products/Fruit Cake Noel.jpg",
    "description": "Fruit Cake Noel crafted with seasonal fresh fruits, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 262,
    "name": "Peppermint Sleigh Christmas Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Christmas Cakes",
    "price": 2739,
    "weights": [
      { "label": "0.5 Kg", "price": 2739 },
      { "label": "1 Kg", "price": 4930 },
      { "label": "2 Kg", "price": 9587 }
    ],
    "oldPrice": 2859,
    "rating": 4,
    "reviews": 426,
    "tag": "Seasonal",
    "img": "/images/products/Peppermint Sleigh Christmas Cake.jpg",
    "description": "Peppermint Sleigh Christmas Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 263,
    "name": "Frosted Pine Christmas Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Christmas Cakes",
    "price": 2769,
    "weights": [
      { "label": "0.5 Kg", "price": 2769 },
      { "label": "1 Kg", "price": 4984 },
      { "label": "2 Kg", "price": 9692 }
    ],
    "oldPrice": 2889,
    "rating": 4,
    "reviews": 429,
    "tag": "Luxury",
    "img": "/images/products/Frosted Pine Christmas Cake.jpg",
    "description": "Frosted Pine Christmas Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 264,
    "name": "Cranberry Holly Christmas Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Christmas Cakes",
    "price": 2799,
    "weights": [
      { "label": "0.5 Kg", "price": 2799 },
      { "label": "1 Kg", "price": 5038 },
      { "label": "2 Kg", "price": 9797 }
    ],
    "oldPrice": 2919,
    "rating": 5,
    "reviews": 432,
    "tag": "Premium",
    "img": "/images/products/Cranberry Holly Christmas Cake.jpg",
    "description": "Cranberry Holly Christmas Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 265,
    "name": "Sparkling Midnight New Year Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "New Year Cakes",
    "price": 2699,
    "weights": [
      { "label": "0.5 Kg", "price": 2699 },
      { "label": "1 Kg", "price": 4858 },
      { "label": "2 Kg", "price": 9447 }
    ],
    "oldPrice": 2819,
    "rating": 5,
    "reviews": 435,
    "tag": "Bestseller",
    "img": "/images/products/Sparkling Midnight New Year Cake.jpg",
    "description": "Sparkling Midnight New Year Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 266,
    "name": "Champagne Toast New Year Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "New Year Cakes",
    "price": 2729,
    "weights": [
      { "label": "0.5 Kg", "price": 2729 },
      { "label": "1 Kg", "price": 4912 },
      { "label": "2 Kg", "price": 9552 }
    ],
    "oldPrice": 2849,
    "rating": 5,
    "reviews": 438,
    "tag": "Trending",
    "img": "/images/products/Champagne Toast New Year Cake.jpg",
    "description": "Champagne Toast New Year Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 267,
    "name": "Golden Countdown New Year Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "New Year Cakes",
    "price": 2759,
    "weights": [
      { "label": "0.5 Kg", "price": 2759 },
      { "label": "1 Kg", "price": 4966 },
      { "label": "2 Kg", "price": 9657 }
    ],
    "oldPrice": 2879,
    "rating": 5,
    "reviews": 441,
    "tag": "New",
    "img": "/images/products/Golden Countdown New Year Cake.jpg",
    "description": "Golden Countdown New Year Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 268,
    "name": "Firework Celebration New Year Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "New Year Cakes",
    "price": 2789,
    "weights": [
      { "label": "0.5 Kg", "price": 2789 },
      { "label": "1 Kg", "price": 5020 },
      { "label": "2 Kg", "price": 9762 }
    ],
    "oldPrice": 2909,
    "rating": 5,
    "reviews": 444,
    "tag": "Seasonal",
    "img": "/images/products/Firework Celebration New Year Cake.jpg",
    "description": "Firework Celebration New Year Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 269,
    "name": "Vintage Times New Year Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "New Year Cakes",
    "price": 2819,
    "weights": [
      { "label": "0.5 Kg", "price": 2819 },
      { "label": "1 Kg", "price": 5074 },
      { "label": "2 Kg", "price": 9867 }
    ],
    "oldPrice": 2939,
    "rating": 5,
    "reviews": 447,
    "tag": "Luxury",
    "img": "/images/products/Vintage Times New Year Cake.jpg",
    "description": "Vintage Times New Year Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 270,
    "name": "New Dawn New Year Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "New Year Cakes",
    "price": 2849,
    "weights": [
      { "label": "0.5 Kg", "price": 2849 },
      { "label": "1 Kg", "price": 5128 },
      { "label": "2 Kg", "price": 9972 }
    ],
    "oldPrice": 2969,
    "rating": 4,
    "reviews": 450,
    "tag": "Premium",
    "img": "/images/products/New Dawn New Year Cake.jpg",
    "description": "New Dawn New Year Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 271,
    "name": "BFF Berry Friendship Cake",
    "flavor": "Mixed Berry Ganache",
    "category": "Friendship Cakes",
    "price": 2749,
    "weights": [
      { "label": "0.5 Kg", "price": 2749 },
      { "label": "1 Kg", "price": 4948 },
      { "label": "2 Kg", "price": 9622 }
    ],
    "oldPrice": 2869,
    "rating": 4,
    "reviews": 453,
    "tag": "Bestseller",
    "img": "/images/products/BFF Berry Friendship Cake.jpg",
    "description": "BFF Berry Friendship Cake crafted with mixed berry ganache, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 272,
    "name": "Circle of Friends Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Friendship Cakes",
    "price": 2779,
    "weights": [
      { "label": "0.5 Kg", "price": 2779 },
      { "label": "1 Kg", "price": 5002 },
      { "label": "2 Kg", "price": 9727 }
    ],
    "oldPrice": 2899,
    "rating": 4,
    "reviews": 456,
    "tag": "Trending",
    "img": "/images/products/Circle of Friends Cake.jpg",
    "description": "Circle of Friends Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 273,
    "name": "Sunset Squad Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Friendship Cakes",
    "price": 2809,
    "weights": [
      { "label": "0.5 Kg", "price": 2809 },
      { "label": "1 Kg", "price": 5056 },
      { "label": "2 Kg", "price": 9832 }
    ],
    "oldPrice": 2929,
    "rating": 4,
    "reviews": 459,
    "tag": "New",
    "img": "/images/products/Sunset Squad Cake.jpg",
    "description": "Sunset Squad Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 274,
    "name": "Laugh & Love Friendship Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Friendship Cakes",
    "price": 2839,
    "weights": [
      { "label": "0.5 Kg", "price": 2839 },
      { "label": "1 Kg", "price": 5110 },
      { "label": "2 Kg", "price": 9937 }
    ],
    "oldPrice": 2959,
    "rating": 5,
    "reviews": 462,
    "tag": "Seasonal",
    "img": "/images/products/Laugh & Love Friendship Cake.jpg",
    "description": "Laugh & Love Friendship Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 275,
    "name": "Golden Memories Friendship Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Friendship Cakes",
    "price": 2869,
    "weights": [
      { "label": "0.5 Kg", "price": 2869 },
      { "label": "1 Kg", "price": 5164 },
      { "label": "2 Kg", "price": 10042 }
    ],
    "oldPrice": 2989,
    "rating": 5,
    "reviews": 465,
    "tag": "Luxury",
    "img": "/images/products/Golden Confetti Birthday Cake.jpg",
    "description": "Golden Memories Friendship Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 276,
    "name": "Sparkle Bond Friendship Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Friendship Cakes",
    "price": 2899,
    "weights": [
      { "label": "0.5 Kg", "price": 2899 },
      { "label": "1 Kg", "price": 5218 },
      { "label": "2 Kg", "price": 10147 }
    ],
    "oldPrice": 3019,
    "rating": 5,
    "reviews": 468,
    "tag": "Premium",
    "img": "/images/products/Sparkle Bond Friendship Cake.jpg",
    "description": "Sparkle Bond Friendship Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 277,
    "name": "Tiny Toes Baby Shower Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Baby Shower Cakes",
    "price": 2799,
    "weights": [
      { "label": "0.5 Kg", "price": 2799 },
      { "label": "1 Kg", "price": 5038 },
      { "label": "2 Kg", "price": 9797 }
    ],
    "oldPrice": 2919,
    "rating": 5,
    "reviews": 471,
    "tag": "Bestseller",
    "img": "/images/products/Tiny Toes Baby Shower Cake.jpg",
    "description": "Tiny Toes Baby Shower Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 278,
    "name": "Stork Surprise Baby Shower Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Baby Shower Cakes",
    "price": 2829,
    "weights": [
      { "label": "0.5 Kg", "price": 2829 },
      { "label": "1 Kg", "price": 5092 },
      { "label": "2 Kg", "price": 9902 }
    ],
    "oldPrice": 2949,
    "rating": 5,
    "reviews": 474,
    "tag": "Trending",
    "img": "/images/products/Stork Surprise Baby Shower Cake.jpg",
    "description": "Stork Surprise Baby Shower Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 279,
    "name": "Blush Baby Shower Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Baby Shower Cakes",
    "price": 2859,
    "weights": [
      { "label": "0.5 Kg", "price": 2859 },
      { "label": "1 Kg", "price": 5146 },
      { "label": "2 Kg", "price": 10007 }
    ],
    "oldPrice": 2979,
    "rating": 5,
    "reviews": 477,
    "tag": "New",
    "img": "/images/products/Blush Baby Shower Cake.jpg",
    "description": "Blush Baby Shower Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 280,
    "name": "Twinkle Little Star Baby Shower Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Baby Shower Cakes",
    "price": 2889,
    "weights": [
      { "label": "0.5 Kg", "price": 2889 },
      { "label": "1 Kg", "price": 5200 },
      { "label": "2 Kg", "price": 10112 }
    ],
    "oldPrice": 3009,
    "rating": 4,
    "reviews": 60,
    "tag": "Seasonal",
    "img": "/images/products/Twinkle Little Star Baby Shower Cake.jpg",
    "description": "Twinkle Little Star Baby Shower Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 281,
    "name": "Welcome Baby Shower Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Baby Shower Cakes",
    "price": 2919,
    "weights": [
      { "label": "0.5 Kg", "price": 2919 },
      { "label": "1 Kg", "price": 5254 },
      { "label": "2 Kg", "price": 10217 }
    ],
    "oldPrice": 3039,
    "rating": 4,
    "reviews": 63,
    "tag": "Luxury",
    "img": "/images/products/Welcome Baby Shower Cake.jpg",
    "description": "Welcome Baby Shower Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 282,
    "name": "Cherub Dream Baby Shower Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Baby Shower Cakes",
    "price": 2949,
    "weights": [
      { "label": "0.5 Kg", "price": 2949 },
      { "label": "1 Kg", "price": 5308 },
      { "label": "2 Kg", "price": 10322 }
    ],
    "oldPrice": 3069,
    "rating": 4,
    "reviews": 66,
    "tag": "Premium",
    "img": "/images/products/Cherub Dream Baby Shower Cake.jpg",
    "description": "Cherub Dream Baby Shower Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 283,
    "name": "Promise Ring Engagement Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Engagement Cakes",
    "price": 2849,
    "weights": [
      { "label": "0.5 Kg", "price": 2849 },
      { "label": "1 Kg", "price": 5128 },
      { "label": "2 Kg", "price": 9972 }
    ],
    "oldPrice": 2969,
    "rating": 4,
    "reviews": 69,
    "tag": "Bestseller",
    "img": "/images/products/Promise Ring Engagement Cake.jpg",
    "description": "Promise Ring Engagement Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 284,
    "name": "Diamond Spark Engagement Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Engagement Cakes",
    "price": 2879,
    "weights": [
      { "label": "0.5 Kg", "price": 2879 },
      { "label": "1 Kg", "price": 5182 },
      { "label": "2 Kg", "price": 10077 }
    ],
    "oldPrice": 2999,
    "rating": 5,
    "reviews": 72,
    "tag": "Trending",
    "img": "/images/products/Diamond Spark Engagement Cake.jpg",
    "description": "Diamond Spark Engagement Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 285,
    "name": "Forever Begins Engagement Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Engagement Cakes",
    "price": 2909,
    "weights": [
      { "label": "0.5 Kg", "price": 2909 },
      { "label": "1 Kg", "price": 5236 },
      { "label": "2 Kg", "price": 10182 }
    ],
    "oldPrice": 3029,
    "rating": 5,
    "reviews": 75,
    "tag": "New",
    "img": "/images/products/Forever Begins Engagement Cake.jpg",
    "description": "Forever Begins Engagement Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 286,
    "name": "Royal Vow Engagement Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Engagement Cakes",
    "price": 2939,
    "weights": [
      { "label": "0.5 Kg", "price": 2939 },
      { "label": "1 Kg", "price": 5290 },
      { "label": "2 Kg", "price": 10287 }
    ],
    "oldPrice": 3059,
    "rating": 5,
    "reviews": 78,
    "tag": "Seasonal",
    "img": "/images/products/Royal Vow Engagement Cake.jpg",
    "description": "Royal Vow Engagement Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 287,
    "name": "Hearts United Engagement Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Engagement Cakes",
    "price": 2969,
    "weights": [
      { "label": "0.5 Kg", "price": 2969 },
      { "label": "1 Kg", "price": 5344 },
      { "label": "2 Kg", "price": 10392 }
    ],
    "oldPrice": 3089,
    "rating": 5,
    "reviews": 81,
    "tag": "Luxury",
    "img": "/images/products/Hearts United Engagement Cake.jpg",
    "description": "Hearts United Engagement Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 288,
    "name": "Silk Ribbon Engagement Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Engagement Cakes",
    "price": 2999,
    "weights": [
      { "label": "0.5 Kg", "price": 2999 },
      { "label": "1 Kg", "price": 5398 },
      { "label": "2 Kg", "price": 10497 }
    ],
    "oldPrice": 3119,
    "rating": 5,
    "reviews": 84,
    "tag": "Premium",
    "img": "/images/products/Silk Ribbon Engagement Cake.jpg",
    "description": "Silk Ribbon Engagement Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 289,
    "name": "Golden Years Retirement Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Retirement Cakes",
    "price": 2899,
    "weights": [
      { "label": "0.5 Kg", "price": 2899 },
      { "label": "1 Kg", "price": 5218 },
      { "label": "2 Kg", "price": 10147 }
    ],
    "oldPrice": 3019,
    "rating": 5,
    "reviews": 87,
    "tag": "Bestseller",
    "img": "/images/products/Golden Years Retirement Cake.jpg",
    "description": "Golden Years Retirement Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 290,
    "name": "Relaxation Retreat Retirement Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Retirement Cakes",
    "price": 2929,
    "weights": [
      { "label": "0.5 Kg", "price": 2929 },
      { "label": "1 Kg", "price": 5272 },
      { "label": "2 Kg", "price": 10252 }
    ],
    "oldPrice": 3049,
    "rating": 4,
    "reviews": 90,
    "tag": "Trending",
    "img": "/images/products/Relaxation Retreat Retirement Cake.jpg",
    "description": "Relaxation Retreat Retirement Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 291,
    "name": "Legacy Lane Retirement Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Retirement Cakes",
    "price": 2959,
    "weights": [
      { "label": "0.5 Kg", "price": 2959 },
      { "label": "1 Kg", "price": 5326 },
      { "label": "2 Kg", "price": 10357 }
    ],
    "oldPrice": 3079,
    "rating": 4,
    "reviews": 93,
    "tag": "New",
    "img": "/images/products/Legacy Lane Retirement Cake.jpg",
    "description": "Legacy Lane Retirement Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 292,
    "name": "Sunset Meritage Retirement Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Retirement Cakes",
    "price": 2989,
    "weights": [
      { "label": "0.5 Kg", "price": 2989 },
      { "label": "1 Kg", "price": 5380 },
      { "label": "2 Kg", "price": 10462 }
    ],
    "oldPrice": 3109,
    "rating": 4,
    "reviews": 96,
    "tag": "Seasonal",
    "img": "/images/products/Sunset Meritage Retirement Cake.jpg",
    "description": "Sunset Meritage Retirement Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 293,
    "name": "Champagne Cheers Retirement Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Retirement Cakes",
    "price": 3019,
    "weights": [
      { "label": "0.5 Kg", "price": 3019 },
      { "label": "1 Kg", "price": 5434 },
      { "label": "2 Kg", "price": 10567 }
    ],
    "oldPrice": 3139,
    "rating": 4,
    "reviews": 99,
    "tag": "Luxury",
    "img": "/images/products/Champagne Cheers Retirement Cake.jpg",
    "description": "Champagne Cheers Retirement Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 294,
    "name": "Peaceful Journey Retirement Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Retirement Cakes",
    "price": 3049,
    "weights": [
      { "label": "0.5 Kg", "price": 3049 },
      { "label": "1 Kg", "price": 5488 },
      { "label": "2 Kg", "price": 10672 }
    ],
    "oldPrice": 3169,
    "rating": 5,
    "reviews": 102,
    "tag": "Premium",
    "img": "/images/products/Peaceful Journey Retirement Cake.jpg",
    "description": "Peaceful Journey Retirement Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 301,
    "name": "Bon Voyage Farewell Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Farewell Cakes",
    "price": 2999,
    "weights": [
      { "label": "0.5 Kg", "price": 2999 },
      { "label": "1 Kg", "price": 5398 },
      { "label": "2 Kg", "price": 10497 }
    ],
    "oldPrice": 3119,
    "rating": 4,
    "reviews": 123,
    "tag": "Bestseller",
    "img": "/images/products/Bon Voyage Farewell Cake.jpg",
    "description": "Bon Voyage Farewell Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 302,
    "name": "New Chapter Farewell Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Farewell Cakes",
    "price": 3029,
    "weights": [
      { "label": "0.5 Kg", "price": 3029 },
      { "label": "1 Kg", "price": 5452 },
      { "label": "2 Kg", "price": 10602 }
    ],
    "oldPrice": 3149,
    "rating": 4,
    "reviews": 126,
    "tag": "Trending",
    "img": "/images/products/New Chapter Farewell Cake.jpg",
    "description": "New Chapter Farewell Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 303,
    "name": "Golden Goodbye Farewell Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Farewell Cakes",
    "price": 3059,
    "weights": [
      { "label": "0.5 Kg", "price": 3059 },
      { "label": "1 Kg", "price": 5506 },
      { "label": "2 Kg", "price": 10707 }
    ],
    "oldPrice": 3179,
    "rating": 4,
    "reviews": 129,
    "tag": "New",
    "img": "/images/products/Golden Goodbye Farewell Cake.jpg",
    "description": "Golden Goodbye Farewell Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 304,
    "name": "Thank You Farewell Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Farewell Cakes",
    "price": 3089,
    "weights": [
      { "label": "0.5 Kg", "price": 3089 },
      { "label": "1 Kg", "price": 5560 },
      { "label": "2 Kg", "price": 10812 }
    ],
    "oldPrice": 3209,
    "rating": 5,
    "reviews": 132,
    "tag": "Seasonal",
    "img": "/images/products/Thank You Farewell Cake.jpg",
    "description": "Thank You Farewell Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 305,
    "name": "Memory Lane Farewell Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Farewell Cakes",
    "price": 3119,
    "weights": [
      { "label": "0.5 Kg", "price": 3119 },
      { "label": "1 Kg", "price": 5614 },
      { "label": "2 Kg", "price": 10917 }
    ],
    "oldPrice": 3239,
    "rating": 5,
    "reviews": 135,
    "tag": "Luxury",
    "img": "/images/products/Memory Lane Farewell Cake.jpg",
    "description": "Memory Lane Farewell Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 306,
    "name": "Final Toast Farewell Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Farewell Cakes",
    "price": 3149,
    "weights": [
      { "label": "0.5 Kg", "price": 3149 },
      { "label": "1 Kg", "price": 5668 },
      { "label": "2 Kg", "price": 11022 }
    ],
    "oldPrice": 3269,
    "rating": 5,
    "reviews": 138,
    "tag": "Premium",
    "img": "/images/products/Final Toast Farewell Cake.jpg",
    "description": "Final Toast Farewell Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 307,
    "name": "Crown Scholar Graduation Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Graduation Cakes",
    "price": 3049,
    "weights": [
      { "label": "0.5 Kg", "price": 3049 },
      { "label": "1 Kg", "price": 5488 },
      { "label": "2 Kg", "price": 10672 }
    ],
    "oldPrice": 3169,
    "rating": 5,
    "reviews": 141,
    "tag": "Bestseller",
    "img": "/images/products/Crown Scholar Graduation Cake.jpg",
    "description": "Crown Scholar Graduation Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 308,
    "name": "Class of Excellence Graduation Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Graduation Cakes",
    "price": 3079,
    "weights": [
      { "label": "0.5 Kg", "price": 3079 },
      { "label": "1 Kg", "price": 5542 },
      { "label": "2 Kg", "price": 10777 }
    ],
    "oldPrice": 3199,
    "rating": 5,
    "reviews": 144,
    "tag": "Trending",
    "img": "/images/products/Class of Excellence Graduation Cake.jpg",
    "description": "Class of Excellence Graduation Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 309,
    "name": "Future Star Graduation Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Graduation Cakes",
    "price": 3109,
    "weights": [
      { "label": "0.5 Kg", "price": 3109 },
      { "label": "1 Kg", "price": 5596 },
      { "label": "2 Kg", "price": 10882 }
    ],
    "oldPrice": 3229,
    "rating": 5,
    "reviews": 147,
    "tag": "New",
    "img": "/images/products/Future Star Graduation Cake.jpg",
    "description": "Future Star Graduation Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 310,
    "name": "Achievement Medal Graduation Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Graduation Cakes",
    "price": 3139,
    "weights": [
      { "label": "0.5 Kg", "price": 3139 },
      { "label": "1 Kg", "price": 5650 },
      { "label": "2 Kg", "price": 10987 }
    ],
    "oldPrice": 3259,
    "rating": 4,
    "reviews": 150,
    "tag": "Seasonal",
    "img": "/images/products/Achievement Medal Graduation Cake.jpg",
    "description": "Achievement Medal Graduation Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 311,
    "name": "Cap & Scroll Graduation Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Graduation Cakes",
    "price": 3169,
    "weights": [
      { "label": "0.5 Kg", "price": 3169 },
      { "label": "1 Kg", "price": 5704 },
      { "label": "2 Kg", "price": 11092 }
    ],
    "oldPrice": 3289,
    "rating": 4,
    "reviews": 153,
    "tag": "Luxury",
    "img": "/images/products/Cap & Scroll Graduation Cake.jpg",
    "description": "Cap & Scroll Graduation Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 312,
    "name": "Dream Big Graduation Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Graduation Cakes",
    "price": 3199,
    "weights": [
      { "label": "0.5 Kg", "price": 3199 },
      { "label": "1 Kg", "price": 5758 },
      { "label": "2 Kg", "price": 11197 }
    ],
    "oldPrice": 3319,
    "rating": 4,
    "reviews": 156,
    "tag": "Premium",
    "img": "/images/products/Dream Big Graduation Cake.jpg",
    "description": "Dream Big Graduation Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 313,
    "name": "Pure White Minimal Cake",
    "flavor": "Classic French Vanilla",
    "category": "Minimal Cakes",
    "price": 3099,
    "weights": [
      { "label": "0.5 Kg", "price": 3099 },
      { "label": "1 Kg", "price": 5578 },
      { "label": "2 Kg", "price": 10847 }
    ],
    "oldPrice": 3219,
    "rating": 4,
    "reviews": 159,
    "tag": "Bestseller",
    "img": "/images/products/Pure White Minimal Cake.jpg",
    "description": "Pure White Minimal Cake crafted with classic french vanilla, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 314,
    "name": "Subtle Elegance Minimal Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Minimal Cakes",
    "price": 3129,
    "weights": [
      { "label": "0.5 Kg", "price": 3129 },
      { "label": "1 Kg", "price": 5632 },
      { "label": "2 Kg", "price": 10952 }
    ],
    "oldPrice": 3249,
    "rating": 5,
    "reviews": 162,
    "tag": "Trending",
    "img": "/images/products/Subtle Elegance Minimal Cake.jpg",
    "description": "Subtle Elegance Minimal Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 315,
    "name": "Textured Linen Minimal Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Minimal Cakes",
    "price": 3159,
    "weights": [
      { "label": "0.5 Kg", "price": 3159 },
      { "label": "1 Kg", "price": 5686 },
      { "label": "2 Kg", "price": 11057 }
    ],
    "oldPrice": 3279,
    "rating": 5,
    "reviews": 165,
    "tag": "New",
    "img": "/images/products/Textured Linen Minimal Cake.jpg",
    "description": "Textured Linen Minimal Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 316,
    "name": "Soft Blossom Minimal Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Minimal Cakes",
    "price": 3189,
    "weights": [
      { "label": "0.5 Kg", "price": 3189 },
      { "label": "1 Kg", "price": 5740 },
      { "label": "2 Kg", "price": 11162 }
    ],
    "oldPrice": 3309,
    "rating": 5,
    "reviews": 168,
    "tag": "Seasonal",
    "img": "/images/products/Soft Blossom Minimal Cake.jpg",
    "description": "Soft Blossom Minimal Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 317,
    "name": "Monochrome Minimal Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Minimal Cakes",
    "price": 3219,
    "weights": [
      { "label": "0.5 Kg", "price": 3219 },
      { "label": "1 Kg", "price": 5794 },
      { "label": "2 Kg", "price": 11267 }
    ],
    "oldPrice": 3339,
    "rating": 5,
    "reviews": 171,
    "tag": "Luxury",
    "img": "/images/products/Monochrome Minimal Cake.jpg",
    "description": "Monochrome Minimal Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 318,
    "name": "Quiet Luxury Minimal Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Minimal Cakes",
    "price": 3249,
    "weights": [
      { "label": "0.5 Kg", "price": 3249 },
      { "label": "1 Kg", "price": 5848 },
      { "label": "2 Kg", "price": 11372 }
    ],
    "oldPrice": 3369,
    "rating": 5,
    "reviews": 174,
    "tag": "Premium",
    "img": "/images/products/Quiet Luxury Minimal Cake.jpg",
    "description": "Quiet Luxury Minimal Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 325,
    "name": "Mirror Glaze Trending Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Trending Cakes",
    "price": 3199,
    "weights": [
      { "label": "0.5 Kg", "price": 3199 },
      { "label": "1 Kg", "price": 5758 },
      { "label": "2 Kg", "price": 11197 }
    ],
    "oldPrice": 3319,
    "rating": 5,
    "reviews": 195,
    "tag": "Bestseller",
    "img": "/images/products/Mirror Glaze Trending Cake.jpg",
    "description": "Mirror Glaze Trending Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 326,
    "name": "Activated Charcoal Trending Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Trending Cakes",
    "price": 3229,
    "weights": [
      { "label": "0.5 Kg", "price": 3229 },
      { "label": "1 Kg", "price": 5812 },
      { "label": "2 Kg", "price": 11302 }
    ],
    "oldPrice": 3349,
    "rating": 5,
    "reviews": 198,
    "tag": "Trending",
    "img": "/images/products/Activated Charcoal Trending Cake.jpg",
    "description": "Activated Charcoal Trending Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 327,
    "name": "Galaxy Glitter Trending Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Trending Cakes",
    "price": 3259,
    "weights": [
      { "label": "0.5 Kg", "price": 3259 },
      { "label": "1 Kg", "price": 5866 },
      { "label": "2 Kg", "price": 11407 }
    ],
    "oldPrice": 3379,
    "rating": 5,
    "reviews": 201,
    "tag": "New",
    "img": "/images/products/Galaxy Glitter Trending Cake.jpg",
    "description": "Galaxy Glitter Trending Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 328,
    "name": "Geode Sparkle Trending Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Trending Cakes",
    "price": 3289,
    "weights": [
      { "label": "0.5 Kg", "price": 3289 },
      { "label": "1 Kg", "price": 5920 },
      { "label": "2 Kg", "price": 11512 }
    ],
    "oldPrice": 3409,
    "rating": 5,
    "reviews": 204,
    "tag": "Seasonal",
    "img": "/images/products/Geode Sparkle Trending Cake.jpg",
    "description": "Geode Sparkle Trending Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 329,
    "name": "Rustic Drip Trending Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Trending Cakes",
    "price": 3319,
    "weights": [
      { "label": "0.5 Kg", "price": 3319 },
      { "label": "1 Kg", "price": 5974 },
      { "label": "2 Kg", "price": 11617 }
    ],
    "oldPrice": 3439,
    "rating": 5,
    "reviews": 207,
    "tag": "Luxury",
    "img": "/images/products/Rustic Drip Trending Cake.jpg",
    "description": "Rustic Drip Trending Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
  {
    "id": 330,
    "name": "Textured Ombre Trending Cake",
    "flavor": "Premium Vanilla Almond",
    "category": "Trending Cakes",
    "price": 3349,
    "weights": [
      { "label": "0.5 Kg", "price": 3349 },
      { "label": "1 Kg", "price": 6028 },
      { "label": "2 Kg", "price": 11722 }
    ],
    "oldPrice": 3469,
    "rating": 4,
    "reviews": 210,
    "tag": "Premium",
    "img": "/images/products/Textured Ombre Trending Cake.jpg",
    "description": "Textured Ombre Trending Cake crafted with premium vanilla almond, premium toppings and a modern bakery finish for a luxurious celebration."
  },
];
