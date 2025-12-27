"use client"

import { useState, useCallback } from "react"
import { Homepage } from "@/components/homepage/homepage"
import { ProcessingScreen } from "@/components/homepage/processing-screen"
import { WrappedExperience } from "@/components/wrapped-experience"
import { AnimatePresence } from "framer-motion"

export type AppState = "home" | "processing" | "wrapped"

export default function MonkeytypeWrapped() {
  const [appState, setAppState] = useState<AppState>("home")

  const handleFileUpload = useCallback(() => {
    setAppState("processing")
  }, [])

  const handleProcessingComplete = useCallback(() => {
    setAppState("wrapped")
  }, [])

  return (
    <main className="relative">
      <AnimatePresence mode="wait">
        {appState === "home" && <Homepage key="home" onFileUpload={handleFileUpload} />}
        {appState === "processing" && <ProcessingScreen key="processing" onComplete={handleProcessingComplete} />}
        {appState === "wrapped" && <WrappedExperience key="wrapped" />}
      </AnimatePresence>
    </main>
  )
}
