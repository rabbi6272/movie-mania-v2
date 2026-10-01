import Link from "next/link";

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  varient?: 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  loading?: boolean
  ariaLabel?: string
}

export function Button({ onClick, href, className, children, varient = 'primary', size = 'md', icon, loading = false, ariaLabel }: ButtonProps) {
  const classes = `flex items-center justify-center rounded-full cursor-pointer shadow text-nowrap whitespace-nowrap font-semibold disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200
    ${size === 'sm' ? 'text-xs font-medium px-3 py-2' : size === 'lg' ? 'text-base px-6 py-3' : 'text-sm px-4 py-2.5'}
    ${varient === 'primary' ? 'bg-black text-white' : 'bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-100'} ${className}`

  const content = loading ? (
    <span className={`w-4 h-4 border-2 ${varient === 'primary' ? 'border-white/30 border-t-white' : 'border-black '} rounded-full animate-spin`} />
  ) : (
    <span className="flex items-center gap-2">
      {icon && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>}
      {children}
    </span>)

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={classes}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  )
}