'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cva } from 'class-variance-authority'

import { cn } from '@faris/utils/tailwindHelper'

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  isSuccess?: boolean
  isError?: boolean
}

const indicatorVariants = cva('h-full w-full flex-1 ease-in transition-all', {
  variants: {
    variant: {
      default: 'bg-slate-600 dark:bg-slate-500',
      isError: 'bg-red-500 dark:bg-red-500',
      isSuccess: 'bg-green-500 dark:bg-green-400',
    },
  },
})

const rootVariants = cva('relative h-4 w-full overflow-hidden rounded-full', {
  variants: {
    variant: {
      default: 'bg-slate-300 dark:bg-slate-950',
      isError: 'bg-red-200 dark:bg-red-800',
      isSuccess: 'bg-green-200 dark:bg-green-800',
    },
  },
})

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, isError, ...props }, ref) => {
  const variant = isError ? 'isError' : 'default'

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(rootVariants({ variant, className }))}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(indicatorVariants({ variant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
