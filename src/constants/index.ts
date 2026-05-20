import { Category, Testimonial } from '@/types';

export const categories: Category[] = [
  { id: 1, name: 'Birthday Cakes', count: '80+ Designs', img: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&q=80', tag: 'Popular' },
  { id: 2, name: 'Wedding Cakes', count: '45+ Designs', img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80' },
  { id: 3, name: 'Chocolate Cakes', count: '60+ Designs', img: 'https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=500&q=80', tag: 'Bestseller' },
  { id: 4, name: 'Custom Cakes', count: 'Design Your Own', img: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=500&q=80', tag: 'Open' }
];

export const testimonials: Testimonial[] = [
  { id: 1, name: 'Priya Sharma', text: 'Ordered a custom birthday cake for my daughter and I was absolutely blown away. The attention to detail was incredible — it looked exactly like the design I requested, and it tasted even better!', avatar: 'https://i.pravatar.cc/100?img=47', tag: 'Loyal Customer · 3 yrs', rating: 5 },
  { id: 2, name: 'Rohan Mehta', text: 'The Belgian chocolate truffle cake was an absolute showstopper at our anniversary dinner. Our guests couldn\'t stop talking about it. Delivery was on time and packaging was beautiful!', avatar: 'https://i.pravatar.cc/100?img=12', tag: 'Verified Buyer', rating: 5 },
  { id: 3, name: 'Ananya Kapoor', text: 'I\'ve ordered from La Douceur 5 times now — red velvet, mango mousse, tiramisu — every single one is perfection. This is my go-to bakery for every celebration!', avatar: 'https://i.pravatar.cc/100?img=32', tag: 'Premium Member', rating: 4.5 }
];
