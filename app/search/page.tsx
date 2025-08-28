"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Filter, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSearch } from "@/components/search-provider"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { searchResults, performSearch, isSearching } = useSearch()

  const [filters, setFilters] = useState({
    category: [],
    size: [],
    color: [],
    priceRange: [0, 500],
    sortBy: "relevance",
  })

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query, performSearch])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-3xl font-bold">Search Results</h1>
            </div>
            {query && (
              <p className="text-muted-foreground">
                {isSearching ? (
                  "Searching..."
                ) : (
                  <>
                    {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{query}"
                  </>
                )}
              </p>
            )}
          </div>

          {/* Mobile Filter Toggle */}
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

        {query ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3">
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Searching for products...</p>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <ProductGrid filters={filters} searchResults={searchResults} />
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">We couldn't find any products matching "{query}"</p>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Try:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Checking your spelling</li>
                      <li>• Using different keywords</li>
                      <li>• Searching for more general terms</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start your search</h3>
            <p className="text-muted-foreground">Enter a search term to find products</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
