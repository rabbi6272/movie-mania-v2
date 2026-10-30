import Link from "next/link";
import { Button as HeroButton, Spinner, buttonVariants } from "@heroui/react";

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
  // native <button> default; the auth forms submit through it
  type?: 'submit' | 'button'
}

export function Button({ onClick, href, className, children, varient = 'primary', size = 'md', icon, loading = false, ariaLabel, type = 'submit' }: ButtonProps) {
  const variant = varient === 'primary' ? 'primary' : 'outline'
  const classes = `rounded-full shadow text-nowrap font-semibold ${className ?? ''}`

  const content = loading ? (
    <Spinner size="sm" color="current" />
  ) : (
    <span className="flex items-center gap-2">
      {icon && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>}
      {children}
    </span>)

  if (href) {
    return (
      <Link href={href} className={buttonVariants({ variant, size, className: classes })} aria-label={ariaLabel}>
        {content}
      </Link>
    )
  }

  return (
    <HeroButton
      type={type}
      onPress={onClick}
      isPending={loading}
      variant={variant}
      size={size}
      className={classes}
      aria-label={ariaLabel}
    >
      {content}
    </HeroButton>
  )
}
