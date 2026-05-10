import Link from 'next/link'
import { MapPin, Phone, Mail, } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">S</span>
              </div>
              <span className="font-bold text-lg">Susmita Nursery</span>
            </div>
            <p className="text-sm opacity-90">
              Bringing nature closer to your home with premium plants and expert guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:opacity-80 transition-opacity">
                  All Plants
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:opacity-80 transition-opacity">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/ar-experience" className="hover:opacity-80 transition-opacity">
                  AR Experience
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:opacity-80 transition-opacity">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:opacity-80 transition-opacity">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  Care Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>123 Green Street, Garden City, GC 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>hello@susmitanursery.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-80">
              &copy; {currentYear} Susmita Nursery. All rights reserved.
            </p>
            <div className="flex gap-4">
              {/* <a href="#" className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 hover:bg-primary-foreground/20 rounded-lg transition-colors">
                <Twitter size={20} />
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
