"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export default function NewArrivalsPage() {
  const [filters, setFilters] = useState({
    category: [],
    size: [],
    color: [],
    priceRange: [0, 500],
    sortBy: "newest",
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-emerald-900 to-teal-700 text-white">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6" />
              <Badge className="bg-emerald-500 text-white">NEW</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">New Arrivals</h1>
            <p className="text-xl opacity-90">Fresh styles just landed</p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-foreground">
            Home
          </a>
          <span>/</span>
          <a href="/collections" className="hover:text-foreground">
            Collections
          </a>
          <span>/</span>
          <span className="text-foreground">New Arrivals</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Latest Products</h2>
            <p className="text-muted-foreground">Be the first to wear the newest trends</p>
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
