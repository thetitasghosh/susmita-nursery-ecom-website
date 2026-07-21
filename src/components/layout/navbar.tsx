"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  Search,
  User,
  ChevronDown,
  // Leaf,
  ChevronRight,
  Home,
  Flower,
  Wrench,
  FlaskConical,
  Info,
  Phone,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "@/lib/shop-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobilePlantsOpen, setMobilePlantsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, wishlist } = useShop();

  const plantCategories = [
    { name: "Indoor Plants", href: "/products?category=Indoor Plants" },
    { name: "Outdoor Plants", href: "/products?category=Outdoor Plants" },
    { name: "Flowering Plants", href: "/products?category=Flowering Plants" },
    { name: "Fruit Plants", href: "/products?category=Fruit Plants" },
    { name: "Palms", href: "/products?category=Palms" },
    { name: "Succulents", href: "/products?category=Succulents" },
    { name: "Bonsai", href: "/products?category=Bonsai" },
  ];

  const navLinks = [
    { label: "Tools", href: "/products?category=Tools", icon: Wrench },
    {
      label: "Plant Medicine",
      href: "/products?category=Plant Medicine",
      icon: FlaskConical,
    },
    { label: "About Us", href: "/about", icon: Info },
    { label: "Contact", href: "/contact", icon: Phone },
  ];

  const closeMenu = () => {
    setIsOpen(false);
    setMobilePlantsOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group redd overflow-hidden"
            >
              <Image
                src="/logos/susmita-nursery-wordmark-logo.svg"
                alt="Susmita Nursery"
                width={1000}
                height={1000}
                priority
                quality={100}
                className=" h-20 w-52  object-cover scale-150"
              />
              {/* <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-tight text-foreground tracking-wide">
                  Susmita Nursery
                </span>
                <span className="text-[9px] text-primary-emerald font-sans uppercase tracking-widest font-semibold">
                  Growing Beauty
                </span>
              </div> */}
            </Link>

            {/* Desktop Menu */}
            <div className="hidden xl:flex items-center gap-6 font-sans text-sm font-medium">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                Home
              </Link>

              {/* Plants Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveDropdown("plants")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors cursor-pointer">
                  <span>Plants</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${activeDropdown === "plants" ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {activeDropdown === "plants" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-xl p-3 z-50"
                    >
                      {plantCategories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-xl transition-colors font-medium"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Interactive Utility Tokens & CTA */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Toggle */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2.5 hover:bg-muted rounded-full transition-colors cursor-pointer"
                  aria-label="Search Catalog"
                >
                  <Search size={18} className="text-foreground" />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-3 w-72 sm:w-80 bg-card border border-border p-3 rounded-2xl shadow-2xl z-50 flex gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Search plants, tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 text-xs border border-border px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-primary bg-background font-sans"
                      />
                      <Link href={`/products?search=${searchQuery}`}>
                        <Button
                          size="sm"
                          onClick={() => setSearchOpen(false)}
                          className="rounded-xl bg-primary"
                        >
                          Go
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2.5 hover:bg-muted rounded-full transition-colors relative hidden sm:inline-flex"
              >
                <Heart size={18} className="text-foreground" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white rounded-full text-[9px] flex items-center justify-center font-bold animate-pulse-slow">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* User Profile */}
              <Link
                href="/account"
                title="My Account"
                aria-label="User Account"
                className="p-2.5 hover:bg-muted rounded-full transition-colors hidden sm:inline-flex"
              >
                <User size={18} className="text-foreground" />
              </Link>

              {/* Shopping Cart */}
              <Link
                href="/cart"
                className="p-2.5 hover:bg-muted rounded-full transition-colors relative"
              >
                <ShoppingCart size={18} className="text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-accent-foreground rounded-full text-[9px] flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsOpen(true)}
                className="xl:hidden p-2.5 hover:bg-muted rounded-full transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu size={20} className="text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Right-Side Sheet ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              key="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />

            {/* Sheet Panel */}
            <motion.aside
              key="sheet-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 38 }}
              className="fixed inset-y-0 right-0 z-[70] w-[280px] sm:w-[320px] flex flex-col bg-primary-emerald text-white shadow-2xl overflow-hidden"
            >
              {/* Sheet Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                    <Image
                      src="/logos/logo-with-ring.jpeg"
                      alt="Susmita Nursery"
                      width={1000}
                      height={1000}
                      priority
                      quality={100}
                      className="   object-cover scal rounded-full"
                    />
                  </div>
                  <span className="font-serif font-bold text-lg text-white tracking-wide">
                    Menu
                  </span>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              {/* Sheet Body — scrollable */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                {/* Home */}
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <Home
                    size={16}
                    className="text-white/60 group-hover:text-white transition-colors"
                  />
                  <span className="text-sm font-medium text-white font-sans">
                    Home
                  </span>
                </Link>

                {/* Plants Accordion */}
                <div>
                  <button
                    onClick={() => setMobilePlantsOpen(!mobilePlantsOpen)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Flower
                        size={16}
                        className="text-white/60 group-hover:text-white transition-colors"
                      />
                      <span className="text-sm font-medium text-white font-sans">
                        Plants
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`text-white/50 transition-transform duration-200 ${mobilePlantsOpen ? "rotate-90" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobilePlantsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pt-1 pb-2 space-y-0.5">
                          {plantCategories.map((cat) => (
                            <Link
                              key={cat.name}
                              href={cat.href}
                              onClick={closeMenu}
                              className="block px-4 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-sans font-medium"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Other nav links */}
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors group"
                    >
                      <Icon
                        size={16}
                        className="text-white/60 group-hover:text-white transition-colors"
                      />
                      <span className="text-sm font-medium text-white font-sans">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="h-px bg-white/10 my-3" />

                {/* Account, Wishlist & Orders */}
                <Link
                  href="/account"
                  onClick={closeMenu}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <User
                      size={16}
                      className="text-white/60 group-hover:text-white transition-colors"
                    />
                    <span className="text-sm font-medium text-white font-sans">
                      My Account
                    </span>
                  </div>
                </Link>

                <Link
                  href="/wishlist"
                  onClick={closeMenu}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Heart
                      size={16}
                      className="text-white/60 group-hover:text-white transition-colors"
                    />
                    <span className="text-sm font-medium text-white font-sans">
                      Wishlist
                    </span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="text-[9px] font-bold bg-accent text-accent-foreground rounded-full px-2 py-0.5 font-sans">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  onClick={closeMenu}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Package
                      size={16}
                      className="text-white/60 group-hover:text-white transition-colors"
                    />
                    <span className="text-sm font-medium text-white font-sans">
                      Your Orders
                    </span>
                  </div>
                  {cartCount > 0 && (
                    <span className="text-[9px] font-bold bg-accent text-accent-foreground rounded-full px-2 py-0.5 font-sans">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Sheet Footer — Brand */}
              <div className="px-4 pb-6 pt-4 border-t border-white/10 space-y-4">
                {/* Mini brand footer */}
                <div className="flex items-center gap-2 px-2 pt-2">
                  <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/logos/logo-with-ring.jpeg"
                      alt="Susmita Nursery"
                      width={1000}
                      height={1000}
                      priority
                      quality={100}
                      className="   object-cover scal rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-[9px] font-serif font-bold text-white/80 leading-none">
                      Susmita Nursery
                    </p>
                    <p className="text-[7px] text-white/40 font-sans mt-0.5">
                      Copyright {new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
