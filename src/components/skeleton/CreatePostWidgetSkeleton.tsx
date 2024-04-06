import { Card } from '../ui/card'

export default function CreatePostWidgetSkeleton() {
    return (
        <Card className="w-full h-28 animate-pulse p-2 border-none- rounded-md shadow-none space-y-3 mt-5">
            <div className='flex items-center gap-x-2 pb-8'>
                <div className="rounded-full skeleton-background h-6 w-6"></div>
                <div className="w-full h-5 skeleton-background rounded-2xl"></div>
            </div>
            <div className='w-full h-[2px] skeleton-background rounded-lg'></div>
            <div className='bottom-2 flex items-center justify-between'>
                <div className="w-6 h-2 skeleton-background rounded"></div>
                <div className="w-6 h-2 skeleton-background rounded"></div>
                <div className="w-6 h-2 skeleton-background rounded"></div>
            </div>
        </Card>
    )
}
