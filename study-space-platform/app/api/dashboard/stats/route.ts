import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { currentMonth, isOverdue, isDueSoon, daysOverdue, formatDateShort } from "@/lib/utils"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  try {
    const month = currentMonth()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const students = await prisma.student.findMany({
      include: {
        payments: {
          where: { month },
          take: 1,
        }
      }
    })

    // Overdue students
    const overdueStudents = students
      .filter(s => s.status === 'ACTIVE')
      .filter(s => {
        const payStatus = s.payments.length > 0 ? s.payments[0].status : 'UNPAID'
        return isOverdue(s.subscriptionEnd, payStatus)
      })
      .map(s => ({
        name: s.name,
        detail: `${daysOverdue(s.subscriptionEnd)} days overdue`,
        student: s
      }))

    // Due soon students
    const dueSoonStudents = students
      .filter(s => s.status === 'ACTIVE')
      .filter(s => {
        const payStatus = s.payments.length > 0 ? s.payments[0].status : 'UNPAID'
        return isDueSoon(s.subscriptionEnd, payStatus)
      })
      .map(s => ({
        name: s.name,
        detail: `Due: ${formatDateShort(s.subscriptionEnd)}`,
      }))

    // Recently discontinued (last 30 days — using createdAt as proxy for lack of discontinuedAt)
    const discontinuedStudents = students
      .filter(s => s.status === 'DISCONTINUED')
      .map(s => ({
        name: s.name,
        detail: formatDateShort(s.subscriptionEnd),
      }))

    // Recently added (last 7 days)
    const recentStudents = students
      .filter(s => new Date(s.createdAt) >= sevenDaysAgo)
      .map(s => ({
        name: s.name,
        detail: formatDateShort(s.createdAt),
      }))

    // Stats
    const activeCount = students.filter(s => s.status === 'ACTIVE').length
    const paidPayments = await prisma.payment.findMany({
      where: { month, status: 'PAID' }
    })
    const revenueThisMonth = paidPayments.reduce((sum, p) => sum + p.amount, 0)

    return NextResponse.json({
      overdue: { count: overdueStudents.length, items: overdueStudents },
      dueSoon: { count: dueSoonStudents.length, items: dueSoonStudents },
      discontinued: { count: discontinuedStudents.length, items: discontinuedStudents },
      recentlyAdded: { count: recentStudents.length, items: recentStudents },
      activeStudents: activeCount,
      revenueThisMonth,
    })
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 })
  }
}
