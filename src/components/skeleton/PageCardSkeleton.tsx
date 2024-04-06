import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { Card } from '../ui/card'
export default function PageCardSkeleton() {
  return (
    <Card className='flex items-center gap-x-2 p-2'>
        <Skeleton className=' w-10 h-10'/>
        <div>
            <Skeleton className='w-20 h-2 rounded'/>
            <div className='flex items-center gap-x-1 pt-3'>
                <Skeleton className='w-8 h-2 rounded'/>
                <Skeleton className='w-8 h-2 rounded'/>
            </div>
        </div>
    </Card>
  )
}