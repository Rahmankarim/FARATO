import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/components/cart-provider"
import { SearchProvider } from "@/components/search-provider"
import { AuthProvider } from "@/components/nextauth-provider"
import { WishlistProvider } from "@/components/wishlist-provider"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Farato - Modern Fashion for the Bold",
  description:
    "Discover the latest in streetwear and fashion. Premium quality, cutting-edge designs for the modern generation.",
  keywords: "fashion, streetwear, clothing, modern, trendy, outfitters, style",
  openGraph: {
    title: "Farato - Modern Fashion for the Bold",
    description: "Discover the latest in streetwear and fashion",
    images: ["/og-image.jpg"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <AuthProvider>
              <SearchProvider>
                <CartProvider>
                  <WishlistProvider>
                    {children}
                    <Toaster />
                  </WishlistProvider>
                </CartProvider>
              </SearchProvider>
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
