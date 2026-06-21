'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Camera, Smartphone, Heart, ShoppingCart, RefreshCw, Layers, Box, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { allProducts } from '@/lib/products'
import { useShop } from '@/lib/shop-context'



export default function ARExperiencePage() {
  const { addToCart, toggleWishlist, isWishlisted } = useShop()
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(0)
  
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState('modern_loft')
  const [scale, setScale] = useState(1.0)
  const [isAutoRotating, setIsAutoRotating] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const activePlant = allProducts[selectedPlantIndex] || allProducts[0]
  const wishlisted = isWishlisted(activePlant.id)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const rooms = [
    {
      id: 'modern_loft',
      name: 'Modern Loft',
      image: '/images/rooms/modern_loft_room.jpg',
    },
    {
      id: 'cozy_study',
      name: 'Study Desk',
      image: '/images/rooms/cozy_study_desk.jpg',
    },
    {
      id: 'garden_patio',
      name: 'Garden Patio',
      image: '/images/rooms/garden_patio_terrace.jpg',
    },
  ]

  // Dynamically load Google's model-viewer script on mount
  useEffect(() => {
    import('@google/model-viewer')
  }, [])

  // Webcam stream effect
  useEffect(() => {
    async function startCamera() {
      if (isCameraOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false,
          })
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            streamRef.current = stream
          }
        } catch (err) {
          console.error('Camera access denied or unsupported device:', err)
          setIsCameraOn(false)
        }
      } else {
        stopCamera()
      }
    }

    startCamera()

    return () => {
      stopCamera()
    }
  }, [isCameraOn])

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const handleReset = () => {
    setScale(1.0)
    setIsAutoRotating(false)
    setResetKey(prev => prev + 1) // forces re-render of model-viewer to reset its camera angle
  }

  const handleAddToCart = () => {
    addToCart(activePlant, 1, activePlant.sizes[0] || 'Standard')
  }

  // Raw GLB URL for testing AR (Khronos Diffuse Transmission Plant Asset)
  const testGLBUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DiffuseTransmissionPlant/glTF-Binary/DiffuseTransmissionPlant.glb'

  return (
    <main className="min-h-screen flex flex-col bg-background">
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
              <div className="inline-block mb-3 px-3 py-1 bg-accent/20 backdrop-blur-sm border border-accent/30 text-accent rounded-full text-xs font-semibold uppercase tracking-wider">
                ✨ Live Camera 3D Fitting
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0d592f] mb-4">
                Augmented Botanical Fitting
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">
                Turn on your webcam or select a room template. We project a transparent, interactive 3D model of the plant directly onto your camera background so you can check fits in real-time.
              </p>
            </motion.div>
          </div>
        </section>

        {/* AR Simulator Area */}
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Visualizer Viewport */}
              <div className="lg:col-span-7 space-y-6">
                <div
                  ref={canvasRef}
                  className="relative h-[400px] sm:h-[520px] rounded-3xl overflow-hidden border border-border bg-black shadow-lg z-10"
                >
                  {/* Background Layer 1: Live Video Feed */}
                  {isCameraOn && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  )}

                  {/* Background Layer 2: Static Room Backdrop (Visible only if Camera is Off) */}
                  {!isCameraOn && (
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={rooms.find(r => r.id === selectedRoom)?.image || rooms[0].image}
                        alt="Room background template"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}

                  {/* Layer 3: Interactive 3D Model Viewer overlaid transparently */}
                  <div className="absolute inset-0 z-10">
                    {React.createElement('model-viewer', {
                      key: resetKey,
                      src: testGLBUrl,
                      ar: true,
                      'ar-modes': 'webxr scene-viewer quick-look',
                      'camera-controls': true,
                      'auto-rotate': isAutoRotating,
                      'shadow-intensity': '1',
                      scale: `${scale} ${scale} ${scale}`,
                      alt: '3D Plant model overlay',
                      style: { width: '100%', height: '100%', backgroundColor: 'transparent' }
                    })}
                  </div>

                  {/* Camera Status Overlay Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#023512]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm z-20">
                    <span className={`w-2 h-2 rounded-full ${isCameraOn ? 'bg-accent animate-pulse' : 'bg-orange-400'}`} />
                    <span>{isCameraOn ? 'Webcam Background Active' : 'Static Room Template'}</span>
                  </div>

                  {/* Reset overlay settings */}
                  <button
                    onClick={handleReset}
                    className="absolute bottom-4 right-4 p-2.5 bg-white/80 hover:bg-white text-neutral-800 rounded-full shadow-md z-20 transition-all cursor-pointer border border-border"
                    title="Reset model settings"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>

                {/* Webcam and Background Selection toggles */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border border-border p-5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className={`rounded-full px-6 font-semibold cursor-pointer ${
                        isCameraOn ? 'bg-orange-500 hover:bg-orange-600' : 'bg-[#023512] hover:bg-[#023512]/90'
                      }`}
                    >
                      <Camera size={16} className="mr-2" />
                      {isCameraOn ? 'Turn Off Webcam' : 'Use Live Camera'}
                    </Button>
                  </div>

                  {!isCameraOn && (
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                      <Layers size={14} className="text-neutral-400 flex-shrink-0" />
                      <span className="text-xs font-semibold text-foreground mr-1 whitespace-nowrap">Template:</span>
                      <div className="flex gap-1.5 overflow-x-auto w-full">
                        {rooms.map(room => (
                          <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room.id)}
                            className={`px-3 py-1.5 text-[10px] rounded-full border cursor-pointer font-medium uppercase tracking-wider transition-all whitespace-nowrap ${
                              selectedRoom === room.id
                                ? 'bg-[#daf5e3] border-[#0d592f] text-[#0d592f]'
                                : 'bg-background hover:bg-muted border-border text-neutral-500'
                            }`}
                          >
                              {room.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Visualizer Controls & Plant List */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 3D Visualizer Adjustments */}
                <div className="bg-card border border-border/80 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-foreground text-lg border-b border-border/50 pb-2">
                    Visualizer Adjustments
                  </h3>
                  
                  {/* Scale slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-neutral-600">
                      <span>3D MODEL SCALE</span>
                      <span>{(scale * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="2.0"
                      step="0.05"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#0d592f]"
                    />
                  </div>

                  {/* Auto rotate toggle */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-semibold text-neutral-600">AUTO ROTATE MODEL</span>
                    <button
                      onClick={() => setIsAutoRotating(!isAutoRotating)}
                      className={`px-4 py-1.5 text-[10px] font-bold rounded-full border transition-all cursor-pointer ${
                        isAutoRotating
                          ? 'bg-[#daf5e3] border-[#0d592f] text-[#0d592f]'
                          : 'bg-background text-neutral-500 border-border'
                      }`}
                    >
                      {isAutoRotating ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                </div>

                {/* Selected Plant Cart CTA panel */}
                <div className="bg-[#daf5e3]/30 border border-[#0d592f]/20 p-6 rounded-3xl space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border border-[#0d592f]/20 flex-shrink-0 bg-white">
                      <Image
                        src={activePlant.image}
                        alt={activePlant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-accent tracking-wider uppercase block">{activePlant.category}</span>
                      <h4 className="font-serif font-bold text-foreground text-lg leading-tight">{activePlant.name}</h4>
                      <p className="text-sm font-semibold text-[#0d592f] mt-0.5">₹{activePlant.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Satisfied with how the 3D {activePlant.name} fits your room? Add this specimen directly to your cart.
                  </p>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-[#023512] hover:bg-[#023512]/90 text-white font-semibold rounded-full cursor-pointer shadow-sm"
                    >
                      <ShoppingCart size={14} className="mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toggleWishlist(activePlant.id)}
                      className={`w-12 rounded-full border border-border flex items-center justify-center cursor-pointer ${
                        wishlisted ? 'bg-accent/15 border-accent/30 text-accent hover:bg-accent/20' : 'hover:bg-muted'
                      }`}
                    >
                      <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                    </Button>
                  </div>
                </div>

                {/* Plant Selector List */}
                <div className="bg-card border border-border/80 p-5 rounded-3xl shadow-sm">
                  <h3 className="font-serif font-bold text-foreground text-base mb-4">
                    Select Specimen
                  </h3>
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {allProducts.map((plant, idx) => (
                      <button
                        key={plant.id}
                        onClick={() => {
                          setSelectedPlantIndex(idx)
                          handleReset()
                        }}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selectedPlantIndex === idx
                            ? 'border-[#0d592f] bg-[#daf5e3]/30 font-semibold'
                            : 'border-border hover:border-[#0d592f]/40 bg-background hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                            <Image
                              src={plant.image}
                              alt={plant.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-xs text-foreground font-medium">{plant.name}</p>
                            <p className="text-[9px] text-muted-foreground uppercase font-light tracking-wide">{plant.category}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#0d592f]">₹{plant.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
