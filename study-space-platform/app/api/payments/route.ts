import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// POST create payment record
export async function POST(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const { studentId, amount, month, notes } = await request.json()

    const payment = await prisma.payment.create({
      data: {
        studentId,
        amount: parseFloat(amount),
        month,
        status: 'UNPAID',
        notes: notes || null,
      }
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create payment" }, { status: 500 })
  }
}
