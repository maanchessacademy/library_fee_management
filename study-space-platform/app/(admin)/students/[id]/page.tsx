"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { StudentForm, StudentFormValues } from "@/components/students/StudentForm"
import { PaymentHistory } from "@/components/students/PaymentHistory"
import { formatCurrency, formatDateShort } from "@/lib/utils"
import { ArrowLeft, Edit, UserMinus, UserPlus, Phone, Hash, IndianRupee, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import { getOverdueMessageLink } from "@/lib/whatsapp"

interface Student {
  id: string
  name: string
  whatsappNumber: string
  seatNumber: string
  monthlyFee: number
  subscriptionStart: string
  subscriptionEnd: string
  status: string
  createdAt: string
  payments: Array<{
    id: string
    month: string
    amount: number
    status: string
    paidAt: string | null
    notes: string | null
  }>
}

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDiscontinueModal, setShowDiscontinueModal] = useState(false)

  const fetchStudent = useCallback(async () => {
    try {
      const res = await fetch(`/api/students/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setStudent(data)
      }
    } catch {
      toast.error("Failed to load student")
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchStudent()
  }, [fetchStudent])

  const handleUpdate = async (data: StudentFormValues) => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/students/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success("Student updated")
      setIsEditing(false)
      fetchStudent()
    } catch {
      toast.error("Failed to update student")
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (status: string) => {
    try {
      const res = await fetch(`/api/students/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Failed")
      toast.success(status === 'DISCONTINUED' ? 'Student discontinued' : 'Student reactivated')
      setShowDiscontinueModal(false)
      fetchStudent()
    } catch {
      toast.error("Failed to update status")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-48 bg-white border border-slate-200 rounded-xl animate-pulse" />
        <div className="h-64 bg-white border border-slate-200 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Student not found</p>
        <Link href="/students"><Button variant="outline">Back to Students</Button></Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/students" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Students
      </Link>

      {/* Profile Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
        {isEditing ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">Edit Student</h2>
            <StudentForm
              onSubmit={handleUpdate}
              isLoading={isSaving}
              submitLabel="Save Changes"
              defaultValues={{
                name: student.name,
                whatsappNumber: student.whatsappNumber,
                seatNumber: student.seatNumber,
                monthlyFee: student.monthlyFee,
                subscriptionStart: format(new Date(student.subscriptionStart), 'yyyy-MM-dd'),
                subscriptionEnd: format(new Date(student.subscriptionEnd), 'yyyy-MM-dd'),
              }}
            />
            <Button variant="ghost" className="w-full mt-2" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{student.name}</h1>
                  <Badge variant={student.status === 'ACTIVE' ? 'success' : 'gray'}>
                    {student.status === 'ACTIVE' ? 'Active' : 'Discontinued'}
                  </Badge>
                  {student.status === 'ACTIVE' && 
                   new Date(student.subscriptionEnd) < new Date() && 
                   (!student.payments[0] || student.payments[0].status === 'UNPAID') && (
                    <WhatsAppButton href={getOverdueMessageLink(student)} label="Send reminder" />
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-1.5">
                <Edit className="h-3.5 w-3.5" /> Edit
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{student.whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Hash className="h-4 w-4 text-slate-400" />
                <span>Seat {student.seatNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <IndianRupee className="h-4 w-4 text-slate-400" />
                <span>{formatCurrency(student.monthlyFee)}/mo</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <span>Start: {formatDateShort(student.subscriptionStart)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <span>End: {formatDateShort(student.subscriptionEnd)}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex gap-3">
              {student.status === 'ACTIVE' ? (
                <Button variant="danger" size="sm" className="gap-1.5" onClick={() => setShowDiscontinueModal(true)}>
                  <UserMinus className="h-3.5 w-3.5" /> Discontinue
                </Button>
              ) : (
                <Button variant="success" size="sm" className="gap-1.5" onClick={() => handleStatusChange('ACTIVE')}>
                  <UserPlus className="h-3.5 w-3.5" /> Reactivate
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
        <PaymentHistory
          payments={student.payments}
          studentId={student.id}
          monthlyFee={student.monthlyFee}
          onRefresh={fetchStudent}
          student={student}
        />
      </div>

      {/* Discontinue Confirmation Modal */}
      <Modal isOpen={showDiscontinueModal} onClose={() => setShowDiscontinueModal(false)} title="Discontinue Student">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to mark <strong>{student.name}</strong> as discontinued?
            This student will no longer appear in active lists.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowDiscontinueModal(false)}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={() => handleStatusChange('DISCONTINUED')}>
              Yes, Discontinue
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
