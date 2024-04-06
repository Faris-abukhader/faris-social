import React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Button } from '@faris/components/ui/button'
import { cn } from '@faris/utils/tailwindHelper'


type ButtonProps = {
    hoverContent?:string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const HoverButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className,children,hoverContent, ...props }, ref) => {
      return (
        <HoverCard>
        <HoverCardTrigger asChild>
            <Button ref={ref} variant='ghost' size={'sm'} className={cn('rounded-full',className)} {...props}>
                {children}
            </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-fit text-xs p-2">{hoverContent}</HoverCardContent>
    </HoverCard>
      )
    }
  )
  HoverButton.displayName = "Button"
  
export default HoverButton;