"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, Mail, ArrowRight } from "lucide-react"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    // In a real app, you would fetch order details from your API
    if (orderId) {
      setOrderDetails({
        id: orderId,
        status: "confirmed",
        estimatedDelivery: "5-7 business days",
        trackingNumber: `TRK${Date.now()}`,
        items: [
          {
            name: "Urban Streetwear Hoodie",
            quantity: 1,
            price: 69.99,
            image: "/urban-streetwear-hoodie.png",
          },
        ],
        total: 89.97,
        shippingAddress: {
          name: "John Doe",
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
        },
      })
    }
  }, [orderId])

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <p className="text-muted-foreground">No order information found.</p>
            <Button asChild className="mt-4">
              <Link href="/">Return to Store</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-medium">{orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-green-100 text-green-800">{orderDetails?.status || "Confirmed"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Estimated Delivery</span>
                  <span className="font-medium">{orderDetails?.estimatedDelivery}</span>
                </div>
                {orderDetails?.trackingNumber && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tracking Number</span>
                    <span className="font-medium">{orderDetails.trackingNumber}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {orderDetails?.shippingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="font-medium">{orderDetails.shippingAddress.name}</p>
                    <p>{orderDetails.shippingAddress.street}</p>
                    <p>
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}{" "}
                      {orderDetails.shippingAddress.zipCode}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Confirmation Email</p>
                    <p className="text-sm text-muted-foreground">
                      We've sent a confirmation email with your order details.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-muted-foreground">Your order is being prepared for shipment.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Shipping Updates</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive tracking information once your order ships.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderDetails?.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${orderDetails?.total?.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <Button asChild className="w-full">
                <Link href="/profile">
                  View Order History
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
