import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function JoinGroupCardSkeleton() {
    return (
        <Card className="w-full min-h-40 p-4 flex items-center justify-between">
            <section className='flex items-center gap-x-2'>
                <Skeleton className='w-12 h-12 rounded-full' />
                <Skeleton className='w-28 h-3 rounded' />
            </section>
            <section className='flex items-center gap-x-2'>
                <Skeleton className='w-28 h-10 rounded' />
                <Skeleton className='w-28 h-10 rounded' />
            </section>
        </Card>
    )
}
