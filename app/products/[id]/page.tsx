"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingBag,
  Share2,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"
import { ProductReviews } from "@/components/product-reviews"
import { RelatedProducts } from "@/components/related-products"
import { SizeGuide } from "@/components/size-guide"
import { WishlistButton } from "@/components/wishlist-button"

// Product interfaces
interface ProductColor {
  name: string
  value: string
  image: string
}

interface ProductSize {
  name: string
  inStock: boolean
}

interface ProductSpecifications {
  [key: string]: string
}

interface Product {
  id: number | string
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: string
  brand: string
  sku: string
  isNew: boolean
  isSale: boolean
  inStock: boolean
  stockCount: number
  colors: ProductColor[]
  sizes: ProductSize[] | string[]
  features: string[]
  specifications: ProductSpecifications
  rating: number
  reviewCount: number
}

// Complete product data for all products
const productData: Record<number, Product> = {
  1: {
    id: 1,
    name: "Urban Streetwear Hoodie",
    price: 89.99,
    originalPrice: 119.99,
    description:
      "Elevate your street style with this premium urban hoodie. Crafted from high-quality cotton blend for ultimate comfort and durability. Features a modern fit with ribbed cuffs and hem.",
    images: [
      "/urban-streetwear-hoodie.png",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
    ],
    category: "Hoodies",
    brand: "Farato",
    sku: "FSH-001",
    isNew: true,
    isSale: true,
    inStock: true,
    stockCount: 15,
    colors: [
      { name: "Black", value: "#000000", image: "/urban-streetwear-hoodie.png" },
      { name: "White", value: "#FFFFFF", image: "/placeholder.svg?height=600&width=500" },
      { name: "Gray", value: "#808080", image: "/placeholder.svg?height=600&width=500" },
    ],
    sizes: [
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
      { name: "XXL", inStock: false },
    ],
    features: [
      "Premium cotton blend fabric",
      "Modern relaxed fit",
      "Ribbed cuffs and hem",
      "Kangaroo pocket",
      "Machine washable",
    ],
    specifications: {
      Material: "80% Cotton, 20% Polyester",
      Fit: "Regular",
      Care: "Machine wash cold",
      Origin: "Made in Turkey",
    },
    rating: 4.5,
    reviewCount: 127,
  },
  2: {
    id: 2,
    name: "Minimalist Denim Jacket",
    price: 129.99,
    originalPrice: undefined,
    description:
      "Classic denim jacket with a modern minimalist design. Crafted from premium denim with a comfortable fit. Perfect for layering and versatile styling.",
    images: [
      "/minimalist-denim-jacket.png",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
    ],
    category: "Jackets",
    brand: "Farato",
    sku: "FDJ-002",
    isNew: false,
    isSale: false,
    inStock: true,
    stockCount: 22,
    colors: [
      { name: "Blue", value: "#4F46E5", image: "/minimalist-denim-jacket.png" },
      { name: "Black", value: "#000000", image: "/placeholder.svg?height=600&width=500" },
    ],
    sizes: [
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
    ],
    features: ["100% Cotton Denim", "Classic button closure", "Chest pockets", "Regular fit", "Pre-washed"],
    specifications: {
      Material: "100% Cotton Denim",
      Fit: "Regular",
      Care: "Machine wash cold",
      Origin: "Made in Portugal",
    },
    rating: 4.3,
    reviewCount: 89,
  },
  3: {
    id: 3,
    name: "Essential Cotton Tee",
    price: 29.99,
    originalPrice: undefined,
    description:
      "Soft and comfortable cotton t-shirt that's perfect for everyday wear. Made from premium cotton with a classic fit that works with any outfit.",
    images: [
      "/placeholder-3kmqz.png",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
    ],
    category: "T-Shirts",
    brand: "Farato",
    sku: "FCT-003",
    isNew: false,
    isSale: false,
    inStock: true,
    stockCount: 45,
    colors: [
      { name: "White", value: "#FFFFFF", image: "/placeholder-3kmqz.png" },
      { name: "Black", value: "#000000", image: "/placeholder.svg?height=600&width=500" },
      { name: "Navy", value: "#1E3A8A", image: "/placeholder.svg?height=600&width=500" },
      { name: "Gray", value: "#808080", image: "/placeholder.svg?height=600&width=500" },
    ],
    sizes: [
      { name: "XS", inStock: true },
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: true },
    ],
    features: ["100% Premium cotton", "Pre-shrunk fabric", "Crew neck design", "Regular fit", "Reinforced seams"],
    specifications: {
      Material: "100% Cotton",
      Fit: "Regular",
      Care: "Machine wash warm",
      Origin: "Made in USA",
    },
    rating: 4.7,
    reviewCount: 203,
  },
  4: {
    id: 4,
    name: "Cargo Utility Pants",
    price: 79.99,
    originalPrice: 99.99,
    description:
      "Functional cargo pants with multiple pockets and durable construction. Perfect for urban adventures and everyday wear with a modern tactical aesthetic.",
    images: [
      "/cargo-pants-utility.png",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
    ],
    category: "Jeans",
    brand: "Farato",
    sku: "FCP-004",
    isNew: true,
    isSale: true,
    inStock: true,
    stockCount: 18,
    colors: [
      { name: "Black", value: "#000000", image: "/cargo-pants-utility.png" },
      { name: "Navy", value: "#1E3A8A", image: "/placeholder.svg?height=600&width=500" },
    ],
    sizes: [
      { name: "28", inStock: true },
      { name: "30", inStock: true },
      { name: "32", inStock: true },
      { name: "34", inStock: true },
      { name: "36", inStock: true },
    ],
    features: [
      "Ripstop fabric construction",
      "Multiple cargo pockets",
      "Adjustable waist",
      "Reinforced knees",
      "Water-resistant coating",
    ],
    specifications: {
      Material: "65% Cotton, 35% Polyester",
      Fit: "Relaxed",
      Care: "Machine wash cold",
      Origin: "Made in Vietnam",
    },
    rating: 4.4,
    reviewCount: 156,
  },
  5: {
    id: 5,
    name: "Oversized Blazer",
    price: 159.99,
    originalPrice: undefined,
    description:
      "Contemporary oversized blazer perfect for both casual and formal occasions. Features a modern silhouette with premium construction and versatile styling options.",
    images: [
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
    ],
    category: "Jackets",
    brand: "Farato",
    sku: "FOB-005",
    isNew: true,
    isSale: false,
    inStock: true,
    stockCount: 12,
    colors: [
      { name: "Black", value: "#000000", image: "/placeholder.svg?height=600&width=500" },
      { name: "Navy", value: "#1E3A8A", image: "/placeholder.svg?height=600&width=500" },
    ],
    sizes: [
      { name: "S", inStock: true },
      { name: "M", inStock: true },
      { name: "L", inStock: true },
      { name: "XL", inStock: false },
    ],
    features: [
      "Polyester blend fabric",
      "Oversized contemporary fit",
      "Notched lapels",
      "Single button closure",
      "Interior pockets",
    ],
    specifications: {
      Material: "70% Polyester, 30% Viscose",
      Fit: "Oversized",
      Care: "Dry clean only",
      Origin: "Made in Italy",
    },
    rating: 4.6,
    reviewCount: 74,
  },
  6: {
    id: 6,
    name: "High-Waist Jeans",
    price: 69.99,
    originalPrice: undefined,
    description:
      "Flattering high-waist jeans with a comfortable fit and timeless style. Made from premium stretch denim that moves with you while maintaining its shape.",
    images: [
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
    ],
    category: "Jeans",
    brand: "Farato",
    sku: "FHJ-006",
    isNew: false,
    isSale: false,
    inStock: true,
    stockCount: 28,
    colors: [
      { name: "Blue", value: "#4F46E5", image: "/placeholder.svg?height=600&width=500" },
      { name: "Black", value: "#000000", image: "/placeholder.svg?height=600&width=500" },
      { name: "White", value: "#FFFFFF", image: "/placeholder.svg?height=600&width=500" },
    ],
    sizes: [
      { name: "24", inStock: true },
      { name: "26", inStock: true },
      { name: "28", inStock: true },
      { name: "30", inStock: true },
      { name: "32", inStock: true },
    ],
    features: ["Stretch denim fabric", "High-waist design", "Skinny fit", "5-pocket styling", "Belt loops"],
    specifications: {
      Material: "98% Cotton, 2% Elastane",
      Fit: "Skinny",
      Care: "Machine wash cold",
      Origin: "Made in Turkey",
    },
    rating: 4.5,
    reviewCount: 192,
  },
  7: {
    id: 7,
    name: "Classic White Sneakers",
    price: 99.99,
    originalPrice: undefined,
    description:
      "Clean and versatile sneakers that complement any outfit. Comfortable for all-day wear with premium leather construction and classic styling.",
    images: [
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
    ],
    category: "Shoes",
    brand: "Farato",
    sku: "FCS-007",
    isNew: false,
    isSale: false,
    inStock: true,
    stockCount: 35,
    colors: [
      { name: "White", value: "#FFFFFF", image: "/placeholder.svg?height=600&width=500" },
      { name: "Black", value: "#000000", image: "/placeholder.svg?height=600&width=500" },
    ],
    sizes: [
      { name: "7", inStock: true },
      { name: "8", inStock: true },
      { name: "9", inStock: true },
      { name: "10", inStock: true },
      { name: "11", inStock: true },
    ],
    features: ["Premium leather upper", "Rubber outsole", "Cushioned insole", "Lace-up closure", "Breathable lining"],
    specifications: {
      Material: "Leather/Rubber",
      Fit: "True to size",
      Care: "Wipe clean",
      Origin: "Made in Portugal",
    },
    rating: 4.4,
    reviewCount: 167,
  },
  8: {
    id: 8,
    name: "Leather Crossbody Bag",
    price: 149.99,
    originalPrice: 199.99,
    description:
      "Premium leather crossbody bag with adjustable strap. Perfect for everyday use and travel with multiple compartments for organization.",
    images: [
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
      "/placeholder.svg?height=600&width=500",
    ],
    category: "Accessories",
    brand: "Farato",
    sku: "FCB-008",
    isNew: false,
    isSale: true,
    inStock: true,
    stockCount: 14,
    colors: [
      { name: "Black", value: "#000000", image: "/placeholder.svg?height=600&width=500" },
      { name: "Brown", value: "#8B4513", image: "/placeholder.svg?height=600&width=500" },
    ],
    sizes: [{ name: "One Size", inStock: true }],
    features: [
      "Genuine leather construction",
      "Adjustable shoulder strap",
      "Multiple compartments",
      "Magnetic closure",
      "Interior zip pocket",
    ],
    specifications: {
      Material: "100% Genuine Leather",
      Dimensions: '10" x 8" x 3"',
      Care: "Leather conditioner recommended",
      Origin: "Made in Italy",
    },
    rating: 4.8,
    reviewCount: 95,
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  const { addItem } = useCart()
  const { toast } = useToast()

  // Load product from either hardcoded data or localStorage
  useEffect(() => {
    // First try to find in hardcoded products
    const numericId = Number.parseInt(productId)
    let foundProduct: Product | undefined = productData[numericId as keyof typeof productData]
    
    if (!foundProduct) {
      // If not found, try to find in admin products from localStorage
      const adminProducts = JSON.parse(localStorage.getItem("farato_products") || "[]")
      const adminProduct = adminProducts.find((p: any) => p.id === productId)
      
      if (adminProduct) {
        // Convert admin product format to expected format
        foundProduct = {
          id: adminProduct.id,
          name: adminProduct.name,
          price: adminProduct.price,
          originalPrice: adminProduct.originalPrice,
          description: adminProduct.description || "No description available.",
          images: adminProduct.images || ["/placeholder.jpg"],
          category: adminProduct.category || "Uncategorized",
          brand: "Farato",
          sku: `FAR-${adminProduct.id}`,
          isNew: false,
          isSale: adminProduct.originalPrice ? adminProduct.originalPrice > adminProduct.price : false,
          inStock: adminProduct.inStock !== false,
          stockCount: adminProduct.stock || 0,
          colors: [
            { 
              name: "Default", 
              value: "#000000", 
              image: adminProduct.images?.[0] || "/placeholder.jpg" 
            }
          ],
          sizes: adminProduct.sizes || ["S", "M", "L", "XL"],
          features: adminProduct.features || ["High quality product"],
          specifications: {
            Material: "Premium materials",
            Fit: "Regular",
            Care: "Machine wash cold",
            Origin: "Made with care"
          },
          rating: 4.5,
          reviewCount: 0
        }
      }
    }
    
    setProduct(foundProduct || null)
  }, [productId])

  // Initialize selected size and color when product loads
  useEffect(() => {
    if (product && product.sizes.length > 0 && !selectedSize) {
      const firstSize = typeof product.sizes[0] === 'string' ? product.sizes[0] : product.sizes[0].name
      setSelectedSize(firstSize)
    }
  }, [product, selectedSize])

  useEffect(() => {
    if (product?.colors[selectedColor]) {
      const colorImage = product.colors[selectedColor].image
      const imageIndex = product.images.findIndex((img) => img === colorImage)
      if (imageIndex !== -1) {
        setSelectedImage(imageIndex)
      }
    }
  }, [selectedColor, product])

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "Choose a size before adding to cart.",
        variant: "destructive",
      })
      return
    }

    addItem({
      id: typeof product.id === 'string' ? parseInt(product.id) || Date.now() : product.id,
      name: product.name,
      price: product.price,
      image: product.images[selectedImage],
      quantity: quantity,
      size: selectedSize,
      color: product.colors[selectedColor].name,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Image Navigation */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <Badge className="bg-green-500">New</Badge>}
                {product.isSale && <Badge className="bg-red-500">Sale</Badge>}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">{product.brand}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                )}
                {product.isSale && product.originalPrice && (
                  <Badge variant="destructive">
                    {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Color Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Color: {product.colors[selectedColor].name}</h3>
              </div>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === index ? "border-primary scale-110" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(index)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Size: {selectedSize}</h3>
                <Button variant="link" className="h-auto p-0 text-sm" onClick={() => setShowSizeGuide(true)}>
                  Size Guide
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`p-3 border rounded-md text-sm font-medium transition-all ${
                      selectedSize === (typeof size === 'string' ? size : size.name)
                        ? "border-primary bg-primary text-primary-foreground"
                        : typeof size === 'object' && !size.inStock
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 hover:border-primary"
                    }`}
                    onClick={() => {
                      const sizeName = typeof size === 'string' ? size : size.name
                      const isInStock = typeof size === 'string' ? true : size.inStock
                      if (isInStock) {
                        setSelectedSize(sizeName)
                      }
                    }}
                    disabled={typeof size === 'object' && !size.inStock}
                  >
                    {typeof size === 'string' ? size : size.name}
                  </button>
                ))}
              </div>
            </div>            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">{product.stockCount} items available</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <WishlistButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.images[0],
                    category: product.category,
                    isNew: product.isNew,
                    isSale: product.isSale,
                    colors: product.colors.map(c => c.name),
                    sizes: product.sizes.map(s => typeof s === 'string' ? s : s.name)
                  }}
                  size="lg"
                />
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $100</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">SSL encrypted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">Product Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <span className="font-medium">{key}:</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ProductReviews 
              productId={typeof product.id === 'string' ? parseInt(product.id) || Date.now() : product.id} 
              rating={product.rating} 
              reviewCount={product.reviewCount} 
            />
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Shipping Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Free standard shipping on orders over $100</li>
                  <li>• Express shipping available for $9.99</li>
                  <li>• International shipping available</li>
                  <li>• Orders processed within 1-2 business days</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Return Policy</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 30-day return window</li>
                  <li>• Items must be in original condition</li>
                  <li>• Free return shipping for defective items</li>
                  <li>• Refunds processed within 5-7 business days</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <RelatedProducts 
          currentProductId={typeof product.id === 'string' ? parseInt(product.id) || Date.now() : product.id} 
          category={product.category} 
        />
      </main>

      <Footer />

      {/* Size Guide Modal */}
      <SizeGuide open={showSizeGuide} onOpenChange={setShowSizeGuide} />
    </div>
  )
}
