import Image from "next/image";
import React, { memo, useState } from "react";

import { cn } from "@faris/utils/tailwindHelper";
import { Button } from "../ui/button";
import { useTranslation } from "next-i18next";
import { EyeOffIcon } from "lucide-react";

type MediaProps = {
    isToxic:boolean
    containerClassName?:string
} & React.ImgHTMLAttributes<HTMLImageElement>

const Media = memo(React.forwardRef<
HTMLImageElement,
MediaProps
>(({ className,src,isToxic,width,height,containerClassName, ...props }, ref) => {
    const [show,setShow] = useState(!isToxic)
    const {t} = useTranslation()

    if (src === undefined) return <></>;
    
    return(
    <div className={cn(`w-full h-full relative`,containerClassName)}>
      <div className={`absolute left-0 top-0 h-full w-full  ${show ? 'backdrop-blur-none':'bg-slate-800/70 backdrop-blur-md'} `} />
      <div className={`absolute ${show ?'hidden':'block'} space-y-4 divide-y bottom-3 x-1.2 left-1/2 -translate-x-1/2 z-10 text-center`}>
        <EyeOffIcon className="mx-auto text-primary-foreground"/>
        <Button size={`sm`} variant={`secondary`} onClick={()=>setShow(prevs=>!prevs)}>{t('show')}</Button>
        <p className="text-xs text-primary-foreground  font-medium">{t('sensitiveContentWarning')}</p>
      </div>
      <Image
        {...props}
       ref={ref}
        src={src}
        width={width?+width:500}
        height={height?+height:500}
        className={cn(`h-96 w-full`,className)}
        alt="media"
      />
    </div>)
}));
Media.displayName = "Media";

export default Media;