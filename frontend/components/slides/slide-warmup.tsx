"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useMemo } from "react"
import { Flame, Thermometer, TrendingUp } from "lucide-react"
import { type WrappedData } from "@/lib/api"

interface SlideWarmupProps {
  data: WrappedData
}

export function SlideWarmup({ data }: SlideWarmupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(chartRef, { once: true })

  const maxWpm = Math.max(...data.warmup.warmupCurve.map((t) => t.avgWpm))
  const minWpm = Math.min(...data.warmup.warmupCurve.map((t) => t.avgWpm))

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
      className="relative min-h-screen w-full flex items-center justify-center py-20 snap-start"
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

      <div className="relative z-10 w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            The <span className="text-gold-gradient">Warmup</span> Effect
          </h2>
          <p className="text-muted-foreground text-lg">How your speed changes as you get into the zone</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 text-center"
          >
            <Thermometer className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <div className="text-sm text-muted-foreground mb-2">Cold Start</div>
            <div className="text-4xl font-bold text-foreground">{data.warmup.coldStartWpm}</div>
            <div className="text-sm text-muted-foreground">WPM</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6 text-center glow-gold"
          >
            <Flame className="w-8 h-8 text-primary mx-auto mb-4 animate-pulse" />
            <div className="text-sm text-primary mb-2">Warmed Up Peak</div>
            <div className="text-4xl font-bold text-gold-gradient">{data.warmup.warmedUpWpm}</div>
            <div className="text-sm text-muted-foreground">WPM</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 text-center"
          >
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-4" />
            <div className="text-sm text-muted-foreground mb-2">Tests to Peak</div>
            <div className="text-4xl font-bold text-foreground">{data.warmup.testsUntilPeak}</div>
            <div className="text-sm text-muted-foreground">tests</div>
          </motion.div>
        </div>

        {/* Warmup Curve */}
        <motion.div
          ref={chartRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-card/30 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 md:p-8"
        >
          <h3 className="text-lg font-semibold mb-8 flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            Your Warmup Curve
          </h3>

          <div className="relative h-64 md:h-80">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-primary/10 w-full" />
              ))}
            </div>

            {/* Chart */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="none">
              {/* Path line */}
              <motion.path
                d={data.warmup.warmupCurve
                  .map((point, i) => {
                    const x = (i / (data.warmup.warmupCurve.length - 1)) * 580 + 10
                    const y = 280 - ((point.avgWpm - minWpm) / (maxWpm - minWpm)) * 260
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`
                  })
                  .join(" ")}
                fill="none"
                stroke="url(#warmupGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="warmupGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6b8dd6" />
                  <stop offset="50%" stopColor="#d4a855" />
                  <stop offset="100%" stopColor="#d4a855" />
                </linearGradient>
              </defs>

              {/* Data points */}
              {data.warmup.warmupCurve.map((point, i) => {
                const x = (i / (data.warmup.warmupCurve.length - 1)) * 580 + 10
                const y = 280 - ((point.avgWpm - minWpm) / (maxWpm - minWpm)) * 260
                const isPeak = point.avgWpm === data.warmup.warmedUpWpm

                return (
                  <motion.g key={i}>
                    <motion.circle
                      cx={x}
                      cy={y}
                      r={isPeak ? 10 : 6}
                      fill={isPeak ? "#d4a855" : "#1a1a1a"}
                      stroke="#d4a855"
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                    />
                    {isPeak && (
                      <motion.circle
                        cx={x}
                        cy={y}
                        r="16"
                        fill="none"
                        stroke="#d4a855"
                        strokeWidth="2"
                        opacity="0.5"
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: [1, 1.5, 1] } : {}}
                        transition={{ duration: 1.5, delay: 1, repeat: Number.POSITIVE_INFINITY }}
                      />
                    )}
                  </motion.g>
                )
              })}
            </svg>

            {/* Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pt-4">
              {data.warmup.warmupCurve.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-xs text-muted-foreground font-mono">Test {point.testNumber}</div>
                  <div className="text-sm font-bold text-foreground">{point.avgWpm}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Improvement stat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <span className="text-muted-foreground">Warmup boost: </span>
            <span className="text-2xl font-bold text-gold-gradient">
              +{(data.warmup.warmedUpWpm - data.warmup.coldStartWpm).toFixed(1)} WPM
            </span>
            <span className="text-muted-foreground ml-2">
              ({(((data.warmup.warmedUpWpm - data.warmup.coldStartWpm) / data.warmup.coldStartWpm) * 100).toFixed(1)}%
              increase)
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
