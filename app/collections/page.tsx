"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

const collections = [
  {
    id: "new",
    name: "New Arrivals",
    description: "Latest trends and fresh styles",
    image: "/modern-streetwear-model.png",
    itemCount: 45,
    link: "/collections/new",
  },
  {
    id: "urban",
    name: "Urban Essentials",
    description: "Street style redefined",
    image: "/urban-fashion-street-style.png",
    itemCount: 32,
    link: "/collections/urban",
  },
  {
    id: "premium",
    name: "Premium Collection",
    description: "Luxury meets comfort",
    image: "/premium-fashion-clothing.png",
    itemCount: 28,
    link: "/collections/premium",
  },
  {
    id: "summer",
    name: "Summer Vibes",
    description: "Light and breezy styles",
    image: "/placeholder.svg?height=400&width=300",
    itemCount: 56,
    link: "/collections/summer",
  },
  {
    id: "winter",
    name: "Winter Warmth",
    description: "Cozy and stylish winter wear",
    image: "/placeholder.svg?height=400&width=300",
    itemCount: 38,
    link: "/collections/winter",
  },
  {
    id: "basics",
    name: "Everyday Basics",
    description: "Essential pieces for your wardrobe",
    image: "/placeholder.svg?height=400&width=300",
    itemCount: 42,
    link: "/collections/basics",
  },
]

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Collections</h1>
            <p className="text-xl opacity-90">Curated styles for every occasion</p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Card key={collection.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                  <p className="text-sm opacity-90 mb-4">{collection.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{collection.itemCount} items</span>
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                      asChild
                    >
                      <Link href={collection.link}>Explore</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
