'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Boxes, 
  Receipt, 
  Users, 
  Mail, 
  Menu, 
  X, 
  Bell, 
  Search,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  LogOut,
  ShoppingBag,
  User,
  Sprout
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string; size?: number | string }>
}

const sidebarItems: SidebarItem[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: Boxes },
  { name: 'Banners', href: '/dashboard/banners', icon: ImageIcon },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Boxes },
  { name: 'Orders', href: '/dashboard/orders', icon: Receipt },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Newsletter', href: '/dashboard/newsletter', icon: Mail },
]

// Global Search Datasets
const searchDatabase = {
  products: [
    { id: 1, name: 'Monstera Deliciosa', category: 'Indoor Plants', price: '₹1,250.00', image: '/images/plants/monstera-plant.jpg' },
    { id: 2, name: 'Peace Lily', category: 'Indoor Plants', price: '₹850.00', image: '/images/plants/peace-lily.jpg' },
    { id: 3, name: 'Pothos Hanging', category: 'Indoor Plants', price: '₹399.00', image: '/images/plants/pothos-hanging.jpg' },
    { id: 8, name: 'Bonsai Tree', category: 'Bonsai', price: '₹2,499.00', image: '/images/plants/bonsai-tree.jpg' },
    { id: 16, name: 'Snake Plant', category: 'Indoor Plants', price: '₹600.00', image: '/images/plants/snake-plant.jpg' }
  ],
  orders: [
    { id: 'OR-4092', name: 'Ananya Mitra', amount: '₹1,250.00', date: 'Jul 17, 2026' },
    { id: 'OR-4091', name: 'Rohit Sharma', amount: '₹850.00', date: 'Jul 16, 2026' },
    { id: 'OR-4090', name: 'Sanjana Sen', amount: '₹2,499.00', date: 'Jul 15, 2026' },
    { id: 'OR-4089', name: 'Arjun Das', amount: '₹399.00', date: 'Jul 14, 2026' },
    { id: 'OR-4088', name: 'Priyadarshini Rao', amount: '₹1,850.00', date: 'Jul 12, 2026' }
  ],
  customers: [
    { id: 1, name: 'Ananya Mitra', email: 'ananya.mitra@gmail.com' },
    { id: 2, name: 'Rohit Sharma', email: 'rohit.sharma@yahoo.com' },
    { id: 3, name: 'Sanjana Sen', email: 'sanjana.sen@outlook.com' },
    { id: 4, name: 'Arjun Das', email: 'arjun.das@live.com' },
    { id: 5, name: 'Priyadarshini Rao', email: 'priya.rao@gmail.com' }
  ]
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const isLoginPage = pathname === '/dashboard/login'

  // Header Search functionality states
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Run client-side check for auth token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('nursery_admin_auth') === 'true'
      setIsAuthenticated(isAuth)

      if (!isAuth && !isLoginPage) {
        router.push('/dashboard/login')
      }
    }
  }, [pathname, isLoginPage, router])

  // Click outside to dismiss global search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('nursery_admin_auth')
      setIsAuthenticated(false)
      router.push('/dashboard/login')
    }
  }

  // Filter global search database based on typed query
  const getSearchResults = () => {
    if (!searchQuery.trim()) return null

    const q = searchQuery.toLowerCase()
    
    const filteredProducts = searchDatabase.products.filter(p => 
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
    const filteredOrders = searchDatabase.orders.filter(o => 
      o.id.toLowerCase().includes(q) || o.name.toLowerCase().includes(q)
    )
    const filteredCustomers = searchDatabase.customers.filter(c => 
      c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    )

    const hasResults = filteredProducts.length > 0 || filteredOrders.length > 0 || filteredCustomers.length > 0

    return {
      products: filteredProducts,
      orders: filteredOrders,
      customers: filteredCustomers,
      hasResults
    }
  }

  const searchResults = getSearchResults()

  const handleSelectResult = (dest: string, searchVal: string) => {
    setSearchQuery('')
    setIsSearchFocused(false)
    router.push(`${dest}?search=${encodeURIComponent(searchVal)}`)
  }

  // 1. Standalone login page bypass
  if (isLoginPage) {
    return (
      <div className="min-h-screen w-screen bg-neutral-dark flex items-center justify-center p-6 select-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-black">
        {children}
      </div>
    )
  }

  // 2. Loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen bg-neutral-dark flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-neutral-400 font-light font-sans tracking-widest uppercase">Checking authorization...</span>
      </div>
    )
  }

  // 3. Fallback protection if routing takes a moment
  if (!isAuthenticated) {
    return null
  }

  // Get active item name
  const activeItem = sidebarItems.find(item => item.href === pathname) || sidebarItems[0]

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background text-foreground font-sans">
      {/* Desktop Sidebar (Left side, collapsible) */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col h-full bg-neutral-dark text-white border-r border-border/10 rounded-r-[36px] shadow-xl overflow-x-hidden shrink-0 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Sidebar Header / Brand Logo */}
        <div className={cn("p-6 border-b border-white/5 flex items-center justify-between", isSidebarCollapsed ? "justify-center" : "")}>
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <span className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/logo-sn.jpeg" alt="Logo" className="object-cover w-full h-full" />
            </span>
            {!isSidebarCollapsed && (
              <div>
                <span className="font-sans font-bold text-base tracking-wide block leading-none">
                  Susmita Nursery
                </span>
                <span className="text-[9px] text-neutral-400 font-sans tracking-widest uppercase block mt-1.5">
                  Admin Console
                </span>
              </div>
            )}
          </Link>
          
          {/* Toggle Button for collapsing sidebar on desktop */}
          {!isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
              title="Collapse Sidebar"
            >
              <ChevronLeft size={15} />
            </button>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-none">
          {isSidebarCollapsed && (
            <div className="flex justify-center pb-4 border-b border-white/5 mb-4">
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-2.5 bg-primary/10 hover:bg-primary border border-primary/20 text-secondary hover:text-white rounded-xl cursor-pointer transition-all"
                title="Expand Sidebar"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}

          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-medium tracking-wide transition-all cursor-pointer group",
                  isActive
                    ? 'bg-primary text-white shadow-md font-bold'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white',
                  isSidebarCollapsed ? 'justify-center px-0 w-12 h-12 mx-auto rounded-xl' : ''
                )}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-300 group-hover:scale-105 shrink-0",
                    isActive ? 'text-secondary' : 'text-neutral-400'
                  )}
                />
                {!isSidebarCollapsed && <span>{item.name}</span>}
                {!isSidebarCollapsed && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-secondary rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={cn("p-6 border-t border-white/5 bg-black/10 flex flex-col gap-3 shrink-0 overflow-x-hidden", isSidebarCollapsed ? "items-center px-2" : "")}>
          {!isSidebarCollapsed ? (
            <Link href="/" target="_blank" className="flex items-center justify-between text-xs text-neutral-400 hover:text-white px-2 py-1.5 transition-colors">
              <span>View Public Storefront</span>
              <ExternalLink size={12} />
            </Link>
          ) : (
            <Link href="/" target="_blank" className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer" title="View Public Storefront">
              <ExternalLink size={14} />
            </Link>
          )}
          <div className="flex items-center gap-3 px-2 w-full">
            {isSidebarCollapsed ? (
              <button
                onClick={handleLogout}
                className="w-9 h-9 bg-secondary/20 border border-secondary/40 text-secondary rounded-full flex items-center justify-center font-bold text-sm shrink-0 select-none hover:bg-red-600/20 hover:border-red-600/40 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                Y
              </button>
            ) : (
              <div className="w-9 h-9 bg-secondary/20 border border-secondary/40 text-secondary rounded-full flex items-center justify-center font-bold text-sm shrink-0 select-none">
                Y
              </div>
            )}
            {!isSidebarCollapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <div className="truncate pr-2">
                  <p className="text-xs font-semibold leading-tight text-white truncate">Yuvraj</p>
                  <p className="text-[10px] text-neutral-500 font-light truncate">Super Admin</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-white/5 cursor-pointer shrink-0"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar / Drawer (Slide-out menu overlay) */}
      <div 
        className={cn(
          "fixed inset-0 z-45 lg:hidden transition-opacity duration-300 ease-in-out",
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50"
        />
        {/* Drawer Panel */}
        <div 
          className={cn(
            "fixed top-0 bottom-0 left-0 w-80 bg-neutral-dark text-white flex flex-col shadow-2xl rounded-r-[36px] transition-transform duration-300 ease-in-out z-50",
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logos/logo-sn.jpeg" alt="Logo" className="object-cover w-full h-full" />
              </span>
              <div>
                <span className="font-sans font-bold text-base leading-none">
                  Susmita Nursery
                </span>
                <span className="text-[9px] text-neutral-400 tracking-widest uppercase block mt-1.5">
                  Admin Console
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer",
                    isActive
                      ? 'bg-primary text-white font-bold'
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <item.icon className={isActive ? 'text-secondary' : 'text-neutral-400'} size={18} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-6 border-t border-white/5 bg-black/10 flex flex-col gap-3">
            <Link href="/" target="_blank" className="flex items-center justify-between text-xs text-neutral-400 hover:text-white px-2 py-1.5">
              <span>View Public Storefront</span>
              <ExternalLink size={12} />
            </Link>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary/20 border border-secondary/40 text-secondary rounded-full flex items-center justify-center font-bold text-sm">
                  Y
                </div>
                <div>
                  <p className="text-xs font-semibold leading-tight text-white">Yuvraj</p>
                  <p className="text-[10px] text-neutral-500 font-light">Super Admin</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-400 hover:text-red-400 rounded-full bg-white/5 cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace (Right side) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-card border-b border-border/80 flex items-center justify-between px-6 sm:px-8 z-30 sticky top-0 shadow-sm shrink-0">
          {/* Left: Mobile menu button & breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2.5 text-neutral-600 hover:text-neutral-900 rounded-xl border border-border bg-white hover:bg-muted cursor-pointer transition-colors"
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground font-sans">
              <span>Admin Console</span>
              <ChevronRight size={12} className="text-neutral-300" />
              <span className="text-primary font-semibold">{activeItem.name}</span>
            </div>
            <span className="sm:hidden text-sm font-semibold text-primary font-sans">{activeItem.name}</span>
          </div>

          {/* Right: Notifications & Functional Global Search */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Functional Search Container */}
            <div ref={searchContainerRef} className="relative hidden md:block w-72 overflow-visible">
              <Search size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search anything (plants, orders, users)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-muted/40 border border-border/80 pl-9 pr-8 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-600 hover:bg-muted rounded-full cursor-pointer"
                >
                  <X size={11} />
                </button>
              )}

              {/* Global Search Results Dropdown Panel */}
              {isSearchFocused && searchResults && (
                <div className="absolute top-full right-0 mt-2.5 w-[420px] bg-white border border-border shadow-2xl rounded-2xl z-50 p-4 max-h-[380px] overflow-y-auto flex flex-col gap-4 font-sans text-xs">
                  {searchResults.hasResults ? (
                    <>
                      {/* 1. Products Section */}
                      {searchResults.products.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-border/40 pb-1 flex items-center gap-1.5">
                            <Sprout size={11} className="text-primary" />
                            <span>Catalog Products ({searchResults.products.length})</span>
                          </div>
                          <div className="space-y-1.5">
                            {searchResults.products.map(p => (
                              <button
                                key={p.id}
                                onClick={() => handleSelectResult('/dashboard/products', p.name)}
                                className="w-full text-left flex items-center justify-between p-2 rounded-xl hover:bg-muted/60 transition-colors group cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded border border-border overflow-hidden shrink-0 bg-muted">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                                  </div>
                                  <div>
                                    <span className="font-semibold text-neutral-800 block line-clamp-1 group-hover:text-primary transition-colors">{p.name}</span>
                                    <span className="text-[10px] text-neutral-400 block font-light">{p.category}</span>
                                  </div>
                                </div>
                                <span className="font-bold text-neutral-700">{p.price}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2. Orders Section */}
                      {searchResults.orders.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-border/40 pb-1 flex items-center gap-1.5">
                            <ShoppingBag size={11} className="text-primary" />
                            <span>Customer Orders ({searchResults.orders.length})</span>
                          </div>
                          <div className="space-y-1.5">
                            {searchResults.orders.map(o => (
                              <button
                                key={o.id}
                                onClick={() => handleSelectResult('/dashboard/orders', o.id)}
                                className="w-full text-left flex items-center justify-between p-2 rounded-xl hover:bg-muted/60 transition-colors group cursor-pointer"
                              >
                                <div>
                                  <span className="font-bold text-primary block group-hover:underline">{o.id}</span>
                                  <span className="text-[10px] text-neutral-500 font-light block">{o.name} • {o.date}</span>
                                </div>
                                <span className="font-bold text-neutral-800">{o.amount}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Customers Section */}
                      {searchResults.customers.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest border-b border-border/40 pb-1 flex items-center gap-1.5">
                            <User size={11} className="text-primary" />
                            <span>Registered Profiles ({searchResults.customers.length})</span>
                          </div>
                          <div className="space-y-1.5">
                            {searchResults.customers.map(c => (
                              <button
                                key={c.id}
                                onClick={() => handleSelectResult('/dashboard/customers', c.name)}
                                className="w-full text-left flex items-center justify-between p-2 rounded-xl hover:bg-muted/60 transition-colors group cursor-pointer"
                              >
                                <div>
                                  <span className="font-semibold text-neutral-800 block group-hover:text-primary transition-colors">{c.name}</span>
                                  <span className="text-[10px] text-neutral-400 block font-light">{c.email}</span>
                                </div>
                                <ChevronRight size={12} className="text-neutral-300 group-hover:text-primary transition-colors" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-neutral-400 font-light">
                      No matching records found for &ldquo;{searchQuery}&rdquo;.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notifications Alert */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 text-neutral-600 hover:text-neutral-900 bg-white border border-border rounded-xl cursor-pointer hover:bg-muted transition-colors relative"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-white" />
              </button>

              <div 
                className={cn(
                  "absolute right-0 mt-2.5 w-80 bg-card border border-border shadow-lg rounded-2xl p-4 z-50 transition-all duration-200",
                  isNotificationsOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                )}
              >
                <h4 className="font-sans font-bold text-sm text-foreground mb-3 pb-1 border-b border-border/60">
                  Recent Notifications
                </h4>
                <div className="space-y-3">
                  <div className="text-xs p-2.5 bg-muted/30 border border-border/40 rounded-xl space-y-1">
                    <span className="font-semibold text-primary block">New Order Recieved</span>
                    <span className="text-neutral-500 font-light">Order #4092 placed by Ananya Mitra.</span>
                    <span className="text-[10px] text-neutral-400 block font-light">5 mins ago</span>
                  </div>
                  <div className="text-xs p-2.5 bg-muted/30 border border-border/40 rounded-xl space-y-1">
                    <span className="font-semibold text-accent-earth block">Low Stock Warning</span>
                    <span className="text-neutral-500 font-light">Monstera Deliciosa is below the threshold of 5 units.</span>
                    <span className="text-[10px] text-neutral-400 block font-light">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-2 border-l border-border/80 pl-3 sm:pl-4">
              <button
                onClick={handleLogout}
                className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs select-none hover:bg-red-600 transition-colors"
                title="Sign Out"
              >
                Y
              </button>
              <span className="hidden sm:inline-block text-xs font-semibold font-sans text-neutral-800">Yuvraj</span>
            </div>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-muted/20">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
