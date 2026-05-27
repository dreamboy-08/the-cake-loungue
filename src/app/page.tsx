import Hero from "@/components/home/Hero";
import OfferMarquee from "@/components/home/OfferMarquee";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import About from "@/components/home/About";
import Gallery from "@/components/home/Gallery";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <OfferMarquee />
      <Categories />
      <FeaturedProducts />
      <About />
      <Gallery />
      <HowItWorks />
      <Testimonials />
      <Contact />
    </>
  );
}
