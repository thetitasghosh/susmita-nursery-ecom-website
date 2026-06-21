import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ShopProvider } from "@/lib/shop-context";

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
    <html lang="en" className={cn("font-sans")}>
      <body className="antialiased">
        <ShopProvider>
          {children}
        </ShopProvider>
      </body>
    </html>
  );
}

