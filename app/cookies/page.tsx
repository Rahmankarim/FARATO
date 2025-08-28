"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Cookie, Settings, Shield, BarChart3, Target, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const cookieCategories = [
  {
    id: "essential",
    name: "Essential Cookies",
    description: "These cookies are necessary for the website to function and cannot be switched off.",
    icon: Shield,
    required: true,
    enabled: true,
    examples: ["Authentication and security", "Shopping cart functionality", "Form submission", "Load balancing"],
  },
  {
    id: "performance",
    name: "Performance Cookies",
    description: "These cookies help us understand how visitors interact with our website.",
    icon: BarChart3,
    required: false,
    enabled: true,
    examples: ["Google Analytics", "Page load times", "Error tracking", "Site usage statistics"],
  },
  {
    id: "functional",
    name: "Functional Cookies",
    description: "These cookies enable enhanced functionality and personalization.",
    icon: Settings,
    required: false,
    enabled: true,
    examples: ["Language preferences", "Theme settings", "Recently viewed items", "Saved preferences"],
  },
  {
    id: "marketing",
    name: "Marketing Cookies",
    description: "These cookies are used to deliver relevant advertisements and track campaign performance.",
    icon: Target,
    required: false,
    enabled: false,
    examples: ["Social media integration", "Advertising targeting", "Campaign tracking", "Retargeting pixels"],
  },
]

export default function CookiesPage() {
  const [cookieSettings, setCookieSettings] = useState(
    cookieCategories.reduce(
      (acc, category) => ({
        ...acc,
        [category.id]: category.enabled,
      }),
      {},
    ),
  )
  const { toast } = useToast()

  const handleToggle = (categoryId: string, enabled: boolean) => {
    setCookieSettings((prev) => ({
      ...prev,
      [categoryId]: enabled,
    }))
  }

  const savePreferences = () => {
    // Save preferences to localStorage or send to server
    localStorage.setItem("cookiePreferences", JSON.stringify(cookieSettings))

    toast({
      title: "Preferences saved",
      description: "Your cookie preferences have been updated successfully.",
    })
  }

  const acceptAll = () => {
    const allEnabled = cookieCategories.reduce(
      (acc, category) => ({
        ...acc,
        [category.id]: true,
      }),
      {},
    )
    setCookieSettings(allEnabled)
    savePreferences()
  }

  const rejectAll = () => {
    const essentialOnly = cookieCategories.reduce(
      (acc, category) => ({
        ...acc,
        [category.id]: category.required,
      }),
      {},
    )
    setCookieSettings(essentialOnly)
    savePreferences()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cookie className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We use cookies to enhance your browsing experience and provide personalized content. Learn about our cookie
            usage and manage your preferences.
          </p>
          <p className="text-sm text-muted-foreground mt-2">Last updated: January 15, 2024</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* What are Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>What are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Cookies are small text files that are stored on your device when you visit a website. They help websites
                remember information about your visit, such as your preferred language and other settings, which can
                make your next visit easier and the site more useful to you.
              </p>
              <p className="text-muted-foreground">
                Cookies can be "first-party" (set by the website you're visiting) or "third-party" (set by other
                websites that provide content on the page you're viewing). They can also be "session" cookies (deleted
                when you close your browser) or "persistent" cookies (stored until they expire or you delete them).
              </p>
            </CardContent>
          </Card>

          {/* Cookie Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Cookie Categories and Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {cookieCategories.map((category) => {
                const Icon = category.icon
                return (
                  <div key={category.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {category.name}
                            {category.required && (
                              <Badge variant="secondary" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={cookieSettings[category.id]}
                        onCheckedChange={(enabled) => handleToggle(category.id, enabled)}
                        disabled={category.required}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Examples:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {category.examples.map((example, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={acceptAll} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept All Cookies
                </Button>
                <Button onClick={rejectAll} variant="outline" className="flex-1 bg-transparent">
                  Reject Non-Essential
                </Button>
                <Button onClick={savePreferences} variant="secondary" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Website Functionality</h3>
                <p className="text-muted-foreground mb-2">
                  We use cookies to ensure our website works properly and provides you with the best possible
                  experience:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Remember items in your shopping cart</li>
                  <li>Keep you logged in during your session</li>
                  <li>Remember your preferences and settings</li>
                  <li>Provide security features and fraud prevention</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Analytics and Performance</h3>
                <p className="text-muted-foreground mb-2">
                  We use analytics cookies to understand how visitors use our website:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Track page views and user interactions</li>
                  <li>Identify popular content and features</li>
                  <li>Monitor website performance and errors</li>
                  <li>Improve our website based on usage patterns</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Personalization</h3>
                <p className="text-muted-foreground mb-2">We use cookies to personalize your experience:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Show you relevant product recommendations</li>
                  <li>Remember your size and style preferences</li>
                  <li>Display content in your preferred language</li>
                  <li>Customize the website layout and theme</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Marketing and Advertising</h3>
                <p className="text-muted-foreground mb-2">With your consent, we use marketing cookies to:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Show you relevant advertisements on other websites</li>
                  <li>Measure the effectiveness of our marketing campaigns</li>
                  <li>Provide social media integration features</li>
                  <li>Track conversions and attribution</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Some cookies on our website are set by third-party services that appear on our pages. We use the
                following third-party services:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Google Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Helps us understand website usage and improve user experience.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Social Media Platforms</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable social sharing and integration with platforms like Facebook and Instagram.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Payment Processors</h4>
                  <p className="text-sm text-muted-foreground">
                    Secure payment processing through services like Stripe and PayPal.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Customer Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Live chat and support tools to provide customer assistance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Browser Settings</h3>
                <p className="text-muted-foreground mb-2">
                  You can control cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>View and delete existing cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block third-party cookies</li>
                  <li>Clear all cookies when you close the browser</li>
                  <li>Set up notifications when cookies are being set</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Browser-Specific Instructions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Chrome</h4>
                    <p className="text-sm text-muted-foreground">
                      Settings → Privacy and Security → Cookies and other site data
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Firefox</h4>
                    <p className="text-sm text-muted-foreground">
                      Options → Privacy & Security → Cookies and Site Data
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Safari</h4>
                    <p className="text-sm text-muted-foreground">Preferences → Privacy → Manage Website Data</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Edge</h4>
                    <p className="text-sm text-muted-foreground">
                      Settings → Cookies and site permissions → Cookies and site data
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Impact of Disabling Cookies</h3>
                <p className="text-muted-foreground">
                  Please note that disabling certain cookies may affect the functionality of our website. Essential
                  cookies are required for basic functionality, while other cookies enhance your experience but are not
                  strictly necessary.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Questions About Cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> privacy@farato.com
                </p>
                <p className="text-sm">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p className="text-sm">
                  <strong>Address:</strong> 123 Fashion Street, Style City, SC 12345
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
