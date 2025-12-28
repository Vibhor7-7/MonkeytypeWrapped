"use client"

import { motion } from "framer-motion"
import { HeroSection } from "./hero-section"
import { VideoSection } from "./video-section"
import { UploadFlow } from "./upload-flow"

interface HomepageProps {
  onFileUpload: (file: File) => void
}

export function Homepage({ onFileUpload }: HomepageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <HeroSection />
      <VideoSection />
      <UploadFlow onFileUpload={onFileUpload} />
    </motion.div>
  )
}
