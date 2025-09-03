"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Printer, Layers, Zap, ArrowRight, Star, Users, Award, Handshake, Shield } from "lucide-react"

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [videoOpacity, setVideoOpacity] = useState(0.35) // fixed to 0.35

  function useAnimatedCounter(end: number, duration = 2000) {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        },
        { threshold: 0.1 },
      )

      if (ref.current) {
        observer.observe(ref.current)
      }

      return () => observer.disconnect()
    }, [isVisible])

    useEffect(() => {
      if (!isVisible) return

      let startTime: number
      let animationId: number

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)

        const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
        setCount(Math.floor(easeOutExpo * end))

        if (progress < 1) {
          animationId = requestAnimationFrame(animate)
        }
      }

      animationId = requestAnimationFrame(animate)

      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
      }
    }, [isVisible, end, duration])

    return { count, ref }
  }

  const projectsCounter = useAnimatedCounter(300, 3000)
  const clientsCounter = useAnimatedCounter(500, 2500)
  const yearsCounter = useAnimatedCounter(5, 2000)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scroll = totalScroll / windowHeight
      setScrollProgress(scroll)

      // Always use 0.35 for opacity
      setVideoOpacity(0.35)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800/50 z-50">
        <div
          className="neon-progress h-full transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      <div className="fixed inset-0 w-full h-full z-0">
        <video autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover">
          <source src="/shelom.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black transition-opacity duration-500"
          style={{ opacity: videoOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
      </div>

      {/* ...rest of your page remains unchanged... */}
    </div>
  )
}
