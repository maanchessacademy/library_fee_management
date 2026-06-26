"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { formatCurrency, formatDateShort, formatMonth } from "@/lib/utils"
import toast from "react-hot-toast"
import { Check } from "lucide-react"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import { getReceiptMessageLink } from "@/lib/whatsapp"

interface Payment {
  id: string
  month: string
  amount: number
  status: string
  paidAt: string | null
  notes: string | null
}

interface PaymentHistoryProps {
  payments: Payment[]
  studentId: string
  monthlyFee: number
  onRefresh: () => void
  student?: any
}

export function PaymentHistory({ payments, studentId, monthlyFee, onRefresh, student }: PaymentHistoryProps) {
  const [isMarkPaidOpen, setIsMarkPaidOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [notes, setNotes] = useState("")
  const [addMonth, setAddMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [addAmount, setAddAmount] = useState(monthlyFee)
  const [addNotes, setAddNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleMarkPaid = async () => {
    if (!selectedPayment) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/payments/${selectedPayment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })
      if (!res.ok) throw new Error("Failed to mark as paid")
      toast.success("Payment marked as paid")
      setIsMarkPaidOpen(false)
      setNotes("")
      onRefresh()
    } catch (error) {
      toast.error("Failed to mark payment as paid")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPayment = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          amount: addAmount,
          month: addMonth,
          notes: addNotes || undefined,
        }),
      })
      if (!res.ok) throw new Error("Failed to add payment")
      toast.success("Payment record added")
      setIsAddOpen(false)
      setAddNotes("")
      onRefresh()
    } catch (error) {
      toast.error("Failed to add payment record")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Payment History</h2>
        <Button size="sm" variant="outline" onClick={() => setIsAddOpen(true)}>
          Add Record
        </Button>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg">
          No payment records yet
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-500">Month</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Amount</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Paid On</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Notes</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium">{formatMonth(p.month)}</td>
                    <td className="px-4 py-3">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status === 'PAID' ? 'success' : 'danger'}>
                        {p.status === 'PAID' ? 'Paid' : 'Unpaid'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {p.paidAt ? formatDateShort(p.paidAt) : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-[150px] truncate">
                      {p.notes || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {p.status === 'PAID' && student && (
                          <WhatsAppButton
                            href={getReceiptMessageLink({ ...student, month: p.month, amount: p.amount })}
                            label="Send receipt"
                          />
                        )}
                        {p.status === 'UNPAID' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => { setSelectedPayment(p); setIsMarkPaidOpen(true) }}
                            className="gap-1.5"
                          >
                            <Check className="h-3.5 w-3.5" /> Mark Paid
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="sm:hidden space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="border border-slate-200 rounded-lg p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">{formatMonth(p.month)}</span>
                  <Badge variant={p.status === 'PAID' ? 'success' : 'danger'}>
                    {p.status === 'PAID' ? 'Paid' : 'Unpaid'}
                  </Badge>
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>Amount: <span className="font-medium text-slate-900">{formatCurrency(p.amount)}</span></p>
                  {p.paidAt && <p>Paid on: {formatDateShort(p.paidAt)}</p>}
                  {p.notes && <p className="text-slate-500">Note: {p.notes}</p>}
                </div>
                {p.status === 'PAID' && student && (
                  <WhatsAppButton
                    href={getReceiptMessageLink({ ...student, month: p.month, amount: p.amount })}
                    label="Send receipt"
                    className="w-full mt-3"
                  />
                )}
                {p.status === 'UNPAID' && (
                  <Button
                    size="sm"
                    variant="success"
                    className="w-full mt-3 gap-1.5"
                    onClick={() => { setSelectedPayment(p); setIsMarkPaidOpen(true) }}
                  >
                    <Check className="h-3.5 w-3.5" /> Mark as Paid
                  </Button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Mark Paid Modal */}
      <Modal isOpen={isMarkPaidOpen} onClose={() => setIsMarkPaidOpen(false)} title="Mark Payment as Paid">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Marking <strong>{selectedPayment ? formatMonth(selectedPayment.month) : ''}</strong> payment of{' '}
            <strong>{selectedPayment ? formatCurrency(selectedPayment.amount) : ''}</strong> as paid.
            This will also extend the student&apos;s subscription by 1 month.
          </p>
          <Input
            label="Notes (optional)"
            placeholder="e.g. Paid via UPI"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsMarkPaidOpen(false)}>Cancel</Button>
            <Button variant="success" className="flex-1" onClick={handleMarkPaid} disabled={isLoading}>
              {isLoading ? "Saving..." : "Confirm Paid"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Payment Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Payment Record">
        <div className="space-y-4">
          <Input
            label="Month"
            type="month"
            value={addMonth}
            onChange={(e) => setAddMonth(e.target.value)}
          />
          <Input
            label="Amount (₹)"
            type="number"
            value={addAmount}
            onChange={(e) => setAddAmount(Number(e.target.value))}
          />
          <Input
            label="Notes (optional)"
            placeholder="e.g. Advance payment"
            value={addNotes}
            onChange={(e) => setAddNotes(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleAddPayment} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Record"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
