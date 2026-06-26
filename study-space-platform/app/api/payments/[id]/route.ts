import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { extendSubscription } from "@/lib/utils"

// PUT mark payment as paid + extend subscription
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const { notes } = await request.json()

    // Update payment status
    const payment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        notes: notes || undefined,
      }
    })

    // Extend student's subscription by 1 month
    const student = await prisma.student.findUnique({
      where: { id: payment.studentId }
    })

    if (student) {
      const newEnd = extendSubscription(student.subscriptionEnd)
      await prisma.student.update({
        where: { id: student.id },
        data: { subscriptionEnd: newEnd }
      })
    }

    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json({ message: "Failed to update payment" }, { status: 500 })
  }
}
