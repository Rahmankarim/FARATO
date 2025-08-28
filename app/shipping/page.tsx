"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Package, Clock, Globe, Shield } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Truck className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Shipping Information</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fast, reliable shipping to get your fashion finds to you quickly and safely.
          </p>
        </div>

        {/* Shipping Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Standard Shipping</CardTitle>
              <Badge className="bg-green-100 text-green-800">FREE over $100</Badge>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-2xl font-bold">$9.99</p>
              <p className="text-muted-foreground">5-7 business days</p>
              <p className="text-sm">Perfect for regular orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Express Shipping</CardTitle>
              <Badge variant="outline">Fast Delivery</Badge>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-2xl font-bold">$19.99</p>
              <p className="text-muted-foreground">2-3 business days</p>
              <p className="text-sm">When you need it faster</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Truck className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Overnight Shipping</CardTitle>
              <Badge className="bg-red-100 text-red-800">Next Day</Badge>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p className="text-2xl font-bold">$39.99</p>
              <p className="text-muted-foreground">Next business day</p>
              <p className="text-sm">For urgent orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Domestic Shipping (US)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Processing Time</h3>
                <p className="text-muted-foreground">
                  Orders are processed within 1-2 business days. Orders placed after 2 PM EST will be processed the next
                  business day.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Delivery Areas</h3>
                <p className="text-muted-foreground">
                  We ship to all 50 states, including Alaska and Hawaii. PO Boxes and APO/FPO addresses are accepted.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tracking</h3>
                <p className="text-muted-foreground">
                  All orders include tracking information sent to your email once shipped.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                International Shipping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Available Countries</h3>
                <p className="text-muted-foreground">
                  We ship to over 100 countries worldwide. Shipping costs and delivery times vary by destination.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Customs & Duties</h3>
                <p className="text-muted-foreground">
                  International customers are responsible for any customs duties, taxes, or fees imposed by their
                  country.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Delivery Time</h3>
                <p className="text-muted-foreground">
                  7-21 business days depending on destination and customs processing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Policies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Shipping Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Order Changes & Cancellations</h3>
              <p className="text-muted-foreground mb-2">
                Orders can be modified or cancelled within 1 hour of placement. After this time, orders enter our
                fulfillment process and cannot be changed.
              </p>
              <p className="text-muted-foreground">
                To request changes, contact our customer service team immediately at support@farato.com or +1 (555)
                123-4567.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Shipping Address</h3>
              <p className="text-muted-foreground mb-2">
                Please ensure your shipping address is correct before completing your order. We are not responsible for
                packages shipped to incorrect addresses provided by the customer.
              </p>
              <p className="text-muted-foreground">
                Address changes can only be made within 1 hour of order placement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Lost or Damaged Packages</h3>
              <p className="text-muted-foreground mb-2">
                If your package is lost or damaged during shipping, please contact us within 7 days of the expected
                delivery date.
              </p>
              <p className="text-muted-foreground">
                We will work with the shipping carrier to resolve the issue and ensure you receive your order.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Holiday Shipping</h3>
              <p className="text-muted-foreground">
                During peak holiday seasons, processing and shipping times may be extended. We recommend placing orders
                early to ensure timely delivery. Check our website for holiday shipping deadlines and any temporary
                policy changes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help with Shipping?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our customer service team is here to help with any shipping questions or concerns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Email Support</h4>
                <p className="text-muted-foreground">support@farato.com</p>
                <p className="text-sm text-muted-foreground">Response within 24 hours</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Phone Support</h4>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
                <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
