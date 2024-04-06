import { Card } from '@faris/components/ui/card'
import React from 'react'

const NavbarSkeleton = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
    <Card {...props} ref={ref} className="animate-pulse p-4 w-full border-none flex items-center justify-between gap-x-2">
        <div className="rounded-md skeleton-background h-6 w-20"></div>
        <div className='flex items-center gap-x-3'>
            {Array.from({length:3}).map((_,i)=><div key={i} className="skeleton-background h-6 w-6 rounded-full"></div>)}
        </div>
        <div className="hidden sm:block w-16 h-8 skeleton-background rounded"></div>
    </Card>
))

NavbarSkeleton.displayName = 'NavbarSkeleton'

export default NavbarSkeleton;

