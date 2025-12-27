"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SlideHook } from "@/components/slides/slide-hook"
import { SlideYearInNumbers } from "@/components/slides/slide-year-in-numbers"
import { SlideJourney } from "@/components/slides/slide-journey"
import { SlidePeakPerformance } from "@/components/slides/slide-peak-performance"
import { SlideWhenYouType } from "@/components/slides/slide-when-you-type"
import { SlidePersona } from "@/components/slides/slide-persona"
import { SlideWarmup } from "@/components/slides/slide-warmup"
import { SlideQuirks } from "@/components/slides/slide-quirks"
import { SlideAccuracy } from "@/components/slides/slide-accuracy"
import { SlideCompare } from "@/components/slides/slide-compare"
import { SlideSummary } from "@/components/slides/slide-summary"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"

const slides = [
  { component: SlideHook, label: "Hook", direction: "vertical" },
  { component: SlideYearInNumbers, label: "Year in Numbers", direction: "vertical" },
  { component: SlideJourney, label: "Journey", direction: "horizontal" },
  { component: SlidePeakPerformance, label: "Peak Performance", direction: "horizontal" },
  { component: SlideWhenYouType, label: "Best Hours", direction: "vertical" },
  { component: SlidePersona, label: "Persona", direction: "vertical" },
  { component: SlideWarmup, label: "Warmup", direction: "horizontal" },
  { component: SlideQuirks, label: "Quirks", direction: "horizontal" },
  { component: SlideAccuracy, label: "Accuracy", direction: "vertical" },
  { component: SlideCompare, label: "Compare", direction: "vertical" },
  { component: SlideSummary, label: "Summary", direction: "vertical" },
]

const getVariants = (direction: "vertical" | "horizontal", isNext: boolean) => {
  if (direction === "horizontal") {
    return {
      enter: { x: isNext ? "100%" : "-100%", opacity: 0 },
      center: { x: 0, opacity: 1 },
      exit: { x: isNext ? "-100%" : "100%", opacity: 0 },
    }
  }
  return {
    enter: { y: isNext ? "100%" : "-100%", opacity: 0, scale: 0.9 },
    center: { y: 0, opacity: 1, scale: 1 },
    exit: { y: isNext ? "-100%" : "100%", opacity: 0, scale: 0.9 },
  }
}

export function WrappedExperience() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<"next" | "prev">("next")
  const slideContentRef = useRef<HTMLDivElement>(null)
  const [canNavigate, setCanNavigate] = useState({ up: true, down: true })

  const totalSlides = slides.length
  const currentSlideData = slides[currentSlide]
  const SlideComponent = currentSlideData.component
  const slideDirection = currentSlideData.direction as "vertical" | "horizontal"

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index < 0 || index >= totalSlides || index === currentSlide) return
      setDirection(index > currentSlide ? "next" : "prev")
      setIsAnimating(true)
      setCurrentSlide(index)
    },
    [currentSlide, isAnimating, totalSlides],
  )

  const goNext = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide])
  const goPrev = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goNext, goPrev])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (e.deltaY > 30) goNext()
        else if (e.deltaY < -30) goPrev()
      }, 50)
    }
    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => {
      window.removeEventListener("wheel", handleWheel)
      clearTimeout(timeout)
    }
  }, [goNext, goPrev])

  useEffect(() => {
    let touchStartY = 0
    let touchStartX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartX = e.touches[0].clientX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const diffY = touchStartY - touchEndY
      const diffX = touchStartX - touchEndX

      if (Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY > 50) goNext()
        else if (diffY < -50) goPrev()
      } else {
        if (diffX > 50) goNext()
        else if (diffX < -50) goPrev()
      }
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchend", handleTouchEnd)
    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [goNext, goPrev])

  const checkScrollBoundaries = useCallback(() => {
    const el = slideContentRef.current
    if (!el) {
      setCanNavigate({ up: true, down: true })
      return
    }

    const isAtTop = el.scrollTop <= 5
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5
    const hasNoScroll = el.scrollHeight <= el.clientHeight

    setCanNavigate({
      up: isAtTop || hasNoScroll,
      down: isAtBottom || hasNoScroll,
    })
  }, [])

  useEffect(() => {
    if (slideContentRef.current) {
      slideContentRef.current.scrollTop = 0
    }
    const timeout = setTimeout(checkScrollBoundaries, 100)
    return () => clearTimeout(timeout)
  }, [currentSlide, checkScrollBoundaries])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      } else if ((e.key === "ArrowDown" || e.key === " ") && canNavigate.down) {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowUp" && canNavigate.up) {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goNext, goPrev, canNavigate])

  useEffect(() => {
    let touchStartY = 0
    let touchStartX = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      touchStartX = e.touches[0].clientX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const diffY = touchStartY - touchEndY
      const diffX = touchStartX - touchEndX

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) goNext()
        else goPrev()
      }
    }

    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchend", handleTouchEnd)
    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [goNext, goPrev])

  const variants = getVariants(slideDirection, direction === "next")

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="group flex items-center gap-3 cursor-pointer"
            aria-label={`Go to ${slide.label}`}
          >
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-right">
              {slide.label}
            </span>
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === i
                  ? "bg-primary scale-150 shadow-lg shadow-primary/50"
                  : "bg-primary/30 group-hover:bg-primary/60"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted lg:hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="fixed top-4 left-4 z-50 text-sm text-muted-foreground font-mono">
        {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <button
          onClick={goPrev}
          disabled={currentSlide === 0 || isAnimating}
          className="p-3 rounded-full bg-card/50 backdrop-blur border border-border/50 text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-card transition-colors"
          aria-label="Previous slide"
        >
          {slideDirection === "horizontal" ? <ChevronLeft className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur border border-border/50">
          <span className="text-xs text-muted-foreground">
            {slideDirection === "horizontal" ? "Swipe left/right" : "Use arrows or buttons"}
          </span>
        </div>

        <button
          onClick={goNext}
          disabled={currentSlide === totalSlides - 1 || isAnimating}
          className="p-3 rounded-full bg-card/50 backdrop-blur border border-border/50 text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-card transition-colors"
          aria-label="Next slide"
        >
          {slideDirection === "horizontal" ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence mode="wait" onExitComplete={() => setIsAnimating(false)}>
        <motion.div
          key={currentSlide}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.5,
          }}
          className="absolute inset-0"
        >
          <div
            ref={slideContentRef}
            onScroll={checkScrollBoundaries}
            className="h-full w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40"
          >
            <SlideComponent />
          </div>
        </motion.div>
      </AnimatePresence>

      {slideDirection === "horizontal" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-1/2 left-4 -translate-y-1/2 z-40 text-primary/50"
        >
          <ChevronLeft className="w-8 h-8 animate-pulse" />
        </motion.div>
      )}
      {slideDirection === "horizontal" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-1/2 right-16 -translate-y-1/2 z-40 text-primary/50"
        >
          <ChevronRight className="w-8 h-8 animate-pulse" />
        </motion.div>
      )}
    </div>
  )
}
