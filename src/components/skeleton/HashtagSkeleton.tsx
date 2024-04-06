import React from 'react'
import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function HashtagSkeleton() {
    return (
        <Card className='p-2 space-y-2'>
            <Skeleton className='h-2 w-20' />
            <Skeleton className='h-2 w-8' />
        </Card>
    )
}
