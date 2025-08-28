"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, ShoppingBag, Loader2 } from "lucide-react"
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

interface ProductGridProps {
  products?: Product[]
  title?: string
  category?: string
  featured?: boolean
  limit?: number
}

export function ProductGrid({ products: externalProducts, title, category, featured, limit }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(!externalProducts)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("default")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [selectedQuickViewVariants, setSelectedQuickViewVariants] = useState({
    color: "",
    size: "",
  })

  const { addToCart } = useCart()
  const { toast } = useToast()

  // Fetch products from API if not provided externally
  useEffect(() => {
    if (!externalProducts) {
      fetchProducts()
    } else {
      setProducts(externalProducts)
      setLoading(false)
    }
  }, [externalProducts, category, featured])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (featured) params.append('featured', 'true')
      if (limit) params.append('limit', limit.toString())

      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get all unique colors and sizes from products
  const allColors = useMemo(() => {
    const colors = new Set<string>()
    products.forEach(product => product.colors.forEach(color => colors.add(color)))
    return Array.from(colors)
  }, [products])

  const allSizes = useMemo(() => {
    const sizes = new Set<string>()
    products.forEach(product => product.sizes.forEach(size => sizes.add(size)))
    return Array.from(sizes)
  }, [products])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const priceToCheck = product.salePrice || product.price
      const matchesPrice = priceToCheck >= priceRange[0] && priceToCheck <= priceRange[1]
      const matchesColor = selectedColors.length === 0 || selectedColors.some(color => product.colors.includes(color))
      const matchesSize = selectedSizes.length === 0 || selectedSizes.some(size => product.sizes.includes(size))
      
      return matchesPrice && matchesColor && matchesSize
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
        break
      case "price-high":
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      default:
        // Default sorting (featured first, then newest)
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
    }

    return filtered
  }, [products, sortBy, priceRange, selectedColors, selectedSizes])

  const handleAddToCart = (product: Product, color?: string, size?: string) => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock.",
        variant: "destructive",
      })
      return
    }

    addToCart({
      id: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0] || "/placeholder.jpg",
      color: color || (product.colors[0] || ""),
      size: size || (product.sizes[0] || ""),
    })

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleQuickViewAddToCart = () => {
    if (!quickViewProduct) return

    const color = selectedQuickViewVariants.color || quickViewProduct.colors[0]
    const size = selectedQuickViewVariants.size || quickViewProduct.sizes[0]

    handleAddToCart(quickViewProduct, color, size)
    setQuickViewProduct(null)
    setSelectedQuickViewVariants({ color: "", size: "" })
  }

  const isRecentlyAdded = (product: Product) => {
    const now = new Date()
    const productDate = new Date(product.createdAt)
    const daysDiff = (now.getTime() - productDate.getTime()) / (1000 * 3600 * 24)
    return daysDiff <= 7 // Consider "new" if added within 7 days
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchProducts} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    )
  }

  return (
    <div>
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="default">Sort by Default</option>
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="featured">Featured First</option>
          </select>

          {/* Color Filter */}
          {allColors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Colors:</span>
              {allColors.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColors(prev =>
                      prev.includes(color)
                        ? prev.filter(c => c !== color)
                        : [...prev, color]
                    )
                  }}
                  className={`px-2 py-1 text-xs rounded border ${
                    selectedColors.includes(color)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          )}

          {/* Size Filter */}
          {allSizes.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sizes:</span>
              {allSizes.map(size => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSizes(prev =>
                      prev.includes(size)
                        ? prev.filter(s => s !== size)
                        : [...prev, size]
                    )
                  }}
                  className={`px-2 py-1 text-xs rounded border ${
                    selectedSizes.includes(size)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((product) => (
          <div
            key={product._id}
            className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            onMouseEnter={() => setHoveredProduct(product._id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {isRecentlyAdded(product) && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                {product.salePrice && <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>}
                {product.featured && <Badge className="bg-blue-500 hover:bg-blue-600">Featured</Badge>}
              </div>

              {/* Quick Actions */}
              <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-200 ${
                hoveredProduct === product._id ? "opacity-100" : "opacity-0"
              }`}>
                <WishlistButton productId={product._id} />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setQuickViewProduct(product)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              {/* Add to Cart Button */}
              <div className={`absolute bottom-2 left-2 right-2 transition-opacity duration-200 ${
                hoveredProduct === product._id ? "opacity-100" : "opacity-0"
              }`}>
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>

            <div className="p-4">
              <Link href={`/products/${product._id}`}>
                <h3 className="font-medium text-sm mb-1 hover:text-primary transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              
              {product.brand && (
                <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {product.salePrice ? (
                    <>
                      <span className="font-semibold text-sm">${product.salePrice}</span>
                      <span className="text-xs text-muted-foreground line-through">${product.price}</span>
                    </>
                  ) : (
                    <span className="font-semibold text-sm">${product.price}</span>
                  )}
                </div>
                
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs">⭐</span>
                    <span className="text-xs">{product.rating}</span>
                    {product.reviewCount && (
                      <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                    )}
                  </div>
                )}
              </div>

              {/* Stock indicator */}
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-xs text-orange-500 mt-1">Only {product.stock} left!</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Dialog */}
      <Dialog open={!!quickViewProduct} onOpenChange={(open) => !open && setQuickViewProduct(null)}>
        <DialogContent className="max-w-2xl">
          {quickViewProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{quickViewProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-square relative">
                  <Image
                    src={quickViewProduct.images[0] || "/placeholder.svg"}
                    alt={quickViewProduct.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {quickViewProduct.salePrice ? (
                        <>
                          <span className="text-2xl font-bold">${quickViewProduct.salePrice}</span>
                          <span className="text-lg text-muted-foreground line-through">${quickViewProduct.price}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">${quickViewProduct.price}</span>
                      )}
                    </div>
                    {quickViewProduct.description && (
                      <p className="text-muted-foreground">{quickViewProduct.description}</p>
                    )}
                  </div>

                  {/* Color Selection */}
                  {quickViewProduct.colors.length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Color</label>
                      <div className="flex gap-2">
                        {quickViewProduct.colors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedQuickViewVariants(prev => ({ ...prev, color }))}
                            className={`px-3 py-1 text-sm border rounded ${
                              selectedQuickViewVariants.color === color
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background hover:bg-muted'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {quickViewProduct.sizes.length > 0 && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Size</label>
                      <div className="flex gap-2">
                        {quickViewProduct.sizes.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedQuickViewVariants(prev => ({ ...prev, size }))}
                            className={`px-3 py-1 text-sm border rounded ${
                              selectedQuickViewVariants.size === size
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background hover:bg-muted'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleQuickViewAddToCart}
                    className="w-full"
                    disabled={quickViewProduct.stock <= 0}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {quickViewProduct.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
