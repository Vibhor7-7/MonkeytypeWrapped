"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { userData } from "@/lib/mock-data"
import { Sun, Moon, Clock, Star } from "lucide-react"

export function SlideWhenYouType() {
  const ref = useRef<HTMLDivElement>(null)
  const heatmapRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(heatmapRef, { once: true })

  const maxWpm = Math.max(...userData.hourlyData.map((h) => h.wpm))
  const minWpm = Math.min(...userData.hourlyData.map((h) => h.wpm))

  const getIntensity = (wpm: number) => {
    const normalized = (wpm - minWpm) / (maxWpm - minWpm)
    return normalized
  }

  const formatHour = (hour: number) => {
    if (hour === 0) return "12AM"
    if (hour === 12) return "12PM"
    return hour > 12 ? `${hour - 12}PM` : `${hour}AM`
  }

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
            When You Type <span className="text-gold-gradient">Best</span>
          </h2>
          <p className="text-muted-foreground text-lg">Your performance throughout the day</p>
        </motion.div>

        {/* Best/Worst Hour Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/20">
                <Moon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Peak Hour</div>
                <div className="text-2xl font-bold text-primary">{formatHour(userData.bestHour)}</div>
              </div>
            </div>
            <div className="text-4xl font-bold text-gold-gradient">
              {userData.hourlyData[userData.bestHour].wpm} WPM
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-muted">
                <Sun className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Slowest Hour</div>
                <div className="text-2xl font-bold text-foreground">{formatHour(userData.worstHour)}</div>
              </div>
            </div>
            <div className="text-4xl font-bold text-foreground">{userData.hourlyData[userData.worstHour].wpm} WPM</div>
          </motion.div>
        </div>

        {/* Hour-by-Hour Heatmap */}
        <motion.div
          ref={heatmapRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-card/30 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 md:p-8 mb-8"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            24-Hour Performance Map
          </h3>

          <div className="grid grid-cols-12 gap-1 md:gap-2">
            {userData.hourlyData.map((hour, index) => {
              const intensity = getIntensity(hour.wpm)

              return (
                <motion.div
                  key={hour.hour}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                  className="aspect-square relative group cursor-pointer"
                >
                  <div
                    className="w-full h-full rounded-md transition-transform hover:scale-110 hover:z-10"
                    style={{
                      backgroundColor: `oklch(${0.3 + intensity * 0.55} ${intensity * 0.18} 85 / ${0.3 + intensity * 0.7})`,
                      boxShadow: intensity > 0.8 ? `0 0 20px oklch(0.85 0.15 85 / ${intensity * 0.5})` : "none",
                    }}
                  />

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <div className="bg-card border border-primary/30 rounded-lg px-3 py-2 text-xs whitespace-nowrap">
                      <div className="font-mono text-primary">{formatHour(hour.hour)}</div>
                      <div className="text-foreground font-bold">{hour.wpm} WPM</div>
                      <div className="text-muted-foreground">{hour.tests} tests</div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Hour labels */}
          <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono">
            <span>12AM</span>
            <span>6AM</span>
            <span>12PM</span>
            <span>6PM</span>
            <span>11PM</span>
          </div>
        </motion.div>

        {/* Persona Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <div className="flex items-center gap-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/30 rounded-full px-8 py-4">
            <Moon className="w-8 h-8 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">You're a</div>
              <div className="text-2xl font-bold text-gold-gradient">{userData.typingPersona}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="w-4 h-4 text-primary" />
            <span>
              Best day: <span className="text-primary font-semibold">{userData.bestDayOfWeek}</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
