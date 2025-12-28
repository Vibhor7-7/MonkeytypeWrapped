"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { MonkeyMascot } from "./monkey-mascot"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  // Generate random values only on client side to avoid hydration mismatch
  const [floatingParticles, setFloatingParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    duration: number;
    delay: number;
  }>>([])

  useEffect(() => {
    setFloatingParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 4 + Math.random() * 3,
        delay: Math.random() * 3,
      }))
    )
  }, [])

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
            <motion.span
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="text-sm text-primary font-mono tracking-wider">YOUR YEAR IN TYPING</span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight"
        >
          <span className="text-foreground">Monkeytype</span>
          <br />
          <span className="text-gold-gradient text-glow-gold">Wrapped</span>
          <br />
          <span className="text-primary text-7xl md:text-8xl lg:text-9xl">2025</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          See how you typed this year. Your keystrokes tell a story.
        </motion.p>

        {/* Monkey Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 100 }}
          className="mb-12"
        >
          <MonkeyMascot />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer"
            onClick={() => {
              document.getElementById("video-section")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            <span className="text-xs uppercase tracking-widest">See how it works</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
