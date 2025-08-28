"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RotateCcw, Package, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

const returnSteps = [
  {
    step: 1,
    title: "Initiate Return",
    description: "Log into your account and select the items you want to return",
    icon: Package,
  },
  {
    step: 2,
    title: "Print Label",
    description: "Download and print your prepaid return shipping label",
    icon: RotateCcw,
  },
  {
    step: 3,
    title: "Pack & Ship",
    description: "Pack items securely and drop off at any authorized location",
    icon: Package,
  },
  {
    step: 4,
    title: "Get Refund",
    description: "Receive your refund within 5-7 business days after we receive your return",
    icon: CheckCircle,
  },
]

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <RotateCcw className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Returns & Exchanges</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Not completely satisfied? No problem. We offer easy returns and exchanges within 30 days.
          </p>
        </div>

        {/* Return Policy Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>30-Day Window</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Return or exchange items within 30 days of delivery for a full refund
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Package className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Free Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We provide prepaid return labels for all domestic returns - no cost to you
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Easy Process</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Simple online returns process - no need to call or email customer service
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How to Return */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">How to Return Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.step} className="text-center">
                    <div className="relative mb-4">
                      <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <Badge className="absolute -top-2 -right-2 bg-primary text-white">{step.step}</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    {index < returnSteps.length - 1 && (
                      <ArrowRight className="h-5 w-5 text-muted-foreground mx-auto mt-4 hidden lg:block" />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Return Policy Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                What Can Be Returned
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Items in original condition with tags attached</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unworn and unwashed clothing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Accessories in original packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Items purchased within the last 30 days</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Sale items (for store credit)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                What Cannot Be Returned
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Items worn, washed, or damaged</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Items without original tags</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Undergarments and swimwear</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Personalized or customized items</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Items purchased over 30 days ago</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exchange Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Exchange Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Size Exchanges</h3>
              <p className="text-muted-foreground mb-2">
                Need a different size? We offer free size exchanges within 30 days of purchase.
              </p>
              <p className="text-muted-foreground">
                Simply return your original item and place a new order for the correct size. We'll refund the original
                purchase and charge for the new item.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Color/Style Exchanges</h3>
              <p className="text-muted-foreground mb-2">
                Want a different color or style? Follow the same process as size exchanges.
              </p>
              <p className="text-muted-foreground">
                If there's a price difference, we'll either refund the difference or charge the additional amount.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Refund Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Refund Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Processing Time</h3>
                <p className="text-muted-foreground text-sm">
                  Refunds are processed within 2-3 business days after we receive your return.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Refund Method</h3>
                <p className="text-muted-foreground text-sm">
                  Refunds are issued to the original payment method used for purchase.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bank Processing</h3>
                <p className="text-muted-foreground text-sm">
                  It may take 5-7 business days for the refund to appear in your account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sale Items</h3>
                <p className="text-muted-foreground text-sm">
                  Sale items can be returned for store credit within 30 days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* International Returns */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>International Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              International customers can return items within 30 days, but are responsible for return shipping costs.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use a trackable shipping method</li>
              <li>• Include original packaging and tags</li>
              <li>• Allow 2-3 weeks for processing</li>
              <li>• Customs duties are non-refundable</li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start a Return?</h2>
          <p className="text-muted-foreground mb-6">
            Log into your account to begin the return process or contact our customer service team for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/profile/orders">Start Return</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
