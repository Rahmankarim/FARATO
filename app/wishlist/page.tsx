"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, X, Share2 } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"

// Mock wishlist data
const wishlistItems = [
  {
    id: 1,
    name: "Urban Streetwear Hoodie",
    price: 89.99,
    originalPrice: 119.99,
    image: "/urban-streetwear-hoodie.png",
    category: "Hoodies",
    inStock: true,
    isSale: true,
  },
  {
    id: 2,
    name: "Minimalist Denim Jacket",
    price: 129.99,
    image: "/minimalist-denim-jacket.png",
    category: "Jackets",
    inStock: true,
    isSale: false,
  },
  {
    id: 3,
    name: "Essential Cotton Tee",
    price: 29.99,
    image: "/placeholder-3kmqz.png",
    category: "T-Shirts",
    inStock: false,
    isSale: false,
  },
]

export default function WishlistPage() {
  const [items, setItems] = useState(wishlistItems)
  const { addItem } = useCart()
  const { toast } = useToast()

  const removeFromWishlist = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
    })
  }

  const addToCart = (item: (typeof wishlistItems)[0]) => {
    if (!item.inStock) {
      toast({
        title: "Out of stock",
        description: "This item is currently out of stock.",
        variant: "destructive",
      })
      return
    }

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      size: "M", // Default size
      color: "Black", // Default color
    })

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const shareWishlist = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Wishlist link copied",
      description: "Share your wishlist with friends and family.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>

          {items.length > 0 && (
            <Button variant="outline" onClick={shareWishlist}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Wishlist
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save items you love to your wishlist and shop them later.</p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="group relative overflow-hidden">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-red-500"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {item.isSale && <Badge className="bg-red-500">Sale</Badge>}
                    {!item.inStock && <Badge variant="secondary">Out of Stock</Badge>}
                  </div>
                </div>

                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">{item.category}</p>
                  <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                    <Link href={`/products/${item.id}`}>{item.name}</Link>
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-lg">${item.price}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">${item.originalPrice}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => addToCart(item)} disabled={!item.inStock}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link href={`/products/${item.id}`}>
                        <Heart className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
