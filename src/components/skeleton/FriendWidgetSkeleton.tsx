import { Card } from "../ui/card";

export default function FriendWidgetSkeleton() {
    return (
        <Card className="w-full animate-pulse p-4 shadow-md grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className='space-y-3 items-center'>
                <div className="w-20 h-20 skeleton-background rounded-md"></div>
                <div className="w-10 h-2 skeleton-background rounded"></div>
            </div>)}
        </Card>
    )
}
