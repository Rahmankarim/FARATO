"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, User, Menu, Sun, Moon, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/nextauth-provider"
import { SearchBar } from "@/components/search-bar"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const { items } = useCart()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const getInitials = () => {
    if (!user) return "U"
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <Link href="/men" className="text-lg font-medium hover:text-primary transition-colors">
                  Men
                </Link>
                <Link href="/women" className="text-lg font-medium hover:text-primary transition-colors">
                  Women
                </Link>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Shop by Category</p>
                  <div className="flex flex-col space-y-2 pl-4">
                    <Link href="/category/t-shirts-tops" className="text-sm hover:text-primary transition-colors">
                      T-Shirts & Tops
                    </Link>
                    <Link href="/category/hoodies-sweatshirts" className="text-sm hover:text-primary transition-colors">
                      Hoodies & Sweatshirts
                    </Link>
                    <Link href="/category/jeans-denim" className="text-sm hover:text-primary transition-colors">
                      Jeans & Denim
                    </Link>
                    <Link href="/category/jackets-outerwear" className="text-sm hover:text-primary transition-colors">
                      Jackets & Outerwear
                    </Link>
                    <Link href="/category/dresses-skirts" className="text-sm hover:text-primary transition-colors">
                      Dresses & Skirts
                    </Link>
                    <Link href="/category/pants-trousers" className="text-sm hover:text-primary transition-colors">
                      Pants & Trousers
                    </Link>
                    <Link href="/category/shoes-footwear" className="text-sm hover:text-primary transition-colors">
                      Shoes & Footwear
                    </Link>
                  </div>
                </div>
                <Link href="/accessories" className="text-lg font-medium hover:text-primary transition-colors">
                  Accessories
                </Link>
                <Link href="/sale" className="text-lg font-medium hover:text-primary transition-colors text-red-500">
                  Sale
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            FARATO
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/men" className="text-sm font-medium hover:text-primary transition-colors">
              Men
            </Link>

            <Link href="/women" className="text-sm font-medium hover:text-primary transition-colors">
              Women
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium hover:text-primary transition-colors">
                Shop by Category
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/category/t-shirts-tops">T-Shirts & Tops</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/category/hoodies-sweatshirts">Hoodies & Sweatshirts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/category/jeans-denim">Jeans & Denim</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/category/jackets-outerwear">Jackets & Outerwear</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/category/dresses-skirts">Dresses & Skirts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/category/pants-trousers">Pants & Trousers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/category/shoes-footwear">Shoes & Footwear</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/accessories" className="text-sm font-medium hover:text-primary transition-colors">
              Accessories
            </Link>
            <Link href="/sale" className="text-sm font-medium hover:text-primary transition-colors text-red-500">
              Sale
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* User Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isAuthenticated && user ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="px-2 pb-1.5 text-xs text-muted-foreground">
                      {user.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/profile">Order History</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/admin/login" className="text-blue-600 font-medium">
                        🔐 Admin Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Link href="/login">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/register">Create Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/admin/login" className="text-blue-600 font-medium">
                        🔐 Admin Login
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Shopping Cart */}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}
