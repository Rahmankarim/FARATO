"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileSidebar } from "@/components/profile-sidebar"
import { ProfileInfo } from "@/components/profile-info"
import { ProfileOrders } from "@/components/profile-orders"
import { ProfileWishlist } from "@/components/profile-wishlist"
import { ProfileAddresses } from "@/components/profile-addresses"
import { ProfileSettings } from "@/components/profile-settings"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info")

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return <ProfileInfo />
      case "orders":
        return <ProfileOrders />
      case "wishlist":
        return <ProfileWishlist />
      case "addresses":
        return <ProfileAddresses />
      case "settings":
        return <ProfileSettings />
      default:
        return <ProfileInfo />
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="lg:col-span-3">{renderContent()}</div>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
