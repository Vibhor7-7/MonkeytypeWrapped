"use client"

import type React from "react"
import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Brain, Zap, TrendingUp, CloudOff, Sparkles } from "lucide-react"
import { type WrappedData } from "@/lib/api"

const personaIcons: Record<string, React.ElementType> = {
  "Flow State": Brain,
  "Speed Demon": Zap,
  "Steady Eddie": TrendingUp,
  "Warm Up Mode": CloudOff,
  "Balanced Performer": Sparkles,
}

const personaColors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#10b981"]

interface SlidePersonaProps {
  data: WrappedData
}

export function SlidePersona({ data }: SlidePersonaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const pieRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(pieRef, { once: true })
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

  // Calculate pie chart segments with colors
  let cumulativePercentage = 0
  const segments = data.persona.allPersonas.map((mode, index) => {
    const startAngle = cumulativePercentage * 3.6
    cumulativePercentage += mode.percentage
    const endAngle = cumulativePercentage * 3.6
    return { ...mode, startAngle, endAngle, color: personaColors[index % personaColors.length] }
  })

  return (
    <section ref={ref} className="relative min-h-screen w-full flex items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full bg-primary/5 blur-3xl"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + (i % 2) * 20}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Your Typing <span className="text-gold-gradient">Persona</span>
            </h2>
            <motion.div
              className="absolute -top-2 -right-6"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
              }}
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Persona Card - Enhanced with 3D effect */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotateY: -20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
            style={{ perspective: "1500px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-3xl blur-3xl" />
            <motion.div
              className="relative bg-gradient-to-br from-card via-card/80 to-card/50 border border-primary/30 rounded-3xl p-8 md:p-10"
              whileHover={{
                rotateY: 5,
                rotateX: -5,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent rounded-3xl"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
              />

              <div className="relative flex items-center gap-4 mb-6">
                <motion.div
                  className="p-4 rounded-2xl bg-primary/20 glow-gold"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(212, 168, 85, 0.3)",
                      "0 0 40px rgba(212, 168, 85, 0.5)",
                      "0 0 20px rgba(212, 168, 85, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Brain className="w-10 h-10 text-primary" />
                  </motion.div>
                </motion.div>
                <div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">Dominant Persona</div>
                  <motion.div
                    className="text-3xl md:text-4xl font-bold text-gold-gradient"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, type: "spring", bounce: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {data.persona.dominantPersona.name}
                  </motion.div>
                </div>
              </div>

              <motion.p
                className="relative text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                {data.persona.dominantPersona.description}
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Pie Chart - Enhanced with hover effects */}
          <motion.div
            ref={pieRef}
            initial={{ opacity: 0, x: 40, rotateY: 20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
            style={{ perspective: "1500px" }}
          >
            <motion.div
              className="relative w-64 h-64 md:w-80 md:h-80"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {segments.map((segment, index) => {
                  const radius = 40
                  const circumference = 2 * Math.PI * radius
                  const strokeDasharray = (segment.percentage / 100) * circumference
                  const strokeDashoffset = -((segment.startAngle / 360) * circumference)
                  const isHovered = hoveredSegment === index

                  return (
                    <motion.circle
                      key={segment.id}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth={isHovered ? "24" : "20"}
                      strokeDasharray={`${strokeDasharray} ${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                      initial={{ strokeDasharray: `0 ${circumference}` }}
                      animate={
                        isInView
                          ? {
                              strokeDasharray: `${strokeDasharray} ${circumference}`,
                              strokeWidth: isHovered ? 24 : 20,
                            }
                          : {}
                      }
                      transition={{ duration: 1, delay: 0.5 + index * 0.15, ease: "easeOut" }}
                      onMouseEnter={() => setHoveredSegment(index)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      style={{ cursor: "pointer" }}
                    />
                  )
                })}
              </svg>

              {/* Center text - Updates on hover */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  key={hoveredSegment ?? "default"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-4xl font-bold text-gold-gradient">
                    {hoveredSegment !== null
                      ? segments[hoveredSegment].percentage
                      : data.persona.dominantPersona.percentage}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {hoveredSegment !== null ? segments[hoveredSegment].name : data.persona.dominantPersona.name}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Legend - Enhanced with hover interactions */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {data.persona.allPersonas.map((mode, index) => {
                const Icon = personaIcons[mode.name] || Brain
                const isHovered = hoveredSegment === index

                return (
                  <motion.div
                    key={mode.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    viewport={{ once: true }}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                      isHovered ? "bg-primary/10" : ""
                    }`}
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: mode.color }}
                      animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
                    />
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isHovered ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm ${isHovered ? "text-foreground" : "text-foreground"}`}>
                        {mode.name}
                      </span>
                    </div>
                    <span className={`text-sm font-mono ${isHovered ? "text-primary font-bold" : "text-primary"}`}>
                      {mode.percentage}%
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
