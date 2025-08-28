"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  product: {
    id: number | string
    name: string
    price: number
    originalPrice?: number
    image?: string
    category: string
    isNew?: boolean
    isSale?: boolean
    colors: string[]
    sizes: string[]
  }
  className?: string
  size?: "sm" | "md" | "lg"
}

export function WishlistButton({ product, className, size = "md" }: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const inWishlist = isInWishlist(product.id)

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlist) {
      removeItem(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addItem({
        ...product,
        image: product.image || "/placeholder.svg"
      })
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  }

  return (
    <Button
      variant="outline"
      size={size === "sm" ? "icon" : "lg"}
      className={cn(
        size === "sm" ? sizeClasses[size] : "w-full",
        "bg-white/80 hover:bg-white rounded-full shadow-md transition-all duration-200",
        inWishlist ? "text-red-500 border-red-500" : "text-gray-600 hover:text-red-500",
        className
      )}
      onClick={handleToggleWishlist}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          inWishlist ? "fill-current" : "",
          size !== "sm" ? "mr-2" : ""
        )} 
      />
      {size !== "sm" && (
        <span>{inWishlist ? "Wishlisted" : "Add to Wishlist"}</span>
      )}
    </Button>
  )
}
