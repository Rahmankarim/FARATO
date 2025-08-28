"use client"

import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useWishlist } from "@/components/wishlist-provider"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"

export function ProfileWishlist() {
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleRemoveFromWishlist = (productId: number | string) => {
    removeItem(productId)
    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist.",
    })
  }

  const handleAddToCart = (product: any) => {
    // For wishlist items, we'll use the first available size as default
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M"
    
    // Ensure ID is a number for cart compatibility
    const productId = typeof product.id === 'string' ? parseInt(product.id) || Date.now() : product.id
    
    addItem({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      size: defaultSize,
      quantity: 1,
      color: product.colors && product.colors.length > 0 ? product.colors[0] : "Default",
    })
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-600 mb-6">Start adding items you love to your wishlist!</p>
        <Link href="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist ({items.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.isNew && (
                <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
                  New
                </Badge>
              )}
              {product.isSale && (
                <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                  Sale
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 rounded-full"
                onClick={() => handleRemoveFromWishlist(product.id)}
              >
                <Heart className="h-4 w-4 fill-current" />
              </Button>
            </div>
            <CardContent className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 mb-2">{product.category}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
