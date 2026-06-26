import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CalendarDays, CreditCard, LogOut, BookOpen } from "lucide-react"

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Book a Seat", href: "/dashboard/book", icon: BookOpen },
  { name: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
  { name: "Fees & Payments", href: "/dashboard/fees", icon: CreditCard },
]

export function StudentNav() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard" className="text-xl font-bold text-slate-900 tracking-tight">
                Study<span className="text-blue-600">Space</span>
              </Link>
            </div>
            <nav className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors",
                      isActive
                        ? "border-blue-500 text-slate-900"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center">
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Mobile nav could go here */}
    </header>
  )
}
