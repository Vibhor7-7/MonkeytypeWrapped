"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Play, Sparkles } from "lucide-react"

export function VideoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  return (
    <section
      id="video-section"
      ref={ref}
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-6 bg-background"
    >
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-mono">HOW IT WORKS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your typing story, <span className="text-gold-gradient">visualized</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how Monkeytype Wrapped transforms your typing data into a personalized, cinematic experience
          </p>
        </motion.div>

        {/* Video placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative aspect-video rounded-2xl overflow-hidden glow-gold"
        >
          {/* Video element */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="/demo-video.mov"
            playsInline
            onEnded={() => setIsPlaying(false)}
          />

          {/* Play button overlay - only show when not playing */}
          {!isPlaying && (
            <>
              {/* Animated pattern background */}
              <div className="absolute inset-0 bg-gradient-to-br from-card/80 via-card/60 to-secondary/80" />

              <div className="absolute inset-0 opacity-20">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                    style={{
                      top: `${(i + 1) * 8}%`,
                      left: 0,
                      right: 0,
                    }}
                    animate={{
                      opacity: [0.2, 0.6, 0.2],
                      scaleX: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  onClick={handlePlayClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  {/* Glow ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30 blur-xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />

                  {/* Button */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </motion.button>
              </div>
            </>
          )}

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
            <p className="text-center text-muted-foreground">Watch how Monkeytype Wrapped works</p>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
        </motion.div>
      </div>
    </section>
  )
}
