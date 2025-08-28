"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { 
  ArrowLeft,
  Eye, 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  Mail,
  Send,
  Edit,
  ShoppingCart
} from "lucide-react"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

interface Order {
  id: string
  userId?: string
  date?: string
  customerName?: string // Keep for backward compatibility
  customerEmail?: string // Keep for backward compatibility
  customerInfo?: {
    firstName: string
    lastName: string
    email: string
  }
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
  trackingNumber?: string
  estimatedDelivery?: string
  notes?: string[]
}

export default function AdminOrdersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [messageSubject, setMessageSubject] = useState("")
  const [messageContent, setMessageContent] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Helper functions to handle both old and new order formats
  const getCustomerName = (order: Order) => {
    if (order.customerInfo) {
      return `${order.customerInfo.firstName} ${order.customerInfo.lastName}`.trim()
    }
    return order.customerName || 'Unknown Customer'
  }

  const getCustomerEmail = (order: Order) => {
    return order.customerInfo?.email || order.customerEmail || 'No email'
  }

  useEffect(() => {
    // Check admin authentication
    const adminSession = localStorage.getItem("admin_session")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }
    setIsAuthenticated(true)

    // Load orders from localStorage
    loadOrders()
  }, [router])

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("farato_orders") || "[]")
    setOrders(storedOrders)
  }

  const filteredOrders = orders.filter((order) => {
    const customerName = getCustomerName(order)
    const customerEmail = getCustomerEmail(order)
    
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || order.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId 
        ? { 
            ...order, 
            status: newStatus, 
            updatedAt: new Date().toISOString(),
            trackingNumber: newStatus === "shipped" && !order.trackingNumber 
              ? `TRK${Date.now()}` 
              : order.trackingNumber,
            estimatedDelivery: newStatus === "shipped" && !order.estimatedDelivery
              ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
              : order.estimatedDelivery
          } 
        : order
    )
    
    setOrders(updatedOrders)
    localStorage.setItem("farato_orders", JSON.stringify(updatedOrders))

    toast({
      title: "Status Updated",
      description: `Order ${orderId} status updated to ${newStatus}`,
    })

    // Send automatic email based on status
    if (newStatus === "shipped") {
      sendShippingNotification(orderId)
    }
  }

  const sendShippingNotification = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    try {
      // This would integrate with your email service
      await fetch("/api/send-shipping-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderData: {
            orderId: order.id,
            customerName: getCustomerName(order),
            customerEmail: getCustomerEmail(order),
            shippingAddress: order.shippingAddress
          },
          trackingInfo: {
            carrier: "FedEx",
            trackingNumber: order.trackingNumber,
            trackingUrl: `https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=${order.trackingNumber}`,
            estimatedDelivery: order.estimatedDelivery
          }
        })
      })

      toast({
        title: "Shipping Notification Sent",
        description: `Customer has been notified about shipment tracking.`,
      })
    } catch (error) {
      console.error("Failed to send shipping notification:", error)
    }
  }

  const sendCustomMessage = async () => {
    if (!selectedOrder || !messageSubject || !messageContent) {
      toast({
        title: "Missing Information",
        description: "Please fill in subject and message content.",
        variant: "destructive"
      })
      return
    }

    setIsSendingMessage(true)

    try {
      // This would integrate with your email service
      const response = await fetch("/api/send-customer-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: getCustomerEmail(selectedOrder),
          customerName: getCustomerName(selectedOrder),
          orderId: selectedOrder.id,
          subject: messageSubject,
          content: messageContent
        })
      })

      if (response.ok) {
        // Add note to order
        const updatedOrders = orders.map(order => 
          order.id === selectedOrder.id 
            ? {
                ...order,
                notes: [
                  ...(order.notes || []),
                  `${new Date().toLocaleString()}: Admin message sent - ${messageSubject}`
                ]
              }
            : order
        )
        
        setOrders(updatedOrders)
        localStorage.setItem("farato_orders", JSON.stringify(updatedOrders))

        toast({
          title: "Message Sent",
          description: `Message sent to ${selectedOrder.customerEmail}`,
        })

        setIsMessageDialogOpen(false)
        setMessageSubject("")
        setMessageContent("")
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Failed to Send Message",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsSendingMessage(false)
    }
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
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 0
      case "processing":
        return 25
      case "shipped":
        return 75
      case "delivered":
        return 100
      case "cancelled":
        return 0
      default:
        return 0
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const calculateStats = () => {
    const total = orders.length
    const pending = orders.filter(o => o.status === "pending").length
    const processing = orders.filter(o => o.status === "processing").length
    const shipped = orders.filter(o => o.status === "shipped").length
    const delivered = orders.filter(o => o.status === "delivered").length
    const cancelled = orders.filter(o => o.status === "cancelled").length
    const totalRevenue = orders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, order) => sum + order.total, 0)

    return { total, pending, processing, shipped, delivered, cancelled, totalRevenue }
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage customer orders and send updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipped</CardTitle>
              <Truck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders, customers..."
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
            <CardDescription>Manage customer orders and track their progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <p className="font-medium">{order.id}</p>
                      {order.trackingNumber && (
                        <p className="text-xs text-muted-foreground">Track: {order.trackingNumber}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{getCustomerName(order)}</p>
                        <p className="text-sm text-muted-foreground">{getCustomerEmail(order)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{order.items.length} items</p>
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
                      <div className="space-y-1">
                        <Progress value={getStatusProgress(order.status)} className="w-20 h-2" />
                        <p className="text-xs text-muted-foreground">{getStatusProgress(order.status)}%</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{formatDate(order.createdAt)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Order Details - {order.id}</DialogTitle>
                              <DialogDescription>
                                Placed on {formatDate(order.createdAt)}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Customer Info */}
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <h3 className="font-semibold mb-2">Customer Information</h3>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Name:</strong> {getCustomerName(selectedOrder)}</p>
                                      <p><strong>Email:</strong> {getCustomerEmail(selectedOrder)}</p>
                                      <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold mb-2">Order Status</h3>
                                    <div className="space-y-2">
                                      <Badge className={getStatusColor(selectedOrder.status)}>
                                        {getStatusIcon(selectedOrder.status)}
                                        <span className="ml-1 capitalize">{selectedOrder.status}</span>
                                      </Badge>
                                      <Progress value={getStatusProgress(selectedOrder.status)} className="w-full" />
                                      {selectedOrder.trackingNumber && (
                                        <p className="text-sm"><strong>Tracking:</strong> {selectedOrder.trackingNumber}</p>
                                      )}
                                      {selectedOrder.estimatedDelivery && (
                                        <p className="text-sm"><strong>Est. Delivery:</strong> {selectedOrder.estimatedDelivery}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                                  <div className="text-sm p-3 bg-gray-50 rounded">
                                    <p>{selectedOrder.shippingAddress.street}</p>
                                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                                    <p>{selectedOrder.shippingAddress.country}</p>
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                  <h3 className="font-semibold mb-2">Order Items</h3>
                                  <div className="space-y-2">
                                    {selectedOrder.items.map((item) => (
                                      <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                                        <div className="flex items-center gap-3">
                                          <Image
                                            src={item.image || "/placeholder.jpg"}
                                            alt={item.name}
                                            width={48}
                                            height={48}
                                            className="object-cover rounded"
                                          />
                                          <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                              Qty: {item.quantity}
                                              {item.size && ` • Size: ${item.size}`}
                                              {item.color && ` • Color: ${item.color}`}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                          <p className="text-sm text-muted-foreground">${item.price} each</p>
                                        </div>
                                      </div>
                                    ))}
                                    <div className="border-t pt-2 text-right">
                                      <p className="text-lg font-bold">Total: ${selectedOrder.total.toFixed(2)}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Notes */}
                                {selectedOrder.notes && selectedOrder.notes.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-2">Admin Notes</h3>
                                    <div className="space-y-1">
                                      {selectedOrder.notes.map((note, index) => (
                                        <p key={index} className="text-sm p-2 bg-blue-50 rounded">{note}</p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsMessageDialogOpen(true)
                            setMessageSubject(`Update on your order ${order.id}`)
                          }}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders found</p>
                <p className="text-sm text-muted-foreground">Orders will appear here when customers make purchases</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to Customer</DialogTitle>
            <DialogDescription>
              Send a custom message to {selectedOrder?.customerEmail}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="Enter message subject"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Enter your message to the customer..."
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={sendCustomMessage} disabled={isSendingMessage}>
                {isSendingMessage ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
