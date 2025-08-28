"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Star } from "lucide-react"
import { useState } from "react"

const salesData = [
  { month: "Jan", revenue: 12500, orders: 145, customers: 89 },
  { month: "Feb", revenue: 15200, orders: 178, customers: 102 },
  { month: "Mar", revenue: 18900, orders: 203, customers: 125 },
  { month: "Apr", revenue: 16800, orders: 189, customers: 118 },
  { month: "May", revenue: 21300, orders: 234, customers: 142 },
  { month: "Jun", revenue: 24500, orders: 267, customers: 156 },
]

const topProducts = [
  { name: "Urban Streetwear Hoodie", sales: 156, revenue: 13944.44, growth: 23.5 },
  { name: "Minimalist Denim Jacket", sales: 98, revenue: 12739.02, growth: 18.2 },
  { name: "Essential Cotton Tee", sales: 234, revenue: 7017.66, growth: -5.3 },
  { name: "Cargo Utility Pants", sales: 87, revenue: 6959.13, growth: 12.8 },
  { name: "Classic White Sneakers", sales: 76, revenue: 6079.24, growth: 8.9 },
]

const customerSegments = [
  { segment: "New Customers", count: 234, percentage: 35.2, color: "bg-blue-100 text-blue-800" },
  { segment: "Returning Customers", count: 312, percentage: 46.9, color: "bg-green-100 text-green-800" },
  { segment: "VIP Customers", count: 89, percentage: 13.4, color: "bg-purple-100 text-purple-800" },
  { segment: "Inactive Customers", count: 30, percentage: 4.5, color: "bg-gray-100 text-gray-800" },
]

const recentActivity = [
  { type: "order", message: "New order #ORD-1234 placed", time: "2 minutes ago", icon: ShoppingCart },
  { type: "user", message: "New user registration: john@example.com", time: "5 minutes ago", icon: Users },
  { type: "product", message: "Product 'Urban Hoodie' stock low (5 remaining)", time: "10 minutes ago", icon: Package },
  { type: "review", message: "New 5-star review on 'Denim Jacket'", time: "15 minutes ago", icon: Star },
  { type: "order", message: "Order #ORD-1230 shipped", time: "20 minutes ago", icon: ShoppingCart },
]

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("6months")

  const currentMonth = salesData[salesData.length - 1]
  const previousMonth = salesData[salesData.length - 2]

  const revenueGrowth = (((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100).toFixed(1)
  const ordersGrowth = (((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100).toFixed(1)
  const customersGrowth = (
    ((currentMonth.customers - previousMonth.customers) / previousMonth.customers) *
    100
  ).toFixed(1)

  const totalRevenue = salesData.reduce((sum, month) => sum + month.revenue, 0)
  const totalOrders = salesData.reduce((sum, month) => sum + month.orders, 0)
  const totalCustomers = customerSegments.reduce((sum, segment) => sum + segment.count, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your store's performance and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+{revenueGrowth}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+{ordersGrowth}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+{customersGrowth}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue / totalOrders).toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">+5.2%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Revenue chart would go here</p>
                <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.revenue.toFixed(2)}</p>
                    <div className="flex items-center text-xs">
                      {product.growth > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                      )}
                      <span className={product.growth > 0 ? "text-green-500" : "text-red-500"}>
                        {product.growth > 0 ? "+" : ""}
                        {product.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerSegments.map((segment) => (
                <div key={segment.segment} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={segment.color}>{segment.segment}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{segment.count}</p>
                    <p className="text-sm text-muted-foreground">{segment.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {salesData.map((month) => (
              <div key={month.month} className="text-center p-4 border rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">{month.month}</p>
                <p className="text-lg font-bold">${month.revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{month.orders} orders</p>
                <p className="text-xs text-muted-foreground">{month.customers} customers</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
