
interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  className?: string
  varient?: 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  loading?: boolean
}

export function Button({ onClick, className, children, varient = 'primary', size = 'md', icon, loading = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center rounded-full cursor-pointer shadow text-nowrap whitespace-nowrap font-semibold disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 
        ${size === 'sm' ? 'text-xs px-3 py-2' : size === 'lg' ? 'text-base px-6 py-3' : 'text-sm px-4 py-2.5'} 
        ${varient === 'primary' ? 'bg-black text-white' : 'bg-transparent border border-gray-300 text-gray-900 hover:bg-gray-100'} ${className}`}
    >
      {loading ? (
        <span className={`w-4 h-4 border-2 ${varient === 'primary' ? 'border-white/30 border-t-white' : 'border-black '} rounded-full animate-spin`} />
      ) : (
        <p className="flex items-center gap-2">
          {icon && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>}
          {children}
        </p>)}
    </button>
  )
}