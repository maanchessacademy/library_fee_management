interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'gray'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
    danger: "bg-red-50 text-red-700 ring-red-600/20",
    outline: "bg-white text-slate-600 ring-slate-200",
    gray: "bg-slate-100 text-slate-600 ring-slate-200",
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
