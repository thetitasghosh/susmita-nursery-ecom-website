'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 4000)
  }

  const contactInfo = [
    {
      image: '/images/plants/peace-lily.jpg',
      title: 'Our Head Office',
      details: 'Susmita Nursery Gardens, Green Park Lane, Kolkata, WB, 700091',
    },
    {
      image: '/images/plants/pothos-hanging.jpg',
      title: 'Horticulture Helpline',
      details: '+91 33 2465 9876 / +91 98300 12345',
    },
    {
      image: '/images/plants/lavender-plant.jpg',
      title: 'Electronic Mail',
      details: 'care@susmitanursery.com (Support) | wholesale@susmitanursery.com (Business)',
    },
    {
      image: '/images/plants/succulent-collection.jpg',
      title: 'Visiting Hours',
      details: 'Monday - Sunday: 8:00 AM - 7:00 PM (IST)',
    },
  ]

  const greenhouseLocations = [
    {
      branch: 'Main Retail Greenhouses',
      address: 'Green Park Road, EM Bypass Connector, Kolkata, WB, 700091',
      phone: '+91 98300 12345',
      desc: 'Our flagship nursery displaying over 400 species of indoor/outdoor plants, potting soils, and custom fiber planters.',
      image: '/images/plants/monstera-plant.jpg',
    },
    {
      branch: 'Botanical Farm & Propagator',
      address: 'Kalyani Highway Junction, Madanpur, Nadia, WB, 741245',
      phone: '+91 98300 67890',
      desc: 'Our 10-acre propagation facility where our rare specimens, succulents, and specialty hybrid orchids are raised by botanists.',
      image: '/images/plants/bonsai-tree.jpg',
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-background">
        {/* Page Hero Header */}
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-[#daf5e3]/30 via-transparent to-transparent border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0d592f] mb-4">
                Let&apos;s Grow Together
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">
                Whether you need help selecting the perfect air-purifying plant, custom landscaping consultation, or bulk corporate gifting orders, our horticulture experts are here to help.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Dynamic Split-Screen Layout */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Contact Details */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Contact Information
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Reach out via phone, email, or stop by our main gardens. We respond to all electronic queries within 24 hours.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    return (
                      <div key={index} className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-[#0d592f]/20 flex-shrink-0 relative shadow-sm">
                          <Image
                            src={info.image}
                            alt={info.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-foreground">
                            {info.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed font-light">
                            {info.details}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Right Column: Form Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm hover:border-[#0d592f]/35 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Send a Message
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Fill out the form below and a representative will get back to you shortly.
                </p>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-accent/10 border border-accent/25 text-[#0d592f] rounded-xl text-sm font-semibold flex items-center gap-2"
                  >
                    <span>✓</span>
                    <span>Thank you! Your inquiry has been sent successfully. Our team will contact you shortly.</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-wide">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 text-foreground transition-all placeholder:text-neutral-400 text-sm"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-wide">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 text-foreground transition-all placeholder:text-neutral-400 text-sm"
                        placeholder="e.g. rahul@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-wide">
                      Inquiry Topic
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 text-foreground transition-all text-sm"
                    >
                      <option value="">Select general category</option>
                      <option value="care">Plant Care & Advice</option>
                      <option value="order">Order Tracking & Returns</option>
                      <option value="wholesale">Wholesale & Trade Inquiries</option>
                      <option value="landscape">Garden Landscaping Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-wide">
                      Detailed Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/45 text-foreground transition-all resize-none text-sm placeholder:text-neutral-400"
                      placeholder="Write your query here..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#023512] hover:bg-[#023512]/90 text-white font-bold py-3 rounded-xl transition-all shadow-md transform active:translate-y-px cursor-pointer"
                  >
                    Submit Inquiry
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Real Branch Greenhouses Section */}
        <section className="py-16 md:py-24 border-t border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0d592f] mb-3">
                Our Greenhouse Locations
              </h2>
              <div className="h-1 w-12 bg-accent mx-auto rounded-full mb-3" />
              <p className="text-sm text-muted-foreground max-w-sm mx-auto font-light">
                Visit our nurseries to experience our stock of plants firsthand or consult with our growers.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {greenhouseLocations.map((loc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-3xl bg-background border border-border/80 shadow-sm flex flex-col md:flex-row overflow-hidden hover:border-[#0d592f]/30 transition-all duration-300 min-h-[220px]"
                >
                  {/* Branch Image */}
                  <div className="relative w-full md:w-2/5 h-48 md:h-auto min-h-[160px] flex-shrink-0">
                    <Image
                      src={loc.image}
                      alt={loc.branch}
                      fill
                      sizes="(max-w-768px) 100vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Branch Text Details */}
                  <div className="p-6 md:p-8 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-[#0d592f] font-bold text-lg font-serif">{loc.branch}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-light">
                        {loc.desc}
                      </p>
                    </div>
                    
                    <div className="space-y-1.5 border-t border-border/50 pt-4 text-xs font-medium text-neutral-600">
                      <p className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#023512] font-semibold flex-shrink-0">Address:</span>
                        <span className="text-neutral-500 font-light">{loc.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-[#023512] font-semibold flex-shrink-0">Phone:</span>
                        <span className="text-neutral-500 font-light">{loc.phone}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
