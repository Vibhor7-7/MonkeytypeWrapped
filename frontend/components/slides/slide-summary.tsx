"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Keyboard, Share2, Download, Sparkles, Trophy, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type WrappedData } from "@/lib/api"
import { toPng } from 'html-to-image'
import { toast } from "sonner"

interface SlideSummaryProps {
  data: WrappedData
}

export function SlideSummary({ data }: SlideSummaryProps) {
  const ref = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.3 })
  const [isHovered, setIsHovered] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = async () => {
    if (!cardRef.current) return
    
    setIsExporting(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#0a0908',
      })
      
      const link = document.createElement('a')
      link.download = 'monkeytype-wrapped-2025.png'
      link.href = dataUrl
      link.click()
      
      toast.success('Card downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download card')
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    if (!cardRef.current) return
    
    setIsExporting(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#0a0908',
      })
      
      // Convert data URL to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const file = new File([blob], 'monkeytype-wrapped-2025.png', { type: 'image/png' })
      
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Monkeytype Wrapped 2025',
          text: `I'm in the top ${(100 - data.comparisons.globalPercentile).toFixed(0)}% of typists! Check out my typing stats 🚀`,
        })
        toast.success('Shared successfully!')
      } else {
        // Fallback: copy link or download
        await handleDownload()
        toast.info('Share not supported. Card downloaded instead!')
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share error:', error)
        toast.error('Failed to share card')
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <section ref={ref} className="relative min-h-screen w-full flex items-center justify-center py-20 overflow-hidden">
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
            animate={
              isInView
                ? {
                    y: [0, -50 - Math.random() * 100, 0],
                    x: [0, (Math.random() - 0.5) * 100, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1 + Math.random(), 0],
                    rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                  }
                : {}
            }
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          >
            {i % 3 === 0 ? (
              <Star className="w-3 h-3 text-primary" fill="currentColor" />
            ) : i % 3 === 1 ? (
              <div className="w-2 h-2 rounded-full bg-primary" />
            ) : (
              <Sparkles className="w-3 h-3 text-primary/70" />
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(212, 168, 85, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(212, 168, 85, 0.2) 0%, transparent 60%)",
            "radial-gradient(circle at 50% 50%, rgba(212, 168, 85, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="relative z-10 w-full max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm text-primary font-mono">THAT'S A WRAP</span>
            <motion.div
              animate={{ rotate: [0, -20, 20, 0] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Your <span className="text-gold-gradient">2025</span> Summary
          </h2>
        </motion.div>

        {/* Summary Card - Enhanced with 3D hover effect */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.8, rotateX: 20, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.3 }}
          viewport={{ once: true }}
          className="relative"
          style={{ perspective: "2000px" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-primary/40 rounded-3xl blur-3xl"
            animate={isHovered ? { scale: 1.1, opacity: 0.8 } : { scale: 1, opacity: 0.5 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="relative bg-gradient-to-br from-[#1a1612] via-[#141210] to-[#1a1612] border-2 border-primary/40 rounded-3xl p-8 md:p-12 glow-gold overflow-hidden"
            animate={
              isHovered
                ? {
                    rotateY: 2,
                    rotateX: -2,
                    scale: 1.02,
                  }
                : {
                    rotateY: 0,
                    rotateX: 0,
                    scale: 1,
                  }
            }
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 opacity-5"
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, #d4a855 10px, #d4a855 11px)`,
                }}
              />
            </motion.div>

            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            />

            {/* Header */}
            <div className="relative flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-lg bg-primary/20"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Keyboard className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Monkeytype</div>
                  <div className="text-lg font-bold text-foreground">Wrapped 2025</div>
                </div>
              </div>
              <div className="text-right flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                <div className="text-xs text-muted-foreground">@{"TypeMaster"}</div>
              </div>
            </div>

            {/* Stats Grid - Enhanced with staggered animations */}
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { value: data.comparisons.maxWpm, label: "Top WPM", icon: Zap },
                { value: `${data.accuracy.overallAccuracy}%`, label: "Accuracy", icon: Star },
                { value: data.yearInNumbers.totalTests.toLocaleString(), label: "Tests", icon: Keyboard },
                { value: data.yearInNumbers.longestStreak, label: "Day Streak", icon: Trophy },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1, type: "spring" }}
                  viewport={{ once: true }}
                  className="text-center group"
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="text-4xl md:text-5xl font-bold text-gold-gradient"
                    animate={
                      isInView
                        ? {
                            textShadow: [
                              "0 0 10px rgba(212, 168, 85, 0.3)",
                              "0 0 20px rgba(212, 168, 85, 0.5)",
                              "0 0 10px rgba(212, 168, 85, 0.3)",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                    <stat.icon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Persona */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
              className="relative text-center py-6 border-t border-b border-primary/20"
            >
              <div className="text-sm text-muted-foreground mb-2">Your Persona</div>
              <motion.div
                className="text-2xl md:text-3xl font-bold text-gold-gradient text-glow-gold"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                {data.persona.dominantPersona.name}
              </motion.div>
            </motion.div>

            {/* Footer text */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
              className="relative text-center mt-6"
            >
              <p className="text-muted-foreground text-sm">
                Top{" "}
                <motion.span
                  className="text-primary font-semibold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  {(100 - data.comparisons.globalPercentile).toFixed(0)}%
                </motion.span>{" "}
                of all typists worldwide
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Action Buttons - Enhanced with animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={handleShare}
              disabled={isExporting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8 relative overflow-hidden group disabled:opacity-50"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
              />
              <Share2 className="w-4 h-4 relative z-10" />
              <span className="relative z-10">
                {isExporting ? 'Processing...' : 'Share Your Wrapped'}
              </span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownload}
              disabled={isExporting}
              className="border-primary/30 hover:bg-primary/10 gap-2 px-8 bg-transparent disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Download Card
            </Button>
          </motion.div>
        </motion.div>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          viewport={{ once: true }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          <p>Made with love for the Monkeytype community</p>
          <motion.p
            className="text-primary mt-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Keep typing. Keep improving.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
