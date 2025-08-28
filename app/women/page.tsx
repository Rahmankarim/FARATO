"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export default function WomenPage() {
  const [filters, setFilters] = useState({
    category: ["T-Shirts", "Hoodies", "Jeans", "Jackets"],
    size: [],
    color: [],
    priceRange: [0, 500],
    sortBy: "featured",
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Background Image */}
      <section className="relative h-96 bg-gradient-to-r from-pink-900 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: "url('/womens-streetwear-fashion.png')",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Women's Collection</h1>
            <p className="text-xl opacity-90 mb-8">
              Elegant and edgy designs that empower your individual style and confidence.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Women's Products</h2>
            <p className="text-muted-foreground">Discover our complete women's collection</p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block">
            <ProductFilters filters={filters} onFiltersChange={setFilters} />
          </div>
          <div className="lg:col-span-3">
            <ProductGrid filters={filters} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
