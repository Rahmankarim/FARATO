import { NextRequest, NextResponse } from 'next/server'
import { seedProducts } from '@/lib/seed-products'

export async function POST(request: NextRequest) {
  try {
    const products = await seedProducts()
    
    return NextResponse.json({
      message: 'Database seeded successfully',
      productsCount: products.length
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
