"use client"

import { useState, useCallback } from "react"
import { Homepage } from "@/components/homepage/homepage"
import { ProcessingScreen } from "@/components/homepage/processing-screen"
import { WrappedExperience } from "@/components/wrapped-experience"
import { AnimatePresence } from "framer-motion"
import { analyzeTypingData, type WrappedData } from "@/lib/api"

export type AppState = "home" | "processing" | "wrapped"

export default function MonkeytypeWrapped() {
  const [appState, setAppState] = useState<AppState>("home")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [wrappedData, setWrappedData] = useState<WrappedData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = useCallback((file: File) => {
    setUploadedFile(file)
    setAppState("processing")
  }, [])

  const handleProcessingComplete = useCallback((data: WrappedData) => {
    setWrappedData(data)
    setAppState("wrapped")
  }, [])

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage)
    setAppState("home")
  }, [])

  return (
    <main className="relative">
      <AnimatePresence mode="wait">
        {appState === "home" && <Homepage key="home" onFileUpload={handleFileUpload} />}
        {appState === "processing" && (
          <ProcessingScreen
            key="processing"
            file={uploadedFile}
            onComplete={handleProcessingComplete}
            onError={handleError}
          />
        )}
        {appState === "wrapped" && wrappedData && (
          <WrappedExperience key="wrapped" data={wrappedData} />
        )}
      </AnimatePresence>
      
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </main>
  )
}
