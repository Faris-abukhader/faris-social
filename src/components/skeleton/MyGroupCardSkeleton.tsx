import React from 'react'
import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function MyGroupCardSkeleton() {
  return (
    <Card className='p-4'>
        <div className='flex items-center gap-x-2 pb-3'>
            <Skeleton className='w-14 h-14 rounded-full'/>
            <Skeleton className='w-28 h-2 rounded'/>
        </div>
        <Skeleton className='w-full h-8 rounded-md'/>
    </Card>
  )
}