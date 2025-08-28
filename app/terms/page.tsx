"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, Shield, AlertTriangle, Mail, Phone } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our website or services.
          </p>
          <p className="text-sm text-muted-foreground mt-2">Last updated: January 15, 2024</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Agreement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                These Terms of Service ("Terms") govern your use of the Farato website and services. By accessing or
                using our website, you agree to be bound by these Terms. If you do not agree to these Terms, please do
                not use our services.
              </p>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon
                posting. Your continued use of our services after any changes constitutes acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          {/* Use of Services */}
          <Card>
            <CardHeader>
              <CardTitle>Use of Our Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Eligibility</h3>
                <p className="text-muted-foreground mb-2">
                  You must be at least 18 years old to use our services. If you are under 18, you may use our services
                  only with the involvement and consent of a parent or guardian.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Account Registration</h3>
                <p className="text-muted-foreground mb-2">
                  To access certain features, you may need to create an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Keep your account information updated</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Prohibited Uses</h3>
                <p className="text-muted-foreground mb-2">You may not use our services to:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful or malicious code</li>
                  <li>Engage in fraudulent activities</li>
                  <li>Harass or harm other users</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Products and Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Products and Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Product Information</h3>
                <p className="text-muted-foreground">
                  We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant
                  that product descriptions or other content is accurate, complete, or error-free. Colors may vary due
                  to monitor settings and photography.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Pricing and Availability</h3>
                <p className="text-muted-foreground mb-2">
                  All prices are subject to change without notice. We reserve the right to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Modify or discontinue products at any time</li>
                  <li>Limit quantities available for purchase</li>
                  <li>Refuse or cancel orders for any reason</li>
                  <li>Correct pricing errors, even after an order is placed</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Order Acceptance</h3>
                <p className="text-muted-foreground">
                  Your order is an offer to purchase products. We reserve the right to accept or decline your order for
                  any reason. Order confirmation does not guarantee acceptance. We will notify you if we cannot fulfill
                  your order.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Payment Methods</h3>
                <p className="text-muted-foreground">
                  We accept major credit cards, PayPal, and other payment methods as displayed at checkout. Payment is
                  due at the time of order placement.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Payment Processing</h3>
                <p className="text-muted-foreground">
                  Payments are processed by secure third-party payment processors. We do not store your complete payment
                  information on our servers. You authorize us to charge your payment method for all purchases.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Taxes</h3>
                <p className="text-muted-foreground">
                  You are responsible for all applicable taxes, duties, and fees. Tax amounts will be calculated and
                  displayed at checkout based on your shipping address.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping and Returns */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping and Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Shipping</h3>
                <p className="text-muted-foreground">
                  Shipping costs and delivery times are displayed at checkout. We are not responsible for delays caused
                  by shipping carriers, customs, or other factors beyond our control.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Risk of Loss</h3>
                <p className="text-muted-foreground">
                  Risk of loss and title for products pass to you upon delivery to the shipping carrier. We recommend
                  purchasing shipping insurance for valuable orders.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Returns</h3>
                <p className="text-muted-foreground">
                  Our return policy is detailed on our Returns page. Returns must be initiated within 30 days of
                  delivery and meet our return conditions. We reserve the right to refuse returns that do not meet our
                  policy requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Our Content</h3>
                <p className="text-muted-foreground">
                  All content on our website, including text, images, logos, designs, and software, is owned by Farato
                  or our licensors and is protected by copyright, trademark, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Limited License</h3>
                <p className="text-muted-foreground">
                  We grant you a limited, non-exclusive, non-transferable license to access and use our website for
                  personal, non-commercial purposes. You may not reproduce, distribute, or create derivative works
                  without our written permission.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">User Content</h3>
                <p className="text-muted-foreground">
                  By submitting content (reviews, comments, images), you grant us a worldwide, royalty-free license to
                  use, reproduce, and display such content in connection with our services.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Disclaimers and Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Service Availability</h3>
                <p className="text-muted-foreground">
                  Our services are provided "as is" without warranties of any kind. We do not guarantee that our website
                  will be available at all times or free from errors, viruses, or other harmful components.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Limitation of Liability</h3>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, Farato shall not be liable for any indirect, incidental,
                  special, or consequential damages arising from your use of our services. Our total liability shall not
                  exceed the amount you paid for the specific product or service.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Indemnification</h3>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold harmless Farato from any claims, damages, or expenses arising from
                  your use of our services or violation of these Terms.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                information. By using our services, you also agree to our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law and Disputes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Governing Law</h3>
                <p className="text-muted-foreground">
                  These Terms are governed by the laws of the State of California, without regard to conflict of law
                  principles.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Dispute Resolution</h3>
                <p className="text-muted-foreground">
                  Any disputes arising from these Terms or your use of our services will be resolved through binding
                  arbitration in accordance with the rules of the American Arbitration Association.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Class Action Waiver</h3>
                <p className="text-muted-foreground">
                  You agree to resolve disputes individually and waive any right to participate in class action lawsuits
                  or class-wide arbitration.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">legal@farato.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-primary mt-0.5" />
                  <div className="text-sm">
                    <p>Farato Legal Department</p>
                    <p className="text-muted-foreground">123 Fashion Street, Style City, SC 12345</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Severability */}
          <Card>
            <CardHeader>
              <CardTitle>Miscellaneous</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Severability</h3>
                <p className="text-muted-foreground">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions will continue
                  in full force and effect.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Entire Agreement</h3>
                <p className="text-muted-foreground">
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and Farato
                  regarding your use of our services.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Assignment</h3>
                <p className="text-muted-foreground">
                  We may assign these Terms to any affiliate or successor. You may not assign your rights or obligations
                  under these Terms without our written consent.
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
