'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { bakeryMenu } from '@/constants/bakery-menu';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

interface Props {
  params: { id: string };
}

export default function ProductDetailPage({ params }: Props) {
  const { addToCart } = useCart();
  const product = bakeryMenu.find((p) => p.id === parseInt(params.id));

  if (!product) {
    notFound();
  }

  const relatedProducts = bakeryMenu
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#FDFCFB] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-[#E5D5C8]">
            <Image
              src={product.img}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.tag && (
              <span className="absolute top-6 left-6 bg-rose-deep text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                {product.tag}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <nav className="text-sm text-[#8C7462] mb-4">
              <span className="hover:text-[#C17E61] cursor-pointer">Menu</span>
              <span className="mx-2">/</span>
              <span className="hover:text-[#C17E61] cursor-pointer">{product.category}</span>
              <span className="mx-2">/</span>
              <span className="text-[#4A2C2A] font-medium">{product.name}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-serif text-[#4A2C2A] mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-[#8C7462] font-medium">
                {product.rating} ({product.reviews} customer reviews)
              </span>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-rose-deep">₹{product.price}</span>
                {product.oldPrice && (
                  <span className="text-xl text-[#8C7462] line-through">₹{product.oldPrice}</span>
                )}
              </div>
              <p className="text-[#8C7462] text-sm italic">Inclusive of all taxes</p>
            </div>

            <p className="text-[#4A2C2A] text-lg leading-relaxed mb-8">
              Indulge in our exquisite {product.name}, a masterpiece of {product.flavor} flavors.
              Handcrafted with the finest ingredients to ensure a premium taste experience that melts in your mouth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-rose-deep hover:bg-brown text-white h-14 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg"
              >
                <ShoppingCart className="w-6 h-6" /> Add to Cart
              </button>
              <button className="w-14 h-14 rounded-full border-2 border-[#E5D5C8] flex items-center justify-center text-[#4A2C2A] hover:bg-white hover:border-rose-deep hover:text-rose-deep transition-all group">
                <Heart className="w-6 h-6 transition-transform group-hover:scale-110" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#E5D5C8]">
              <div className="flex flex-col items-center text-center">
                <Truck className="w-8 h-8 text-[#C17E61] mb-2" />
                <span className="text-sm font-semibold text-[#4A2C2A]">Free Delivery</span>
                <span className="text-xs text-[#8C7462]">On orders above ₹999</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="w-8 h-8 text-[#C17E61] mb-2" />
                <span className="text-sm font-semibold text-[#4A2C2A]">Secure Payment</span>
                <span className="text-xs text-[#8C7462]">100% Protected</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RefreshCw className="w-8 h-8 text-[#C17E61] mb-2" />
                <span className="text-sm font-semibold text-[#4A2C2A]">Fresh Always</span>
                <span className="text-xs text-[#8C7462]">Baked on order</span>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif text-[#4A2C2A]">You May Also Like</h2>
              <button className="text-[#C17E61] font-semibold hover:underline">View More</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
