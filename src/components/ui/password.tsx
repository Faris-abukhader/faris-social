import * as React from 'react'

import { cn } from '@faris/utils/tailwindHelper'
import { Button } from './button'
import { EyeIcon } from 'lucide-react'
import useLocalizationStore from 'zustandStore/localizationStore'

export type PasswordProps = React.InputHTMLAttributes<HTMLInputElement>

const Password = React.forwardRef<HTMLInputElement, PasswordProps>(
  ({ className, ...props }, ref) => {
    const language = useLocalizationStore(state=>state.language)
    const [show,setShow] = React.useState(false)
    return (
        <div className='relative'>
      <input
        type={show?'text':'password'}
        className={cn(
          'flex h-10 w-full rounded-md border border-customLightBlue bg-transparent py-2 px-3 text-sm text-[16px] placeholder:text-slate-400 focus:outline-none focus:ring focus:ring-customLightBlue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-borderDarkColor dark:text-slate-50 dark:focus:ring-gray-950 dark:focus:ring-offset-slate-950',
          className
        )}
        ref={ref}
        {...props}
      />
      <Button onClick={()=>setShow(prevs=>!prevs)} className={` absolute ${language=='ar'?'left-0 rounded-r-none':'right-0 rounded-l-none'} top-1/2 -translate-y-1/2`} variant={'ghost'}>
        <EyeIcon className='w-4 h-4'/>
      </Button>
      </div>
    )
  }
)
Password.displayName = 'Password'

export { Password }
