"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import { useEffect } from "react"
import { generateAndDownloadBackup } from "@/lib/backup"
import toast from "react-hot-toast"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Auto-backup: once per day when admin opens the app
  useEffect(() => {
    const runAutoBackup = async () => {
      try {
        const lastBackup = localStorage.getItem('lastBackupDate')
        const today = new Date().toISOString().split('T')[0]
        if (lastBackup !== today) {
          await generateAndDownloadBackup()
          localStorage.setItem('lastBackupDate', today)
          toast.success(`Daily backup saved — studyspace-backup-${today}.xlsx`, { duration: 4000 })
        }
      } catch {
        // Silently fail auto-backup — manual button is always available
      }
    }
    runAutoBackup()
  }, [])

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:pl-64 pb-20 md:pb-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
