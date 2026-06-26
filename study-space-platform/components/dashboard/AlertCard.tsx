import { LucideIcon } from "lucide-react"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import { getOverdueMessageLink } from "@/lib/whatsapp"

interface AlertCardProps {
  title: string
  count: number
  icon: LucideIcon
  color: 'red' | 'amber' | 'gray' | 'green'
  items: { name: string; detail: string; student?: any }[]
}

const colorMap = {
  red: {
    bg: "bg-red-50 border-red-200",
    icon: "bg-red-100 text-red-600",
    title: "text-red-800",
    count: "text-red-900",
    badge: "bg-red-100 text-red-700",
  },
  amber: {
    bg: "bg-amber-50 border-amber-200",
    icon: "bg-amber-100 text-amber-600",
    title: "text-amber-800",
    count: "text-amber-900",
    badge: "bg-amber-100 text-amber-700",
  },
  gray: {
    bg: "bg-slate-50 border-slate-200",
    icon: "bg-slate-100 text-slate-600",
    title: "text-slate-700",
    count: "text-slate-900",
    badge: "bg-slate-100 text-slate-700",
  },
  green: {
    bg: "bg-emerald-50 border-emerald-200",
    icon: "bg-emerald-100 text-emerald-600",
    title: "text-emerald-800",
    count: "text-emerald-900",
    badge: "bg-emerald-100 text-emerald-700",
  },
}

export function AlertCard({ title, count, icon: Icon, color, items }: AlertCardProps) {
  const c = colorMap[color]

  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${c.bg}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${c.title}`}>{title}</p>
          <p className={`text-3xl font-bold mt-1 ${c.count}`}>{count}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${c.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {items.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${c.title}`}>{item.name}</span>
                {item.student && (
                  <WhatsAppButton href={getOverdueMessageLink(item.student)} />
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>{item.detail}</span>
            </div>
          ))}
          {items.length > 3 && (
            <p className={`text-xs ${c.title} opacity-70`}>+{items.length - 3} more</p>
          )}
        </div>
      )}
      {items.length === 0 && (
        <p className={`mt-3 text-sm ${c.title} opacity-60`}>No students</p>
      )}
    </div>
  )
}
