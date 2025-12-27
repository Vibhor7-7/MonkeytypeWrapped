"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

export function MonkeyMascot() {
  const [isTyping, setIsTyping] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Eye tracking
  const eyeX = useTransform(mouseX, [-500, 500], [-3, 3])
  const eyeY = useTransform(mouseY, [-500, 500], [-2, 2])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 150)
      },
      3000 + Math.random() * 2000,
    )

    return () => clearInterval(blinkInterval)
  }, [])

  // Random typing animation
  useEffect(() => {
    const typeInterval = setInterval(
      () => {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 500)
      },
      2000 + Math.random() * 1500,
    )

    return () => clearInterval(typeInterval)
  }, [])

  return (
    <motion.div
      className="relative w-48 h-48 md:w-64 md:h-64 mx-auto cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      />

      {/* Main monkey body */}
      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
        {/* Face background */}
        <motion.ellipse
          cx="100"
          cy="100"
          rx="70"
          ry="65"
          fill="oklch(0.35 0.08 50)"
          animate={isTyping ? { y: [0, -2, 0] } : {}}
          transition={{ duration: 0.15, repeat: isTyping ? 3 : 0 }}
        />

        {/* Inner face */}
        <ellipse cx="100" cy="105" rx="45" ry="40" fill="oklch(0.55 0.12 60)" />

        {/* Left ear */}
        <motion.circle cx="35" cy="80" r="20" fill="oklch(0.35 0.08 50)" whileHover={{ scale: 1.1 }} />
        <circle cx="35" cy="80" r="12" fill="oklch(0.55 0.12 60)" />

        {/* Right ear */}
        <motion.circle cx="165" cy="80" r="20" fill="oklch(0.35 0.08 50)" whileHover={{ scale: 1.1 }} />
        <circle cx="165" cy="80" r="12" fill="oklch(0.55 0.12 60)" />

        {/* Left eye white */}
        <ellipse cx="75" cy="90" rx="18" ry={isBlinking ? 2 : 20} fill="white" />

        {/* Right eye white */}
        <ellipse cx="125" cy="90" rx="18" ry={isBlinking ? 2 : 20} fill="white" />

        {/* Left pupil */}
        {!isBlinking && <motion.circle cx="75" cy="90" r="8" fill="oklch(0.15 0 0)" style={{ x: eyeX, y: eyeY }} />}

        {/* Right pupil */}
        {!isBlinking && <motion.circle cx="125" cy="90" r="8" fill="oklch(0.15 0 0)" style={{ x: eyeX, y: eyeY }} />}

        {/* Eye shine */}
        {!isBlinking && (
          <>
            <circle cx="78" cy="86" r="3" fill="white" opacity="0.8" />
            <circle cx="128" cy="86" r="3" fill="white" opacity="0.8" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="100" cy="115" rx="8" ry="6" fill="oklch(0.25 0.05 50)" />

        {/* Mouth - changes with typing */}
        <motion.path
          d={isTyping ? "M 80 130 Q 100 135 120 130" : "M 80 130 Q 100 145 120 130"}
          stroke="oklch(0.25 0.05 50)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Keyboard below */}
        <motion.g animate={isTyping ? { y: [0, 1, 0] } : {}} transition={{ duration: 0.1, repeat: isTyping ? 5 : 0 }}>
          <rect x="55" y="165" width="90" height="25" rx="4" fill="oklch(0.2 0 0)" />
          {/* Keys */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <motion.rect
              key={i}
              x={60 + i * 12}
              y="170"
              width="8"
              height="6"
              rx="1"
              fill={isTyping && i === Math.floor(Math.random() * 7) ? "oklch(0.85 0.15 85)" : "oklch(0.35 0 0)"}
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.rect
              key={`row2-${i}`}
              x={65 + i * 12}
              y="180"
              width="8"
              height="6"
              rx="1"
              fill={isTyping && i === Math.floor(Math.random() * 6) ? "oklch(0.85 0.15 85)" : "oklch(0.35 0 0)"}
            />
          ))}
        </motion.g>
      </svg>

      {/* Floating typing indicators */}
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 right-0 text-primary font-mono text-sm"
        >
          clack!
        </motion.div>
      )}
    </motion.div>
  )
}
