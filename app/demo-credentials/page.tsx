import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DemoCredentialsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Demo Login Credentials</h1>
            <p className="text-muted-foreground">
              Use these credentials to test the login functionality
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Regular User Login
                  <Badge variant="secondary">Demo</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-muted px-3 py-2 rounded flex-1">user@farato.com</code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigator.clipboard.writeText('user@farato.com')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Password:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-muted px-3 py-2 rounded flex-1">123456</code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigator.clipboard.writeText('123456')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Alternative Demo Accounts
                  <Badge variant="secondary">Demo</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <code className="bg-muted px-3 py-2 rounded block">test@farato.com</code>
                  </div>
                  <div>
                    <code className="bg-muted px-3 py-2 rounded block">demo@farato.com</code>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  All demo accounts use the same password: <code>123456</code>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  For admin dashboard access, use:
                </p>
                <div className="space-y-2">
                  <div>
                    <code className="bg-muted px-3 py-2 rounded block">admin@farato.com</code>
                  </div>
                  <div>
                    <code className="bg-muted px-3 py-2 rounded block">admin123</code>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Visit <a href="/admin/login" className="text-primary hover:underline">/admin/login</a> to access the admin dashboard.
                </p>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button asChild>
                <a href="/login">Go to Login</a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
