"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import AdminDashboard from "@/components/admin-dashboard"
import { AdminProducts } from "@/components/admin-products"
import { AdminOrders } from "@/components/admin-orders"
import { AdminUsers } from "@/components/admin-users"
import { AdminAnalytics } from "@/components/admin-analytics"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
  return <AdminDashboard section={activeTab} />
      case "products":
        return <AdminProducts />
      case "orders":
        return <AdminOrders />
      case "users":
        return <AdminUsers />
      case "analytics":
        return <AdminAnalytics />
      default:
  return <AdminDashboard section={activeTab} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
  <AdminSidebar />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6">{renderContent()}</main>
        </div>
      </div>
    </div>
  )
}
