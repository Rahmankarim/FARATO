"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SizeGuideProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const sizeCharts = {
  tops: [
    { size: "XS", chest: "32-34", waist: "26-28", length: "26" },
    { size: "S", chest: "34-36", waist: "28-30", length: "27" },
    { size: "M", chest: "36-38", waist: "30-32", length: "28" },
    { size: "L", chest: "38-40", waist: "32-34", length: "29" },
    { size: "XL", chest: "40-42", waist: "34-36", length: "30" },
    { size: "XXL", chest: "42-44", waist: "36-38", length: "31" },
  ],
  bottoms: [
    { size: "26", waist: "26", hip: "36", inseam: "30" },
    { size: "28", waist: "28", hip: "38", inseam: "30" },
    { size: "30", waist: "30", hip: "40", inseam: "32" },
    { size: "32", waist: "32", hip: "42", inseam: "32" },
    { size: "34", waist: "34", hip: "44", inseam: "32" },
    { size: "36", waist: "36", hip: "46", inseam: "32" },
  ],
}

export function SizeGuide({ open, onOpenChange }: SizeGuideProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="tops" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tops">Tops & Outerwear</TabsTrigger>
            <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
          </TabsList>

          <TabsContent value="tops" className="mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Tops & Outerwear Size Chart (inches)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-300 p-2 text-left">Size</th>
                      <th className="border border-gray-300 p-2 text-left">Chest</th>
                      <th className="border border-gray-300 p-2 text-left">Waist</th>
                      <th className="border border-gray-300 p-2 text-left">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeCharts.tops.map((row) => (
                      <tr key={row.size}>
                        <td className="border border-gray-300 p-2 font-medium">{row.size}</td>
                        <td className="border border-gray-300 p-2">{row.chest}</td>
                        <td className="border border-gray-300 p-2">{row.waist}</td>
                        <td className="border border-gray-300 p-2">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bottoms" className="mt-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Bottoms Size Chart (inches)</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-300 p-2 text-left">Size</th>
                      <th className="border border-gray-300 p-2 text-left">Waist</th>
                      <th className="border border-gray-300 p-2 text-left">Hip</th>
                      <th className="border border-gray-300 p-2 text-left">Inseam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeCharts.bottoms.map((row) => (
                      <tr key={row.size}>
                        <td className="border border-gray-300 p-2 font-medium">{row.size}</td>
                        <td className="border border-gray-300 p-2">{row.waist}</td>
                        <td className="border border-gray-300 p-2">{row.hip}</td>
                        <td className="border border-gray-300 p-2">{row.inseam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">How to Measure</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              • <strong>Chest:</strong> Measure around the fullest part of your chest
            </li>
            <li>
              • <strong>Waist:</strong> Measure around your natural waistline
            </li>
            <li>
              • <strong>Hip:</strong> Measure around the fullest part of your hips
            </li>
            <li>
              • <strong>Inseam:</strong> Measure from crotch to ankle
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
