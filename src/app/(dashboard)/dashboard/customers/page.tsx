'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Receipt
} from 'lucide-react'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet'
import { useSearchParams } from 'next/navigation'

interface CustomerOrder {
  id: string
  date: string
  amount: number
  status: string
}

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  joinedDate: string
  totalOrders: number
  totalSpent: number
  orderHistory: CustomerOrder[]
}

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: 'Ananya Mitra',
    email: 'ananya.mitra@gmail.com',
    phone: '+91 98765 43210',
    joinedDate: 'Jan 15, 2026',
    totalOrders: 3,
    totalSpent: 4250.00,
    orderHistory: [
      { id: 'OR-4092', date: 'Jul 17, 2026', amount: 1250.00, status: 'processing' },
      { id: 'OR-3980', date: 'May 04, 2026', amount: 1450.00, status: 'delivered' },
      { id: 'OR-3820', date: 'Mar 12, 2026', amount: 1550.00, status: 'delivered' }
    ]
  },
  {
    id: 2,
    name: 'Rohit Sharma',
    email: 'rohit.sharma@yahoo.com',
    phone: '+91 87654 32109',
    joinedDate: 'Feb 10, 2026',
    totalOrders: 1,
    totalSpent: 850.00,
    orderHistory: [
      { id: 'OR-4091', date: 'Jul 16, 2026', amount: 850.00, status: 'processing' }
    ]
  },
  {
    id: 3,
    name: 'Sanjana Sen',
    email: 'sanjana.sen@outlook.com',
    phone: '+91 76543 21098',
    joinedDate: 'Nov 02, 2025',
    totalOrders: 4,
    totalSpent: 6280.00,
    orderHistory: [
      { id: 'OR-4090', date: 'Jul 15, 2026', amount: 2499.00, status: 'shipped' },
      { id: 'OR-3890', date: 'Apr 02, 2026', amount: 999.00, status: 'delivered' },
      { id: 'OR-3742', date: 'Jan 10, 2026', amount: 1232.00, status: 'delivered' },
      { id: 'OR-3601', date: 'Nov 20, 2025', amount: 1550.00, status: 'delivered' }
    ]
  },
  {
    id: 4,
    name: 'Arjun Das',
    email: 'arjun.das@live.com',
    phone: '+91 90123 45678',
    joinedDate: 'Jun 18, 2026',
    totalOrders: 1,
    totalSpent: 399.00,
    orderHistory: [
      { id: 'OR-4089', date: 'Jul 14, 2026', amount: 399.00, status: 'cancelled' }
    ]
  },
  {
    id: 5,
    name: 'Priyadarshini Rao',
    email: 'priya.rao@gmail.com',
    phone: '+91 99887 76655',
    joinedDate: 'Mar 30, 2026',
    totalOrders: 2,
    totalSpent: 3450.00,
    orderHistory: [
      { id: 'OR-4088', date: 'Jul 12, 2026', amount: 1850.00, status: 'delivered' },
      { id: 'OR-3790', date: 'Apr 15, 2026', amount: 1600.00, status: 'delivered' }
    ]
  }
]

export default function CustomersPage() {
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search')

  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  useEffect(() => {
    if (urlSearch !== null) {
      setSearchTerm(urlSearch)
    }
  }, [urlSearch])

  // Load customers
  useEffect(() => {
    const stored = localStorage.getItem('nursery_customers')
    if (stored) {
      try {
        setCustomers(JSON.parse(stored))
      } catch {
        setCustomers(initialCustomers)
      }
    } else {
      setCustomers(initialCustomers)
      localStorage.setItem('nursery_customers', JSON.stringify(initialCustomers))
    }
  }, [])

  const handleOpenDetails = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsSheetOpen(true)
  }

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statusStyle = (status: string) => {
    if (status === 'delivered') return 'text-green-700 bg-green-50 border-green-200'
    if (status === 'processing') return 'text-primary bg-primary/10 border-primary/20'
    if (status === 'shipped') return 'text-blue-700 bg-blue-50 border-blue-200'
    return 'text-red-700 bg-red-50 border-red-200'
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-neutral-dark">
          Registered Customer Profiles
        </h1>
        <p className="text-xs text-muted-foreground font-light mt-1">
          Monitor user accounts, registration parameters, purchase indices, and customer lifetime value (LTV).
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-neutral-400"
          />
        </div>

        <div className="text-xs text-muted-foreground font-light px-2">
          Displaying {filteredCustomers.length} registered accounts
        </div>
      </div>

      {/* Customers table */}
      <div className="bg-card border border-border/80 rounded-[32px] overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="py-4 px-6 font-semibold">User</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Contact Info</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Joined Date</TableHead>
              <TableHead className="py-4 px-4 text-center font-semibold">Orders Placed</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Total Spent (LTV)</TableHead>
              <TableHead className="py-4 px-6 text-right font-semibold">Profile</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 border border-primary/20 text-primary font-bold text-xs rounded-full flex items-center justify-center select-none shrink-0">
                        {customer.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span className="text-sm font-semibold text-neutral-800 leading-tight block">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4 font-light text-neutral-500 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Mail size={11} className="text-primary shrink-0" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone size={11} className="text-primary shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4 font-light text-neutral-400">{customer.joinedDate}</TableCell>
                  <TableCell className="py-4 px-4 text-center font-bold text-neutral-700 font-mono">
                    {customer.totalOrders}
                  </TableCell>
                  <TableCell className="py-4 px-4 font-bold text-neutral-800 tabular-nums">
                    ₹{customer.totalSpent.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleOpenDetails(customer)}
                      className="p-2 text-primary hover:text-white bg-primary/5 hover:bg-primary border border-primary/25 rounded-lg transition-colors cursor-pointer"
                      title="View Profile Details"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground font-light">
                  No customer profile matched the search parameters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Slide-out Profile Details Sheet (Drawer) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        {selectedCustomer && (
          <SheetContent className="max-w-md flex flex-col h-full overflow-hidden">
            <SheetHeader>
              <SheetTitle>Customer Profile Card</SheetTitle>
              <SheetDescription>
                Client ID: #{selectedCustomer.id} • Registered
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-xs">
              {/* Profile Overview */}
              <div className="text-center space-y-2 bg-muted/20 border border-border/50 p-6 rounded-3xl">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto shadow-sm border-2 border-white select-none">
                  {selectedCustomer.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <h3 className="font-serif font-bold text-lg text-neutral-dark">{selectedCustomer.name}</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-white border border-border/50 px-2.5 py-0.5 rounded-full inline-block">
                  Customer Account
                </span>
              </div>

              {/* Parameters lists */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-primary border-b border-border/40 pb-1 flex items-center gap-1">
                  <Sparkles size={12} className="text-secondary" />
                  <span>Account Parameters</span>
                </h4>
                
                <div className="space-y-3 pl-1 font-light text-neutral-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail size={12} className="text-primary shrink-0" />
                      <span>Email address</span>
                    </span>
                    <span className="font-semibold text-neutral-800">{selectedCustomer.email}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone size={12} className="text-primary shrink-0" />
                      <span>Phone number</span>
                    </span>
                    <span className="font-semibold text-neutral-800">{selectedCustomer.phone}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-primary shrink-0" />
                      <span>Registration Date</span>
                    </span>
                    <span className="font-semibold text-neutral-800">{selectedCustomer.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Purchase stats indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl space-y-1">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Orders placed</span>
                  <span className="text-xl font-bold text-primary font-mono block flex items-center gap-1.5">
                    <ShoppingBag size={16} />
                    <span>{selectedCustomer.totalOrders} items</span>
                  </span>
                </div>

                <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-2xl space-y-1">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Lifetime Spent</span>
                  <span className="text-xl font-bold text-primary-deep block flex items-center gap-1.5">
                    <TrendingUp size={16} className="text-secondary" />
                    <span>₹{selectedCustomer.totalSpent}</span>
                  </span>
                </div>
              </div>

              {/* Complete Order History */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-primary border-b border-border/40 pb-1.5 flex items-center gap-1.5">
                  <Receipt size={12} className="text-secondary" />
                  <span>Purchase History Ledger</span>
                </h4>

                <div className="space-y-3.5">
                  {selectedCustomer.orderHistory.map((ord, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-border/30 pb-3 last:border-b-0 last:pb-0">
                      <div className="space-y-1">
                        <span className="font-bold text-primary block leading-none">{ord.id}</span>
                        <span className="text-[10px] text-neutral-400 font-light block">{ord.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-neutral-800">₹{ord.amount.toFixed(2)}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full uppercase tracking-wider ${statusStyle(ord.status)}`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SheetFooter className="p-6 border-t border-border mt-auto flex justify-end">
              <SheetClose>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-emerald text-white font-bold text-xs cursor-pointer shadow-md transition-all"
                >
                  Close Profile
                </button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}
