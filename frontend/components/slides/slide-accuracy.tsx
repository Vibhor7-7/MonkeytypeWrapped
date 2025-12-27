"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { userData } from "@/lib/mock-data"
import { Target, Zap, TrendingDown } from "lucide-react"

export function SlideAccuracy() {
  const ref = useRef<HTMLDivElement>(null)
  const pieRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(pieRef, { once: true })

  // Calculate pie chart segments
  let cumulativePercentage = 0
  const segments = userData.errorBreakdown.map((error) => {
    const startAngle = cumulativePercentage * 3.6
    cumulativePercentage += error.percentage
    const endAngle = cumulativePercentage * 3.6
    return { ...error, startAngle, endAngle }
  })

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full flex items-center justify-center py-20 overflow-hidden snap-start"
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              y: [0, -50 - Math.random() * 100, 0],
              x: [0, (Math.random() - 0.5) * 100, 0],
              opacity: [0, 0.3, 0],
              scale: [0, 1 + Math.random(), 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
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

      <div className="relative z-10 w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Accuracy <span className="text-gold-gradient">Deep Dive</span>
          </h2>
        </motion.div>

        {/* Overall Accuracy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-full px-12 py-8 glow-gold">
            <div className="text-sm text-primary uppercase tracking-wider mb-2">Overall Accuracy</div>
            <div className="text-6xl md:text-7xl font-bold text-gold-gradient">{userData.overallAccuracy}%</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Error Breakdown Pie */}
          <motion.div
            ref={pieRef}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card/30 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 md:p-8"
          >
            <h3 className="text-lg font-semibold mb-6">Error Type Breakdown</h3>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Pie Chart */}
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {segments.map((segment, index) => {
                    const radius = 40
                    const circumference = 2 * Math.PI * radius
                    const strokeDasharray = (segment.percentage / 100) * circumference
                    const strokeDashoffset = -((segment.startAngle / 360) * circumference)

                    return (
                      <motion.circle
                        key={segment.type}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={segment.color}
                        strokeWidth="20"
                        strokeDasharray={`${strokeDasharray} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        initial={{ strokeDasharray: `0 ${circumference}` }}
                        animate={isInView ? { strokeDasharray: `${strokeDasharray} ${circumference}` } : {}}
                        transition={{ duration: 1, delay: 0.3 + index * 0.15, ease: "easeOut" }}
                      />
                    )
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-4">
                {userData.errorBreakdown.map((error, index) => (
                  <motion.div
                    key={error.type}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: error.color }} />
                    <div className="flex-1">
                      <div className="text-sm text-foreground">{error.type}</div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${error.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                          viewport={{ once: true }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: error.color }}
                        />
                      </div>
                    </div>
                    <span className="text-lg font-bold font-mono" style={{ color: error.color }}>
                      {error.percentage}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Clutch Factor */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-card/30 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 md:p-8"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Clutch Factor
            </h3>
            <p className="text-muted-foreground text-sm mb-8">
              How does your accuracy hold up when you're typing fast vs. slow?
            </p>

            <div className="space-y-8">
              {/* Fast typing */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="text-foreground">When Typing Fast</span>
                  </div>
                  <span className="text-2xl font-bold text-gold-gradient">{userData.clutchFactor.fastAccuracy}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${userData.clutchFactor.fastAccuracy}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
                  />
                </div>
              </div>

              {/* Slow typing */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">When Typing Slow</span>
                  </div>
                  <span className="text-2xl font-bold text-foreground">{userData.clutchFactor.slowAccuracy}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${userData.clutchFactor.slowAccuracy}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="h-full bg-muted-foreground rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Clutch assessment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-8 p-4 bg-primary/10 rounded-xl text-center"
            >
              <Target className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">
                {userData.clutchFactor.fastAccuracy > 95
                  ? "You stay precise even under pressure!"
                  : "Room to improve accuracy at high speeds"}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
