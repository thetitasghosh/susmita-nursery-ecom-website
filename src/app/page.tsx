import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ARShowcase } from "@/components/home/ar-showcase";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { GallerySection } from "@/components/home/gallery-section";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <ARShowcase />
        <TestimonialsSection />
        <GallerySection />
      </div>
      <Footer />
    </main>
  );
}
