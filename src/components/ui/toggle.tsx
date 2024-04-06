import { type VariantProps, cva } from "class-variance-authority"
import React, { useEffect } from 'react'
import { cn } from '@faris/utils/tailwindHelper'



const toggleVariants = cva(
    "bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600",
    {
      variants: {
        variant: {
          default:"bg-zinc-400 text-green-200 peer-focus:ring-zinc-300 dark:peer-focus:ring-green-800 peer-checked:bg-green-600",
          success:
            "bg-zinc-400 text-green-200 peer-focus:ring-zinc-300 dark:peer-focus:ring-green-800 peer-checked:bg-green-600",
          info:
            "bg-zinc-400 text-blue-200 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600",
          secondary:
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "underline-offset-4 hover:underline text-primary",
        },
        size: {
          default: "w-11 h-6",
          sm: "h-9 px-3 rounded-md",
          lg: "h-11 px-8 rounded-md",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    }
  )
export interface ToggleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toggleVariants> {
        label?:string|null
        value:boolean
        onChange:(e: React.FormEvent<HTMLInputElement>)=> void
}

export default function Toggle({className,variant,size,label,value,onChange}:ToggleProps) {

    useEffect(()=>{
        console.log(value)

    })
      
  return (
    
<label className="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" checked={value} onChange={onChange} className="sr-only peer"/>
  <div className={''+cn(toggleVariants({ variant, size, className }))}></div>
  <span className="ml-3 text-sm font-medium text-gray-400 dark:text-gray-300">{label}</span>
</label>
  )
}





