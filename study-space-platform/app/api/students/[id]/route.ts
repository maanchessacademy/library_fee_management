import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET single student with all payments
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        payments: { orderBy: { month: 'desc' } }
      }
    })

    if (!student) return NextResponse.json({ message: "Student not found" }, { status: 404 })
    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch student" }, { status: 500 })
  }
}

// PUT update student details
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { name, whatsappNumber, seatNumber, monthlyFee, subscriptionStart, subscriptionEnd } = body

    const student = await prisma.student.update({
      where: { id: params.id },
      data: {
        name,
        whatsappNumber,
        seatNumber,
        monthlyFee: parseFloat(monthlyFee),
        subscriptionStart: new Date(subscriptionStart),
        subscriptionEnd: new Date(subscriptionEnd),
      }
    })

    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ message: "Failed to update student" }, { status: 500 })
  }
}

// PATCH discontinue or reactivate
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const { status } = await request.json()

    const student = await prisma.student.update({
      where: { id: params.id },
      data: { status }
    })

    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json({ message: "Failed to update status" }, { status: 500 })
  }
}
