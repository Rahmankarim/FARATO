"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductFilters } from "@/components/product-filters"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function PantsTrousersPage() {
  const [filters, setFilters] = useState({
    category: ["Pants", "Trousers"],
    size: [],
    color: [],
    priceRange: [0, 500],
    sortBy: "featured",
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pants & Trousers</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comfortable and versatile bottoms for work, play, and everything in between.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-foreground">
            Home
          </a>
          <span>/</span>
          <span className="text-foreground">Pants & Trousers</span>
        </nav>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Mobile Filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden mb-6 bg-transparent">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </SheetContent>
          </Sheet>

          {/* Products */}
          <div className="flex-1">
            <ProductGrid filters={filters} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
