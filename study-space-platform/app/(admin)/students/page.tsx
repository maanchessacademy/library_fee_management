"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { TopBar } from "@/components/layout/TopBar"
import { StudentTable } from "@/components/students/StudentTable"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Plus, Search } from "lucide-react"

interface StudentData {
  id: string
  name: string
  seatNumber: string
  whatsappNumber: string
  monthlyFee: number
  subscriptionEnd: string
  status: string
  currentMonthPaid: boolean
}

const TABS = ['All', 'Active', 'Overdue', 'Discontinued'] as const
type Tab = typeof TABS[number]

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<Tab>('All')

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students")
      if (res.ok) {
        const data = await res.json()
        setStudents(data)
      }
    } catch {
      // handle silently
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let result = students

    // Search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.seatNumber.toLowerCase().includes(q)
      )
    }

    // Tab filter
    if (activeTab === 'Active') {
      result = result.filter(s => s.status === 'ACTIVE')
    } else if (activeTab === 'Discontinued') {
      result = result.filter(s => s.status === 'DISCONTINUED')
    } else if (activeTab === 'Overdue') {
      result = result.filter(s => {
        const isEndPast = new Date(s.subscriptionEnd) < new Date()
        return s.status === 'ACTIVE' && isEndPast && !s.currentMonthPaid
      })
    }

    return result
  }, [students, search, activeTab])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Students</h1>
        <Link href="/students/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Student</span>
          </Button>
        </Link>
      </div>

      {/* Search + Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or seat number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <StudentTable students={filtered} />
          )}
        </div>
      </div>
    </div>
  )
}
