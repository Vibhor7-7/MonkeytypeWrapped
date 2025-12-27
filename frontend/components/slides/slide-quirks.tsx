"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { userData } from "@/lib/mock-data"
import { RotateCcw, Clock, Target, Gamepad2 } from "lucide-react"

export function SlideQuirks() {
  const ref = useRef<HTMLDivElement>(null)

  // Calculate restart addiction level
  const getAddictionLevel = (score: number) => {
    if (score >= 80) return { label: "Extreme", color: "#ef4444" }
    if (score >= 60) return { label: "High", color: "#f97316" }
    if (score >= 40) return { label: "Moderate", color: "#eab308" }
    return { label: "Low", color: "#22c55e" }
  }

  const addictionLevel = getAddictionLevel(userData.restartAddictionScore)

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full flex items-center justify-center py-20 overflow-hidden snap-start"
    >
      <div className="relative z-10 w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Your <span className="text-gold-gradient">Quirks</span>
          </h2>
          <p className="text-muted-foreground text-lg">The habits that make you unique</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Restart Addiction */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <RotateCcw className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Restart Addiction</div>
                <div className="text-xl font-bold" style={{ color: addictionLevel.color }}>
                  {addictionLevel.label}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Addiction Score</span>
                <span className="font-mono text-primary">{userData.restartAddictionScore}/100</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${userData.restartAddictionScore}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #22c55e, #eab308, #f97316, #ef4444)`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="text-sm text-muted-foreground mb-1">Avg Restarts</div>
                <div className="text-2xl font-bold text-foreground">{userData.avgRestarts}</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="text-sm text-muted-foreground mb-1">Max Ever</div>
                <div className="text-2xl font-bold text-primary">{userData.maxRestarts}</div>
              </div>
            </div>
          </motion.div>

          {/* Time Wasted */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Time on Restarts</div>
                <div className="text-xl font-bold text-foreground">The Cost of Perfection</div>
              </div>
            </div>

            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                viewport={{ once: true }}
                className="text-6xl md:text-7xl font-bold text-gold-gradient mb-2"
              >
                {userData.timeWastedOnRestarts}
              </motion.div>
              <div className="text-xl text-muted-foreground">hours "wasted"</div>
              <div className="text-sm text-primary mt-2">(but were they really wasted?)</div>
            </div>
          </motion.div>

          {/* First Try Success */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">First Try Success Rate</div>
              </div>
            </div>

            <div className="relative flex items-center justify-center py-4">
              <svg className="w-40 h-40" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-primary"
                  strokeDasharray={`${userData.firstTrySuccessRate * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                  initial={{ strokeDasharray: "0 251" }}
                  whileInView={{ strokeDasharray: `${userData.firstTrySuccessRate * 2.51} 251` }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                  viewport={{ once: true }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-gradient">{userData.firstTrySuccessRate}%</div>
                  <div className="text-xs text-muted-foreground">First Try</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Favorite Mode */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/20">
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Favorite Test Mode</div>
              </div>
            </div>

            <div className="text-center py-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                viewport={{ once: true }}
                className="inline-block"
              >
                <div className="text-4xl md:text-5xl font-bold text-gold-gradient text-glow-gold">
                  {userData.favoriteTestMode}
                </div>
                <div className="text-sm text-muted-foreground mt-2">Your go-to challenge</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
