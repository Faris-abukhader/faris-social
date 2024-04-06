import React from "react"
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const UserBirthdayCardSkeleton = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
    <Card {...props} ref={ref}>
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-x-2">
            <Skeleton className='w-16 h-16 rounded-full'/>
            <Skeleton className="w-32 h-2 rounded"/>
            </div>
            <Skeleton className="w-20 h-2 rounded"/>
        </div>
    </Card>
))

UserBirthdayCardSkeleton.displayName = 'UserBirthdayCardSkeleton'

export default UserBirthdayCardSkeleton;

