"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const processingMessages = [
  "Crunching your keystrokes...",
  "Analyzing your typing habits...",
  "Finding your peak performance...",
  "Calculating your accuracy...",
  "Discovering your persona...",
  "Generating your story...",
]

interface ProcessingScreenProps {
  onComplete: () => void
}

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 80)

    // Message rotation
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % processingMessages.length)
    }, 700)

    // Complete after processing
    const completeTimeout = setTimeout(() => {
      onComplete()
    }, 4500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
      clearTimeout(completeTimeout)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-background flex items-center justify-center z-50"
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-xl">
        {/* Animated monkey */}
        <motion.div
          className="mb-8 mx-auto w-32 h-32"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Simplified excited monkey */}
            <motion.ellipse
              cx="100"
              cy="100"
              rx="70"
              ry="65"
              fill="oklch(0.35 0.08 50)"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.3, repeat: Number.POSITIVE_INFINITY }}
            />
            <ellipse cx="100" cy="105" rx="45" ry="40" fill="oklch(0.55 0.12 60)" />

            {/* Excited eyes */}
            <motion.ellipse
              cx="75"
              cy="90"
              rx="18"
              ry="20"
              fill="white"
              animate={{ scaleY: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.ellipse
              cx="125"
              cy="90"
              rx="18"
              ry="20"
              fill="white"
              animate={{ scaleY: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
            />

            {/* Star eyes */}
            <motion.path
              d="M 75 90 L 77 85 L 79 90 L 84 90 L 80 93 L 82 98 L 75 94 L 68 98 L 70 93 L 66 90 Z"
              fill="oklch(0.85 0.15 85)"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{ transformOrigin: "75px 90px" }}
            />
            <motion.path
              d="M 125 90 L 127 85 L 129 90 L 134 90 L 130 93 L 132 98 L 125 94 L 118 98 L 120 93 L 116 90 Z"
              fill="oklch(0.85 0.15 85)"
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{ transformOrigin: "125px 90px" }}
            />

            {/* Big smile */}
            <path
              d="M 75 125 Q 100 155 125 125"
              stroke="oklch(0.25 0.05 50)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Rotating message */}
        <div className="h-16 mb-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-2xl md:text-3xl font-semibold text-gold-gradient"
            >
              {processingMessages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-gold-bright to-primary rounded-full"
              style={{ width: `${progress}%` }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
          <p className="text-muted-foreground mt-4 font-mono text-sm">{progress}% complete</p>
        </div>

        {/* Floating key indicators */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["W", "P", "M", "A", "S", "K", "E", "Y"].map((key, i) => (
            <motion.div
              key={key}
              className="absolute px-3 py-1.5 bg-card border border-border rounded-lg font-mono text-sm text-primary"
              style={{
                left: `${10 + i * 12}%`,
                top: "20%",
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
              }}
            >
              {key}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
