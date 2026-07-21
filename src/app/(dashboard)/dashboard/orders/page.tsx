'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  Package,
  ShoppingBag,
  Store,
  CheckCircle2,
  Clock
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

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  customerName: string
  email: string
  phone: string
  date: string
  amount: number
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  orderStatus: 'processing' | 'ready_for_pickup' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled'
  address: string
  items: OrderItem[]
}

const initialOrders: Order[] = [
  {
    id: 'SN-RES-84920',
    customerName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98301 23456',
    date: 'Jul 19, 2026',
    amount: 2100.00,
    paymentStatus: 'pending',
    orderStatus: 'ready_for_pickup',
    address: '42 Palm Grove Avenue, Salt Lake Sector V, Kolkata - 700091',
    items: [
      { id: 1, name: 'Monstera Deliciosa', price: 1250.00, quantity: 1, image: '/images/plants/monstera-plant.jpg' },
      { id: 2, name: 'Peace Lily', price: 850.00, quantity: 1, image: '/images/plants/peace-lily.jpg' }
    ]
  },
  {
    id: 'OR-4092',
    customerName: 'Ananya Mitra',
    email: 'ananya.mitra@gmail.com',
    phone: '+91 98765 43210',
    date: 'Jul 17, 2026',
    amount: 1250.00,
    paymentStatus: 'paid',
    orderStatus: 'processing',
    address: '12B Ballygunge Place, Kolkata, West Bengal - 700019',
    items: [
      { id: 1, name: 'Monstera Deliciosa', price: 1250.00, quantity: 1, image: '/images/plants/monstera-plant.jpg' }
    ]
  },
  {
    id: 'OR-4091',
    customerName: 'Rohit Sharma',
    email: 'rohit.sharma@yahoo.com',
    phone: '+91 87654 32109',
    date: 'Jul 16, 2026',
    amount: 850.00,
    paymentStatus: 'pending',
    orderStatus: 'ready_for_pickup',
    address: 'Flat 402, Royal Gardens, Sector V, Salt Lake, Kolkata - 700091',
    items: [
      { id: 2, name: 'Peace Lily', price: 850.00, quantity: 1, image: '/images/plants/peace-lily.jpg' }
    ]
  },
  {
    id: 'OR-4090',
    customerName: 'Sanjana Sen',
    email: 'sanjana.sen@outlook.com',
    phone: '+91 76543 21098',
    date: 'Jul 15, 2026',
    amount: 2499.00,
    paymentStatus: 'paid',
    orderStatus: 'fulfilled',
    address: '44 Gariahat Road, Kolkata, West Bengal - 700029',
    items: [
      { id: 8, name: 'Bonsai Tree', price: 2499.00, quantity: 1, image: '/images/plants/bonsai-tree.jpg' }
    ]
  },
  {
    id: 'OR-4089',
    customerName: 'Arjun Das',
    email: 'arjun.das@live.com',
    phone: '+91 90123 45678',
    date: 'Jul 14, 2026',
    amount: 399.00,
    paymentStatus: 'failed',
    orderStatus: 'cancelled',
    address: 'House 5, Green Avenue, New Delhi, Delhi - 110001',
    items: [
      { id: 3, name: 'Pothos Hanging', price: 399.00, quantity: 1, image: '/images/plants/pothos-hanging.jpg' }
    ]
  },
  {
    id: 'OR-4088',
    customerName: 'Priyadarshini Rao',
    email: 'priya.rao@gmail.com',
    phone: '+91 99887 76655',
    date: 'Jul 12, 2026',
    amount: 1850.00,
    paymentStatus: 'paid',
    orderStatus: 'fulfilled',
    address: '7A Park Street, Kolkata, West Bengal - 700016',
    items: [
      { id: 1, name: 'Monstera Deliciosa', price: 1250.00, quantity: 1, image: '/images/plants/monstera-plant.jpg' },
      { id: 16, name: 'Snake Plant', price: 600.00, quantity: 1, image: '/images/plants/snake-plant.jpg' }
    ]
  }
]

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search')

  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  useEffect(() => {
    if (urlSearch !== null) {
      setSearchTerm(urlSearch)
    }
  }, [urlSearch])

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('nursery_orders')
    if (stored) {
      try {
        setOrders(JSON.parse(stored))
      } catch {
        setOrders(initialOrders)
      }
    } else {
      setOrders(initialOrders)
      localStorage.setItem('nursery_orders', JSON.stringify(initialOrders))
    }
  }, [])

  // Open details sheet
  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsSheetOpen(true)
  }

  // Update statuses from Sheet
  const handleUpdateStatus = (field: 'paymentStatus' | 'orderStatus', val: string) => {
    if (!selectedOrder) return

    const updatedOrder = { ...selectedOrder, [field]: val } as Order
    setSelectedOrder(updatedOrder)

    const updatedOrders = orders.map(o => o.id === selectedOrder.id ? updatedOrder : o)
    setOrders(updatedOrders)
    localStorage.setItem('nursery_orders', JSON.stringify(updatedOrders))
  }

  // Status styling helper maps
  const paymentStatusStyle = (status: string) => {
    if (status === 'paid') return 'bg-emerald-100 text-emerald-800 border-emerald-300'
    if (status === 'pending') return 'bg-amber-100 text-amber-800 border-amber-300'
    if (status === 'failed') return 'bg-red-100 text-red-700 border-red-300'
    return 'bg-neutral-100 text-neutral-600 border-neutral-300'
  }

  const paymentStatusLabel = (status: string) => {
    if (status === 'paid') return 'Paid In-Store'
    if (status === 'pending') return 'Unpaid (Pending Counter)'
    if (status === 'failed') return 'Failed'
    return 'Refunded'
  }

  const orderStatusStyle = (status: string) => {
    if (status === 'ready_for_pickup') return 'bg-emerald-100 text-emerald-800 border-emerald-300'
    if (status === 'fulfilled' || status === 'delivered') return 'bg-blue-100 text-blue-800 border-blue-300'
    if (status === 'processing') return 'bg-amber-100 text-amber-800 border-amber-300'
    if (status === 'shipped') return 'bg-indigo-100 text-indigo-800 border-indigo-300'
    return 'bg-red-100 text-red-700 border-red-300'
  }

  const orderStatusLabel = (status: string) => {
    if (status === 'ready_for_pickup') return 'Ready for In-Store Pickup'
    if (status === 'fulfilled' || status === 'delivered') return 'Handed Over In-Store'
    if (status === 'processing') return 'Preparing Plants'
    if (status === 'shipped') return 'Dispatched'
    return 'Cancelled'
  }

  // Filter List
  const statuses = ['All', 'ready_for_pickup', 'processing', 'fulfilled', 'cancelled']

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'All' || o.orderStatus === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-neutral-dark flex items-center gap-3">
          <Store className="text-secondary" />
          In-Store Plant Reservations & Orders Log
        </h1>
        <p className="text-xs text-muted-foreground font-light mt-1">
          Search customer reservations by Name, Phone, Email, or Reservation ID to prepare plants for in-store pickup.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Name, Phone (+91...), Email, or Reservation ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/40 border border-border/80 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-neutral-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1 shrink-0 mr-1.5">
            <Filter size={12} className="text-primary" />
            <span>Pickup Status:</span>
          </span>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer shrink-0 ${
                selectedStatus === st
                  ? 'bg-primary text-white border-primary font-semibold'
                  : 'bg-white hover:bg-muted text-neutral-500 border-border hover:text-foreground'
              }`}
            >
              {st === 'All' ? 'All' : orderStatusLabel(st)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border/80 rounded-[32px] overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="py-4 px-6 font-semibold w-36">Reservation ID</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Customer (In-Store)</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Date</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Estimated Total</TableHead>
              <TableHead className="py-4 px-4 font-semibold">Counter Payment</TableHead>
              <TableHead className="py-4 px-4 font-semibold">In-Store Pickup Status</TableHead>
              <TableHead className="py-4 px-6 text-right font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="py-4 px-6 font-bold text-primary font-mono text-xs">{order.id}</TableCell>
                  <TableCell className="py-4 px-4">
                    <div>
                      <span className="text-sm font-semibold text-neutral-800 block leading-tight">{order.customerName}</span>
                      <span className="text-[10px] text-neutral-500 font-medium block mt-0.5">{order.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4 font-light text-neutral-500">{order.date}</TableCell>
                  <TableCell className="py-4 px-4 font-bold text-neutral-800 tabular-nums">
                    ₹{order.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[9px] font-bold tracking-wide ${paymentStatusStyle(order.paymentStatus)}`}>
                      {paymentStatusLabel(order.paymentStatus)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[9px] font-bold tracking-wide ${orderStatusStyle(order.orderStatus)}`}>
                      {orderStatusLabel(order.orderStatus)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleOpenDetails(order)}
                      className="px-3 py-1.5 text-xs bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl transition-colors cursor-pointer font-medium inline-flex items-center gap-1"
                    >
                      <Eye size={13} /> Details
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground font-light">
                  No reservations matching customer search found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Slide-out Order Details Sheet (Drawer) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        {selectedOrder && (
          <SheetContent className="max-w-xl flex flex-col h-full overflow-hidden">
            <SheetHeader>
              <SheetTitle className="font-serif text-xl">Customer In-Store Reservation Sheet</SheetTitle>
              <SheetDescription>
                Reservation Code: <span className="font-mono font-bold text-primary">{selectedOrder.id}</span> • Reserved on {selectedOrder.date}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-xs">
              {/* 1. Customer & Identification details */}
              <div className="space-y-4">
                <h3 className="text-sm font-serif font-bold text-primary border-b border-border/40 pb-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  <span>Customer Store Lookup & Contact</span>
                </h3>
                
                <div className="bg-muted/30 border border-border/60 p-4 rounded-2xl space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs select-none">
                      {selectedOrder.customerName.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800 text-sm block leading-none">{selectedOrder.customerName}</span>
                      <span className="text-[10px] text-neutral-400 block mt-1">In-Store Nursery Client</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-border/30 pt-3">
                    <div className="flex items-center gap-2 text-neutral-600 font-medium">
                      <Phone size={13} className="text-primary shrink-0" />
                      <span>{selectedOrder.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500 font-light truncate">
                      <Mail size={13} className="text-primary shrink-0" />
                      <span className="truncate">{selectedOrder.email}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 border-t border-border/30 pt-3 text-neutral-500 font-light leading-normal">
                    <MapPin size={13} className="text-primary shrink-0 mt-0.5" />
                    <span>{selectedOrder.address}</span>
                  </div>
                </div>
              </div>

              {/* 2. Items Reserved */}
              <div className="space-y-4">
                <h3 className="text-sm font-serif font-bold text-primary border-b border-border/40 pb-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  <span>Reserved Plants List (Fetch from Greenhouse)</span>
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-border/30 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 border border-border rounded-xl overflow-hidden relative shrink-0 bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <span className="font-semibold text-neutral-800 block text-xs leading-tight">{item.name}</span>
                          <span className="text-[10px] text-neutral-500 font-medium block mt-0.5">₹{item.price} × {item.quantity} unit(s)</span>
                        </div>
                      </div>
                      <span className="font-bold text-neutral-800 text-xs">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/50 pt-4 flex justify-between items-center bg-muted/20 p-4 rounded-xl border">
                  <span className="font-serif font-bold text-neutral-700 text-sm">Estimated Total Amount</span>
                  <span className="font-sans font-bold text-primary text-base">
                    ₹{selectedOrder.amount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 3. Action Toggles (Status update dropdowns) */}
              <div className="space-y-4">
                <h3 className="text-sm font-serif font-bold text-primary border-b border-border/40 pb-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  <span>In-Store Staff Fulfillment Controls</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-700 flex items-center gap-1">
                      <CreditCard size={12} className="text-primary" />
                      <span>Counter Payment Status</span>
                    </label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handleUpdateStatus('paymentStatus', e.target.value)}
                      className="w-full bg-white border border-border/80 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
                    >
                      <option value="pending">Pending Settlement (Unpaid)</option>
                      <option value="paid">Paid In-Store (Cash / UPI / Card)</option>
                      <option value="failed">Failed Transaction</option>
                      <option value="refunded">Refunded / Cancelled</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-700 flex items-center gap-1">
                      <Store size={12} className="text-primary" />
                      <span>In-Store Pickup Status</span>
                    </label>
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => handleUpdateStatus('orderStatus', e.target.value)}
                      className="w-full bg-white border border-border/80 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground text-xs"
                    >
                      <option value="ready_for_pickup">Ready for In-Store Pickup</option>
                      <option value="processing">Preparing Plants (In Greenhouse)</option>
                      <option value="fulfilled">Fulfilled & Handed Over In-Store</option>
                      <option value="cancelled">Cancelled (Release Stock)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter className="p-4 border-t border-border bg-muted/20">
              <SheetClose>
                <button className="w-full py-2.5 bg-primary text-white rounded-xl font-semibold text-xs hover:bg-primary/90 transition-colors cursor-pointer">
                  Save & Close Order Sheet
                </button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}
