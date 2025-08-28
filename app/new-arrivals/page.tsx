"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, Sparkles, TrendingUp } from "lucide-react"
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
      <section className="relative h-80 bg-gradient-to-r from-purple-900 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-8 w-8" />
              <Badge className="bg-purple-500 text-white text-lg px-4 py-2">NEW</Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">New Arrivals</h1>
            <p className="text-xl opacity-90 mb-6">Fresh styles just dropped - be the first to wear them</p>
            <div className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              <span>Updated weekly with the latest trends</span>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-foreground">
            Home
          </a>
          <span>/</span>
          <span className="text-foreground">New Arrivals</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Latest Drops</h2>
            <p className="text-muted-foreground">Discover the newest additions to our collection</p>
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
