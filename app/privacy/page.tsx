"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Users, Mail, Phone } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-muted-foreground mt-2">Last updated: January 15, 2024</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Farato ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when you visit our website or make a purchase
                from us.
              </p>
              <p className="text-muted-foreground">
                By using our services, you agree to the collection and use of information in accordance with this
                policy. We will not use or share your information with anyone except as described in this Privacy
                Policy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Personal Information</h3>
                <p className="text-muted-foreground mb-2">
                  We collect information you provide directly to us, such as:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by our payment providers)</li>
                  <li>Account credentials and preferences</li>
                  <li>Communication preferences and marketing consents</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Automatically Collected Information</h3>
                <p className="text-muted-foreground mb-2">When you visit our website, we automatically collect:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>IP address and browser information</li>
                  <li>Device type and operating system</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website and search terms</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Purchase Information</h3>
                <p className="text-muted-foreground mb-2">When you make a purchase, we collect:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Order history and purchase details</li>
                  <li>Product preferences and reviews</li>
                  <li>Customer service interactions</li>
                  <li>Returns and exchange information</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Order Processing</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Process and fulfill your orders</li>
                    <li>Send order confirmations and updates</li>
                    <li>Handle returns and exchanges</li>
                    <li>Provide customer support</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Account Management</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Create and manage your account</li>
                    <li>Authenticate your identity</li>
                    <li>Save your preferences</li>
                    <li>Provide personalized experiences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Marketing & Communication</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Send promotional emails (with consent)</li>
                    <li>Notify you about sales and new products</li>
                    <li>Conduct surveys and research</li>
                    <li>Personalize marketing content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Website Improvement</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Analyze website usage and performance</li>
                    <li>Improve our products and services</li>
                    <li>Prevent fraud and enhance security</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We do not sell, trade, or rent your personal information to third parties. We may share your information
                in the following circumstances:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Service Providers</h4>
                  <p className="text-sm text-muted-foreground">
                    We work with trusted third-party service providers who help us operate our business, such as payment
                    processors, shipping companies, email service providers, and analytics tools. These providers are
                    contractually obligated to protect your information.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    We may disclose your information if required by law, court order, or government regulation, or to
                    protect our rights, property, or safety, or that of our users or the public.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Business Transfers</h4>
                  <p className="text-sm text-muted-foreground">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred as
                    part of the business transaction. We will notify you of any such change in ownership or control.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>SSL encryption for data transmission</li>
                    <li>Secure servers and databases</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Organizational Measures</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Employee training on data protection</li>
                    <li>Limited access to personal information</li>
                    <li>Confidentiality agreements</li>
                    <li>Incident response procedures</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                While we strive to protect your information, no method of transmission over the internet or electronic
                storage is 100% secure. We cannot guarantee absolute security but are committed to protecting your data
                using industry-standard practices.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">You have certain rights regarding your personal information:</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Access and Portability</h4>
                  <p className="text-sm text-muted-foreground">
                    You can access and download your personal information through your account settings or by contacting
                    us.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Correction and Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    You can update your personal information at any time through your account or by contacting customer
                    service.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Marketing Communications</h4>
                  <p className="text-sm text-muted-foreground">
                    You can opt out of marketing emails by clicking the unsubscribe link in any email or updating your
                    preferences in your account.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Account Deletion</h4>
                  <p className="text-sm text-muted-foreground">
                    You can request deletion of your account and personal information by contacting our customer service
                    team. Some information may be retained for legal or business purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and
                personalize content.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Types of Cookies</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>
                      <strong>Essential:</strong> Required for basic site functionality
                    </li>
                    <li>
                      <strong>Performance:</strong> Help us understand how visitors use our site
                    </li>
                    <li>
                      <strong>Functional:</strong> Remember your preferences and settings
                    </li>
                    <li>
                      <strong>Marketing:</strong> Used to deliver relevant advertisements
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Managing Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    You can control cookies through your browser settings. However, disabling certain cookies may affect
                    site functionality and your user experience.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">privacy@farato.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-4 w-4 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p>Farato Privacy Team</p>
                    <p className="text-muted-foreground">123 Fashion Street, Style City, SC 12345</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal
                requirements. We will notify you of any material changes by posting the updated policy on our website
                and updating the "Last updated" date. Your continued use of our services after any changes constitutes
                acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
