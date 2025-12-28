"use client"

import type React from "react"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useCallback } from "react"
import { Upload, FileText, CheckCircle, ExternalLink, Copy, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadFlowProps {
  onFileUpload: (file: File) => void
}

const steps = [
  {
    number: "01",
    title: "Go to Monkeytype",
    description: "Visit your profile page on monkeytype.com",
    icon: ExternalLink,
  },
  {
    number: "02",
    title: "Export your data",
    description: "Download your typing history as a CSV file",
    icon: Copy,
  },
  {
    number: "03",
    title: "Upload it here",
    description: "Drop your CSV to generate your Wrapped",
    icon: Upload,
  },
]

export function UploadFlow({ onFileUpload }: UploadFlowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isDragging, setIsDragging] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.csv')) {
        alert('Please upload a CSV file')
        return
      }
      
      setFileUploaded(true)
      setTimeout(() => onFileUpload(file), 800)
    },
    [onFileUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      
      const file = e.dataTransfer.files[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile],
  )

  const handleFileSelect = useCallback(() => {
    console.log('Dropbox clicked, triggering file input...')
    if (fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      console.error('File input ref not found')
    }
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile]
  )

  return (
    <section ref={ref} className="relative min-h-screen w-full py-24 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get your <span className="text-gold-gradient">Wrapped</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to generate your personalized typing story
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300">
                {/* Step number */}
                <div className="text-6xl font-bold text-primary/10 absolute top-4 right-4 font-mono">{step.number}</div>

                {/* Icon */}
                <motion.div
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <step.icon className="w-6 h-6 text-primary" />
                </motion.div>

                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-primary/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Upload dropzone */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            animate={{
              scale: isDragging ? 1.02 : 1,
              borderColor: isDragging
                ? "oklch(0.85 0.15 85)"
                : fileUploaded
                  ? "oklch(0.7 0.2 145)"
                  : "oklch(0.25 0.02 85)",
            }}
            className={`
              relative p-12 rounded-2xl border-2 border-dashed 
              bg-card/50 backdrop-blur-sm
              flex flex-col items-center justify-center gap-4
              cursor-pointer transition-all duration-300
              hover:border-primary/50 hover:bg-card
              ${isDragging ? "glow-gold" : ""}
            `}
          >
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              title="Click to upload CSV"
            />
            
            {/* Upload icon */}
            <motion.div
              animate={{
                y: isDragging ? -10 : 0,
                scale: fileUploaded ? 1.2 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`
                w-20 h-20 rounded-2xl flex items-center justify-center
                ${fileUploaded ? "bg-green-500/20" : "bg-primary/10"}
              `}
            >
              {fileUploaded ? (
                <CheckCircle className="w-10 h-10 text-green-500" />
              ) : isDragging ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Upload className="w-10 h-10 text-primary" />
                </motion.div>
              ) : (
                <FileText className="w-10 h-10 text-primary" />
              )}
            </motion.div>

            {/* Text */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {fileUploaded ? "CSV Detected!" : isDragging ? "Drop it here!" : "Drag & drop your CSV"}
              </h3>
              <p className="text-muted-foreground">
                {fileUploaded ? "Processing your typing data..." : "or click to browse files"}
              </p>
            </div>

            {/* Supported formats */}
            {!fileUploaded && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 rounded bg-secondary font-mono">.csv</span>
                <span>Monkeytype export format</span>
              </div>
            )}

            {/* Progress bar for uploaded state */}
            {fileUploaded && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1 }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-green-500 rounded-b-2xl"
              />
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  )
}
