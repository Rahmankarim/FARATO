import mongoose from 'mongoose'

// User Schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: String,
  dateOfBirth: Date,
  gender: String,
  avatar: String,
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  provider: {
    type: String,
    enum: ['credentials', 'google', 'facebook'],
    default: 'credentials',
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
})

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  originalPrice: Number,
  category: {
    type: String,
    required: true,
  },
  brand: String,
  sku: String,
  images: [String],
  colors: [String],
  sizes: [String],
  features: [String],
  specifications: {
    type: Map,
    of: String,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  stockCount: {
    type: Number,
    default: 0,
  },
  isNew: {
    type: Boolean,
    default: false,
  },
  isSale: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
})

// Order Schema
const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String,
    image: String,
  }],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: Number,
  paymentMethod: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  trackingNumber: String,
  notes: String,
}, {
  timestamps: true,
})

// Review Schema
const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: String,
  userEmail: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: String,
  content: String,
  helpful: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

// Wishlist Schema
const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
})

// Cart Schema
const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: Number,
    size: String,
    color: String,
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
})

// Log Schema for tracking activities
const LogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
})

// Export models
export const User = mongoose.models.User || mongoose.model('User', UserSchema)
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema)
export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema)
export const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema)
export const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema)
export const Log = mongoose.models.Log || mongoose.model('Log', LogSchema)
