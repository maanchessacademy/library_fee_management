"use client"

import { BackupButton } from "@/components/backup/BackupButton"

interface TopBarProps {
  title: string
  showBackup?: boolean
}

export function TopBar({ title, showBackup = false }: TopBarProps) {
  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      {showBackup && <BackupButton />}
    </div>
  )
}
