"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Search, UserPlus, Mail, Phone, MapPin, Calendar, ShoppingBag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  status: "active" | "inactive" | "banned"
  role: "customer" | "admin"
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  joinDate: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "active",
    role: "customer",
    totalOrders: 12,
    totalSpent: 1299.88,
    lastOrderDate: "2024-01-15T10:30:00Z",
    joinDate: "2023-06-15T09:00:00Z",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    role: "customer",
    totalOrders: 8,
    totalSpent: 899.92,
    lastOrderDate: "2024-01-14T15:45:00Z",
    joinDate: "2023-08-22T14:30:00Z",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA",
    },
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "inactive",
    role: "customer",
    totalOrders: 3,
    totalSpent: 299.97,
    lastOrderDate: "2023-12-10T12:00:00Z",
    joinDate: "2023-09-05T11:15:00Z",
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@farato.com",
    status: "active",
    role: "admin",
    totalOrders: 0,
    totalSpent: 0,
    joinDate: "2023-01-01T00:00:00Z",
  },
]

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRole, setFilterRole] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { toast } = useToast()

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    const matchesRole = filterRole === "all" || user.role === filterRole

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))

    toast({
      title: "Success",
      description: `User status updated to ${newStatus}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-yellow-100 text-yellow-800"
      case "banned":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "customer":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage customer accounts and administrators</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <UserPlus className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Customers</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.role === "customer").length}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Admins</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{user.totalOrders}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">${user.totalSpent.toFixed(2)}</p>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.status}
                      onValueChange={(value: User["status"]) => handleStatusChange(user.id, value)}
                    >
                      <SelectTrigger className="w-24">
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{formatDate(user.joinDate)}</p>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>User Details</DialogTitle>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="space-y-6">
                            {/* User Info */}
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                                <AvatarFallback className="text-lg">{getInitials(selectedUser.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                                <p className="text-muted-foreground">{selectedUser.email}</p>
                                <div className="flex gap-2 mt-2">
                                  <Badge className={getRoleColor(selectedUser.role)}>{selectedUser.role}</Badge>
                                  <Badge className={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge>
                                </div>
                              </div>
                            </div>

                            {/* Contact Info */}
                            <div>
                              <h4 className="font-semibold mb-3">Contact Information</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span>{selectedUser.email}</span>
                                </div>
                                {selectedUser.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedUser.phone}</span>
                                  </div>
                                )}
                                {selectedUser.address && (
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <div>
                                      <p>{selectedUser.address.street}</p>
                                      <p>
                                        {selectedUser.address.city}, {selectedUser.address.state}{" "}
                                        {selectedUser.address.zipCode}
                                      </p>
                                      <p>{selectedUser.address.country}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Order Stats */}
                            <div>
                              <h4 className="font-semibold mb-3">Order Statistics</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg">
                                  <p className="text-sm text-muted-foreground">Total Orders</p>
                                  <p className="text-2xl font-bold">{selectedUser.totalOrders}</p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                  <p className="text-sm text-muted-foreground">Total Spent</p>
                                  <p className="text-2xl font-bold">${selectedUser.totalSpent.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>

                            {/* Dates */}
                            <div>
                              <h4 className="font-semibold mb-3">Account Information</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>Joined: {formatDate(selectedUser.joinDate)}</span>
                                </div>
                                {selectedUser.lastOrderDate && (
                                  <div className="flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                    <span>Last Order: {formatDate(selectedUser.lastOrderDate)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
