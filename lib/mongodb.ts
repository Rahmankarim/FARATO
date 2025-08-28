import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/farato-ecommerce'

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

interface GlobalMongoDB {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Use global to prevent multiple connections during development
const globalForMongoDB = globalThis as unknown as {
  mongodb: GlobalMongoDB
}

let cached = globalForMongoDB.mongodb

if (!cached) {
  cached = globalForMongoDB.mongodb = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB')
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
