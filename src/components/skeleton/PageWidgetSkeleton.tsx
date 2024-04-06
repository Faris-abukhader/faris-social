import React from 'react'
import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function PageWidgetSkeleton() {
  return (
    <Card>
        <Skeleton className='w-full h-72 rounded-b-none'/>
        <div className='flex items-center gap-x-2 p-3 sm:pb-1'>
            <Skeleton className='w-12 h-12 rounded-full'/>
            <div className=' space-y-2'>
                <Skeleton className='w-25 h-2 rounded'/>
                <Skeleton className='w-20 h-2 rounded'/>
                <Skeleton className='w-16 h-2 rounded'/>
            </div>
        </div>
        <div className='p-4'>
            <Skeleton className='w-full h-8'/>
        </div>
    </Card>
  )
}