import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { StarIcon } from 'lucide-react'

export default function ReviewCardSkeleton() {
  return (
    <div>
    <section className='flex items-start justify-between'>
        <div className='flex items-center gap-x-2'>
            <Skeleton className='w-12 h-12'/>
            <div className='space-y-2'>
                <Skeleton className='w-32 h-3'/>
                <Skeleton className='w-16 h-2'/>
            </div>
        </div>
        <div className='flex items-center gap-x-1'>
        {Array.from({length:5}).map((_,i)=><StarIcon key={i} className='w-3 h-3 animate-pulse text-skeleton-background fill-skeleton-background'/>)}
        </div>
    </section>
    <section className='py-4 space-y-2'>
        <Skeleton className='w-36 h-2'/>
        <Skeleton className='w-28 h-2'/>
        <Skeleton className='w-16 h-2'/>
    </section>
    </div>
  )
}
