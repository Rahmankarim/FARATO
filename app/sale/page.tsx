"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGridSale } from "@/components/product-grid-sale"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, Clock } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"

export default function SalePage() {
  const [filters, setFilters] = useState({
    category: [],
    size: [],
    color: [],
    priceRange: [0, 500],
    sortBy: "featured",
    saleOnly: true,
  })

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-red-900 to-pink-700 text-white">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center">
            <Badge className="bg-red-500 text-white mb-4 text-lg px-4 py-2">MEGA SALE</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Up to 70% OFF</h1>
            <p className="text-xl opacity-90 mb-6">Limited time offer on selected items</p>

            {/* Countdown Timer */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Clock className="h-5 w-5" />
              <span className="text-lg">Sale ends in:</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="bg-white/20 rounded-lg p-3 min-w-[60px]">
                <div className="text-2xl font-bold">{timeLeft.days}</div>
                <div className="text-sm opacity-75">Days</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 min-w-[60px]">
                <div className="text-2xl font-bold">{timeLeft.hours}</div>
                <div className="text-sm opacity-75">Hours</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 min-w-[60px]">
                <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                <div className="text-sm opacity-75">Min</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3 min-w-[60px]">
                <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                <div className="text-sm opacity-75">Sec</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-red-600">Sale Items</h2>
            <p className="text-muted-foreground">Don't miss out on these amazing deals</p>
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
            <ProductGridSale filters={filters} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
