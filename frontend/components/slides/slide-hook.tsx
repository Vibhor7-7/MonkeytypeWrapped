"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Keyboard } from "lucide-react"
import { type WrappedData } from "@/lib/api"

interface SlideHookProps {
  data: WrappedData
}

export function SlideHook({ data }: SlideHookProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [typedWords, setTypedWords] = useState(0)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [0, 20])

  useEffect(() => {
    const target = data.hook.totalWords
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setTypedWords(target)
        clearInterval(timer)
      } else {
        setTypedWords(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [data.hook.totalWords])

  return (
    <section
      ref={ref}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ perspective: "1500px" }}
    >
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
            initial={{ width: 100, height: 100, opacity: 0 }}
            animate={{
              width: [100 + i * 150, 200 + i * 200, 100 + i * 150],
              height: [100 + i * 150, 200 + i * 200, 100 + i * 150],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div style={{ y, opacity, scale, rotateX }} className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(212, 168, 85, 0)",
                "0 0 20px 5px rgba(212, 168, 85, 0.3)",
                "0 0 0 0 rgba(212, 168, 85, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
            >
              <Keyboard className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm text-primary font-mono">2025 WRAPPED</span>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
        >
          <motion.span
            className="text-foreground block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            You typed
          </motion.span>
          <motion.span
            className="text-gold-gradient text-glow-gold block my-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring", bounce: 0.4 }}
          >
            <motion.span key={typedWords} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
              {typedWords.toLocaleString()}
            </motion.span>
          </motion.span>
          <motion.span
            className="text-foreground block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            words
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-xl md:text-2xl text-muted-foreground mb-8"
        >
          That's{" "}
          <motion.span
            className="text-primary font-semibold inline-block"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            {data.hook.novelComparison}
          </motion.span>{" "}
          worth of typing
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="font-mono">{data.hook.totalTimeHours} hours at the keyboard</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-widest">Use buttons to explore</span>
            <div className="flex gap-2 mt-2">
              <motion.div
                animate={{ x: [-2, 2, -2] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="w-2 h-2 bg-primary rounded-full"
              />
              <motion.div
                animate={{ x: [-2, 2, -2] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                className="w-2 h-2 bg-primary rounded-full"
              />
              <motion.div
                animate={{ x: [-2, 2, -2] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
                className="w-2 h-2 bg-primary rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
