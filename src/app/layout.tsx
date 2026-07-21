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
  title: "Susmita Nursery | Indoor Plants, Outdoor Plants & Garden Essentials",
  keywords: [
    "Susmita Nursery",
    "Indoor Plants",
    "Air-Purifying Plants",
    "Gangni",
    "Badkulla",
    "Nadia",
  ],
  description:
    "Cultivating green sanctuaries. Susmita Nursery merges expert horticultural practice with modern digital convenience, including interactive AR room-fitting tools. Discover resilient indoor plants, air-purifiers, succulents, and flowering specimens.",
  metadataBase: new URL("https://www.susmitanursery.com/"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/meta/favicon.ico" },
      { url: "/meta/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/meta/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      {
        url: "/meta/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/meta/site.webmanifest",
  // openGraph: {
  //   title: "Susmita Nursery - Premium Plants & Gardening",
  //   description:
  //     "Cultivating green sanctuaries since 2015. Susmita Nursery merges expert horticultural practice with modern digital convenience, including interactive AR room-fitting tools.",
  //   url: "https://www.susmitanursery.com/",
  //   siteName: "Susmita Nursery",
  //   images: [
  //     {
  //       url: "/images/hero-garden.jpg",
  //       width: 1200,
  //       height: 630,
  //       alt: "Susmita Nursery Greenhouse Farm",
  //     },
  //   ],
  //   locale: "en_IN",
  //   type: "website",
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Susmita Nursery - Premium Plants & Gardening",
  //   description:
  //     "Cultivating green sanctuaries since 2015. Susmita Nursery merges expert horticultural practice with modern digital convenience.",
  //   images: ["/images/hero-garden.jpg"],
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        inter.variable,
        cormorant.variable,
        "font-sans scroll-smooth",
      )}
    >
      <body className="antialiased bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <ShopProvider>{children}</ShopProvider>
      </body>
    </html>
  );
}
