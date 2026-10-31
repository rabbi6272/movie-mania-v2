import Link from "next/link";
import { Button as HeroButton, Spinner, buttonVariants } from "@heroui/react";

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  varient?: 'primary' | 'outline' | 'secondary' | 'ghost' | 'danger' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  loading?: boolean
  ariaLabel?: string
  // native <button> default; the auth forms submit through it
  type?: 'submit' | 'button'
}

export function Button({ onClick, href, className, children, varient = 'primary', size = 'md', icon, loading = false, ariaLabel, type = 'submit' }: ButtonProps) {
  // glass is our own skin (globals.css) layered on HeroUI's ghost
  const variant = varient === 'glass' ? 'ghost' : varient
  const isIconOnly = !!icon && !children
  const classes = `${varient === 'glass' ? 'button--glass' : ''} ${className ?? ''}`

  const content = loading ? (
    <Spinner size="sm" color="current" />
  ) : (
    <>
      {icon && <span className="material-symbols-outlined">{icon}</span>}
      {children}
    </>)

  if (href) {
    return (
      <Link href={href} className={buttonVariants({ variant, size, isIconOnly, className: classes })} aria-label={ariaLabel}>
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
      isIconOnly={isIconOnly}
      className={classes}
      aria-label={ariaLabel}
    >
      {content}
    </HeroButton>
  )
}
