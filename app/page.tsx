import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { CategorySection } from "@/components/category-section"
import { InstagramFeed } from "@/components/instagram-feed"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedProducts />
        <InstagramFeed />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
