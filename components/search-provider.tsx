"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface SearchResult {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew?: boolean
  isSale?: boolean
  colors: string[]
  sizes: string[]
  description?: string
}

interface SearchContextType {
  searchQuery: string
  searchResults: SearchResult[]
  isSearching: boolean
  recentSearches: string[]
  popularSearches: string[]
  setSearchQuery: (query: string) => void
  performSearch: (query: string) => Promise<void>
  clearSearch: () => void
  addToRecentSearches: (query: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

// Mock product data for search
const allProducts: SearchResult[] = [
  {
    id: 1,
    name: "Urban Streetwear Hoodie",
    price: 89.99,
    originalPrice: 119.99,
    image: "/urban-streetwear-hoodie.png",
    category: "Hoodies",
    isNew: true,
    isSale: true,
    colors: ["Black", "White", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    description: "Premium cotton blend hoodie with modern streetwear design",
  },
  {
    id: 2,
    name: "Minimalist Denim Jacket",
    price: 129.99,
    image: "/minimalist-denim-jacket.png",
    category: "Jackets",
    isNew: false,
    isSale: false,
    colors: ["Blue", "Black"],
    sizes: ["S", "M", "L", "XL"],
    description: "Classic denim jacket with clean lines and modern fit",
  },
  {
    id: 3,
    name: "Essential Cotton Tee",
    price: 29.99,
    image: "/placeholder-3kmqz.png",
    category: "T-Shirts",
    isNew: false,
    isSale: false,
    colors: ["White", "Black", "Navy", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Soft cotton t-shirt perfect for everyday wear",
  },
  {
    id: 4,
    name: "Cargo Utility Pants",
    price: 79.99,
    originalPrice: 99.99,
    image: "/cargo-pants-utility.png",
    category: "Jeans",
    isNew: true,
    isSale: true,
    colors: ["Black", "Navy"],
    sizes: ["28", "30", "32", "34", "36"],
    description: "Functional cargo pants with multiple pockets and modern fit",
  },
  {
    id: 5,
    name: "Oversized Blazer",
    price: 159.99,
    image: "/blazer.png",
    category: "Jackets",
    isNew: true,
    isSale: false,
    colors: ["Black", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "Contemporary oversized blazer for professional and casual wear",
  },
  {
    id: 6,
    name: "High-Waist Jeans",
    price: 69.99,
    image: "/folded-denim-stack.png",
    category: "Jeans",
    isNew: false,
    isSale: false,
    colors: ["Blue", "Black", "White"],
    sizes: ["24", "26", "28", "30", "32"],
    description: "Flattering high-waist jeans with stretch comfort",
  },
  {
    id: 7,
    name: "Classic White Sneakers",
    price: 99.99,
    image: "/diverse-sneaker-collection.png",
    category: "Shoes",
    isNew: false,
    isSale: false,
    colors: ["White", "Black"],
    sizes: ["7", "8", "9", "10", "11"],
    description: "Timeless white sneakers that go with everything",
  },
  {
    id: 8,
    name: "Leather Crossbody Bag",
    price: 149.99,
    originalPrice: 199.99,
    image: "/brown-leather-messenger-bag.png",
    category: "Accessories",
    isNew: false,
    isSale: true,
    colors: ["Black", "Brown"],
    sizes: ["One Size"],
    description: "Premium leather crossbody bag with adjustable strap",
  },
  {
    id: 9,
    name: "Vintage Band T-Shirt",
    price: 39.99,
    image: "/generic-band-tshirt.png",
    category: "T-Shirts",
    isNew: true,
    isSale: false,
    colors: ["Black", "White", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    description: "Authentic vintage band t-shirt with distressed finish",
  },
  {
    id: 10,
    name: "Wool Blend Coat",
    price: 249.99,
    originalPrice: 299.99,
    image: "/cozy-wool-coat.png",
    category: "Jackets",
    isNew: false,
    isSale: true,
    colors: ["Black", "Camel", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "Elegant wool blend coat for cold weather styling",
  },
]

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(["hoodie", "jeans", "sneakers", "jacket"])
  const [popularSearches] = useState<string[]>([
    "streetwear",
    "denim",
    "accessories",
    "sale",
    "new arrivals",
    "hoodies",
  ])

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const results = allProducts.filter((product) => {
      const searchTerm = query.toLowerCase()
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.colors.some((color) => color.toLowerCase().includes(searchTerm))
      )
    })

    setSearchResults(results)
    setIsSearching(false)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery("")
    setSearchResults([])
  }, [])

  const addToRecentSearches = useCallback((query: string) => {
    if (!query.trim()) return

    setRecentSearches((prev) => {
      const filtered = prev.filter((search) => search !== query)
      return [query, ...filtered].slice(0, 5)
    })
  }, [])

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        searchResults,
        isSearching,
        recentSearches,
        popularSearches,
        setSearchQuery,
        performSearch,
        clearSearch,
        addToRecentSearches,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}
