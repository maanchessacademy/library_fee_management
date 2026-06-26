"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { formatCurrency, formatDateShort } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

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

interface StudentTableProps {
  students: StudentData[]
}

export function StudentTable({ students }: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-lg font-medium">No students found</p>
        <p className="text-sm mt-1">Try adjusting your search or filter</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-500">Name</th>
              <th className="px-4 py-3 font-medium text-slate-500">Seat</th>
              <th className="px-4 py-3 font-medium text-slate-500">WhatsApp</th>
              <th className="px-4 py-3 font-medium text-slate-500">Fee (₹)</th>
              <th className="px-4 py-3 font-medium text-slate-500">Sub. End</th>
              <th className="px-4 py-3 font-medium text-slate-500">Status</th>
              <th className="px-4 py-3 font-medium text-slate-500">Payment</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3.5 font-medium text-slate-900">{s.name}</td>
                <td className="px-4 py-3.5 text-slate-600">{s.seatNumber}</td>
                <td className="px-4 py-3.5 text-slate-600">{s.whatsappNumber}</td>
                <td className="px-4 py-3.5 text-slate-900 font-medium">{formatCurrency(s.monthlyFee)}</td>
                <td className="px-4 py-3.5 text-slate-600">{formatDateShort(s.subscriptionEnd)}</td>
                <td className="px-4 py-3.5">
                  <Badge variant={s.status === 'ACTIVE' ? 'success' : 'gray'}>
                    {s.status === 'ACTIVE' ? 'Active' : 'Discontinued'}
                  </Badge>
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={s.currentMonthPaid ? 'success' : 'danger'}>
                    {s.currentMonthPaid ? 'Paid' : 'Unpaid'}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Link href={`/students/${s.id}`} className="text-indigo-600 hover:text-indigo-800">
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden space-y-3">
        {students.map((s) => (
          <Link key={s.id} href={`/students/${s.id}`}>
            <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-900">{s.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={s.status === 'ACTIVE' ? 'success' : 'gray'} className="text-[10px]">
                    {s.status === 'ACTIVE' ? 'Active' : 'Disc.'}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-1.5 text-sm">
                <span className="text-slate-500">Seat: <span className="text-slate-700 font-medium">{s.seatNumber}</span></span>
                <span className="text-slate-500">Fee: <span className="text-slate-700 font-medium">{formatCurrency(s.monthlyFee)}</span></span>
                <span className="text-slate-500">Ends: <span className="text-slate-700">{formatDateShort(s.subscriptionEnd)}</span></span>
                <span>
                  <Badge variant={s.currentMonthPaid ? 'success' : 'danger'} className="text-[10px]">
                    {s.currentMonthPaid ? 'Paid' : 'Unpaid'}
                  </Badge>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
