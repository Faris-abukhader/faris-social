import CustomAvatar from '../general/CustomAvatar'
import Image from 'next/image'
import fromNow from '@faris/utils/fromNow'
import { type HTMLAttributes, forwardRef, memo, useCallback } from 'react'
import { cn } from '@faris/utils/tailwindHelper'
import { useStoryGallary } from 'zustandStore/storyGallaryStore'

type MiniStoryCardProps = {
  type: 'previous' | 'next'
} & HTMLAttributes<HTMLDivElement>

const MiniStoryCard = forwardRef<
  HTMLDivElement,
  MiniStoryCardProps
>(({ className, type, ...props }, ref) => {
  const { getPreviousProfile, getNextProfile,hasNextProfile,hasPreviousProfile,nextProfile,previousProfile } = useStoryGallary(state => state)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const targetProfile = useCallback(() => type == 'next' ? getNextProfile() : getPreviousProfile(), [type])

  if(type=='next'&& !hasNextProfile() || type=='previous'&& !hasPreviousProfile())return

  return (
    <div onClick={()=>type=='next'?nextProfile():previousProfile()} ref={ref} {...props} className={cn(className, `hidden opacity-80  relative sm:flex items-center justify-center w-[200px] h-[300px] overflow-hidden sm:rounded-md sm:shadow-sm bg-slate-200 dark:bg-slate-800`)}>
      <div className='absolute w-full left-0 top-6 flex items-center gap-x-2 px-2'>
        <CustomAvatar className='w-6 h-6' imageUrl={targetProfile()?.owner?.image?.url ?? ''} alt={`${targetProfile()?.owner?.fullName ?? ''}_profile`} />
        <h1 className='font-bold text-xs'>{targetProfile()?.owner?.fullName}</h1>
        <p className='text-[8px]'>{fromNow(targetProfile()?.stories[0]?.createdAt ?? new Date())}</p>
      </div>
      <Image src={targetProfile()?.stories[0]?.media?.url ?? ''} className='w-full' width={1080} height={1920} alt={`${targetProfile()?.stories[0]?.id ?? ''}_story`} />
    </div>
  )
})

MiniStoryCard.displayName = "MiniStoryCard"

export default memo(MiniStoryCard)