import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function EventCardSkeleton() {
  return (
    <Card className="w-full min-h-40 pb-4">
        <Skeleton className='w-full h-32 rounded-b-none'/>
    <div className='p-4 space-y-2'>
        <Skeleton className='w-28 h-2 rounded'/>
        <Skeleton className='w-16 h-2 rounded'/>
    </div>
    <div className='flex items-center gap-x-2 px-4'>
        {Array.from({length:3}).map((_,i)=><Skeleton key={i} className='w-12 h-2 rounded'/>)}
    </div>
</Card>
)
}
