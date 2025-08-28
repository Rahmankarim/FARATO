"use client"

import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface Filters {
  category: string[]
  size: string[]
  color: string[]
  priceRange: number[]
  sortBy: string
}

interface ProductFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

const categories = ["T-Shirts", "Hoodies", "Jeans", "Jackets", "Accessories", "Shoes"]
const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
const colors = ["Black", "White", "Gray", "Navy", "Blue", "Red", "Green", "Brown"]

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ? [...filters.category, category] : filters.category.filter((c) => c !== category)

    onFiltersChange({ ...filters, category: newCategories })
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked ? [...filters.size, size] : filters.size.filter((s) => s !== size)

    onFiltersChange({ ...filters, size: newSizes })
  }

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked ? [...filters.color, color] : filters.color.filter((c) => c !== color)

    onFiltersChange({ ...filters, color: newColors })
  }

  return (
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <h3 className="font-semibold mb-3">Sort By</h3>
        <Select value={filters.sortBy} onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={filters.category.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={category} className="text-sm font-normal">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
            max={500}
            min={0}
            step={10}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Sizes */}
      <div>
        <h3 className="font-semibold mb-3">Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={size}
                checked={filters.size.includes(size)}
                onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
              />
              <Label htmlFor={size} className="text-sm font-normal">
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div>
        <h3 className="font-semibold mb-3">Colors</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={color}
                checked={filters.color.includes(color)}
                onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
              />
              <Label htmlFor={color} className="text-sm font-normal">
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
