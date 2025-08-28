"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface PayPalPaymentFormProps {
  amount: number
  onSuccess: (orderId: string) => void
  onError: (error: string) => void
  customerInfo: {
    name: string
    email: string
    address: any
  }
  orderItems: any[]
}

declare global {
  interface Window {
    paypal?: any
  }
}

export function PayPalPaymentForm({ amount, onSuccess, onError, customerInfo, orderItems }: PayPalPaymentFormProps) {
  const paypalRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadPayPalScript = () => {
      if (window.paypal) {
        renderPayPalButtons()
        return
      }

      const script = document.createElement("script")
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`
      script.addEventListener("load", renderPayPalButtons)
      document.body.appendChild(script)
    }

    const renderPayPalButtons = () => {
      if (!window.paypal || !paypalRef.current) return

      window.paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toFixed(2),
                    currency_code: "USD",
                  },
                  description: `Farato Order - ${orderItems.length} items`,
                  shipping: {
                    name: {
                      full_name: customerInfo.name,
                    },
                    address: {
                      address_line_1: customerInfo.address.street,
                      admin_area_2: customerInfo.address.city,
                      admin_area_1: customerInfo.address.state,
                      postal_code: customerInfo.address.zipCode,
                      country_code: customerInfo.address.country === "USA" ? "US" : customerInfo.address.country,
                    },
                  },
                },
              ],
            })
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const order = await actions.order.capture()

              // Confirm the order on the backend
              const response = await fetch("/api/confirm-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paymentIntentId: order.id,
                  orderData: {
                    customerEmail: customerInfo.email,
                    items: orderItems,
                    shippingAddress: customerInfo.address,
                    paymentMethod: "PayPal",
                  },
                }),
              })

              const result = await response.json()

              if (result.success) {
                onSuccess(result.orderId)
                toast({
                  title: "Payment Successful",
                  description: "Your PayPal payment has been processed!",
                })
              } else {
                throw new Error(result.error || "Payment confirmation failed")
              }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : "PayPal payment failed"
              onError(errorMessage)
              toast({
                title: "Payment Failed",
                description: errorMessage,
                variant: "destructive",
              })
            }
          },
          onError: (err: any) => {
            console.error("PayPal error:", err)
            onError("PayPal payment failed")
            toast({
              title: "Payment Failed",
              description: "There was an error processing your PayPal payment",
              variant: "destructive",
            })
          },
        })
        .render(paypalRef.current)
    }

    loadPayPalScript()
  }, [amount, customerInfo, orderItems, onSuccess, onError, toast])

  return (
    <Card>
      <CardHeader>
        <CardTitle>PayPal Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={paypalRef} />
      </CardContent>
    </Card>
  )
}
