import { cn } from "@faris/utils/tailwindHelper"
import React from "react"

type IsOnlineProps = {
    isOnline:boolean,
} & React.HTMLAttributes<HTMLSpanElement>

const IsOnline = React.forwardRef<
    HTMLDivElement,
    IsOnlineProps
>(({ className,isOnline, ...props }, ref) => (
    <span
        ref={ref}
        className={cn(
            'relative flex h-3 w-3',
            className,
        )}
        {...props}
    >
        <span className={` absolute inline-flex h-full w-full rounded-full ${isOnline?'bg-green-400 animate-ping':'bg-green-200'} opacity-75`}></span>
        <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline?'bg-green-400':'bg-green-200'}`}></span>
    </span>
))
IsOnline.displayName = 'IsOnline'

export default IsOnline
