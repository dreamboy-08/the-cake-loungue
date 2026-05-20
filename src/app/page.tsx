import { Hero, HeroSlider } from "@/components/Hero";
import { OfferBanner } from "@/components/OfferBanner";
import { CategoryCard } from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { categories } from "@/constants";
import { bakeryMenu } from "@/constants/bakery-menu";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const featuredProducts = bakeryMenu.slice(0, 8);

  return (
    <main className="min-h-screen">
      <Hero />
      <HeroSlider />
      <OfferBanner />

      {/* Categories Section */}
      <section id="categories" className="py-24 md:py-[90px] bg-cream">
        <div className="container px-6">
          <div className="text-center mb-12.5">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-rose mb-2.5">Browse By Category</p>
            <h2 className="font-playfair text-[clamp(1.8rem,8vw,3rem)] font-bold text-chocolate leading-[1.2]">What Are You Celebrating?</h2>
            <p className="mt-3.5 text-[clamp(0.85rem,2vw,0.95rem)] text-text-soft leading-[1.7] max-w-[480px] mx-auto">
              From birthdays to weddings, we have the perfect cake for every special moment in your life.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-20 bg-cream-dark">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12.5">
            <div>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-rose mb-2.5">Our Bestsellers</p>
              <h2 className="font-playfair text-[clamp(1.8rem,8vw,3rem)] font-bold text-chocolate leading-[1.2]">Featured Cakes</h2>
            </div>
            <Link href="/menu" className="group text-[0.88rem] font-semibold text-rose-deep flex items-center gap-1.5 transition-all">
              View All <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5.5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <About />
      <Gallery />
      <HowItWorks />
      <Testimonials />
      <Contact />
    </main>
  );
}
