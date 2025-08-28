"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Search, HelpCircle, MessageCircle, Mail, Phone } from "lucide-react"
import Link from "next/link"

const faqCategories = [
  {
    category: "Orders & Shipping",
    icon: "📦",
    faqs: [
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'Order History' section. Tracking information is usually available within 24 hours of shipment.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Overnight shipping delivers the next business day. Processing time is 1-2 business days before shipment.",
      },
      {
        question: "Do you offer free shipping?",
        answer:
          "Yes! We offer free standard shipping on all orders over $100 within the United States. For orders under $100, standard shipping is $9.99.",
      },
      {
        question: "Can I change or cancel my order?",
        answer:
          "Orders can be modified or cancelled within 1 hour of placement. After this time, orders enter our fulfillment process. Contact customer service immediately if you need to make changes.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to over 100 countries worldwide. International shipping costs and delivery times vary by destination. Customers are responsible for any customs duties or taxes.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    icon: "🔄",
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "We offer 30-day returns on all items in original condition with tags attached. Returns are free for domestic customers, and we provide prepaid return labels.",
      },
      {
        question: "How do I return an item?",
        answer:
          "Log into your account, go to Order History, select the items you want to return, and print the prepaid return label. Pack the items securely and drop them off at any authorized shipping location.",
      },
      {
        question: "Can I exchange items for a different size?",
        answer:
          "Yes! We offer free size exchanges within 30 days. Return your original item and place a new order for the correct size. We'll process both transactions simultaneously.",
      },
      {
        question: "How long do refunds take?",
        answer:
          "Refunds are processed within 2-3 business days after we receive your return. It may take an additional 5-7 business days for the refund to appear in your account, depending on your bank.",
      },
      {
        question: "Can I return sale items?",
        answer:
          "Sale items can be returned within 30 days for store credit. Final sale items are not eligible for returns unless defective.",
      },
    ],
  },
  {
    category: "Sizing & Fit",
    icon: "📏",
    faqs: [
      {
        question: "How do I find my size?",
        answer:
          "Check our detailed size guide for measurements and fit information. Each product page also includes specific sizing notes. When in doubt, we recommend sizing up for a more comfortable fit.",
      },
      {
        question: "Do your clothes run true to size?",
        answer:
          "Our sizing is generally true to size, but fit can vary by style. Check the product description for specific fit notes (slim, regular, oversized). Customer reviews often include helpful sizing feedback.",
      },
      {
        question: "What if I'm between sizes?",
        answer:
          "If you're between sizes, we generally recommend sizing up for comfort. Check the product's fit description - for slim-fit items, consider your larger size; for oversized items, consider your smaller size.",
      },
      {
        question: "Can I get help with sizing?",
        answer:
          "Our customer service team can help with sizing questions. You can also check customer reviews for real-world fit feedback from other shoppers.",
      },
    ],
  },
  {
    category: "Account & Payment",
    icon: "💳",
    faqs: [
      {
        question: "Do I need an account to shop?",
        answer:
          "You can shop as a guest, but creating an account allows you to track orders, save items to your wishlist, store addresses, and access exclusive member benefits.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. We also offer buy-now-pay-later options.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes, we use industry-standard SSL encryption to protect your payment information. We never store your full credit card details on our servers.",
      },
      {
        question: "Can I save multiple addresses?",
        answer:
          "Yes! Account holders can save multiple shipping and billing addresses for faster checkout. You can manage these in your account settings.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page and enter your email address. We'll send you a secure link to reset your password. If you don't receive the email, check your spam folder.",
      },
    ],
  },
  {
    category: "Products & Quality",
    icon: "👕",
    faqs: [
      {
        question: "What materials do you use?",
        answer:
          "We use high-quality materials including premium cotton, sustainable fabrics, and durable blends. Each product page lists specific material composition and care instructions.",
      },
      {
        question: "How do I care for my items?",
        answer:
          "Care instructions are included on each product page and on the garment tags. Generally, we recommend washing in cold water and air drying to maintain quality and fit.",
      },
      {
        question: "Are your products ethically made?",
        answer:
          "Yes, we're committed to ethical manufacturing. We work with certified suppliers who meet our standards for fair labor practices and environmental responsibility.",
      },
      {
        question: "Do you restock sold-out items?",
        answer:
          "Popular items are often restocked, but availability varies. Sign up for restock notifications on product pages, or follow us on social media for updates on new arrivals and restocks.",
      },
      {
        question: "Can I get notified when items go on sale?",
        answer:
          "Yes! Add items to your wishlist to receive notifications about price drops and sales. You can also subscribe to our newsletter for exclusive sale alerts.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.faqs.length > 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about shopping, shipping, returns, and more.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQs.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const itemId = `${categoryIndex}-${faqIndex}`
                  return (
                    <Collapsible
                      key={faqIndex}
                      open={openItems.includes(itemId)}
                      onOpenChange={() => toggleItem(itemId)}
                    >
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="font-medium">{faq.question}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${openItems.includes(itemId) ? "rotate-180" : ""}`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 py-3 text-muted-foreground">{faq.answer}</CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {searchTerm && filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find any FAQs matching "{searchTerm}". Try different keywords or contact our support team.
            </p>
            <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
          </div>
        )}

        {/* Contact Support */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Still Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Can't find what you're looking for? Our customer service team is here to help.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild className="justify-start">
                <Link href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Send us an Email
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start bg-transparent">
                <a href="tel:+15551234567">
                  <Phone className="h-4 w-4 mr-2" />
                  Call: +1 (555) 123-4567
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Email support: Available 24/7 • Phone support: Mon-Fri, 9AM-6PM EST
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
