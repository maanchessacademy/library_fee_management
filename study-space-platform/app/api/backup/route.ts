import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET all students data for Excel backup
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const students = await prisma.student.findMany({
      orderBy: { name: 'asc' },
    })

    const result = students.map((s) => ({
      name: s.name,
      whatsappNumber: s.whatsappNumber,
      seatNumber: s.seatNumber,
      monthlyFee: s.monthlyFee,
      subscriptionStart: s.subscriptionStart.toISOString(),
      subscriptionEnd: s.subscriptionEnd.toISOString(),
      status: s.status,
      createdAt: s.createdAt.toISOString(),
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch backup data" }, { status: 500 })
  }
}
