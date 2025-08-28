"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { User, ShoppingBag, Heart, MapPin, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/components/nextauth-provider"

interface ProfileSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  { id: "info", label: "Profile Info", icon: User },
  { id: "orders", label: "Order History", icon: ShoppingBag },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
]

export function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
  const { user, logout } = useAuth()

  const getInitials = () => {
    if (!user) return "U"
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src={user?.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-lg font-semibold">{getInitials()}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          )
        })}
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-700"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  )
}
