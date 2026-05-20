export interface Product {
  id: number;
  name: string;
  flavor: string;
  category?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  tag?: string;
  img: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  count: string;
  img: string;
  tag?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  avatar: string;
  tag: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}
