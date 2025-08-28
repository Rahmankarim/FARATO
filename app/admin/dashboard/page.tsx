"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Plus,
  LogOut,
  BarChart3,
  Settings
} from "lucide-react"

interface DashboardStats {
  totalProducts: number
  totalUsers: number
  totalOrders: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const router = useRouter()

  useEffect(() => {
    // Check admin authentication
    const adminSession = localStorage.getItem("admin_session")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }
    setIsAuthenticated(true)

    // Load dashboard stats
    loadDashboardStats()
  }, [router])

  const loadDashboardStats = () => {
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem("farato_products") || "[]")
    const users = JSON.parse(localStorage.getItem("farato_users") || "[]")
    let orders = JSON.parse(localStorage.getItem("farato_orders") || "[]")
    
    // Create demo orders if none exist
    if (orders.length === 0 && products.length > 0) {
      const demoOrders = [
        {
          id: `ORD-${Date.now() - 86400000}`, // 1 day ago
          userId: "john.doe@example.com",
          date: new Date(Date.now() - 86400000).toISOString(),
          status: "delivered",
          total: 159.99,
          items: [
            {
              id: "1",
              name: "Urban Streetwear Hoodie",
              price: 89.99,
              quantity: 1,
              image: "/urban-streetwear-hoodie.png",
              size: "L",
              color: "Black"
            },
            {
              id: "2",
              name: "Essential Cotton Tee",
              price: 29.99,
              quantity: 2,
              image: "/placeholder-3kmqz.png",
              size: "M",
              color: "White"
            }
          ],
          customerInfo: {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com"
          },
          shippingAddress: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA"
          },
          paymentMethod: "Credit Card",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 43200000).toISOString(),
          trackingNumber: "TRK123456789",
          estimatedDelivery: new Date(Date.now() - 3600000).toLocaleDateString()
        },
        {
          id: `ORD-${Date.now() - 43200000}`, // 12 hours ago
          userId: "jane.smith@example.com",
          date: new Date(Date.now() - 43200000).toISOString(),
          status: "shipped",
          total: 89.99,
          items: [
            {
              id: "2",
              name: "Minimalist Denim Jacket",
              price: 129.99,
              quantity: 1,
              image: "/minimalist-denim-jacket.png",
              size: "S",
              color: "Blue"
            }
          ],
          customerInfo: {
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com"
          },
          shippingAddress: {
            street: "456 Oak Ave",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210",
            country: "USA"
          },
          paymentMethod: "PayPal",
          createdAt: new Date(Date.now() - 43200000).toISOString(),
          updatedAt: new Date(Date.now() - 21600000).toISOString(),
          trackingNumber: "TRK987654321",
          estimatedDelivery: new Date(Date.now() + 172800000).toLocaleDateString()
        },
        {
          id: `ORD-${Date.now() - 7200000}`, // 2 hours ago
          userId: "mike.johnson@example.com",
          date: new Date(Date.now() - 7200000).toISOString(),
          status: "processing",
          total: 45.98,
          items: [
            {
              id: "3",
              name: "Essential Cotton Tee",
              price: 29.99,
              quantity: 1,
              image: "/placeholder-3kmqz.png",
              size: "L",
              color: "Navy"
            }
          ],
          customerInfo: {
            firstName: "Mike",
            lastName: "Johnson",
            email: "mike.johnson@example.com"
          },
          shippingAddress: {
            street: "789 Pine St",
            city: "Chicago",
            state: "IL",
            zipCode: "60601",
            country: "USA"
          },
          paymentMethod: "Cash on Delivery",
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          updatedAt: new Date(Date.now() - 7200000).toISOString()
        }
      ]
      
      orders = demoOrders
      localStorage.setItem("farato_orders", JSON.stringify(orders))
    }
    
    // Calculate real revenue from actual orders
    const totalRevenue = orders
      .filter((order: any) => order.status !== "cancelled")
      .reduce((sum: number, order: any) => sum + (order.total || 0), 0)
    
    setStats({
      totalProducts: products.length,
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue: Math.round(totalRevenue)
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_session")
    router.push("/admin/login")
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your e-commerce store
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Active products in store
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Orders this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">
                Total revenue this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/admin/products">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Manage Products
                </CardTitle>
                <CardDescription>
                  View, edit, and manage your product catalog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{stats.totalProducts} products</Badge>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/admin/orders">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Manage Orders
                </CardTitle>
                <CardDescription>
                  Track orders and communicate with customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{stats.totalOrders} orders</Badge>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/admin/products/new">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Product
                </CardTitle>
                <CardDescription>
                  Upload new products to your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Product
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Analytics
              </CardTitle>
              <CardDescription>
                View sales and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Coming Soon</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
