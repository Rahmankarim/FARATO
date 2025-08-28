import Image from "next/image"
import Link from "next/link"
import { Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"

const instagramPosts = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=300",
    likes: 1234,
    caption: "Street style vibes ✨",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=300",
    likes: 2156,
    caption: "Minimalist perfection 🖤",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=300",
    likes: 987,
    caption: "Urban essentials 🏙️",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=300",
    likes: 3421,
    caption: "Bold and beautiful 💫",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=300&width=300",
    likes: 1876,
    caption: "Everyday elegance ✨",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=300&width=300",
    likes: 2543,
    caption: "Fashion forward 🚀",
  },
]

export function InstagramFeed() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="h-6 w-6" />
            <h2 className="text-3xl md:text-4xl font-bold">@farato_official</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow us for daily style inspiration and behind-the-scenes content
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <div key={post.id} className="group relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={`Instagram post ${post.id}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                  <Instagram className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{post.likes.toLocaleString()} likes</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="https://instagram.com/farato_official" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5 mr-2" />
              Follow @farato_official
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
