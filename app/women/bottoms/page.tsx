"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

export default function WomenBottomsPage() {
  const [filters, setFilters] = useState({
    category: ["Jeans"],
    size: [],
    color: [],
    priceRange: [0, 500],
    sortBy: "featured",
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <a href="/" className="hover:text-foreground">
            Home
          </a>
          <span>/</span>
          <a href="/women" className="hover:text-foreground">
            Women
          </a>
          <span>/</span>
          <span className="text-foreground">Bottoms</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Women's Bottoms</h1>
            <p className="text-muted-foreground">Comfortable and chic bottoms</p>
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
