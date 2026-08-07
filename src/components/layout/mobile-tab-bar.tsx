"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sprout, ShoppingCart, User } from "lucide-react";
import { useShop } from "@/lib/shop-context";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function MobileTabBar() {
  const pathname = usePathname();
  const { cartCount, user, openLoginModal } = useShop();

  // WhatsApp redirection link with pre-filled thank-you greeting
  const whatsappNumber = "918670329291";
  const greetingText = encodeURIComponent(
    "Hello Susmita Nursery! I visited your website and would like to thank you for the wonderful plant collection. I am looking to get some expert guidance on choosing the right plants."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${greetingText}`;

  // Hide the tab bar inside dashboard pages or admin panel to avoid UI clutter
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const handleAccountClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      openLoginModal();
    }
  };

  const isHomeActive = pathname === "/";
  const isProductsActive = pathname?.startsWith("/products");
  const isCartActive = pathname === "/cart";
  const isAccountActive = pathname?.startsWith("/account");

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 h-16 w-full font-sans">
      <div className="flex items-center justify-between h-full max-w-md mx-auto px-4">
        {/* 1. Home Tab */}
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors duration-200",
            isHomeActive ? "text-primary font-semibold" : "text-neutral-500 hover:text-neutral-800"
          )}
        >
          <div className="h-8 flex items-center justify-center flex-shrink-0">
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </Link>

        {/* 2. Products Tab */}
        <Link
          href="/products"
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors duration-200",
            isProductsActive ? "text-primary font-semibold" : "text-neutral-500 hover:text-neutral-800"
          )}
        >
          <div className="h-8 flex items-center justify-center flex-shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Products</span>
        </Link>

        {/* 3. WhatsApp Tab (PNG Image, aligned inline) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-neutral-500 hover:text-neutral-800 transition-colors duration-200"
          aria-label="Contact on WhatsApp"
        >
          <div className="h-8 flex items-center justify-center flex-shrink-0">
            <div className="relative w-7 h-7">
              <Image
                src="/images/whatsapp-2.png"
                alt="WhatsApp"
                fill
                sizes="28px"
                className="object-contain"
                priority
              />
            </div>
          </div>
          <span className="text-[10px] font-medium tracking-wide">WhatsApp</span>
        </a>

        {/* 4. Cart Tab */}
        <Link
          href="/cart"
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors duration-200 relative",
            isCartActive ? "text-primary font-semibold" : "text-neutral-500 hover:text-neutral-800"
          )}
        >
          <div className="h-8 flex items-center justify-center flex-shrink-0">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-90 border border-white">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
          <span className="text-[10px] font-medium tracking-wide">Cart</span>
        </Link>

        {/* 5. Account Tab */}
        <Link
          href="/account"
          onClick={handleAccountClick}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors duration-200",
            isAccountActive ? "text-primary font-semibold" : "text-neutral-500 hover:text-neutral-800"
          )}
        >
          <div className="h-8 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Account</span>
        </Link>
      </div>
    </div>
  );
}
