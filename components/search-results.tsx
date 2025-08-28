"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Eye } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"

interface SearchResult {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew?: boolean
  isSale?: boolean
  colors: string[]
  sizes: string[]
  description?: string
}

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  onResultClick?: () => void
}

export function SearchResults({ results, query, onResultClick }: SearchResultsProps) {
  const [hoveredResult, setHoveredResult] = useState<number | null>(null)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (product: SearchResult, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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

  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      <div className="p-2">
        <p className="text-sm text-muted-foreground mb-3 px-2">
          Found {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
        </p>

        <div className="space-y-1">
          {results.slice(0, 6).map((result) => (
            <Link
              key={result.id}
              href={`/products/${result.id}`}
              onClick={onResultClick}
              className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
              onMouseEnter={() => setHoveredResult(result.id)}
              onMouseLeave={() => setHoveredResult(null)}
            >
              <div className="flex items-center gap-3">
                {/* Product Image */}
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <Image src={result.image || "/placeholder.svg"} alt={result.name} fill className="object-cover" />
                  {/* Badges */}
                  <div className="absolute top-0 left-0 flex flex-col gap-1">
                    {result.isNew && <Badge className="bg-green-500 hover:bg-green-600 text-xs px-1 py-0">New</Badge>}
                    {result.isSale && <Badge className="bg-red-500 hover:bg-red-600 text-xs px-1 py-0">Sale</Badge>}
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{highlightText(result.name, query)}</h4>
                      <p className="text-xs text-muted-foreground mb-1">{highlightText(result.category, query)}</p>
                      {result.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {highlightText(result.description, query)}
                        </p>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center gap-2 ml-2">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-sm">${result.price}</span>
                          {result.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">${result.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      {hoveredResult === result.id && (
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => handleAddToCart(result, e)}
                          >
                            <ShoppingBag className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6" asChild>
                            <Link href={`/products/${result.id}`}>
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Color Options */}
                  <div className="flex gap-1 mt-2">
                    {result.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full border border-gray-300 ${
                          color === "White"
                            ? "bg-white"
                            : color === "Black"
                              ? "bg-black"
                              : color === "Gray"
                                ? "bg-gray-500"
                                : color === "Navy"
                                  ? "bg-navy-500"
                                  : color === "Blue"
                                    ? "bg-blue-500"
                                    : color === "Red"
                                      ? "bg-red-500"
                                      : color === "Green"
                                        ? "bg-green-500"
                                        : color === "Brown"
                                          ? "bg-yellow-600"
                                          : "bg-gray-400"
                        }`}
                      />
                    ))}
                    {result.colors.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{result.colors.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {results.length > 6 && (
          <div className="p-2 border-t mt-2">
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={onResultClick}>
                View all {results.length} results
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
