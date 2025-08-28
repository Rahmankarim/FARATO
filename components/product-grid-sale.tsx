"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import { WishlistButton } from "@/components/wishlist-button"

// Mock product data - only sale items
const saleProducts = [
  {
    id: 1,
    name: "Urban Streetwear Hoodie",
    price: 89.99,
    originalPrice: 119.99,
    image: "/urban-streetwear-hoodie.png",
    category: "Hoodies",
    isNew: true,
    isSale: true,
    colors: ["Black", "White", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    description: "Premium cotton blend hoodie with modern streetwear design. Perfect for casual wear and layering.",
    features: ["100% Cotton", "Machine Washable", "Relaxed Fit", "Kangaroo Pocket"],
    discount: 25,
  },
  {
    id: 4,
    name: "Cargo Utility Pants",
    price: 79.99,
    originalPrice: 99.99,
    image: "/cargo-pants-utility.png",
    category: "Jeans",
    isNew: true,
    isSale: true,
    colors: ["Black", "Navy"],
    sizes: ["28", "30", "32", "34", "36"],
    description: "Functional cargo pants with multiple pockets and durable construction. Perfect for urban adventures.",
    features: ["Ripstop Fabric", "Multiple Pockets", "Adjustable Waist", "Reinforced Knees"],
    discount: 20,
  },
  {
    id: 8,
    name: "Leather Crossbody Bag",
    price: 149.99,
    originalPrice: 199.99,
    image: "/placeholder.svg?height=400&width=300&text=Leather+Crossbody+Bag",
    category: "Accessories",
    isNew: false,
    isSale: true,
    colors: ["Black", "Brown"],
    sizes: ["One Size"],
    description: "Premium leather crossbody bag with adjustable strap. Perfect for everyday use and travel.",
    features: ["Genuine Leather", "Adjustable Strap", "Multiple Compartments", "Magnetic Closure"],
    discount: 25,
  },
  {
    id: 9,
    name: "Vintage Denim Jacket",
    price: 109.99,
    originalPrice: 149.99,
    image: "/placeholder.svg?height=400&width=300&text=Vintage+Denim+Jacket",
    category: "Jackets",
    isNew: false,
    isSale: true,
    colors: ["Blue", "Black", "White"],
    sizes: ["S", "M", "L", "XL"],
    description: "Classic vintage-style denim jacket with distressed details. A timeless wardrobe essential.",
    features: ["100% Cotton Denim", "Vintage Wash", "Button Closure", "Chest Pockets"],
    discount: 27,
  },
  {
    id: 10,
    name: "Athletic Sneakers",
    price: 79.99,
    originalPrice: 119.99,
    image: "/placeholder.svg?height=400&width=300&text=Athletic+Sneakers",
    category: "Shoes",
    isNew: true,
    isSale: true,
    colors: ["White", "Black", "Gray"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    description: "Comfortable athletic sneakers with breathable mesh upper and cushioned sole.",
    features: ["Breathable Mesh", "Cushioned Sole", "Lightweight", "Non-slip Outsole"],
    discount: 33,
  },
  {
    id: 11,
    name: "Oversized T-Shirt",
    price: 24.99,
    originalPrice: 39.99,
    image: "/placeholder.svg?height=400&width=300&text=Oversized+T-Shirt",
    category: "T-Shirts",
    isNew: false,
    isSale: true,
    colors: ["White", "Black", "Gray", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Comfortable oversized t-shirt made from premium cotton. Perfect for casual everyday wear.",
    features: ["100% Cotton", "Oversized Fit", "Pre-shrunk", "Reinforced Seams"],
    discount: 37,
  },
  {
    id: 12,
    name: "Designer Sunglasses",
    price: 89.99,
    originalPrice: 129.99,
    image: "/placeholder.svg?height=400&width=300&text=Designer+Sunglasses",
    category: "Accessories",
    isNew: true,
    isSale: true,
    colors: ["Black", "Brown", "Gold"],
    sizes: ["One Size"],
    description: "Premium designer sunglasses with UV protection and polarized lenses.",
    features: ["UV Protection", "Polarized Lenses", "Lightweight Frame", "Scratch Resistant"],
    discount: 31,
  },
  {
    id: 13,
    name: "Wool Blend Sweater",
    price: 69.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=400&width=300&text=Wool+Blend+Sweater",
    category: "Sweaters",
    isNew: false,
    isSale: true,
    colors: ["Cream", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    description: "Cozy wool blend sweater perfect for cooler weather. Classic fit with ribbed details.",
    features: ["Wool Blend", "Ribbed Cuffs", "Classic Fit", "Machine Washable"],
    discount: 30,
  },
]

interface ProductGridSaleProps {
  filters: {
    category: string[]
    size: string[]
    color: string[]
    priceRange: number[]
    sortBy: string
    saleOnly?: boolean
  }
}

export function ProductGridSale({ filters }: ProductGridSaleProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [previewProduct, setPreviewProduct] = useState<(typeof saleProducts)[0] | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const { addItem } = useCart()
  const { toast } = useToast()

  const filteredProducts = useMemo(() => {
    let filtered = [...saleProducts]

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter((product) => filters.category.includes(product.category))
    }

    // Size filter
    if (filters.size.length > 0) {
      filtered = filtered.filter((product) => product.sizes.some((size) => filters.size.includes(size)))
    }

    // Color filter
    if (filters.color.length > 0) {
      filtered = filtered.filter((product) => product.colors.some((color) => filters.color.includes(color)))
    }

    // Price filter
    filtered = filtered.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Sort products
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "discount":
        filtered.sort((a, b) => b.discount - a.discount)
        break
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        // Featured - keep original order
        break
    }

    return filtered
  }, [filters])

  const handleAddToCart = (product: (typeof saleProducts)[0], size?: string, color?: string) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: size || product.sizes[0],
      color: color || product.colors[0],
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const openPreview = (product: (typeof saleProducts)[0]) => {
    setPreviewProduct(product)
    setSelectedSize(product.sizes[0])
    setSelectedColor(product.colors[0])
  }

  const closePreview = () => {
    setPreviewProduct(null)
    setSelectedSize("")
    setSelectedColor("")
  }

  const handlePreviewAddToCart = () => {
    if (previewProduct) {
      handleAddToCart(previewProduct, selectedSize, selectedColor)
      closePreview()
    }
  }

  const getColorClass = (color: string) => {
    switch (color.toLowerCase()) {
      case "white":
        return "bg-white border-gray-300"
      case "black":
        return "bg-black"
      case "gray":
        return "bg-gray-500"
      case "navy":
        return "bg-blue-900"
      case "blue":
        return "bg-blue-500"
      case "brown":
        return "bg-amber-700"
      case "cream":
        return "bg-amber-100 border-gray-300"
      case "gold":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} sale items
          <Badge className="ml-2 bg-red-500 text-white">SALE ONLY</Badge>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Badge className="bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
              </div>

              {/* Quick Actions - Eye Icon */}
              <div
                className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${
                  hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <WishlistButton product={product} size="sm" />
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/90 hover:bg-white"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    openPreview(product)
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {/* Add to Cart Button */}
              <div
                className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
                  hoveredProduct === product.id ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
              >
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    openPreview(product)
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
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
                <span className="font-bold text-lg text-red-600">${product.price}</span>
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              </div>

              {/* Color Options */}
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div key={index} className={`w-4 h-4 rounded-full border ${getColorClass(color)}`} />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-muted-foreground ml-1">+{product.colors.length - 4}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewProduct} onOpenChange={closePreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {previewProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{previewProduct.name}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={previewProduct.image || "/placeholder.svg"}
                    alt={previewProduct.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {previewProduct.isNew && <Badge className="bg-green-500">New</Badge>}
                    <Badge className="bg-red-500">-{previewProduct.discount}%</Badge>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <p className="text-muted-foreground mb-2">{previewProduct.category}</p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl font-bold text-red-600">${previewProduct.price}</span>
                      <span className="text-xl text-muted-foreground line-through">
                        ${previewProduct.originalPrice}
                      </span>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Save ${(previewProduct.originalPrice - previewProduct.price).toFixed(2)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{previewProduct.description}</p>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <h4 className="font-semibold mb-3">Color: {selectedColor}</h4>
                    <div className="flex gap-2">
                      {previewProduct.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            selectedColor === color ? "border-primary scale-110" : "border-gray-300"
                          } ${getColorClass(color)}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <h4 className="font-semibold mb-3">Size: {selectedSize}</h4>
                    <div className="flex gap-2 flex-wrap">
                      {previewProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 border rounded-md transition-all ${
                            selectedSize === size
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3">Features</h4>
                    <ul className="space-y-1">
                      {previewProduct.features.map((feature, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Add to Cart */}
                  <div className="space-y-3">
                    <Button className="w-full" size="lg" onClick={handlePreviewAddToCart}>
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Add to Cart - ${previewProduct.price}
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href={`/products/${previewProduct.id}`}>View Full Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">No sale items found matching your filters.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
