import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ShopProvider } from "@/lib/shop-context";
import { Inter, Cormorant_Garamond } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Susmita Nursery - Premium Plants & Gardening",
  description:
    "Discover beautiful indoor and outdoor plants, seeds, and gardening essentials. Experience our plants with AR visualization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, cormorant.variable, "font-sans scroll-smooth")}>
      <body className="antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <ShopProvider>
          {children}
        </ShopProvider>
      </body>
    </html>
  );
}

