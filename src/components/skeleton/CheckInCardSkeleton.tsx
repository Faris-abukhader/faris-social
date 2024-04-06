import { Card } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export const CheckInCardSkeleton = () => {
    return (
        <Card className="w-full h-20 animate-pulse flex rounded-md items-center gap-x-3 p-0">
            <Skeleton className='w-1/3 h-full rounded-s-sm skeleton-background'/>
            <div className=' space-y-2'>
                <Skeleton className='w-28 h-2 rounded skeleton-background'/>
                <Skeleton className='w-16 h-2 rounded skeleton-background'/>
            </div>
        </Card>
    )
}