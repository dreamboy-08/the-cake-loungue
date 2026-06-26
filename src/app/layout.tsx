import type { Metadata } from "next";
import { Playfair_Display, Poppins, Dancing_Script } from "next/font/google";
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

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
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
      <body className={`${playfair.variable} ${poppins.variable} ${dancingScript.variable} font-poppins`}>
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
