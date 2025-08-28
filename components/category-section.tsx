import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const categories = [
  {
    id: 1,
    name: "Men's Collection",
    description: "Bold styles for the modern man",
    image: "/mens-streetwear-style.png",
    link: "/men",
  },
  {
    id: 2,
    name: "Women's Collection",
    description: "Elegant and edgy designs",
    image: "/womens-streetwear-fashion.png",
    link: "/women",
  },
  {
    id: 3,
    name: "Accessories",
    description: "Complete your look",
    image: "/fashion-accessories-bags-shoes.png",
    link: "/accessories",
  },
]

export function CategorySection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our curated collections designed for the modern lifestyle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group relative overflow-hidden rounded-lg">
              <div className="aspect-[3/4] relative">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm opacity-90 mb-4">{category.description}</p>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black w-fit bg-transparent"
                  asChild
                >
                  <Link href={category.link}>Shop Now</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
