"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Ruler, Info } from "lucide-react"

const sizeCharts = {
  mens: {
    tops: [
      { size: "XS", chest: "32-34", waist: "26-28", length: "26" },
      { size: "S", chest: "34-36", waist: "28-30", length: "27" },
      { size: "M", chest: "36-38", waist: "30-32", length: "28" },
      { size: "L", chest: "38-40", waist: "32-34", length: "29" },
      { size: "XL", chest: "40-42", waist: "34-36", length: "30" },
      { size: "XXL", chest: "42-44", waist: "36-38", length: "31" },
    ],
    bottoms: [
      { size: "28", waist: "28", hip: "36", inseam: "30" },
      { size: "30", waist: "30", hip: "38", inseam: "30" },
      { size: "32", waist: "32", hip: "40", inseam: "32" },
      { size: "34", waist: "34", hip: "42", inseam: "32" },
      { size: "36", waist: "36", hip: "44", inseam: "32" },
      { size: "38", waist: "38", hip: "46", inseam: "32" },
    ],
  },
  womens: {
    tops: [
      { size: "XS", chest: "30-32", waist: "24-26", length: "24" },
      { size: "S", chest: "32-34", waist: "26-28", length: "25" },
      { size: "M", chest: "34-36", waist: "28-30", length: "26" },
      { size: "L", chest: "36-38", waist: "30-32", length: "27" },
      { size: "XL", chest: "38-40", waist: "32-34", length: "28" },
      { size: "XXL", chest: "40-42", waist: "34-36", length: "29" },
    ],
    bottoms: [
      { size: "24", waist: "24", hip: "34", inseam: "28" },
      { size: "26", waist: "26", hip: "36", inseam: "28" },
      { size: "28", waist: "28", hip: "38", inseam: "30" },
      { size: "30", waist: "30", hip: "40", inseam: "30" },
      { size: "32", waist: "32", hip: "42", inseam: "30" },
      { size: "34", waist: "34", hip: "44", inseam: "30" },
    ],
  },
}

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Ruler className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Size Guide</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size guide. All measurements are in inches.
          </p>
        </div>

        <Tabs defaultValue="mens" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="mens">Men's Sizes</TabsTrigger>
            <TabsTrigger value="womens">Women's Sizes</TabsTrigger>
          </TabsList>

          <TabsContent value="mens" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Men's Tops & Outerwear
                    <Badge variant="outline">Inches</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">Size</th>
                          <th className="text-left p-2 font-semibold">Chest</th>
                          <th className="text-left p-2 font-semibold">Waist</th>
                          <th className="text-left p-2 font-semibold">Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeCharts.mens.tops.map((row) => (
                          <tr key={row.size} className="border-b">
                            <td className="p-2 font-medium">{row.size}</td>
                            <td className="p-2">{row.chest}</td>
                            <td className="p-2">{row.waist}</td>
                            <td className="p-2">{row.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Men's Bottoms
                    <Badge variant="outline">Inches</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">Size</th>
                          <th className="text-left p-2 font-semibold">Waist</th>
                          <th className="text-left p-2 font-semibold">Hip</th>
                          <th className="text-left p-2 font-semibold">Inseam</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeCharts.mens.bottoms.map((row) => (
                          <tr key={row.size} className="border-b">
                            <td className="p-2 font-medium">{row.size}</td>
                            <td className="p-2">{row.waist}</td>
                            <td className="p-2">{row.hip}</td>
                            <td className="p-2">{row.inseam}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="womens" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Women's Tops & Outerwear
                    <Badge variant="outline">Inches</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">Size</th>
                          <th className="text-left p-2 font-semibold">Chest</th>
                          <th className="text-left p-2 font-semibold">Waist</th>
                          <th className="text-left p-2 font-semibold">Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeCharts.womens.tops.map((row) => (
                          <tr key={row.size} className="border-b">
                            <td className="p-2 font-medium">{row.size}</td>
                            <td className="p-2">{row.chest}</td>
                            <td className="p-2">{row.waist}</td>
                            <td className="p-2">{row.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Women's Bottoms
                    <Badge variant="outline">Inches</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">Size</th>
                          <th className="text-left p-2 font-semibold">Waist</th>
                          <th className="text-left p-2 font-semibold">Hip</th>
                          <th className="text-left p-2 font-semibold">Inseam</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeCharts.womens.bottoms.map((row) => (
                          <tr key={row.size} className="border-b">
                            <td className="p-2 font-medium">{row.size}</td>
                            <td className="p-2">{row.waist}</td>
                            <td className="p-2">{row.hip}</td>
                            <td className="p-2">{row.inseam}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* How to Measure Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              How to Measure
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">For Tops & Outerwear:</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal
                </li>
                <li>
                  <strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose
                </li>
                <li>
                  <strong>Length:</strong> Measure from the highest point of your shoulder to the desired length
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Bottoms:</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Waist:</strong> Measure around your natural waistline where you normally wear your pants
                </li>
                <li>
                  <strong>Hip:</strong> Measure around the fullest part of your hips, about 8 inches below your waist
                </li>
                <li>
                  <strong>Inseam:</strong> Measure from the crotch seam to the bottom of the leg opening
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Fit Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Fit Guide</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-lg mb-4">
                <h3 className="font-semibold">Slim Fit</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Close to the body with minimal ease. Choose your exact size or size up for comfort.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-lg mb-4">
                <h3 className="font-semibold">Regular Fit</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Comfortable fit with room to move. True to size for most body types.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-lg mb-4">
                <h3 className="font-semibold">Oversized Fit</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Loose, relaxed fit. Consider sizing down for a less oversized look.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
