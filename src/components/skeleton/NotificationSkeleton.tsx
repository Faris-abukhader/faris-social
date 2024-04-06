import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function NotificationSkeleton() {
  return (
    <Card className='flex items-center gap-x-2 p-3'>
        <Skeleton className='w-10 h-10 rounded-full'/>
        <div className=' space-y-1'>
        <Skeleton className='w-16 h-2 rounded'/>
        <Skeleton className='w-28 h-2 rounded'/>
        </div>
    </Card>
  )
}
