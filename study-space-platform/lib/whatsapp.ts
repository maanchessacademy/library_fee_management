import { format } from "date-fns"

export function getOverdueMessageLink(student: {
  name: string
  whatsappNumber: string
  seatNumber: string
  monthlyFee: number
  subscriptionEnd: Date | string
}): string {
  const endDate = typeof student.subscriptionEnd === 'string' ? new Date(student.subscriptionEnd) : student.subscriptionEnd

  const message = `Hello ${student.name},

This is a reminder that your study space fee of ₹${student.monthlyFee} is overdue.

Seat: ${student.seatNumber}
Due date: ${format(endDate, 'dd/MM/yyyy')}

Please make the payment at your earliest convenience to continue using the space.

Thank you.`

  return `https://wa.me/${student.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export function getReceiptMessageLink(student: {
  name: string
  whatsappNumber: string
  seatNumber: string
  amount: number
  month: string
  subscriptionEnd: Date | string
}): string {
  const endDate = typeof student.subscriptionEnd === 'string' ? new Date(student.subscriptionEnd) : student.subscriptionEnd
  const [year, mon] = student.month.split('-')
  const monthName = format(new Date(Number(year), Number(mon) - 1), 'MMMM yyyy')

  const message = `Hello ${student.name},

Your payment has been received. Thank you!

Receipt Details:
- Seat: ${student.seatNumber}
- Month: ${monthName}
- Amount Paid: ₹${student.amount}
- Valid Until: ${format(endDate, 'dd/MM/yyyy')}

See you at the study space!`

  return `https://wa.me/${student.whatsappNumber}?text=${encodeURIComponent(message)}`
}
