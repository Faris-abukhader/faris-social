import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function PostSkeleton() {
    return (
        <Card className="w-full animate-pulse p-4  rounded-md shadow-md space-y-3">
            <div className='flex items-start gap-x-2 pb-5'>
                <Skeleton className="rounded-full h-8 w-8" />
                <div className='space-y-2'>
                    <Skeleton className="w-20 h-2 rounded-2xl" />
                    <Skeleton className="w-14 h-2 rounded-2xl" />
                    <div className="pt-8 space-y-2">
                        <Skeleton className="w-28 h-2 rounded-2xl" />
                        <Skeleton className="w-36 h-2 rounded-2xl" />
                        <Skeleton className="w-20 h-2 rounded-2xl" />
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-between'>
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="w-12 h-2 rounded" />)}
            </div>
        </Card>
    )
}
