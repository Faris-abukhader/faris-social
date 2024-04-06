import * as React from 'react'

import { cn } from '@faris/utils/tailwindHelper'
import useLocalizationStore from 'zustandStore/localizationStore'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const language = useLocalizationStore(state=>state.language)
    return (
      <input
        dir={language=='ar'?'rtl':'ltr'}
        className={cn(
          'flex h-10 w-full rounded-md border border-customLightBlue bg-transparent py-2 px-3 text-sm text-[16px] placeholder:text-slate-400 focus:outline-none focus:ring focus:ring-customLightBlue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-borderDarkColor dark:text-slate-50 dark:focus:ring-gray-950 dark:focus:ring-offset-slate-950',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
