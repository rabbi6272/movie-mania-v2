import Link from "next/link";
import { Button as HeroButton, Spinner, buttonVariants } from "@heroui/react";

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  varient?: 'primary' | '3d' | 'outline' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  loading?: boolean
  ariaLabel?: string
  // native <button> default; the auth forms submit through it
  type?: 'submit' | 'button'
}

export function Button({ onClick, href, className, children, varient = 'primary', size = 'md', icon, loading = false, ariaLabel, type = 'submit' }: ButtonProps) {
  // glass and 3d are custom skins layered on HeroUI
  const variant = varient === 'glass' ? 'ghost' : varient === '3d' ? 'primary' : varient
  const isIconOnly = !!icon && !children
  const classes = `${varient === 'glass' ? 'button--glass' : ''} ${varient === '3d' ? 'button--3d' : ''} ${className ?? ''}`

  const content = loading ? (
    <Spinner size="sm" color="current" />
  ) : (
    <>
      {icon && <span className="material-symbols-outlined ">{icon}</span>}
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
