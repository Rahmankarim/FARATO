"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Clock, TrendingUp, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSearch } from "@/components/search-provider"
import { SearchResults } from "@/components/search-results"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  className?: string
  placeholder?: string
  showResults?: boolean
  onClose?: () => void
}

export function SearchBar({
  className,
  placeholder = "Search for products...",
  showResults = true,
  onClose,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const {
    searchQuery,
    searchResults,
    isSearching,
    recentSearches,
    popularSearches,
    setSearchQuery,
    performSearch,
    clearSearch,
    addToRecentSearches,
  } = useSearch()

  // Handle search input changes with debounce
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue)
        if (inputValue.trim()) {
          performSearch(inputValue)
        }
      }
    }, 300)

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [inputValue, searchQuery, setSearchQuery, performSearch])

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setIsOpen(true)
  }

  const handleSearch = (query: string) => {
    setInputValue(query)
    setSearchQuery(query)
    performSearch(query)
    addToRecentSearches(query)
    setIsOpen(false)
    inputRef.current?.blur()

    // Navigate to search results page
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleClear = () => {
    setInputValue("")
    clearSearch()
    setIsOpen(false)
    onClose?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleSearch(inputValue)
    }
    if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const hasResults = searchResults.length > 0
  const hasQuery = inputValue.trim().length > 0
  const showSuggestions = isOpen && !hasQuery
  const showSearchResults = isOpen && hasQuery && showResults

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {(inputValue || isSearching) && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={handleClear}
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Search Dropdown */}
      {(showSuggestions || showSearchResults) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {showSuggestions && (
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showSearchResults && (
            <div className="border-t">
              {isSearching ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-muted-foreground">Searching...</span>
                </div>
              ) : hasResults ? (
                <SearchResults results={searchResults} query={inputValue} onResultClick={() => setIsOpen(false)} />
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground mb-2">No products found for "{inputValue}"</p>
                  <p className="text-sm text-muted-foreground">Try searching for something else</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
