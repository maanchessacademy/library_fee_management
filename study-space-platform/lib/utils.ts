import { format, addMonths, differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns'

export function currentMonth(): string {
  return format(new Date(), 'yyyy-MM')
}

export function formatMonth(month: string): string {
  const [year, m] = month.split('-')
  const date = new Date(parseInt(year), parseInt(m) - 1)
  return format(date, 'MMMM yyyy')
}

export function extendSubscription(subscriptionEnd: Date | string): Date {
  return addMonths(new Date(subscriptionEnd), 1)
}

export function isOverdue(subscriptionEnd: Date | string, currentMonthPaymentStatus: string): boolean {
  const today = startOfDay(new Date())
  const endDate = startOfDay(new Date(subscriptionEnd))
  return isBefore(endDate, today) && currentMonthPaymentStatus === 'UNPAID'
}

export function isDueSoon(subscriptionEnd: Date | string, currentMonthPaymentStatus: string): boolean {
  const today = startOfDay(new Date())
  const endDate = startOfDay(new Date(subscriptionEnd))
  const daysUntilEnd = differenceInDays(endDate, today)
  return daysUntilEnd >= 0 && daysUntilEnd <= 5 && currentMonthPaymentStatus !== 'PAID'
}

export function daysOverdue(subscriptionEnd: Date | string): number {
  const today = startOfDay(new Date())
  const endDate = startOfDay(new Date(subscriptionEnd))
  const diff = differenceInDays(today, endDate)
  return diff > 0 ? diff : 0
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'dd/MM/yyyy')
}

export function formatDateShort(date: Date | string): string {
  return format(new Date(date), 'dd MMM yyyy')
}
