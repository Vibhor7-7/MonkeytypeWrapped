"use client"

import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef } from "react"
import { userData } from "@/lib/mock-data"
import { Crown, Sparkles, Target, BarChart3 } from "lucide-react"

export function SlidePeakPerformance() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full flex items-center justify-center py-20 snap-start"
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

      <motion.div style={{ scale, opacity }} className="relative z-10 w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Peak <span className="text-gold-gradient">Performance</span>
          </h2>
        </motion.div>

        {/* PB Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          viewport={{ once: true }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-3xl" />
          <div className="relative bg-gradient-to-br from-card via-card/80 to-card/50 border border-primary/30 rounded-3xl p-8 md:p-12 text-center glow-gold">
            <div className="absolute top-4 right-4">
              <Crown className="w-8 h-8 text-primary animate-pulse" />
            </div>

            <div className="text-sm text-primary uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              All-Time Personal Best
              <Sparkles className="w-4 h-4" />
            </div>

            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.4 }}
              viewport={{ once: true }}
              className="text-7xl md:text-9xl font-bold text-gold-gradient text-glow-gold mb-4"
            >
              {userData.allTimePB}
            </motion.div>

            <div className="text-2xl text-foreground font-mono mb-4">WPM</div>
            <div className="text-muted-foreground">
              Achieved on <span className="text-primary font-semibold">{userData.pbDate}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">PBs This Year</span>
            </div>
            <div className="text-4xl font-bold text-gold-gradient">{userData.totalPBsThisYear}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Perfect Accuracy</span>
            </div>
            <div className="text-4xl font-bold text-gold-gradient">{userData.perfectAccuracyTests}</div>
            <div className="text-sm text-muted-foreground">tests with 100%</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Speed Tiers</span>
            </div>
            <div className="space-y-2">
              {userData.thresholdBreakdown.slice(0, 3).map((tier, index) => (
                <div key={tier.threshold} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">≥{tier.threshold} WPM</span>
                  <span className="text-sm font-bold text-primary">{tier.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Threshold Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-card/30 backdrop-blur-sm border border-primary/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6 text-center">Speed Threshold Breakdown</h3>
          <div className="flex items-end justify-center gap-4 h-40">
            {userData.thresholdBreakdown.map((tier, index) => {
              const maxCount = Math.max(...userData.thresholdBreakdown.map((t) => t.count))
              const height = (tier.count / maxCount) * 100

              return (
                <ThresholdBar
                  key={tier.threshold}
                  threshold={tier.threshold}
                  count={tier.count}
                  height={height}
                  delay={0.7 + index * 0.1}
                />
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function ThresholdBar({
  threshold,
  count,
  height,
  delay,
}: {
  threshold: number
  count: number
  height: number
  delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <motion.div
        initial={{ height: 0 }}
        animate={isInView ? { height: `${height}%` } : {}}
        transition={{ duration: 0.8, delay, type: "spring" }}
        className="w-12 md:w-16 bg-gradient-to-t from-primary/50 to-primary rounded-t-lg relative"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: delay + 0.3 }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-foreground"
        >
          {count}
        </motion.span>
      </motion.div>
      <span className="text-xs text-muted-foreground font-mono">≥{threshold}</span>
    </div>
  )
}
