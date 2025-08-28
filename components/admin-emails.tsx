"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, Eye, Plus, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmailCampaign {
  id: string
  title: string
  subject: string
  content: string
  recipients: number
  status: "draft" | "sent" | "scheduled"
  createdAt: string
  sentAt?: string
  openRate?: number
  clickRate?: number
}

const mockCampaigns: EmailCampaign[] = [
  {
    id: "1",
    title: "Summer Sale 2024",
    subject: "🔥 50% Off Summer Collection - Limited Time!",
    content: "Don't miss out on our biggest summer sale...",
    recipients: 1250,
    status: "sent",
    createdAt: "2024-01-15T10:00:00Z",
    sentAt: "2024-01-15T14:00:00Z",
    openRate: 24.5,
    clickRate: 3.2,
  },
  {
    id: "2",
    title: "New Arrivals Newsletter",
    subject: "Fresh Styles Just Dropped 🆕",
    content: "Check out our latest collection...",
    recipients: 2100,
    status: "sent",
    createdAt: "2024-01-10T09:00:00Z",
    sentAt: "2024-01-10T12:00:00Z",
    openRate: 28.7,
    clickRate: 4.1,
  },
  {
    id: "3",
    title: "Welcome Series - Part 1",
    subject: "Welcome to Farato! Here's 15% off your first order",
    content: "Welcome to the Farato family...",
    recipients: 450,
    status: "draft",
    createdAt: "2024-01-16T11:00:00Z",
  },
]

export function AdminEmails() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns)
  const [isCreating, setIsCreating] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null)
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    subject: "",
    content: "",
    ctaText: "Shop Now",
    ctaUrl: "https://farato.com/products",
    discountCode: "",
    imageUrl: "",
    recipientType: "all",
  })
  const { toast } = useToast()

  const handleCreateCampaign = async () => {
    if (!newCampaign.title || !newCampaign.subject || !newCampaign.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const campaign: EmailCampaign = {
      id: Date.now().toString(),
      title: newCampaign.title,
      subject: newCampaign.subject,
      content: newCampaign.content,
      recipients: newCampaign.recipientType === "all" ? 2500 : 1200,
      status: "draft",
      createdAt: new Date().toISOString(),
    }

    setCampaigns([campaign, ...campaigns])
    setNewCampaign({
      title: "",
      subject: "",
      content: "",
      ctaText: "Shop Now",
      ctaUrl: "https://farato.com/products",
      discountCode: "",
      imageUrl: "",
      recipientType: "all",
    })
    setIsCreating(false)

    toast({
      title: "Success",
      description: "Email campaign created successfully",
    })
  }

  const handleSendCampaign = async (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (!campaign) return

    try {
      // Get recipients based on type
      const recipients = ["customer1@example.com", "customer2@example.com"] // Mock recipients

      const response = await fetch("/api/send-promotional-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients,
          emailData: {
            title: campaign.title,
            subject: campaign.subject,
            content: campaign.content,
            ctaText: newCampaign.ctaText,
            ctaUrl: newCampaign.ctaUrl,
            discountCode: newCampaign.discountCode,
            imageUrl: newCampaign.imageUrl,
          },
        }),
      })

      if (response.ok) {
        setCampaigns(
          campaigns.map((c) =>
            c.id === campaignId ? { ...c, status: "sent" as const, sentAt: new Date().toISOString() } : c,
          ),
        )

        toast({
          title: "Success",
          description: "Email campaign sent successfully",
        })
      } else {
        throw new Error("Failed to send campaign")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email campaign",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Email Marketing</h1>
          <p className="text-muted-foreground">Manage promotional emails and campaigns</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                    placeholder="Summer Sale 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                    placeholder="🔥 50% Off Summer Collection"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                  placeholder="Write your email content here..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ctaText">Button Text</Label>
                  <Input
                    id="ctaText"
                    value={newCampaign.ctaText}
                    onChange={(e) => setNewCampaign({ ...newCampaign, ctaText: e.target.value })}
                    placeholder="Shop Now"
                  />
                </div>
                <div>
                  <Label htmlFor="ctaUrl">Button URL</Label>
                  <Input
                    id="ctaUrl"
                    value={newCampaign.ctaUrl}
                    onChange={(e) => setNewCampaign({ ...newCampaign, ctaUrl: e.target.value })}
                    placeholder="https://farato.com/products"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountCode">Discount Code (Optional)</Label>
                  <Input
                    id="discountCode"
                    value={newCampaign.discountCode}
                    onChange={(e) => setNewCampaign({ ...newCampaign, discountCode: e.target.value })}
                    placeholder="SUMMER50"
                  />
                </div>
                <div>
                  <Label htmlFor="recipientType">Recipients</Label>
                  <Select
                    value={newCampaign.recipientType}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, recipientType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="active">Active Customers</SelectItem>
                      <SelectItem value="new">New Customers</SelectItem>
                      <SelectItem value="vip">VIP Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="imageUrl">Hero Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  value={newCampaign.imageUrl}
                  onChange={(e) => setNewCampaign({ ...newCampaign, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign}>Create Campaign</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Email Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Sent This Month</p>
                <p className="text-2xl font-bold">{campaigns.filter((c) => c.status === "sent").length}</p>
              </div>
              <Send className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Avg. Open Rate</p>
                <p className="text-2xl font-bold">26.6%</p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Subscribers</p>
                <p className="text-2xl font-bold">2,500</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{campaign.title}</p>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                    </div>
                  </TableCell>
                  <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                  </TableCell>
                  <TableCell>{campaign.openRate ? `${campaign.openRate}%` : "-"}</TableCell>
                  <TableCell>{campaign.clickRate ? `${campaign.clickRate}%` : "-"}</TableCell>
                  <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedCampaign(campaign)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Campaign Preview - {campaign.title}</DialogTitle>
                          </DialogHeader>
                          {selectedCampaign && (
                            <div className="space-y-4">
                              <div>
                                <Label>Subject Line</Label>
                                <p className="text-sm bg-gray-50 p-2 rounded">{selectedCampaign.subject}</p>
                              </div>
                              <div>
                                <Label>Content</Label>
                                <div className="text-sm bg-gray-50 p-4 rounded max-h-60 overflow-y-auto">
                                  {selectedCampaign.content}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label>Recipients</Label>
                                  <p>{selectedCampaign.recipients.toLocaleString()}</p>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Badge className={getStatusColor(selectedCampaign.status)}>
                                    {selectedCampaign.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {campaign.status === "draft" && (
                        <Button variant="ghost" size="sm" onClick={() => handleSendCampaign(campaign.id)}>
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
