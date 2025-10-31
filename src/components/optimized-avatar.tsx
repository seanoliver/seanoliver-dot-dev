'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const OptimizedAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
))
OptimizedAvatar.displayName = 'OptimizedAvatar'

interface OptimizedAvatarImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  width?: number
  height?: number
}

const OptimizedAvatarImage = React.forwardRef<
  HTMLDivElement,
  OptimizedAvatarImageProps
>(({ className, src, alt, priority = false, width = 40, height = 40 }, ref) => (
  <div
    ref={ref}
    className={cn('aspect-square h-full w-full relative', className)}
  >
    <Image
      src={src}
      alt={alt}
      fill
      sizes="40px"
      priority={priority}
      className="object-cover"
    />
  </div>
))
OptimizedAvatarImage.displayName = 'OptimizedAvatarImage'

const OptimizedAvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800',
      className
    )}
    {...props}
  />
))
OptimizedAvatarFallback.displayName = 'OptimizedAvatarFallback'

export { OptimizedAvatar, OptimizedAvatarImage, OptimizedAvatarFallback }
