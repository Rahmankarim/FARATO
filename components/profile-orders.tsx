"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"
import { useAuth } from "@/components/nextauth-provider"

interface OrderItem {
  id: number | string
  name: string
  price: number
  quantity: number
  image: string
  size?: string
  color?: string
}

interface Order {
  id: string
  userId: string
  date: string
  status: string
  total: number
  items: OrderItem[]
  customerInfo: {
    firstName: string
    lastName: string
    email: string
  }
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "processing":
      return <Clock className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-500"
    case "shipped":
      return "bg-blue-500"
    case "processing":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

export function ProfileOrders() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null)
  const { user, isLoading } = useAuth()

  // Load orders from localStorage and filter by current user
  useEffect(() => {
    if (isLoading) return // Wait for auth to load
    
    if (!user || !user.email) {
      setUserOrders([])
      return
    }

    try {
      const allOrders = JSON.parse(localStorage.getItem("farato_orders") || "[]")
      const filteredOrders = allOrders.filter((order: Order) => 
        order?.customerInfo?.email === user.email
      )
      
      // Sort by date (newest first)
      const sortedOrders = filteredOrders.sort((a: Order, b: Order) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      
      setUserOrders(sortedOrders)
    } catch (error) {
      console.error("Error loading user orders:", error)
      setUserOrders([])
    }
  }, [user, isLoading])

  const handleReorder = (order: Order) => {
    // This would typically add all items from the order back to cart
    console.log("Reordering:", order.id)
    // Implementation would depend on cart provider setup
  }

  // Show loading state while authentication is loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Order History</h2>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your orders...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Order History</h2>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      <div className="space-y-4">
        {userOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                  <p className="font-semibold">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                        {item.size && ` • Size: ${item.size}`}
                        {item.color && ` • Color: ${item.color}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrderDetails(order)}>
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Order Details - {order.id}</DialogTitle>
                    </DialogHeader>
                    {selectedOrderDetails && (
                      <div className="space-y-6">
                        {/* Order Info */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold mb-2">Order Information</h3>
                            <div className="space-y-1 text-sm">
                              <p><strong>Order ID:</strong> {selectedOrderDetails.id}</p>
                              <p><strong>Date:</strong> {new Date(selectedOrderDetails.date).toLocaleDateString()}</p>
                              <p><strong>Status:</strong> <Badge className={getStatusColor(selectedOrderDetails.status)}>{selectedOrderDetails.status}</Badge></p>
                              <p><strong>Total:</strong> ${selectedOrderDetails.total.toFixed(2)}</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Shipping Address</h3>
                            <div className="text-sm">
                              <p>{selectedOrderDetails.shippingAddress.street}</p>
                              <p>{selectedOrderDetails.shippingAddress.city}, {selectedOrderDetails.shippingAddress.state} {selectedOrderDetails.shippingAddress.zipCode}</p>
                              <p>{selectedOrderDetails.shippingAddress.country}</p>
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        <div>
                          <h3 className="font-semibold mb-3">Order Items</h3>
                          <div className="space-y-3">
                            {selectedOrderDetails.items.map((item, index) => (
                              <div key={`${item.id}-${index}`} className="flex items-center gap-3 p-3 border rounded-lg">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Qty: {item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                                  </p>
                                  {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                                  {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                {order.status === "delivered" && (
                  <Button variant="outline" size="sm" onClick={() => handleReorder(order)}>
                    Reorder
                  </Button>
                )}
                {order.status === "shipped" && (
                  <Button variant="outline" size="sm">
                    Track Package
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {userOrders.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
