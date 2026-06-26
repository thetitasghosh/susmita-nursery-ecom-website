'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingCart, Heart, Search, User, Calendar, ChevronDown, Leaf } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useShop } from '@/lib/shop-context'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { cartCount, wishlist } = useShop()

  const plantCategories = [
    { name: 'Indoor Plants', href: '/products?category=Indoor Plants' },
    { name: 'Outdoor Plants', href: '/products?category=Outdoor Plants' },
    { name: 'Flowering Plants', href: '/products?category=Flowering Plants' },
    { name: 'Fruit Plants', href: '/products?category=Fruit Plants' },
    { name: 'Palms', href: '/products?category=Palms' },
    { name: 'Succulents', href: '/products?category=Succulents' },
    { name: 'Bonsai', href: '/products?category=Bonsai' },
  ]

  const navLinks = [
    { label: 'Tools', href: '/products?category=Tools' },
    { label: 'Plant Medicine', href: '/products?category=Plant Medicine' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl leading-tight text-foreground tracking-wide">
                Susmita Nursery
              </span>
              <span className="text-[9px] text-primary-emerald font-sans uppercase tracking-widest font-semibold">
                Growing Beauty
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center gap-6 font-sans text-sm font-medium">
            <Link href="/" className="text-foreground hover:text-primary transition-colors py-2">
              Home
            </Link>

            {/* Plants Dropdown */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown('plants')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors cursor-pointer">
                <span>Plants</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'plants' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'plants' && (
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
                      <Button size="sm" onClick={() => setSearchOpen(false)} className="rounded-xl bg-primary">
                        Go
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2.5 hover:bg-muted rounded-full transition-colors relative hidden sm:inline-flex">
              <Heart size={18} className="text-foreground" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white rounded-full text-[9px] flex items-center justify-center font-bold animate-pulse-slow">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <Link href="/about" className="p-2.5 hover:bg-muted rounded-full transition-colors hidden sm:inline-flex">
              <User size={18} className="text-foreground" />
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart" className="p-2.5 hover:bg-muted rounded-full transition-colors relative">
              <ShoppingCart size={18} className="text-foreground" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-accent-foreground rounded-full text-[9px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Book a Visit CTA */}
            <Link href="/contact?booking=true" className="hidden lg:inline-flex">
              <Button className="bg-primary-emerald hover:bg-primary text-white font-semibold rounded-full px-6 flex items-center gap-2 shadow-sm border border-primary/20 cursor-pointer">
                <Calendar size={15} />
                <span>Book a Visit</span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2.5 hover:bg-muted rounded-full transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <X size={20} className="text-foreground" />
              ) : (
                <Menu size={20} className="text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="xl:hidden border-t border-border bg-background overflow-hidden"
            >
              <div className="py-4 space-y-2 px-2 max-h-[80vh] overflow-y-auto">
                <Link
                  href="/"
                  className="block px-4 py-2.5 text-foreground hover:bg-muted rounded-xl transition-colors font-medium text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>

                {/* Plants Submenu */}
                <div className="border-b border-border/30 pb-2">
                  <span className="block px-4 py-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">Plants Categories</span>
                  <div className="grid grid-cols-2 gap-1 pl-4 pr-2 mt-1">
                    {plantCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="block px-2 py-1.5 text-xs text-foreground hover:text-primary transition-colors font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>



                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block px-4 py-2.5 text-foreground hover:bg-muted rounded-xl transition-colors font-medium text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Visit Button */}
                <div className="pt-4 border-t border-border px-4">
                  <Link href="/contact?booking=true" className="w-full block" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary-emerald hover:bg-primary text-white font-semibold rounded-full py-3 flex items-center justify-center gap-2">
                      <Calendar size={16} />
                      <span>Book a Visit</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
