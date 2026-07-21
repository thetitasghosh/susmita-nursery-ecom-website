'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  TrendingUp, 
  ShoppingBag, 
  AlertTriangle, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Boxes,
  Clock,
  Calendar
} from 'lucide-react'

// Dummy data for Overview Stats
const stats = [
  {
    title: 'Total Revenue',
    value: '₹48,250.00',
    change: '+14.2%',
    isPositive: true,
    subtitle: 'vs. ₹42,240 last month',
    icon: TrendingUp,
    color: 'text-primary bg-primary/10',
  },
  {
    title: 'Active Orders',
    value: '18 Orders',
    change: '+8.3%',
    isPositive: true,
    subtitle: '6 pending shipment',
    icon: ShoppingBag,
    color: 'text-secondary bg-secondary/10',
  },
  {
    title: 'Low Stock Items',
    value: '4 Products',
    change: '-25%',
    isPositive: true,
    subtitle: 'Items below threshold (5)',
    icon: AlertTriangle,
    color: 'text-accent-earth bg-accent-earth/10',
  },
  {
    title: 'Subscribers',
    value: '1,428 Subscribers',
    change: '+6.1%',
    isPositive: true,
    subtitle: '12 new this week',
    icon: Users,
    color: 'text-primary-deep bg-primary-deep/10',
  },
]

const recentOrders = [
  { id: '#4092', name: 'Ananya Mitra', date: 'Jul 17, 2026', amount: '₹1,250.00', status: 'paid', statusColor: 'text-secondary bg-secondary/15 border-secondary/30' },
  { id: '#4091', name: 'Rohit Sharma', date: 'Jul 16, 2026', amount: '₹850.00', status: 'pending', statusColor: 'text-accent-earth bg-accent/15 border-accent/30' },
  { id: '#4090', name: 'Sanjana Sen', date: 'Jul 15, 2026', amount: '₹2,499.00', status: 'paid', statusColor: 'text-secondary bg-secondary/15 border-secondary/30' },
  { id: '#4089', name: 'Arjun Das', date: 'Jul 14, 2026', amount: '₹399.00', status: 'failed', statusColor: 'text-red-600 bg-red-50 border-red-200' },
]

const lowStockItems = [
  { name: 'Monstera Deliciosa', stock: 2, image: '/images/plants/monstera-plant.jpg', status: 'Critical' },
  { name: 'Peace Lily', stock: 4, image: '/images/plants/peace-lily.jpg', status: 'Warning' },
  { name: 'Lavender Plant', stock: 3, image: '/images/plants/lavender-plant.jpg', status: 'Warning' },
  { name: 'Neem Oil Pest Spray', stock: 0, image: '/images/plants/neem-oil.jpg', status: 'Out of Stock' },
]

// Dynamic Chart Data Points
const monthlyChartData = [
  { month: 'JAN', plants: 12000, tools: 5000, x: 25, yPlants: 160, yTools: 175 },
  { month: 'FEB', plants: 18000, tools: 7000, x: 100, yPlants: 135, yTools: 165 },
  { month: 'MAR', plants: 15000, tools: 6000, x: 175, yPlants: 150, yTools: 170 },
  { month: 'APR', plants: 25000, tools: 10000, x: 250, yPlants: 110, yTools: 150 },
  { month: 'MAY', plants: 32000, tools: 14000, x: 325, yPlants: 80, yTools: 130 },
  { month: 'JUN', plants: 40000, tools: 18000, x: 400, yPlants: 50, yTools: 110 },
  { month: 'JUL', plants: 48250, tools: 22000, x: 475, yPlants: 20, yTools: 90 },
]

const weeklyChartData = [
  { month: 'Week 1', plants: 8000, tools: 3000, x: 25, yPlants: 170, yTools: 180 },
  { month: 'Week 2', plants: 11000, tools: 4500, x: 100, yPlants: 155, yTools: 175 },
  { month: 'Week 3', plants: 14000, tools: 5500, x: 175, yPlants: 145, yTools: 170 },
  { month: 'Week 4', plants: 22000, tools: 9000, x: 250, yPlants: 120, yTools: 155 },
  { month: 'Week 5', plants: 29000, tools: 12000, x: 325, yPlants: 90, yTools: 140 },
  { month: 'Week 6', plants: 36000, tools: 16000, x: 400, yPlants: 65, yTools: 120 },
  { month: 'Week 7', plants: 48250, tools: 22000, x: 475, yPlants: 20, yTools: 90 },
]

export default function OverviewPage() {
  const [timeframe, setTimeframe] = useState<'monthly' | 'weekly'>('monthly')
  const [activePointIndex, setActivePointIndex] = useState<number | null>(6) // Default to latest data index

  const currentChartData = timeframe === 'monthly' ? monthlyChartData : weeklyChartData
  const activePoint = activePointIndex !== null ? currentChartData[activePointIndex] : null

  // Helper to compile SVG paths dynamically
  const plantsPath = currentChartData.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${d.x} ${d.yPlants}`).join(' ')
  const toolsPath = currentChartData.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${d.x} ${d.yTools}`).join(' ')
  
  // Closed paths for background shading
  const plantsAreaPath = `${plantsPath} L 475 190 L 25 190 Z`
  const toolsAreaPath = `${toolsPath} L 475 190 L 25 190 Z`

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Title */}
      <div>
        <h1 className="text-3xl font-sans font-bold text-neutral-dark tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-xs text-muted-foreground font-light mt-1">
          Here is what is happening at Susmita Nursery today, Jul 17, 2026.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-card border border-border/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground block">
                  {stat.title}
                </span>
                <span className="text-2xl font-sans font-bold text-neutral-dark block tracking-tight">
                  {stat.value}
                </span>
              </div>
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={18} />
              </span>
            </div>

            <div className="border-t border-border/40 pt-4 mt-4 flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                stat.isPositive 
                  ? 'bg-secondary/15 text-primary' 
                  : 'bg-red-50 text-red-600'
              }`}>
                {stat.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                <span>{stat.change}</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-light">
                {stat.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Sales Chart Widget */}
        <div className="lg:col-span-2 bg-card border border-border/80 p-6 rounded-[32px] shadow-sm flex flex-col justify-between relative overflow-visible">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/40 pb-4 mb-6 gap-3">
            <div>
              <h3 className="font-sans font-bold text-lg text-neutral-dark tracking-tight">
                Revenue & Sales Performance
              </h3>
              <p className="text-[10px] text-muted-foreground font-light mt-0.5">
                Hover over columns to query category performance parameters.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3.5 text-xs font-semibold mr-1.5">
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  <span>Plants</span>
                </span>
                <span className="flex items-center gap-1.5 text-neutral-500">
                  <span className="w-2 h-2 bg-secondary rounded-full" />
                  <span>Tools/Care</span>
                </span>
              </div>

              {/* Timeframe selector */}
              <div className="bg-muted p-1 rounded-xl flex border border-border/40 select-none">
                <button
                  onClick={() => {
                    setTimeframe('monthly')
                    setActivePointIndex(6)
                  }}
                  className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors cursor-pointer ${
                    timeframe === 'monthly' ? 'bg-white text-primary shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => {
                    setTimeframe('weekly')
                    setActivePointIndex(6)
                  }}
                  className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors cursor-pointer ${
                    timeframe === 'weekly' ? 'bg-white text-primary shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic SVG chart viewport with hover interactions */}
          <div className="relative h-60 w-full overflow-visible select-none">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gradient-plants" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0"/>
                </linearGradient>
                <linearGradient id="gradient-tools" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.0"/>
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="25" y1="40" x2="475" y2="40" stroke="#e5e2d8" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="25" y1="90" x2="475" y2="90" stroke="#e5e2d8" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="25" y1="140" x2="475" y2="140" stroke="#e5e2d8" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="25" y1="190" x2="475" y2="190" stroke="#e5e2d8" strokeWidth="0.75" />

              {/* Area filled paths */}
              <path d={plantsAreaPath} fill="url(#gradient-plants)" className="transition-all duration-300" />
              <path d={toolsAreaPath} fill="url(#gradient-tools)" className="transition-all duration-300" />

              {/* Stroke line paths */}
              <path
                d={plantsPath}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
              <path
                d={toolsPath}
                fill="none"
                stroke="var(--secondary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2 2"
                className="transition-all duration-300"
              />

              {/* Active Point Hover vertical guide line */}
              {activePoint && (
                <line
                  x1={activePoint.x}
                  y1={10}
                  x2={activePoint.x}
                  y2={190}
                  stroke="var(--primary)"
                  strokeWidth="1.25"
                  strokeDasharray="3 3"
                  className="transition-all duration-150"
                />
              )}

              {/* Render dynamic nodes circles */}
              {currentChartData.map((d, idx) => (
                <g key={idx}>
                  <circle
                    cx={d.x}
                    cy={d.yPlants}
                    r={activePointIndex === idx ? "5.5" : "3.5"}
                    fill="var(--primary)"
                    stroke="white"
                    strokeWidth="1.5"
                    className="transition-all duration-200"
                  />
                  <circle
                    cx={d.x}
                    cy={d.yTools}
                    r={activePointIndex === idx ? "5.5" : "3"}
                    fill="var(--secondary)"
                    stroke="white"
                    strokeWidth="1.5"
                    className="transition-all duration-200"
                  />
                </g>
              ))}

              {/* Invisible trigger columns for active hover states */}
              {currentChartData.map((d, idx) => (
                <rect
                  key={idx}
                  x={d.x - 30}
                  y={0}
                  width={60}
                  height={190}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActivePointIndex(idx)}
                />
              ))}
            </svg>

            {/* Absolute Rendered Premium HTML Tooltip Box */}
            {activePoint && (
              <div 
                className="absolute bg-white/95 backdrop-blur-xs border border-border/80 shadow-lg rounded-2xl p-4 space-y-1.5 pointer-events-none transition-all duration-200 z-10 w-44"
                style={{
                  left: `${(activePoint.x / 500) * 100}%`,
                  transform: 'translate(-50%, -100%)',
                  top: `${(activePoint.yPlants / 200) * 100}%`,
                }}
              >
                <div className="font-bold text-[9px] text-neutral-400 uppercase tracking-widest flex items-center gap-1 border-b border-border/40 pb-1">
                  <Calendar size={10} className="text-primary" />
                  <span>{activePoint.month} Summary</span>
                </div>
                <div className="space-y-1 text-xs font-sans">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-neutral-500 font-light">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>Plants:</span>
                    </span>
                    <span className="font-bold text-neutral-800">₹{activePoint.plants.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-neutral-500 font-light">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      <span>Tools:</span>
                    </span>
                    <span className="font-bold text-neutral-800">₹{activePoint.tools.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-border/40 pt-1.5 mt-1.5 flex justify-between items-center font-bold text-primary font-sans">
                    <span>Total:</span>
                    <span>₹{(activePoint.plants + activePoint.tools).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* X axis labels */}
          <div className="flex justify-between text-[10px] text-neutral-400 font-bold tracking-wider px-2 pt-4 border-t border-border/40">
            {currentChartData.map((d, idx) => (
              <span 
                key={idx} 
                className={`transition-colors duration-200 cursor-pointer ${
                  activePointIndex === idx ? 'text-primary font-bold' : 'text-neutral-400'
                }`}
                onMouseEnter={() => setActivePointIndex(idx)}
              >
                {d.month}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Inventory Stock Alert */}
        <div className="bg-card border border-border/80 p-6 rounded-[32px] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-border/40 pb-4">
              <h3 className="font-sans font-bold text-lg text-neutral-dark tracking-tight">
                Stock Status Check
              </h3>
              <p className="text-[10px] text-muted-foreground font-light mt-0.5">
                Specimens currently needing manual stock allocation.
              </p>
            </div>

            <div className="space-y-3.5">
              {lowStockItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-border/30 pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-border relative flex-shrink-0 bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-neutral-800 block line-clamp-1">{item.name}</span>
                      <span className="text-[10px] text-neutral-400 font-light block">Remaining: {item.stock} items</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                    item.status === 'Critical' 
                      ? 'text-amber-700 bg-amber-50 border-amber-200' 
                      : item.status === 'Out of Stock' 
                      ? 'text-red-700 bg-red-50 border-red-200'
                      : 'text-neutral-600 bg-neutral-100 border-neutral-200'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link href="/dashboard/inventory" className="mt-5">
            <span className="w-full py-2.5 text-center text-xs font-semibold text-primary hover:text-white bg-primary/5 hover:bg-primary border border-primary/20 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5">
              <Boxes size={13} />
              <span>Go to Inventory Management</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Orders List & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table Widget */}
        <div className="lg:col-span-2 bg-card border border-border/80 p-6 rounded-[32px] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="font-sans font-bold text-lg text-neutral-dark tracking-tight">
                  Recent Orders Log
                </h3>
                <p className="text-[10px] text-muted-foreground font-light mt-0.5">
                  Latest customer purchases awaiting delivery confirmation.
                </p>
              </div>
              <Link href="/dashboard/orders">
                <span className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer">
                  <span>View All</span>
                  <ChevronRight size={13} />
                </span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground border-b border-border/60">
                    <th className="py-2 pb-3 font-semibold">Order</th>
                    <th className="py-2 pb-3 font-semibold">Customer</th>
                    <th className="py-2 pb-3 font-semibold">Date</th>
                    <th className="py-2 pb-3 font-semibold">Amount</th>
                    <th className="py-2 pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-muted/10">
                      <td className="py-3 font-bold text-primary">{order.id}</td>
                      <td className="py-3 font-medium text-neutral-800">{order.name}</td>
                      <td className="py-3 font-light text-neutral-400">{order.date}</td>
                      <td className="py-3 font-bold text-neutral-800">{order.amount}</td>
                      <td className="py-3 text-right">
                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Activity Feed Widget */}
        <div className="bg-card border border-border/80 p-6 rounded-[32px] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-border/40 pb-4">
              <h3 className="font-sans font-bold text-lg text-neutral-dark tracking-tight">
                Nursery Activity Feed
              </h3>
              <p className="text-[10px] text-muted-foreground font-light mt-0.5">
                Real-time admin activity log from the nursery floor.
              </p>
            </div>

            <div className="relative border-l border-border pl-4 space-y-5 py-1">
              <div className="relative text-xs space-y-1">
                <span className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-secondary border-2 border-white mt-0.5" />
                <span className="font-semibold text-neutral-800">Order #4092 paid</span>
                <span className="text-neutral-500 font-light block leading-normal">Customer Ananya Mitra checked out 1x Monstera.</span>
                <span className="text-[10px] text-neutral-400 font-light block flex items-center gap-1">
                  <Clock size={10} />
                  <span>5 minutes ago</span>
                </span>
              </div>
              <div className="relative text-xs space-y-1">
                <span className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-primary border-2 border-white mt-0.5" />
                <span className="font-semibold text-neutral-800">Product List Sync</span>
                <span className="text-neutral-500 font-light block leading-normal">Liquid Bio-Organic Fertilizer specs updated.</span>
                <span className="text-[10px] text-neutral-400 font-light block flex items-center gap-1">
                  <Clock size={10} />
                  <span>1 hour ago</span>
                </span>
              </div>
              <div className="relative text-xs space-y-1">
                <span className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-accent border-2 border-white mt-0.5" />
                <span className="font-semibold text-neutral-800">Low Stock Alert</span>
                <span className="text-neutral-500 font-light block leading-normal">Monstera Deliciosa hit inventory safety limit (2).</span>
                <span className="text-[10px] text-neutral-400 font-light block flex items-center gap-1">
                  <Clock size={10} />
                  <span>2 hours ago</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
