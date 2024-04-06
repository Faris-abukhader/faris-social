import React from "react"
import { Card } from "../ui/card";

const ProfileDropdownSkeleton = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
    <Card {...props} ref={ref} className="animate-pulse p-0 sm:p-2 shadow-sm w-fit border-2 rounded-full sm:w-36 hover:cursor-pointer sm:rounded-md flex items-center justify-center gap-x-2">
        <div className="rounded-full skeleton-background h-6 w-6"></div>
        <div className="hidden sm:block w-16 h-2 skeleton-background rounded"></div>
    </Card>
))

ProfileDropdownSkeleton.displayName = 'ProfileDropdownSkeleton'

export default ProfileDropdownSkeleton;

