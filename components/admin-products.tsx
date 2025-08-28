"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  price: number
  salePrice?: number
  category: string
  subcategory: string
  stock: number
  images: string[]
  status: "active" | "inactive" | "draft"
  tags: string[]
  createdAt: string
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Urban Streetwear Hoodie",
    description: "Premium cotton blend hoodie with modern streetwear design",
    price: 89.99,
    salePrice: 69.99,
    category: "men",
    subcategory: "hoodies",
    stock: 45,
    images: ["/urban-streetwear-hoodie.png"],
    status: "active",
    tags: ["streetwear", "hoodie", "cotton"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Minimalist Denim Jacket",
    description: "Classic denim jacket with a modern minimalist approach",
    price: 129.99,
    category: "women",
    subcategory: "jackets",
    stock: 23,
    images: ["/minimalist-denim-jacket.png"],
    status: "active",
    tags: ["denim", "jacket", "minimalist"],
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    name: "Essential Cotton Tee",
    description: "Soft, comfortable cotton t-shirt for everyday wear",
    price: 29.99,
    category: "unisex",
    subcategory: "t-shirts",
    stock: 0,
    images: ["/placeholder.svg?height=200&width=200"],
    status: "inactive",
    tags: ["cotton", "basic", "tee"],
    createdAt: "2024-01-13",
  },
]

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    category: "",
    subcategory: "",
    stock: "",
    images: [""],
    tags: "",
  })

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category === filterCategory
    const matchesStatus = filterStatus === "all" || product.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      price: Number.parseFloat(newProduct.price),
      salePrice: newProduct.salePrice ? Number.parseFloat(newProduct.salePrice) : undefined,
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      stock: Number.parseInt(newProduct.stock) || 0,
      images: newProduct.images.filter((img) => img.trim() !== ""),
      status: "active",
      tags: newProduct.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      createdAt: new Date().toISOString().split("T")[0],
    }

    setProducts([...products, product])
    setNewProduct({
      name: "",
      description: "",
      price: "",
      salePrice: "",
      category: "",
      subcategory: "",
      stock: "",
      images: [""],
      tags: "",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Success",
      description: "Product added successfully",
    })
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
    toast({
      title: "Success",
      description: "Product deleted successfully",
    })
  }

  const handleStatusChange = (id: string, status: "active" | "inactive" | "draft") => {
    setProducts(products.map((p) => (p.id === id ? { ...p, status } : p)))
    toast({
      title: "Success",
      description: "Product status updated",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (stock < 10) return { text: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
    return { text: "In Stock", color: "bg-green-100 text-green-800" }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    value={newProduct.salePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    id="subcategory"
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct({ ...newProduct, subcategory: e.target.value })}
                    placeholder="e.g., hoodies, t-shirts"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newProduct.tags}
                    onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
                    placeholder="streetwear, cotton, casual"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newProduct.images[0]}
                  onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value] })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="unisex">Unisex</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={product.images[0] || "/placeholder.svg?height=40&width=40"}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.description.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="capitalize">{product.category}</p>
                        {product.subcategory && (
                          <p className="text-sm text-muted-foreground capitalize">{product.subcategory}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {product.salePrice ? (
                          <>
                            <p className="font-medium">${product.salePrice}</p>
                            <p className="text-sm text-muted-foreground line-through">${product.price}</p>
                          </>
                        ) : (
                          <p className="font-medium">${product.price}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.stock}</p>
                        <Badge className={stockStatus.color}>{stockStatus.text}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={product.status}
                        onValueChange={(value: "active" | "inactive" | "draft") =>
                          handleStatusChange(product.id, value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
