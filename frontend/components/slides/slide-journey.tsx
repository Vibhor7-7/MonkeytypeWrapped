"use client"

import { motion, useScroll, useInView } from "framer-motion"
import { useRef, useMemo } from "react"
import { TrendingUp, Trophy, Rocket, Sparkles } from "lucide-react"
import { type WrappedData } from "@/lib/api"

interface SlideJourneyProps {
  data: WrappedData
}

export function SlideJourney({ data }: SlideJourneyProps) {
  const ref = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(chartRef, { once: true })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

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

  const maxWpm = Math.max(...data.journey.monthlyTrend.map((m) => m.avgWpm))
  const minWpm = Math.min(...data.journey.monthlyTrend.map((m) => m.avgWpm))
  const range = maxWpm - minWpm

  return (
    <section ref={ref} className="relative h-full w-full flex items-center justify-center py-20 overflow-hidden">
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
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Your <span className="text-gold-gradient">Journey</span>
            </h2>
            <motion.div
              className="absolute -top-2 -right-4"
              animate={{ rotate: [0, 20, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
          </div>
          <p className="text-muted-foreground text-lg">From where you started to where you are now</p>
        </motion.div>

        {/* Progress Stats - Enhanced with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -40, rotateY: -30 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 text-center"
            style={{ perspective: "1000px" }}
          >
            <div className="text-muted-foreground text-sm mb-2">January Average</div>
            <motion.div
              className="text-3xl font-bold text-foreground"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
              viewport={{ once: true }}
            >
              {data.journey.firstMonthAvg} WPM
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
            className="bg-primary/10 border border-primary/30 rounded-2xl p-6 text-center glow-gold relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
            />
            <div className="relative flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm">Improvement</span>
            </div>
            <motion.div
              className="relative text-4xl font-bold text-gold-gradient"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              +{data.journey.improvement}%
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: 30 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 text-center"
            style={{ perspective: "1000px" }}
          >
            <div className="text-muted-foreground text-sm mb-2">December Average</div>
            <motion.div
              className="text-3xl font-bold text-foreground"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
              viewport={{ once: true }}
            >
              {data.journey.lastMonthAvg} WPM
            </motion.div>
          </motion.div>
        </div>

        {/* Progress Chart - Enhanced with better animations */}
        <motion.div
          ref={chartRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-card/30 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 md:p-8"
        >
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            >
              <Trophy className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-sm text-muted-foreground">
              Best Month: <span className="text-primary font-semibold">{data.journey.bestMonth}</span> (
              {data.journey.bestMonthAvg} WPM)
            </span>
          </div>

          <div className="relative h-64 md:h-80">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-muted-foreground font-mono">
              <span>{Math.round(maxWpm + 5)}</span>
              <span>{Math.round((maxWpm + minWpm) / 2)}</span>
              <span>{Math.round(minWpm - 5)}</span>
            </div>

            <svg className="absolute ml-14 inset-0 w-[calc(100%-3.5rem)] h-full pointer-events-none">
              <motion.path
                d={data.journey.monthlyTrend
                  .map((month, i) => {
                    const x = (i / (data.journey.monthlyTrend.length - 1)) * 100
                    const height = ((month.avgWpm - minWpm + 10) / (range + 20)) * 100
                    const y = 100 - height
                    return `${i === 0 ? "M" : "L"} ${x}% ${y}%`
                  })
                  .join(" ")}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d4a855" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#d4a855" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#d4a855" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>

            {/* Chart area */}
            <div className="ml-14 h-full flex items-end gap-2 md:gap-4">
              {data.journey.monthlyTrend.map((month, index) => {
                const height = ((month.avgWpm - minWpm + 10) / (range + 20)) * 100
                const isBestMonth = month.month === data.journey.bestMonth.substring(0, 3)

                return (
                  <motion.div
                    key={month.month}
                    className="flex-1 flex flex-col items-center gap-2"
                    initial={{ height: 0 }}
                    animate={isInView ? { height: "100%" } : {}}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                  >
                    <div className="relative flex-1 w-full flex items-end">
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={isInView ? { height: `${height}%`, opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.05, type: "spring" }}
                        whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                        className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer ${
                          isBestMonth
                            ? "bg-gradient-to-t from-primary/80 to-primary glow-gold"
                            : "bg-gradient-to-t from-primary/30 to-primary/60 hover:from-primary/50 hover:to-primary/80"
                        }`}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.4, delay: 0.8 + index * 0.05 }}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-foreground whitespace-nowrap"
                        >
                          {month.avgWpm}
                        </motion.div>
                        {isBestMonth && (
                          <motion.div
                            className="absolute -top-12 left-1/2 -translate-x-1/2"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                          >
                            <Trophy className="w-4 h-4 text-primary" />
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{month.month}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Biggest Jump Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            viewport={{ once: true }}
            className="mt-6 flex items-center justify-center gap-3 text-sm"
          >
            <motion.div
              animate={{ rotate: [0, 15, 0], y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Rocket className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-muted-foreground">
              Biggest jump: <span className="text-primary font-semibold">+{data.journey.biggestJumpAmount} WPM</span> from{" "}
              {data.journey.biggestJumpMonth} to {""}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
