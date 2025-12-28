"use client"

import type React from "react"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useMemo } from "react"
import { Target, Calendar, Flame, Zap } from "lucide-react"
import { type WrappedData } from "@/lib/api"

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, type: "spring" }}
      className="text-gold-gradient text-glow-gold"
    >
      {isInView ? value.toLocaleString() : 0}
      {suffix}
    </motion.span>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  delay = 0,
}: {
  icon: React.ElementType
  label: string
  value: number
  suffix?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay, type: "spring" }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <div className="text-4xl md:text-5xl font-bold">
          <AnimatedNumber value={value} suffix={suffix} />
        </div>
      </div>
    </motion.div>
  )
}

interface SlideYearInNumbersProps {
  data: WrappedData
}

export function SlideYearInNumbers({ data }: SlideYearInNumbersProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"])

  // Generate random values once on client side to avoid hydration mismatch
  const floatingDots = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      yOffset: -50 - Math.random() * 100,
      xOffset: (Math.random() - 0.5) * 100,
      scaleMax: 1 + Math.random(),
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 3,
    })),
    []
  )

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full flex items-center justify-center py-20 overflow-hidden snap-start"
    >
      <div className="absolute inset-0 overflow-hidden">
        {floatingDots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute"
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              y: [0, dot.yOffset, 0],
              x: [0, dot.xOffset, 0],
              opacity: [0, 0.3, 0],
              scale: [0, dot.scaleMax, 0],
            }}
            transition={{
              duration: dot.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: dot.delay,
              ease: "easeInOut",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-primary" />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(212, 168, 85, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(212, 168, 85, 0.1) 0%, transparent 60%)",
            "radial-gradient(circle at 50% 50%, rgba(212, 168, 85, 0.05) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      />

      <motion.div style={{ y }} className="relative z-10 w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Your Year in <span className="text-gold-gradient">Numbers</span>
          </h2>
          <p className="text-muted-foreground text-lg">The stats that define your typing journey</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard icon={Target} label="Tests Completed" value={data.yearInNumbers.totalTests} delay={0.1} />
          <StatCard
            icon={Calendar}
            label="Active Days"
            value={data.yearInNumbers.activeDays}
            delay={0.2}
          />
          <StatCard icon={Zap} label="Characters Typed" value={data.yearInNumbers.totalCharacters} delay={0.3} />
          <StatCard icon={Flame} label="Longest Streak" value={data.yearInNumbers.longestStreak} suffix=" days" delay={0.4} />
        </div>
      </motion.div>
    </section>
  )
}
