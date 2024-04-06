import { cn } from '@faris/utils/tailwindHelper'
import Image from 'next/image'
import React from 'react';
import useLocalizationStore from 'zustandStore/localizationStore';

interface IllustrationContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  path: string;
  description?: string;
  width?: number;
  height?: number;
}

const IllustrationContainer = React.forwardRef<HTMLDivElement, IllustrationContainerProps>(
  ({ className,width=250,height=250,description,path, ...props }, ref) => {
    const language = useLocalizationStore(state=>state.language)
    return <div dir={language=='ar'?'rtl':'ltr'} ref={ref} className={cn('w-full h-full flex items-center justify-center p-4 sm:p-0', className)} {...props}>
         <div className='w-fit'>
             <Image src={path} width={width} height={height} className='mx-auto' alt='illustration'/>
             {description && <p className='w-full max-w-sm text-xs text-center py-2'>{description}</p>}
        </div>

    </div>
  }
);

IllustrationContainer.displayName = 'IllustrationContainer';

export default IllustrationContainer;
