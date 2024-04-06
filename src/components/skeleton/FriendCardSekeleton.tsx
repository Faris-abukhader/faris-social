import { Card } from '../ui/card'

export default function FriendCardSkeleton() {
    return (
        <Card className="w-full h-20 flex items-center gap-x-3 p-0">
            <div className='w-1/3 h-full rounded-s-sm skeleton-background'></div>
            <div className=' space-y-2'>
                <div className='w-28 h-2 rounded skeleton-background'></div>
                <div className='w-16 h-2 rounded skeleton-background'></div>
            </div>
        </Card>
    )
}
