"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { userData } from "@/lib/mock-data"
import { Globe, Zap, BookOpen } from "lucide-react"

export function SlideCompare() {
  const ref = useRef<HTMLDivElement>(null)

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
            How You <span className="text-gold-gradient">Compare</span>
          </h2>
          <p className="text-muted-foreground text-lg">Your place in the global typing community</p>
        </motion.div>

        {/* Global Percentile - Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          viewport={{ once: true }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-3xl" />
          <div className="relative bg-gradient-to-br from-card via-card/80 to-card/50 border border-primary/30 rounded-3xl p-8 md:p-12 text-center glow-gold">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-primary" />
              <span className="text-sm text-primary uppercase tracking-wider">Global Percentile</span>
            </div>

            <div className="relative mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, type: "spring", bounce: 0.4 }}
                viewport={{ once: true }}
                className="text-8xl md:text-9xl font-bold text-gold-gradient text-glow-gold"
              >
                {userData.globalPercentile}
              </motion.div>
              <div className="text-2xl text-primary font-mono">percentile</div>
            </div>

            {/* Percentile bar */}
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${userData.globalPercentile}%` }}
                  transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
                />
                <motion.div
                  initial={{ left: 0, opacity: 0 }}
                  whileInView={{ left: `${userData.globalPercentile}%`, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-2 border-background shadow-lg"
                />
              </div>
              <p className="text-muted-foreground mt-4">
                You're faster than <span className="text-primary font-semibold">{userData.globalPercentile}%</span> of
                all typists
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Characters per second */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Characters Per Second</div>
              </div>
            </div>

            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                viewport={{ once: true }}
                className="text-5xl md:text-6xl font-bold text-gold-gradient mb-2"
              >
                {userData.charactersPerSecond}
              </motion.div>
              <div className="text-muted-foreground">CPS</div>
            </div>

            <div className="mt-4 p-4 bg-muted/30 rounded-xl">
              <div className="text-sm text-center">
                <span className="text-muted-foreground">That's </span>
                <span className="text-primary font-semibold">
                  {(userData.charactersPerSecond * 60).toFixed(0)} characters
                </span>
                <span className="text-muted-foreground"> per minute</span>
              </div>
            </div>
          </motion.div>

          {/* Fun comparison */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/20">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Fun Fact</div>
              </div>
            </div>

            <div className="text-center py-4">
              <p className="text-lg text-muted-foreground mb-4">At your speed, you could type</p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">The Great Gatsby</div>
                <div className="text-muted-foreground">in just</div>
                <div className="text-5xl font-bold text-gold-gradient text-glow-gold mt-2">
                  {userData.gatsbyComparison} hours
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
