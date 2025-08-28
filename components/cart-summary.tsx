"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { useState } from "react"
import Link from "next/link"

export function CartSummary() {
  const { total, items } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const subtotal = total
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const finalTotal = subtotal + shipping + tax - discount

  const handlePromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(subtotal * 0.1)
    }
  }

  return (
    <div className="bg-muted/30 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal ({items.length} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between font-semibold text-lg mb-6">
        <span>Total</span>
        <span>${finalTotal.toFixed(2)}</span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex gap-2">
          <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
          <Button variant="outline" onClick={handlePromoCode}>
            Apply
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Button className="w-full" size="lg" asChild>
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">Free shipping on orders over $100</p>
    </div>
  )
}
