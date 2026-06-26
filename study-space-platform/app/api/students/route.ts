import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { currentMonth } from "@/lib/utils"

// GET all students
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const month = currentMonth()
    const students = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        payments: {
          where: { month },
          take: 1,
        }
      }
    })

    const result = students.map((s) => ({
      id: s.id,
      name: s.name,
      seatNumber: s.seatNumber,
      whatsappNumber: s.whatsappNumber,
      monthlyFee: s.monthlyFee,
      subscriptionEnd: s.subscriptionEnd.toISOString(),
      status: s.status,
      currentMonthPaid: s.payments.length > 0 && s.payments[0].status === 'PAID',
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch students" }, { status: 500 })
  }
}

// POST create student + first payment record
export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const { name, whatsappNumber, seatNumber, monthlyFee, subscriptionStart, subscriptionEnd } = body

    const month = currentMonth()

    const student = await prisma.student.create({
      data: {
        name,
        whatsappNumber,
        seatNumber,
        monthlyFee: parseFloat(monthlyFee),
        subscriptionStart: new Date(subscriptionStart),
        subscriptionEnd: new Date(subscriptionEnd),
        payments: {
          create: {
            amount: parseFloat(monthlyFee),
            month,
            status: 'UNPAID',
          }
        }
      }
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create student" }, { status: 500 })
  }
}
