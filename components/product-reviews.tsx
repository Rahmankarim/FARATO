"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/nextauth-provider"

interface ProductReviewsProps {
  productId: number | string
  rating: number
  reviewCount: number
}

interface Review {
  id: string
  productId: number | string
  user: string
  email: string
  avatar?: string
  rating: number
  date: string
  title: string
  content: string
  helpful: number
  verified: boolean
}

const REVIEWS_STORAGE_KEY = "farato_reviews"

// Get reviews from localStorage
function getStoredReviews(): Review[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Save reviews to localStorage
function saveReviews(reviews: Review[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews))
}

export function ProductReviews({ productId, rating, reviewCount }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    content: "",
  })
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  // Load reviews for this product
  useEffect(() => {
    const allReviews = getStoredReviews()
    const productReviews = allReviews.filter(review => review.productId.toString() === productId.toString())
    setReviews(productReviews)
  }, [productId])

  // Calculate rating distribution from actual reviews
  const calculateRatingDistribution = () => {
    const distribution = [
      { stars: 5, count: 0, percentage: 0 },
      { stars: 4, count: 0, percentage: 0 },
      { stars: 3, count: 0, percentage: 0 },
      { stars: 2, count: 0, percentage: 0 },
      { stars: 1, count: 0, percentage: 0 },
    ]

    reviews.forEach(review => {
      const starIndex = distribution.findIndex(d => d.stars === review.rating)
      if (starIndex !== -1) {
        distribution[starIndex].count++
      }
    })

    const totalReviews = reviews.length
    if (totalReviews > 0) {
      distribution.forEach(item => {
        item.percentage = Math.round((item.count / totalReviews) * 100)
      })
    }

    return distribution.reverse() // Show 5 stars first
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to write a review.",
        variant: "destructive",
      })
      return
    }

    if (newReview.rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Rating is required to submit a review.",
        variant: "destructive",
      })
      return
    }

    if (!newReview.title.trim() || !newReview.content.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Title and review content are required.",
        variant: "destructive",
      })
      return
    }

    // Create new review
    const review: Review = {
      id: Date.now().toString(),
      productId: productId,
      user: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0],
      email: user.email,
      avatar: user.avatar,
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      title: newReview.title.trim(),
      content: newReview.content.trim(),
      helpful: 0,
      verified: true, // Since they're logged in
    }

    // Save review
    const allReviews = getStoredReviews()
    const updatedReviews = [...allReviews, review]
    saveReviews(updatedReviews)

    // Update local state
    setReviews(prev => [...prev, review])

    toast({
      title: "Review submitted!",
      description: "Thank you for your feedback. Your review has been published.",
    })

    setNewReview({ rating: 0, title: "", content: "" })
    setShowReviewForm(false)
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${interactive ? "cursor-pointer hover:scale-110" : ""} transition-transform`}
            onClick={() => interactive && onRate?.(star)}
            disabled={!interactive}
          >
            <Star className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2">
              {reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : rating
              }
            </div>
            {renderStars(
              reviews.length > 0 
                ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
                : rating
            )}
            <p className="text-muted-foreground mt-2">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-2">
            {calculateRatingDistribution().map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-sm w-8">{item.stars}★</span>
                <Progress value={item.percentage} className="flex-1" />
                <span className="text-sm text-muted-foreground w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-4">Share your experience</h3>
          <p className="text-muted-foreground mb-4">Help other customers by writing a review about this product.</p>
          {isAuthenticated ? (
            <Button onClick={() => setShowReviewForm(!showReviewForm)}>
              {showReviewForm ? "Cancel Review" : "Write a Review"}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Please <a href="/login" className="text-primary hover:underline">log in</a> to write a review.
            </p>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && isAuthenticated && (
        <form onSubmit={handleSubmitReview} className="border rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">Write Your Review</h3>

          <div>
            <Label>Rating *</Label>
            <div className="mt-2">
              {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
            </div>
          </div>

          <div>
            <Label htmlFor="reviewTitle">Review Title *</Label>
            <Input
              id="reviewTitle"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              placeholder="Summarize your experience"
              required
            />
          </div>

          <div>
            <Label htmlFor="reviewContent">Your Review *</Label>
            <Textarea
              id="reviewContent"
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              placeholder="Tell us about your experience with this product"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit">Submit Review</Button>
            <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">
          Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by newest first
            .map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{review.user.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{review.user}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>

                    <h4 className="font-medium mb-2">{review.title}</h4>
                    <p className="text-muted-foreground mb-3">{review.content}</p>

                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        Helpful ({review.helpful})
                      </button>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ThumbsDown className="h-4 w-4" />
                        Not helpful
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}
