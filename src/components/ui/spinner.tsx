import type { FC } from 'react'
import { Loader2 } from 'lucide-react'

import { cn } from '@faris/utils/tailwindHelper'

type SpinnerProps = {
  className?:string
}

const Spinner: FC<SpinnerProps> = ({ className, ...props }) => {
  return (
    <Loader2
      {...props}
      className={cn('mr-2 h-4 w-4 animate-spin', className)}
    />
  )
}

export default Spinner
