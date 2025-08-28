"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"

export function CartItems() {
  const { items, updateQuantity, removeItem } = useCart()

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 p-4 border rounded-lg">
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-md" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground">
              Size: {item.size} | Color: {item.color}
            </p>
            <p className="font-bold mt-1">${item.price}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
