import * as XLSX from 'xlsx'
import { formatDate } from './utils'

interface StudentBackupData {
  name: string
  whatsappNumber: string
  seatNumber: string
  monthlyFee: number
  subscriptionStart: string
  subscriptionEnd: string
  status: string
  createdAt: string
}

export async function generateAndDownloadBackup(): Promise<void> {
  const res = await fetch('/api/backup')
  if (!res.ok) throw new Error('Failed to fetch backup data')

  const students: StudentBackupData[] = await res.json()

  const rows = students.map((s) => ({
    'Name': s.name,
    'WhatsApp Number': s.whatsappNumber,
    'Seat Number': s.seatNumber,
    'Monthly Fee (₹)': s.monthlyFee,
    'Subscription Start': formatDate(s.subscriptionStart),
    'Subscription End': formatDate(s.subscriptionEnd),
    'Status': s.status,
    'Member Since': formatDate(s.createdAt),
  }))

  const ws = XLSX.utils.json_to_sheet(rows)

  // Set column widths
  ws['!cols'] = [
    { wch: 25 },  // Name
    { wch: 18 },  // WhatsApp
    { wch: 12 },  // Seat
    { wch: 16 },  // Fee
    { wch: 18 },  // Start
    { wch: 18 },  // End
    { wch: 14 },  // Status
    { wch: 16 },  // Since
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Students')

  const today = new Date().toISOString().split('T')[0]
  const filename = `studyspace-backup-${today}.xlsx`

  XLSX.writeFile(wb, filename)
}
