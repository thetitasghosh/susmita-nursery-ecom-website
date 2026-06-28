"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Heart,
  ShoppingCart,
  RotateCcw,
  Play,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ArrowUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { allProducts, Product } from "@/lib/products";
import { useShop } from "@/lib/shop-context";

export default function ARExperiencePage() {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(0);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("modern_loft");
  const [scale, setScale] = useState(0.2);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "expert"; text: string }>
  >([
    {
      sender: "expert",
      text: "Hello! I'm Susmita's senior horticulturist. Unsure which plant suits your humidity and lighting? Ask me anything!",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const activePlant = allProducts[selectedPlantIndex] || allProducts[0];
  const wishlisted = isWishlisted(activePlant.id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const visualizerSectionRef = useRef<HTMLDivElement>(null);

  const rooms = [
    {
      id: "modern_loft",
      name: "Modern Loft",
      image: "/images/rooms/modern_loft_room.jpg",
    },
    {
      id: "cozy_study",
      name: "Study Desk",
      image: "/images/rooms/cozy_study_desk.jpg",
    },
    {
      id: "garden_patio",
      name: "Garden Patio",
      image: "/images/rooms/garden_patio_terrace.jpg",
    },
  ];

  // Dynamically load Google's model-viewer script on mount
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  // Webcam stream effect
  useEffect(() => {
    async function startCamera() {
      if (isCameraOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        } catch (err) {
          console.error("Camera access denied or unsupported device:", err);
          setIsCameraOn(false);
        }
      } else {
        stopCamera();
      }
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isCameraOn]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleReset = () => {
    setScale(1.0);
    setIsAutoRotating(false);
    setResetKey((prev) => prev + 1);
  };

  const handleAddToCart = (plant: Product) => {
    addToCart(plant, 1, plant.sizes[0] || "Standard");
  };

  const scrollToVisualizer = () => {
    setIsCameraOn(true);
    visualizerSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const userMsg = newMessage;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setNewMessage("");

    // Simple mock response
    setTimeout(() => {
      let reply =
        "That's a great choice! For that environment, we highly recommend plants like the Areca Palm or Snake Plant which are very resilient.";
      if (userMsg.toLowerCase().includes("pet")) {
        reply =
          "If you have pets, the Areca Palm or Monstera (under supervision) are beautiful. The Areca Palm is 100% non-toxic and pet-safe!";
      } else if (
        userMsg.toLowerCase().includes("dark") ||
        userMsg.toLowerCase().includes("low light")
      ) {
        reply =
          "For low light settings, Aglaonema Red or the Snake Plant will thrive beautifully with minimal indirect sun.";
      }
      setChatMessages((prev) => [...prev, { sender: "expert", text: reply }]);
    }, 1000);
  };

  // Filter 6 popular varieties for AR Upsell Trigger
  const upsellPlants = allProducts.filter((p) =>
    [1, 13, 14, 2, 16, 3].includes(p.id),
  );

  // Raw GLB URL for testing AR (Khronos Diffuse Transmission Plant Asset)
  const testGLBUrl = "/images/plants/pothos_plant.glb";

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1">
        {/* Core Value Proposition Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-b from-primary/10 via-transparent to-transparent border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto space-y-4"
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-semibold uppercase tracking-wider font-sans">
                <Sparkles size={12} className="text-secondary" />
                <span>Augmented Reality simulator</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-foreground leading-tight">
                See Plants In Your Space
                <br />
                Before You Buy.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto font-sans">
                Bring nature home with confidence. Use our interactive web AR
                experience to see how plants look, fit, and scale in your space
                in real time.
              </p>
            </motion.div>

            {/* Hero Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex md:flex-row justify-center flex-col gap-4"
            >
              <Button
                onClick={scrollToVisualizer}
                size="lg"
                className="bg-primary hover:bg-primary-emerald text-white font-semibold rounded-full px-8 cursor-pointer shadow-md"
              >
                <Camera className="w-4 h-4 mr-2" />
                Start AR Experience
              </Button>
              <Button
                onClick={() => setVideoModalOpen(true)}
                size="lg"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5 rounded-full px-8 cursor-pointer"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Watch How It Works
              </Button>
            </motion.div>
          </div>
        </section>

        {/* AR Visualizer Simulator Section */}
        <section
          ref={visualizerSectionRef}
          className="py-16 md:py-24 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Visualizer Viewport */}
              <div className="lg:col-span-7 space-y-6">
                <div className="relative h-[400px] sm:h-[550px] rounded-[36px] overflow-hidden border border-border bg-neutral-950 shadow-2xl z-10 group">
                  {/* Video feed */}
                  {isCameraOn && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  )}

                  {/* Static backdrop if camera is off */}
                  {!isCameraOn && (
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={
                          rooms.find((r) => r.id === selectedRoom)?.image ||
                          rooms[0].image
                        }
                        alt="Room backdrop template"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}

                  {/* 3D Model Overlay */}
                  <div className="absolute inset-0 z-10">
                    {React.createElement("model-viewer", {
                      key: resetKey,
                      src: testGLBUrl,
                      ar: true,
                      "ar-modes": "webxr scene-viewer quick-look",
                      "camera-controls": true,
                      "auto-rotate": isAutoRotating,
                      "shadow-intensity": "1",
                      scale: `${scale} ${scale} ${scale}`,
                      alt: "3D Plant model overlay",
                      style: {
                        width: "100%",
                        height: "100%",
                        backgroundColor: "transparent",
                      },
                    })}
                  </div>

                  {/* Custom badges and controls */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-neutral-950/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-sm z-20">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${isCameraOn ? "bg-secondary animate-pulse" : "bg-accent"}`}
                    />
                    <span>
                      {isCameraOn
                        ? "Webcam Fitting Active"
                        : "Room Backdrop Mode"}
                    </span>
                  </div>

                  <button
                    onClick={handleReset}
                    className="absolute bottom-4 right-4 p-3 bg-white/95 hover:bg-white text-neutral-800 rounded-full shadow-lg z-20 transition-all cursor-pointer border border-border"
                    title="Reset model angle & scale"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>

                {/* Webcam & Room Selectors */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border border-border p-6 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button
                      onClick={() => setIsCameraOn(!isCameraOn)}
                      className={`w-full sm:w-auto rounded-full px-6 font-semibold cursor-pointer py-5 ${
                        isCameraOn
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-primary hover:bg-primary-emerald"
                      }`}
                    >
                      <Camera size={16} className="mr-2" />
                      {isCameraOn
                        ? "Switch to Room backdrop"
                        : "Open Live Webcam"}
                    </Button>
                  </div>

                  {!isCameraOn && (
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0 overflow-x-auto pb-1 sm:pb-0">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                        Templates:
                      </span>
                      <div className="flex gap-1.5">
                        {rooms.map((room) => (
                          <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room.id)}
                            className={`px-4 py-2 text-[10px] rounded-full border cursor-pointer font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                              selectedRoom === room.id
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-background hover:bg-muted border-border text-neutral-500"
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

              {/* Right Column: Visualizer Controls & Value Drivers */}
              <div className="lg:col-span-5 space-y-6">
                {/* Visualizer Adjustments */}
                <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-serif font-bold text-foreground text-lg border-b border-border/50 pb-2">
                    Visualizer Adjustments
                  </h3>

                  {/* Scale slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      <span>3D Model Scale</span>
                      <span className="text-primary font-bold">
                        {(scale * 100).toFixed(0)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.8"
                      step="0.05"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  {/* Auto rotate toggle */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      Auto Rotate
                    </span>
                    <button
                      onClick={() => setIsAutoRotating(!isAutoRotating)}
                      className={`px-4 py-1.5 text-[10px] font-bold rounded-full border transition-all cursor-pointer ${
                        isAutoRotating
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-background text-neutral-500 border-border"
                      }`}
                    >
                      {isAutoRotating ? "ENABLED" : "DISABLED"}
                    </button>
                  </div>
                </div>

                {/* Selected Plant Cart CTA panel */}
                <div className="bg-primary/5 border border-primary/10 p-6 rounded-3xl space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-border flex-shrink-0 bg-white">
                      <Image
                        src={activePlant.image}
                        alt={activePlant.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-sans font-bold text-primary tracking-widest uppercase block">
                        {activePlant.category}
                      </span>
                      <h4 className="font-serif font-bold text-foreground text-lg leading-tight">
                        {activePlant.name}
                      </h4>
                      {activePlant.scientificName && (
                        <p className="text-[10px] text-muted-foreground italic font-serif leading-none mt-0.5">
                          {activePlant.scientificName}
                        </p>
                      )}
                      <p className="text-sm font-serif font-bold text-primary mt-1">
                        ₹{activePlant.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Satisfied with how the {activePlant.name} projects in your
                    room? Add this specimen directly to your cart or save it for
                    later.
                  </p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(activePlant)}
                      className="flex-1 bg-primary-emerald hover:bg-primary text-white font-semibold rounded-full cursor-pointer shadow-sm"
                    >
                      <ShoppingCart size={14} className="mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toggleWishlist(activePlant.id)}
                      className={`w-12 rounded-full border border-border flex items-center justify-center cursor-pointer transition-colors ${
                        wishlisted
                          ? "bg-primary/10 border-primary text-primary hover:bg-primary/20"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <Heart
                        size={16}
                        fill={wishlisted ? "currentColor" : "none"}
                      />
                    </Button>
                  </div>
                </div>

                {/* Value Drivers Box */}
                <div className="bg-accent/5 border border-accent/25 p-6 rounded-3xl space-y-4">
                  <h4 className="font-serif font-bold text-foreground text-base border-b border-accent/20 pb-2">
                    Why You&apos;ll Love It
                  </h4>
                  <ul className="space-y-3 text-xs text-neutral-600 font-light font-sans">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={14}
                        className="text-primary mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <strong className="font-semibold text-foreground">
                          Realistic Preview
                        </strong>{" "}
                        — Inspect high-fidelity leaves and textures in real
                        sizes.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={14}
                        className="text-primary mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <strong className="font-semibold text-foreground">
                          Perfect Fit
                        </strong>{" "}
                        — Validate vertical heights and widths in your rooms
                        before shipping.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={14}
                        className="text-primary mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <strong className="font-semibold text-foreground">
                          Any Space Usable
                        </strong>{" "}
                        — Works in living rooms, study desks, patio spaces, and
                        balconies.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={14}
                        className="text-primary mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <strong className="font-semibold text-foreground">
                          Better Decisions
                        </strong>{" "}
                        — No more guessing if a plant fits or suits the
                        aesthetics.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Functional Instruction Component (How It Works) */}
        <section className="py-20 bg-white border-t border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div className="space-y-3">
              <span className="text-[10px] font-sans font-bold tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase w-max mx-auto block">
                Guide
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                How It Works
              </h2>
              <div className="h-1 w-12 bg-accent mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                {
                  step: "1",
                  title: "Open Camera",
                  desc: 'Tap on "Start AR Experience" to open your webcam or phone camera.',
                },
                {
                  step: "2",
                  title: "Scan Your Space",
                  desc: "Move your camera around slightly to detect flat floor surfaces.",
                },
                {
                  step: "3",
                  title: "Choose a Plant",
                  desc: "Select any plant variety from our dynamic spec grid below.",
                },
                {
                  step: "4",
                  title: "View in AR",
                  desc: "See the plant model projected in its real size and shape.",
                },
                {
                  step: "5",
                  title: "Make It Yours",
                  desc: 'Love the styling? Click "Add to Cart" to bring it home!',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="space-y-4 flex flex-col items-center p-4"
                >
                  <div className="w-12 h-12 bg-primary/10 border border-primary/25 rounded-full flex items-center justify-center font-serif font-bold text-primary text-xl shadow-inner">
                    {item.step}
                  </div>
                  <h4 className="font-serif font-bold text-base text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-[200px]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upsell Trigger Grid */}
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-sans font-bold tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full uppercase w-max mx-auto block">
                Projection Catalog
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
                Popular Varieties Ready for AR
              </h2>
              <div className="h-1 w-12 bg-accent mx-auto rounded-full" />
              <p className="text-sm text-muted-foreground font-light max-w-md mx-auto">
                Tap on any popular houseplant below to immediately project it in
                the simulator box above.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
              {upsellPlants.map((plant) => {
                const isSelected =
                  allProducts[selectedPlantIndex]?.id === plant.id;
                return (
                  <motion.div
                    key={plant.id}
                    whileHover={{ y: -4 }}
                    onClick={() => {
                      const actualIdx = allProducts.findIndex(
                        (p) => p.id === plant.id,
                      );
                      if (actualIdx > -1) {
                        setSelectedPlantIndex(actualIdx);
                        handleReset();
                        // Scroll up to visualizer
                        visualizerSectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }
                    }}
                    className={`relative rounded-3xl overflow-hidden border cursor-pointer bg-card transition-all duration-300 flex flex-col justify-between p-4 ${
                      isSelected
                        ? "border-primary shadow-md ring-2 ring-primary/20"
                        : "border-border hover:border-primary/30 shadow-sm"
                    }`}
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 bg-muted">
                        <Image
                          src={plant.image}
                          alt={plant.name}
                          fill
                          className="object-cover"
                        />
                        {/* AR Badge */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-neutral-950/70 backdrop-blur-md rounded text-[7px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                          <Camera size={8} className="text-accent" />
                          <span>AR Projection</span>
                        </div>
                      </div>

                      <span className="text-[8px] font-sans font-bold text-primary uppercase tracking-widest">
                        {plant.category}
                      </span>
                      <h4 className="font-serif font-bold text-foreground text-sm line-clamp-1 mt-0.5">
                        {plant.name}
                      </h4>
                      {plant.scientificName && (
                        <p className="text-[9px] text-muted-foreground italic font-serif leading-none mt-0.5">
                          {plant.scientificName}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-border/40">
                      <span className="font-serif font-bold text-primary text-xs tabular-nums">
                        ₹{plant.price}
                      </span>
                      <button
                        className={`p-1.5 rounded-full cursor-pointer transition-colors ${isSelected ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-primary hover:text-white"}`}
                      >
                        <ArrowUp size={10} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Expert Consulting Intercept */}
        <section className="py-16 md:py-20 bg-primary-deep text-white border-t border-b border-white/5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[36px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                {/* Expert Headshot avatar */}
                <div className="relative w-20 h-20 rounded-full border-2 border-accent overflow-hidden bg-muted-foreground/30 flex-shrink-0 shadow-lg">
                  <div className="w-full h-full flex items-center justify-center bg-primary font-serif font-bold text-2xl text-white">
                    SM
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-accent/80 text-[7px] font-bold text-neutral-900 text-center uppercase py-0.5 tracking-wider font-sans">
                    ONLINE
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[8px] font-sans font-bold tracking-widest text-accent uppercase block">
                    Free Consultancy
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl">
                    Not sure which plant to choose?
                  </h3>
                  <p className="text-xs text-neutral-300 font-light max-w-sm leading-relaxed">
                    Our Nadia greenhouse specialists are online to verify your
                    spatial light, humidity, and pet-friendly concerns.
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Button
                  onClick={() => setChatOpen(true)}
                  className="bg-accent hover:bg-accent/90 text-neutral-950 font-bold uppercase tracking-wider text-xs rounded-full px-8 py-6 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageSquare size={14} />
                  <span>Chat with Plant Expert</span>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Video Modal component */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card w-full max-w-3xl rounded-[32px] overflow-hidden border border-border shadow-2xl p-6 sm:p-8 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="font-serif font-bold text-lg text-foreground flex items-center gap-2">
                  <Play className="w-4 h-4 text-primary fill-current" />
                  <span>How AR Botanical Fitting Works</span>
                </h3>
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="p-1 hover:bg-muted rounded-full cursor-pointer text-foreground font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Visualized simulation details */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden border bg-black relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 flex flex-col justify-end p-6 text-white text-left">
                  <p className="font-serif font-bold text-lg mb-1">
                    Fitting a Monstera in AR
                  </p>
                  <p className="text-xs text-neutral-300 font-light">
                    Follow the 3D projection dots to verify spatial placement.
                  </p>
                </div>
                <div className="relative z-0 w-full h-full flex items-center justify-center">
                  <video
                    src="https://assets.mixkit.co/videos/preview/mixkit-watering-potted-plants-with-a-can-44331-large.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 cursor-pointer shadow-lg hover:scale-105 transition-transform z-20">
                    <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setVideoModalOpen(false)}
                  className="rounded-full bg-primary"
                >
                  Got It, Let&apos;s Fit!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Expert Modal */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 w-96 bg-card border border-border rounded-[28px] shadow-2xl z-[999] flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-primary-deep p-4 flex items-center justify-between text-white border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary font-serif font-bold text-xs flex items-center justify-center border border-accent">
                  SM
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-xs leading-none">
                    Susmita Expert
                  </h4>
                  <span className="text-[7px] text-secondary font-sans font-bold tracking-widest uppercase">
                    Online Now
                  </span>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white hover:opacity-75 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[300px] bg-background flex flex-col">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed font-light ${
                    msg.sender === "expert"
                      ? "bg-white text-foreground self-start border border-border/80 rounded-tl-none"
                      : "bg-primary text-white self-end rounded-tr-none"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-border bg-card flex gap-2">
              <input
                type="text"
                placeholder="Ask about lighting, pets..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary font-sans bg-background"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl cursor-pointer hover:bg-primary/95"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
