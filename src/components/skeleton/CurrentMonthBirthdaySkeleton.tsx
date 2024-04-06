import React from "react"
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const CurrentMonthBirthdaySkeleton = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
    <Card {...props} ref={ref} className="border-none">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-4">
            {Array.from({length:30}).map((_,i)=><Skeleton key={i} className='w-16 h-16 rounded-full'/>)}
        </div>
    </Card>
))

CurrentMonthBirthdaySkeleton.displayName = 'CurrentMonthBirthdaySkeleton'

export default CurrentMonthBirthdaySkeleton;

