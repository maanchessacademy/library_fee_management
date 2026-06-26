"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StudentForm, StudentFormValues } from "@/components/students/StudentForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

export default function AddStudentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: StudentFormValues) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Failed to create student")

      const student = await res.json()
      toast.success("Student added successfully!")
      router.push(`/students/${student.id}`)
    } catch (error) {
      toast.error("Failed to add student")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link href="/students" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Students
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-6">Add New Student</h1>
        <StudentForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  )
}
