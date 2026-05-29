import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { FlyToCartProvider } from "@/context/FlyToCartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartBubble from "@/components/CartBubble";

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
  title: "cake lounge — Artisan Bakery & Patisserie",
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
          <CartProvider>
            <FlyToCartProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <CartBubble />
            </FlyToCartProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
