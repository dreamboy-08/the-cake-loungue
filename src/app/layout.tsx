import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { FlyToCartProvider } from "@/context/FlyToCartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ProductsProvider } from "@/context/ProductsContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartBubble from "@/components/CartBubble";
import { CMSProvider } from "@/context/CMSContext";
import CMSStyleRoot from "@/components/CMSStyleRoot";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Cake Lounge — Artisan Bakery & Patisserie",
  description: "Handcrafted cakes and desserts delivered fresh to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${poppins.variable} font-poppins`}>
        <AuthProvider>
          <CMSProvider>
            <CMSStyleRoot />
            <ProductsProvider>
          <ProductsProvider>
            <CMSProvider>
              <CartProvider>
                <FlyToCartProvider>
                  <WishlistProvider>
                    <Navbar />
                    <main>{children}</main>
                    <Footer />
                    <CartBubble />
                  </WishlistProvider>
                </FlyToCartProvider>
              </CartProvider>
            </ProductsProvider>
          </CMSProvider>
            </CMSProvider>
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
