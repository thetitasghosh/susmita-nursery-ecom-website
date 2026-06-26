import Link from 'next/link'
import { MapPin, Phone, Mail, Award, Sprout, ShieldCheck, Truck, Trees, HeartHandshake, Calendar } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const trustIndicators = [
    {
      icon: <Award className="w-8 h-8 text-accent" />,
      title: '40+ Years of Experience',
      desc: 'Generations of horticultural expertise.',
    },
    {
      icon: <Sprout className="w-8 h-8 text-accent" />,
      title: '500+ Varieties of Plants',
      desc: 'Healthy plants grown with care for stronger life.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-accent" />,
      title: 'Expert Advice',
      desc: 'Guidance you can trust for every plant.',
    },
    {
      icon: <Truck className="w-8 h-8 text-accent" />,
      title: 'Safe & Fast Delivery',
      desc: 'Secure packaging and timely arrival.',
    },
    {
      icon: <Trees className="w-8 h-8 text-accent" />,
      title: 'Landscape Services',
      desc: 'Custom green spaces for every need.',
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-accent" />,
      title: 'After Sales Support',
      desc: 'Always here for you, whenever you need.',
    },
  ]

  return (
    <footer className="bg-primary-emerald text-white border-t border-primary/20">
      
      {/* Universal Footer Ribbon (Trust Indicators) */}
      <div className="bg-primary-deep py-12 border-b border-primary-deepest/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {trustIndicators.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300">
                <div className="mb-3 p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                  {item.icon}
                </div>
                <h4 className="font-serif font-semibold text-sm mb-1 text-accent">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-300 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white text-primary-emerald rounded-xl flex items-center justify-center shadow-lg font-serif font-bold text-xl">
                S
              </div>
              <span className="font-serif font-bold text-xl tracking-wide">Susmita Nursery</span>
            </div>
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              &quot;Bring Nature Home.&quot; A premium plant and garden brand dedicated to bringing nature closer to homes and creating beautiful, sustainable green spaces.
            </p>
            <div className="text-xs text-accent font-medium italic">
              &quot;Growing Beauty Every Day&quot;
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-sm uppercase tracking-widest text-accent mb-5">
              Explore Plants
            </h3>
            <ul className="space-y-3 text-xs text-neutral-300 font-light">
              <li>
                <Link href="/products?category=Indoor Plants" className="hover:text-white transition-colors">
                  Indoor Plants
                </Link>
              </li>
              <li>
                <Link href="/products?category=Outdoor Plants" className="hover:text-white transition-colors">
                  Outdoor Plants
                </Link>
              </li>
              <li>
                <Link href="/products?category=Flowering Plants" className="hover:text-white transition-colors">
                  Flowering Plants
                </Link>
              </li>
              <li>
                <Link href="/products?category=Succulents" className="hover:text-white transition-colors">
                  Succulents & Cactus
                </Link>
              </li>
              <li>
                <Link href="/products?category=Bonsai" className="hover:text-white transition-colors">
                  Bonsai Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Nursery Info & Timings */}
          <div>
            <h3 className="font-serif font-semibold text-sm uppercase tracking-widest text-accent mb-5">
              Nursery Details
            </h3>
            <ul className="space-y-3.5 text-xs text-neutral-300 font-light">
              <li className="flex items-start gap-2.5">
                <Calendar size={14} className="mt-0.5 text-accent flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Timings</p>
                  <p>9:00 AM – 7:00 PM All Days</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 text-accent flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Location Coordinates</p>
                  <p className="leading-tight">123 Green Valley, Botanical Road, Your City, State – 123456</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="font-serif font-semibold text-sm uppercase tracking-widest text-accent mb-5">
              Contact Expert
            </h3>
            <ul className="space-y-3.5 text-xs text-neutral-300 font-light">
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-accent" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-accent" />
                <span>hello@susmitanursery.com</span>
              </li>
              <li className="pt-2">
                <Link href="/contact?booking=true" className="inline-flex items-center justify-center px-4 py-2 bg-accent hover:bg-accent/90 text-neutral-900 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors shadow-sm">
                  Book Consultation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="border-t border-white/10 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400 font-light">
          <p>
            &copy; {currentYear} Susmita Nursery. All rights reserved. Generational Horticulture in Nadia, West Bengal.
          </p>
          <div className="flex gap-4">
            <Link href="/promo" className="hover:text-white transition-colors">
              Launch Announcement
            </Link>
            <span>•</span>
            <Link href="/ar-experience" className="hover:text-white transition-colors">
              Interactive AR Simulator
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
