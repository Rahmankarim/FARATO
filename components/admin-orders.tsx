"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items: OrderItem[]
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    status: "processing",
    total: 159.98,
    items: [
      {
        id: "1",
        name: "Urban Streetwear Hoodie",
        price: 69.99,
        quantity: 1,
        image: "/urban-streetwear-hoodie.png",
      },
      {
        id: "2",
        name: "Essential Cotton Tee",
        price: 29.99,
        quantity: 3,
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    status: "shipped",
    total: 129.99,
    items: [
      {
        id: "2",
        name: "Minimalist Denim Jacket",
        price: 129.99,
        quantity: 1,
        image: "/minimalist-denim-jacket.png",
      },
    ],
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
    paymentMethod: "PayPal",
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    status: "delivered",
    total: 89.99,
    items: [
      {
        id: "1",
        name: "Urban Streetwear Hoodie",
        price: 89.99,
        quantity: 1,
        image: "/urban-streetwear-hoodie.png",
      },
    ],
    shippingAddress: {
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    createdAt: "2024-01-13T12:00:00Z",
    updatedAt: "2024-01-16T16:30:00Z",
  },
]

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { toast } = useToast()

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order,
      ),
    )

    toast({
      title: "Success",
      description: `Order ${orderId} status updated to ${newStatus}`,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          {
            status: "pending",
            count: orders.filter((o) => o.status === "pending").length,
            color: "bg-yellow-100 text-yellow-800",
          },
          {
            status: "processing",
            count: orders.filter((o) => o.status === "processing").length,
            color: "bg-blue-100 text-blue-800",
          },
          {
            status: "shipped",
            count: orders.filter((o) => o.status === "shipped").length,
            color: "bg-purple-100 text-purple-800",
          },
          {
            status: "delivered",
            count: orders.filter((o) => o.status === "delivered").length,
            color: "bg-green-100 text-green-800",
          },
          {
            status: "cancelled",
            count: orders.filter((o) => o.status === "cancelled").length,
            color: "bg-red-100 text-red-800",
          },
        ].map((stat) => (
          <Card key={stat.status}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium capitalize">{stat.status}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
                <div className={`p-2 rounded-full ${stat.color}`}>{getStatusIcon(stat.status)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <p className="font-medium">{order.id}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value: Order["status"]) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{formatDate(order.createdAt)}</p>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.id}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Customer Info */}
                            <div>
                              <h3 className="font-semibold mb-2">Customer Information</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p>
                                    <strong>Name:</strong> {selectedOrder.customerName}
                                  </p>
                                  <p>
                                    <strong>Email:</strong> {selectedOrder.customerEmail}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Payment:</strong> {selectedOrder.paymentMethod}
                                  </p>
                                  <p>
                                    <strong>Status:</strong>
                                    <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                                      {selectedOrder.status}
                                    </Badge>
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                              <h3 className="font-semibold mb-2">Shipping Address</h3>
                              <div className="text-sm">
                                <p>{selectedOrder.shippingAddress.street}</p>
                                <p>
                                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                                  {selectedOrder.shippingAddress.zipCode}
                                </p>
                                <p>{selectedOrder.shippingAddress.country}</p>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div>
                              <h3 className="font-semibold mb-2">Order Items</h3>
                              <div className="space-y-2">
                                {selectedOrder.items.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                      <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                      </div>
                                    </div>
                                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between items-center pt-4 border-t">
                                <p className="font-semibold">Total:</p>
                                <p className="font-semibold text-lg">${selectedOrder.total.toFixed(2)}</p>
                              </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p>
                                  <strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <strong>Last Updated:</strong> {formatDate(selectedOrder.updatedAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
