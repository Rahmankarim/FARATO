import connectToDatabase from '@/lib/mongodb'
import { Product } from '@/lib/models'

const products = [
  {
    name: "Classic Denim Jacket",
    description: "A timeless denim jacket perfect for layering. Made from premium cotton denim with vintage-inspired details.",
    price: 89.99,
    salePrice: 69.99,
    category: "men",
    brand: "Farato",
    images: ["/minimalist-denim-jacket.png"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black"],
    stock: 50,
    featured: true,
    tags: ["denim", "jacket", "casual", "layering"]
  },
  {
    name: "Urban Streetwear Hoodie",
    description: "Comfortable urban hoodie with modern design. Perfect for casual wear and street style.",
    price: 79.99,
    category: "men",
    brand: "Farato",
    images: ["/urban-streetwear-hoodie.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gray", "Black", "Navy"],
    stock: 75,
    featured: true,
    tags: ["hoodie", "streetwear", "casual", "urban"]
  },
  {
    name: "Cozy Wool Coat",
    description: "Elegant wool coat for the fashion-forward woman. Perfect for chilly weather with sophisticated style.",
    price: 199.99,
    salePrice: 149.99,
    category: "women",
    brand: "Farato",
    images: ["/cozy-wool-coat.png"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Camel", "Black", "Navy"],
    stock: 30,
    featured: true,
    tags: ["coat", "wool", "elegant", "winter"]
  },
  {
    name: "Premium Fashion Blazer",
    description: "Sophisticated blazer for professional and casual wear. Tailored fit with modern details.",
    price: 129.99,
    category: "women",
    brand: "Farato",
    images: ["/blazer.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray"],
    stock: 40,
    featured: false,
    tags: ["blazer", "professional", "elegant", "tailored"]
  },
  {
    name: "Cargo Utility Pants",
    description: "Functional cargo pants with multiple pockets. Perfect for outdoor activities and casual wear.",
    price: 69.99,
    category: "men",
    brand: "Farato",
    images: ["/cargo-pants-utility.png"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Khaki", "Black", "Olive"],
    stock: 60,
    featured: false,
    tags: ["cargo", "utility", "outdoor", "functional"]
  },
  {
    name: "Brown Leather Messenger Bag",
    description: "Genuine leather messenger bag for work and travel. Spacious and durable with vintage charm.",
    price: 159.99,
    salePrice: 119.99,
    category: "accessories",
    brand: "Farato",
    images: ["/brown-leather-messenger-bag.png"],
    sizes: ["One Size"],
    colors: ["Brown", "Black"],
    stock: 25,
    featured: true,
    tags: ["bag", "leather", "messenger", "work", "travel"]
  }
]

export async function seedProducts() {
  try {
    await connectToDatabase()
    
    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')
    
    // Insert new products
    const insertedProducts = await Product.insertMany(products)
    console.log(`Inserted ${insertedProducts.length} products`)
    
    return insertedProducts
  } catch (error) {
    console.error('Error seeding products:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('Seeding completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
}
