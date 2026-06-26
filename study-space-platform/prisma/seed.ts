import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.payment.deleteMany()
  await prisma.student.deleteMany()

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`

  // Student 1: Overdue — subscription ended last month, current month unpaid
  const s1 = await prisma.student.create({
    data: {
      name: 'Rahul Sharma',
      whatsappNumber: '919876543210',
      seatNumber: 'A01',
      monthlyFee: 1500,
      subscriptionStart: new Date(now.getFullYear(), now.getMonth() - 3, 1),
      subscriptionEnd: new Date(now.getFullYear(), now.getMonth() - 1, 28),
      status: 'ACTIVE',
    },
  })
  await prisma.payment.createMany({
    data: [
      { studentId: s1.id, amount: 1500, month: `${now.getFullYear()}-${String(now.getMonth() - 1).padStart(2, '0')}`, status: 'PAID', paidAt: new Date(now.getFullYear(), now.getMonth() - 1, 5) },
      { studentId: s1.id, amount: 1500, month: lastMonthStr, status: 'PAID', paidAt: lastMonth },
      { studentId: s1.id, amount: 1500, month: currentMonth, status: 'UNPAID' },
    ],
  })

  // Student 2: Overdue — subscription ended 10 days ago, current month unpaid
  const s2 = await prisma.student.create({
    data: {
      name: 'Priya Patel',
      whatsappNumber: '919876543211',
      seatNumber: 'A05',
      monthlyFee: 1200,
      subscriptionStart: new Date(now.getFullYear(), now.getMonth() - 2, 15),
      subscriptionEnd: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
      status: 'ACTIVE',
    },
  })
  await prisma.payment.createMany({
    data: [
      { studentId: s2.id, amount: 1200, month: lastMonthStr, status: 'PAID', paidAt: lastMonth },
      { studentId: s2.id, amount: 1200, month: currentMonth, status: 'UNPAID' },
    ],
  })

  // Student 3: Due soon — subscription ends in 3 days
  const s3 = await prisma.student.create({
    data: {
      name: 'Amit Kumar',
      whatsappNumber: '919876543212',
      seatNumber: 'B02',
      monthlyFee: 1500,
      subscriptionStart: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate() + 3),
      subscriptionEnd: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
      status: 'ACTIVE',
    },
  })
  await prisma.payment.createMany({
    data: [
      { studentId: s3.id, amount: 1500, month: lastMonthStr, status: 'PAID', paidAt: lastMonth },
      { studentId: s3.id, amount: 1500, month: currentMonth, status: 'PAID', paidAt: new Date(now.getFullYear(), now.getMonth(), 2) },
    ],
  })

  // Student 4: Paid and up to date
  const s4 = await prisma.student.create({
    data: {
      name: 'Sneha Reddy',
      whatsappNumber: '919876543213',
      seatNumber: 'B08',
      monthlyFee: 1800,
      subscriptionStart: new Date(now.getFullYear(), now.getMonth() - 2, 1),
      subscriptionEnd: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      status: 'ACTIVE',
    },
  })
  await prisma.payment.createMany({
    data: [
      { studentId: s4.id, amount: 1800, month: lastMonthStr, status: 'PAID', paidAt: lastMonth },
      { studentId: s4.id, amount: 1800, month: currentMonth, status: 'PAID', paidAt: new Date(now.getFullYear(), now.getMonth(), 1) },
    ],
  })

  // Student 5: Discontinued 10 days ago
  const s5 = await prisma.student.create({
    data: {
      name: 'Vikram Singh',
      whatsappNumber: '919876543214',
      seatNumber: 'C03',
      monthlyFee: 1500,
      subscriptionStart: new Date(now.getFullYear(), now.getMonth() - 4, 1),
      subscriptionEnd: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
      status: 'DISCONTINUED',
      createdAt: new Date(now.getFullYear(), now.getMonth() - 4, 1),
    },
  })
  await prisma.payment.createMany({
    data: [
      { studentId: s5.id, amount: 1500, month: `${now.getFullYear()}-${String(now.getMonth() - 2).padStart(2, '0')}`, status: 'PAID', paidAt: new Date(now.getFullYear(), now.getMonth() - 2, 5) },
      { studentId: s5.id, amount: 1500, month: lastMonthStr, status: 'PAID', paidAt: lastMonth },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log('   Students: 5 (2 overdue, 1 due soon, 1 paid, 1 discontinued)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
