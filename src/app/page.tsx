import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { ValueProposition } from "@/components/home/value-proposition";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ARShowcase } from "@/components/home/ar-showcase";
// import { TestimonialsSection } from "@/components/home/testimonials-section";
import { GallerySection } from "@/components/home/gallery-section";
import { NurseryBanner } from "@/components/home/nursery-banner";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      <div className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <ValueProposition />
        <FeaturedProducts />
        <ARShowcase />
        {/* <TestimonialsSection /> */}
        <GallerySection />
        <NurseryBanner />
      </div>
      <Footer />
    </main>
  );
}
