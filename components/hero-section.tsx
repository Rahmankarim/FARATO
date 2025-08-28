"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

const heroSlides = [
  {
    id: 1,
    title: "BOLD. MODERN. FEARLESS.",
    subtitle: "New Collection 2024",
    description: "Discover the latest in streetwear fashion",
    image: "/modern-streetwear-model.png",
    cta: "Shop Now",
    link: "/collections/new",
  },
  {
    id: 2,
    title: "STREET STYLE REDEFINED",
    subtitle: "Urban Essentials",
    description: "Elevate your everyday look",
    image: "/urban-fashion-street-style.png",
    cta: "Explore",
    link: "/collections/urban",
  },
  {
    id: 3,
    title: "PREMIUM QUALITY",
    subtitle: "Crafted for Excellence",
    description: "Where comfort meets style",
    image: "/premium-fashion-clothing.png",
    cta: "Discover",
    link: "/collections/premium",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm md:text-base font-medium tracking-wider uppercase mb-4 opacity-90">
              {heroSlides[currentSlide].subtitle}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {heroSlides[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-3" asChild>
                <Link href={heroSlides[currentSlide].link}>{heroSlides[currentSlide].cta}</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3 bg-transparent"
                asChild
              >
                <Link href="/collections">View All Collections</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20 h-12 w-12"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-white/20 h-12 w-12"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Auto-play Control */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-8 right-8 z-20 text-white hover:bg-white/20"
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
      >
        <Play className={`h-5 w-5 ${isAutoPlaying ? "opacity-100" : "opacity-50"}`} />
      </Button>
    </section>
  )
}
