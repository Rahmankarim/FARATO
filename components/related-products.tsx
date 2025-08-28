"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"

const relatedProducts = [
  {
    id: 2,
    name: "Minimalist Denim Jacket",
    price: 129.99,
    image: "/minimalist-denim-jacket.png",
    category: "Jackets",
    isNew: false,
    isSale: false,
    colors: ["blue", "black"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Essential Cotton Tee",
    price: 29.99,
    image: "/placeholder-3kmqz.png",
    category: "T-Shirts",
    isNew: false,
    isSale: false,
    colors: ["white", "black", "navy", "gray"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: "Cargo Utility Pants",
    price: 79.99,
    originalPrice: 99.99,
    image: "/cargo-pants-utility.png",
    category: "Pants",
    isNew: true,
    isSale: true,
    colors: ["khaki", "black", "olive"],
    sizes: ["28", "30", "32", "34", "36"],
  },
  {
    id: 5,
    name: "Oversized Blazer",
    price: 159.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "Blazers",
    isNew: true,
    isSale: false,
    colors: ["black", "beige", "navy"],
    sizes: ["S", "M", "L", "XL"],
  },
]

interface RelatedProductsProps {
  currentProductId: number
  category: string
}

export function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const { addItem } = useCart()
  const { toast } = useToast()

  const filteredProducts = relatedProducts.filter((product) => product.id !== currentProductId).slice(0, 4)

  const handleAddToCart = (product: (typeof relatedProducts)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0],
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">You Might Also Like</h2>
        <Button variant="outline" asChild>
          <Link href="/products">View All</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            {/* Product Image */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                {product.isSale && <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>}
              </div>

              {/* Quick Actions */}
              <div
                className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${
                  hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8" asChild>
                  <Link href={`/products/${product.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Add to Cart Button */}
              <div
                className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
                  hoveredProduct === product.id ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
              >
                <Button className="w-full" onClick={() => handleAddToCart(product)}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                <Link href={`/products/${product.id}`}>{product.name}</Link>
              </h3>

              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-lg">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>

              {/* Color Options */}
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full border-2 border-gray-300 ${
                      color === "white"
                        ? "bg-white"
                        : color === "black"
                          ? "bg-black"
                          : color === "gray"
                            ? "bg-gray-500"
                            : color === "navy"
                              ? "bg-navy-500"
                              : color === "blue"
                                ? "bg-blue-500"
                                : color === "khaki"
                                  ? "bg-yellow-600"
                                  : color === "olive"
                                    ? "bg-green-600"
                                    : color === "beige"
                                      ? "bg-yellow-200"
                                      : "bg-gray-400"
                    }`}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-muted-foreground ml-1">+{product.colors.length - 4}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
