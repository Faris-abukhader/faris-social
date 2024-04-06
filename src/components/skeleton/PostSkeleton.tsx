import { Card } from "../ui/card";

export default function PostSkeleton() {
    return (
        <Card className="w-full animate-pulse p-4  rounded-md shadow-md space-y-3">
            <div className='flex items-center gap-x-2 pb-32'>
                <div className="rounded-full skeleton-background h-8 w-8"></div>
                <div className=' space-y-2'>
                    <div className="w-20 h-2 skeleton-background rounded-2xl"></div>
                    <div className="w-14 h-2 skeleton-background rounded-2xl"></div>
                </div>
            </div>
            <div className='flex items-center justify-between'>
                <div className="w-6 h-2 skeleton-background rounded"></div>
                <div className="w-6 h-2 skeleton-background rounded"></div>
                <div className="w-6 h-2 skeleton-background rounded"></div>
            </div>
        </Card>
    )
}