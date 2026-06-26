"use client"

import { useState, useEffect } from "react"
import { TopBar } from "@/components/layout/TopBar"
import { AlertCard } from "@/components/dashboard/AlertCard"
import { StatCard } from "@/components/dashboard/StatCard"
import { AlertTriangle, Clock, UserMinus, UserPlus, Users, IndianRupee } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface DashboardStats {
  overdue: { count: number; items: { name: string; detail: string; student?: any }[] }
  dueSoon: { count: number; items: { name: string; detail: string }[] }
  discontinued: { count: number; items: { name: string; detail: string }[] }
  recentlyAdded: { count: number; items: { name: string; detail: string }[] }
  activeStudents: number
  revenueThisMonth: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats")
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {
      // handle silently
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div>
        <TopBar title="Dashboard" showBackup />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return <div className="text-center py-20 text-slate-500">Failed to load dashboard</div>

  return (
    <div>
      <TopBar title="Dashboard" showBackup />

      {/* Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <AlertCard
          title="Overdue Fees"
          count={stats.overdue.count}
          icon={AlertTriangle}
          color="red"
          items={stats.overdue.items}
        />
        <AlertCard
          title="Due Soon"
          count={stats.dueSoon.count}
          icon={Clock}
          color="amber"
          items={stats.dueSoon.items}
        />
        <AlertCard
          title="Recently Discontinued"
          count={stats.discontinued.count}
          icon={UserMinus}
          color="gray"
          items={stats.discontinued.items}
        />
        <AlertCard
          title="Recently Added"
          count={stats.recentlyAdded.count}
          icon={UserPlus}
          color="green"
          items={stats.recentlyAdded.items}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon={Users}
        />
        <StatCard
          title="Revenue This Month"
          value={formatCurrency(stats.revenueThisMonth)}
          icon={IndianRupee}
        />
      </div>
    </div>
  )
}
