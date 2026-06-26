import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Grid, CalendarDays, CreditCard, LogOut } from "lucide-react"

const NAV_ITEMS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Seats", href: "/admin/seats", icon: Grid },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">StudySpace <span className="text-blue-600">Admin</span></h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 px-4">
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-blue-700" : "text-slate-400 group-hover:text-slate-500"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="border-t border-slate-200 p-4">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-red-500" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
