"use client"

import { useState } from "react"
import { Download, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { generateAndDownloadBackup } from "@/lib/backup"
import toast from "react-hot-toast"

export function BackupButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const handleBackup = async () => {
    setIsLoading(true)
    try {
      await generateAndDownloadBackup()
      setIsDone(true)
      toast.success(`Daily backup saved — studyspace-backup-${new Date().toISOString().split('T')[0]}.xlsx`)
      setTimeout(() => setIsDone(false), 3000)
    } catch (error) {
      toast.error("Backup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleBackup}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isDone ? (
        <Check className="h-4 w-4 text-emerald-600" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">{isDone ? 'Downloaded' : 'Download Backup'}</span>
    </Button>
  )
}
