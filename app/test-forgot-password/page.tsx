"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to test" })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Test Password Reset</h1>
        
        <div className="space-y-4 mb-8">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to test"
              className="max-w-md"
            />
          </div>
          
          <Button onClick={handleTest} disabled={loading || !email}>
            {loading ? "Testing..." : "Test Password Reset"}
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            {result.resetLink && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">✅ Reset Link Generated!</h3>
                <p className="text-sm text-green-700 mb-3">{result.message}</p>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm font-mono break-all">{result.resetLink}</p>
                </div>
                <Button 
                  onClick={() => window.open(result.resetLink, '_blank')}
                  className="mt-3"
                >
                  🔗 Test Reset Link
                </Button>
              </div>
            )}

            {result.emailContent && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📧 Email Preview</h3>
                <div 
                  className="bg-white p-4 rounded border max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: result.emailContent }}
                />
              </div>
            )}

            {result.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800">❌ Error</h3>
                <p className="text-red-700">{result.error}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">📝 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Enter an email address that you used to register an account</li>
            <li>Click "Test Password Reset" to generate a reset link</li>
            <li>Click "Test Reset Link" to try the password reset process</li>
            <li>The email preview shows what users would receive</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
