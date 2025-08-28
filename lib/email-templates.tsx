import { render } from "@react-email/render"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface OrderData {
  orderId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  createdAt: string
}

interface TrackingInfo {
  carrier: string
  trackingNumber: string
  trackingUrl: string
  estimatedDelivery: string
}

interface PromotionalData {
  title: string
  subtitle?: string
  content: string
  ctaText: string
  ctaUrl: string
  imageUrl?: string
  discountCode?: string
}

interface PasswordResetData {
  email: string
  resetToken: string
  resetUrl: string
}

// Order Confirmation Email Template
function OrderConfirmationEmail({ orderData }: { orderData: OrderData }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Confirmation</title>
        <style>{`
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .item { display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee; }
          .item:last-child { border-bottom: none; }
          .item-image { width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 4px; }
          .item-details { flex: 1; }
          .item-name { font-weight: bold; margin-bottom: 5px; }
          .item-price { color: #666; }
          .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #000; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>FARATO</h1>
            <h2>Order Confirmation</h2>
          </div>

          <div className="content">
            <h3>Thank you for your order, {orderData.customerName}!</h3>
            <p>
              We've received your order and are preparing it for shipment. You'll receive another email when your order
              ships.
            </p>

            <div className="order-details">
              <h4>Order Details</h4>
              <p>
                <strong>Order Number:</strong> {orderData.orderId}
              </p>
              <p>
                <strong>Order Date:</strong> {formatDate(orderData.createdAt)}
              </p>
              <p>
                <strong>Payment Method:</strong> {orderData.paymentMethod}
              </p>

              <h4>Items Ordered</h4>
              {orderData.items.map((item) => (
                <div key={item.id} className="item">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">
                      Quantity: {item.quantity} × ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}

              <div className="total">Total: ${orderData.total.toFixed(2)}</div>
            </div>

            <div className="order-details">
              <h4>Shipping Address</h4>
              <p>
                {orderData.shippingAddress.street}
                <br />
                {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                <br />
                {orderData.shippingAddress.country}
              </p>
            </div>

            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <a href={`${process.env.NEXT_PUBLIC_BASE_URL}/profile/orders`} className="button">
                Track Your Order
              </a>
            </div>
          </div>

          <div className="footer">
            <p>Questions about your order? Contact us at infobyfarato@gmail.com</p>
            <p>© 2025 Farato Fashion. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  )
}

// Shipping Update Email Template
function ShippingUpdateEmail({ orderData, trackingInfo }: { orderData: OrderData; trackingInfo: TrackingInfo }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Order Has Shipped</title>
        <style>{`
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .shipping-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .tracking-box { background: #e8f5e8; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .button { display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>FARATO</h1>
            <h2>Your Order Has Shipped!</h2>
          </div>

          <div className="content">
            <h3>Great news, {orderData.customerName}!</h3>
            <p>
              Your order <strong>{orderData.orderId}</strong> has been shipped and is on its way to you.
            </p>

            <div className="tracking-box">
              <h4>Tracking Information</h4>
              <p>
                <strong>Carrier:</strong> {trackingInfo.carrier}
              </p>
              <p>
                <strong>Tracking Number:</strong> {trackingInfo.trackingNumber}
              </p>
              <p>
                <strong>Estimated Delivery:</strong> {trackingInfo.estimatedDelivery}
              </p>

              <a href={trackingInfo.trackingUrl} className="button" target="_blank" rel="noopener noreferrer">
                Track Your Package
              </a>
            </div>

            <div className="shipping-details">
              <h4>Shipping To:</h4>
              <p>
                {orderData.shippingAddress.street}
                <br />
                {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                <br />
                {orderData.shippingAddress.country}
              </p>
            </div>

            <p>You can track your package using the tracking number above or by visiting your account.</p>
          </div>

          <div className="footer">
            <p>Questions about your shipment? Contact us at infobyfarato@gmail.com</p>
            <p>© 2025 Farato Fashion. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  )
}

// Promotional Email Template
function PromotionalEmail({ emailData }: { emailData: PromotionalData }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{emailData.title}</title>
        <style>{`
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; text-align: center; }
          .hero-image { width: 100%; max-width: 500px; height: auto; border-radius: 8px; margin: 20px 0; }
          .discount-code { background: #fff; border: 2px dashed #000; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .button { display: inline-block; background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-size: 16px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>FARATO</h1>
          </div>

          <div className="content">
            <h2>{emailData.title}</h2>
            {emailData.subtitle && <h3>{emailData.subtitle}</h3>}

            {emailData.imageUrl && (
              <img src={emailData.imageUrl || "/placeholder.svg"} alt={emailData.title} className="hero-image" />
            )}

            <div dangerouslySetInnerHTML={{ __html: emailData.content }} />

            {emailData.discountCode && (
              <div className="discount-code">
                <h4>Use Code:</h4>
                <h2 style={{ margin: "10px 0", letterSpacing: "2px" }}>{emailData.discountCode}</h2>
                <p>Copy this code and use it at checkout</p>
              </div>
            )}

            <a href={emailData.ctaUrl} className="button">
              {emailData.ctaText}
            </a>
          </div>

          <div className="footer">
            <p>
              Don't want to receive these emails? <a href="#">Unsubscribe</a>
            </p>
            <p>© 2024 Farato. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  )
}

// Render functions
export async function renderOrderConfirmationEmail(orderData: OrderData): Promise<string> {
  return render(<OrderConfirmationEmail orderData={orderData} />)
}

export async function renderShippingUpdateEmail(orderData: OrderData, trackingInfo: TrackingInfo): Promise<string> {
  return render(<ShippingUpdateEmail orderData={orderData} trackingInfo={trackingInfo} />)
}

export async function renderPromotionalEmail(emailData: PromotionalData): Promise<string> {
  return render(<PromotionalEmail emailData={emailData} />)
}

export async function renderPasswordResetEmail(resetData: PasswordResetData): Promise<string> {
  return render(<PasswordResetEmail resetData={resetData} />)
}

// Password Reset Email Template
function PasswordResetEmail({ resetData }: { resetData: PasswordResetData }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Your Password</title>
        <style>{`
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: #000; color: white; padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; letter-spacing: 2px; }
          .content { padding: 40px 30px; }
          .reset-box { background: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0; border-left: 4px solid #000; }
          .reset-button { display: inline-block; background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; transition: background 0.3s; }
          .reset-button:hover { background: #333; }
          .token-info { background: #e9ecef; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .security-notice { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #e9ecef; }
          .footer a { color: #000; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
          .highlight { color: #000; font-weight: bold; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1>FARATO</h1>
            <h2 style={{ margin: "10px 0 0 0", fontWeight: "normal", fontSize: "18px" }}>Password Reset Request</h2>
          </div>

          <div className="content">
            <h3>Hello!</h3>
            <p>
              We received a request to reset the password for your Farato Fashion account associated with{" "}
              <span className="highlight">{resetData.email}</span>.
            </p>

            <div className="reset-box">
              <h4 style={{ margin: "0 0 15px 0", color: "#000" }}>Reset Your Password</h4>
              <p style={{ margin: "0 0 20px 0" }}>Click the button below to set a new password for your account:</p>
              
              <a href={resetData.resetUrl} className="reset-button">
                Reset My Password
              </a>
              
              <p style={{ margin: "20px 0 0 0", fontSize: "14px", color: "#666" }}>
                This link will expire in <strong>1 hour</strong> for your security.
              </p>
            </div>

            <div className="security-notice">
              <h4 style={{ margin: "0 0 10px 0", color: "#856404" }}>Security Notice</h4>
              <ul style={{ margin: "0", paddingLeft: "20px", color: "#856404" }}>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Your current password will remain unchanged until you create a new one</li>
                <li>For security, this link can only be used once</li>
              </ul>
            </div>

            <div className="token-info">
              <h4 style={{ margin: "0 0 10px 0" }}>Having trouble with the button?</h4>
              <p style={{ margin: "0 0 10px 0" }}>Copy and paste this link into your browser:</p>
              <p style={{ margin: "0", wordBreak: "break-all", fontFamily: "monospace", fontSize: "12px", background: "white", padding: "10px", borderRadius: "3px" }}>
                {resetData.resetUrl}
              </p>
            </div>

            <p style={{ margin: "30px 0 0 0", fontSize: "14px", color: "#666" }}>
              Need help? Contact our support team at{" "}
              <a href="mailto:infobyfarato@gmail.com" style={{ color: "#000" }}>
                infobyfarato@gmail.com
              </a>
            </p>
          </div>

          <div className="footer">
            <p>This email was sent by Farato Fashion</p>
            <p>
              <a href="mailto:infobyfarato@gmail.com">infobyfarato@gmail.com</a> | 
              <a href="#" style={{ margin: "0 10px" }}>Privacy Policy</a> | 
              <a href="#">Terms of Service</a>
            </p>
            <p>© 2025 FARATO Fashion. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  )
}
