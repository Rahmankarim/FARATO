"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import { WishlistButton } from "@/components/wishlist-button"

// Product interface
interface Product {
  _id: string
  name: string
  price: number
  salePrice?: number
  images: string[]
  category: string
  brand?: string
  colors: string[]
  sizes: string[]
  description?: string
  featured?: boolean
  stock: number
  rating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

// Mock product data
const mockProducts: Product[] = [
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
  },
  {
    id: 2,
    name: "Minimalist Denim Jacket",
    price: 129.99,
    image: "/minimalist-denim-jacket.png",
    category: "Jackets",
    isNew: false,
    isSale: false,
    colors: ["Blue", "Black"],
    sizes: ["S", "M", "L", "XL"],
    description: "Classic denim jacket with a modern minimalist design. Versatile piece for any wardrobe.",
    features: ["100% Cotton Denim", "Button Closure", "Chest Pockets", "Regular Fit"],
  },
  {
    id: 3,
    name: "Essential Cotton Tee",
    price: 29.99,
    image: "/placeholder-3kmqz.png",
    category: "T-Shirts",
    isNew: false,
    isSale: false,
    colors: ["White", "Black", "Navy", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Soft and comfortable cotton t-shirt. A wardrobe essential that pairs with everything.",
    features: ["100% Cotton", "Pre-shrunk", "Crew Neck", "Regular Fit"],
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
  },
  {
    id: 5,
    name: "Oversized Blazer",
    price: 159.99,
    image: "/blazer.png",
    category: "Jackets",
    isNew: true,
    isSale: false,
    colors: ["Black", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "Contemporary oversized blazer perfect for both casual and formal occasions.",
    features: ["Polyester Blend", "Oversized Fit", "Notched Lapels", "Single Button"],
  },
  {
    id: 6,
    name: "High-Waist Jeans",
    price: 69.99,
    image: "/folded-denim-stack.png",
    category: "Jeans",
    isNew: false,
    isSale: false,
    colors: ["Blue", "Black", "White"],
    sizes: ["24", "26", "28", "30", "32"],
    description: "Flattering high-waist jeans with a comfortable fit and timeless style.",
    features: ["Stretch Denim", "High Waist", "Skinny Fit", "5-Pocket Design"],
  },
  {
    id: 7,
    name: "Classic White Sneakers",
    price: 99.99,
    image: "/diverse-sneaker-collection.png",
    category: "Shoes",
    isNew: false,
    isSale: false,
    colors: ["White", "Black"],
    sizes: ["7", "8", "9", "10", "11"],
    description: "Clean and versatile sneakers that complement any outfit. Comfortable for all-day wear.",
    features: ["Leather Upper", "Rubber Sole", "Cushioned Insole", "Lace-up Closure"],
  },
  {
    id: 8,
    name: "Leather Crossbody Bag",
    price: 149.99,
    originalPrice: 199.99,
    image: "/brown-leather-messenger-bag.png",
    category: "Accessories",
    isNew: false,
    isSale: true,
    colors: ["Black", "Brown"],
    sizes: ["One Size"],
    description: "Premium leather crossbody bag with adjustable strap. Perfect for everyday use and travel.",
    features: ["Genuine Leather", "Adjustable Strap", "Multiple Compartments", "Magnetic Closure"],
  },
]

interface ProductGridProps {
  filters: {
    category: string[]
    size: string[]
    color: string[]
    priceRange: [number, number]
    sortBy: string
  }
  searchResults?: Product[]
}

export function ProductGrid({ filters, searchResults }: ProductGridProps) {
  const [hoveredProduct, setHoveredProduct] = useState<number | string | null>(null)
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const { addItem } = useCart()
  const { toast } = useToast()

  // Load products from localStorage and merge with mock data
  useEffect(() => {
    const loadProducts = () => {
      const adminProducts = JSON.parse(localStorage.getItem("farato_products") || "[]")
      
      // Convert admin products to the expected format
      const formattedAdminProducts: Product[] = adminProducts.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0] || "/placeholder.jpg",
        category: product.category,
        isNew: false, // Admin products are not marked as new by default
        isSale: product.originalPrice ? product.originalPrice > product.price : false,
        colors: product.colors || [],
        sizes: product.sizes || [],
        description: product.description || "",
        features: product.features || [],
        inStock: product.inStock !== false
      }))

      // Combine mock products with admin products
      const combined = [...mockProducts, ...formattedAdminProducts]
      setAllProducts(combined)
    }

    loadProducts()

    // Listen for storage changes to update products in real-time
    const handleStorageChange = () => {
      loadProducts()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events when products are added/updated
    window.addEventListener('productsUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('productsUpdated', handleStorageChange)
    }
  }, [])

  const filteredProducts = useMemo(() => {
    // Use search results if provided, otherwise use all products
    const productsToFilter = searchResults || allProducts

    const filtered = productsToFilter.filter((product: Product) => {
      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(product.category)) {
        return false
      }

      // Size filter
      if (filters.size.length > 0 && !product.sizes.some((size: string) => filters.size.includes(size))) {
        return false
      }

      // Color filter
      if (filters.color.length > 0 && !product.colors.some((color: string) => filters.color.includes(color))) {
        return false
      }

      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      return true
    })

    // Sort products
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a: Product, b: Product) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a: Product, b: Product) => b.price - a.price)
        break
      case "newest":
        filtered.sort((a: Product, b: Product) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case "popular":
        // Mock popularity sort
        filtered.sort(() => Math.random() - 0.5)
        break
      default:
        // Featured - keep original order
        break
    }

    return filtered
  }, [filters, searchResults, allProducts])

  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    addItem({
      id: typeof product.id === 'string' ? parseInt(product.id) || Date.now() : product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder.jpg",
      quantity: 1,
      size: size || product.sizes[0],
      color: color || product.colors[0],
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const openPreview = (product: Product) => {
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
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">Showing {filteredProducts.length} products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product: Product) => (
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
                <WishlistButton product={product} size="sm" />
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
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
                <span className="font-bold text-lg">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>

              {/* Color Options */}
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color: string, index: number) => (
                  <div key={index} className={`w-4 h-4 rounded-full border-2 ${getColorClass(color)}`} />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-muted-foreground ml-1">+{product.colors.length - 4}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Preview Modal */}
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
                    {previewProduct.isSale && <Badge className="bg-red-500">Sale</Badge>}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <p className="text-muted-foreground mb-2">{previewProduct.category}</p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl font-bold">${previewProduct.price}</span>
                      {previewProduct.originalPrice && (
                        <span className="text-xl text-muted-foreground line-through">
                          ${previewProduct.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{previewProduct.description}</p>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <h4 className="font-semibold mb-3">Color: {selectedColor}</h4>
                    <div className="flex gap-2">
                      {previewProduct.colors.map((color: string) => (
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
                      {previewProduct.sizes.map((size: string) => (
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
                      {previewProduct.features?.map((feature: string, index: number) => (
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
          <p className="text-muted-foreground text-lg mb-4">No products found matching your filters.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
